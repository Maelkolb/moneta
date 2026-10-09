import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { chapters } from '../data/chapters'
import { coinsOfChapter } from '../data'
import { assetUrl, img } from '../engine/assets'
import { play, sfxFound } from '../engine/audio'
import { MapView, type Cell } from '../engine/MapView'
import { buildSite, diggable, placeCoins } from '../engine/sites'
import { mulberry32 } from '../game/questions'
import { bookOpen, go, save, t, tx, unlockedChapters } from '../state'
import { TextBox } from '../ui/TextBox'

type Props = { chapter: number }

type Overlay = { kind: 'none' } | { kind: 'message'; lines: string[] } | { kind: 'gwen' } | { kind: 'travel' } | { kind: 'found' }

const positions: Record<number, Cell> = {}
const coinSets: Record<number, Cell[]> = {}

export function World({ chapter }: Props) {
  const ch = chapters.find((c) => c.number === chapter)!
  const site = useMemo(() => buildSite(chapter), [chapter])
  const [player, setPlayer] = useState<Cell>(positions[chapter] ?? site.start)
  const [coins, setCoins] = useState<Cell[]>(() => coinSets[chapter] ?? placeCoins(site, chapter * 1000 + Date.now()))
  const [overlay, setOverlay] = useState<Overlay>({ kind: 'none' })
  const [travelIndex, setTravelIndex] = useState(chapter - 1)
  const foundCell = useRef<Cell | null>(null)
  const lessonSeen = save.value.lessonsSeen.includes(chapter)
  const found = save.value.chapterFound[chapter] ?? 0
  const done = save.value.chapterDone.includes(chapter)

  useEffect(() => {
    void play('town')
    if (!lessonSeen && chapter === 1 && !positions[chapter]) setOverlay({ kind: 'message', lines: [t('findGwen')] })
    if (!lessonSeen && chapter !== 1) go({ name: 'lesson', chapter, part: 'intro' })
    if (found >= ch.coinsToFind && !done) go({ name: 'lesson', chapter, part: 'outro' })
  }, [])

  useEffect(() => {
    positions[chapter] = player
    coinSets[chapter] = coins
    if (import.meta.env.DEV) (window as unknown as { monetaWorld?: unknown }).monetaWorld = { player, coins, gwen: site.gwen, grid: site.grid, exits: site.exits }
  }, [player, coins])

  const nearest = coins.reduce((best, k) => Math.min(best, Math.hypot(k.x - player.x, k.y - player.y)), Infinity)
  const signal = nearest === Infinity ? 0 : Math.max(0, 1 - nearest / 6)

  const onMove = (next: Cell) => {
    const code = site.grid[next.y][next.x]
    if (code === 'X') {
      setOverlay({ kind: 'travel' })
      return
    }
    if (diggable[code] && !lessonSeen && chapter === 1) {
      setOverlay({ kind: 'message', lines: [t('talkToGwenFirst')] })
      return
    }
    if (code === 'S' && !lessonSeen && chapter === 1) {
      setPlayer(next)
      go({ name: 'lesson', chapter, part: 'intro' })
      return
    }
    setPlayer(next)
    const hit = coins.find((c) => c.x === next.x && c.y === next.y)
    if (hit) {
      foundCell.current = hit
      sfxFound()
      setOverlay({ kind: 'found' })
      setTimeout(() => {
        const rest = coins.filter((c) => c !== hit)
        coinSets[chapter] = rest.length ? rest : placeCoins(site, chapter * 7919 + Date.now())
        setCoins(coinSets[chapter])
        go({ name: 'identify', chapter, coin: pickCoin(chapter) })
      }, 1600)
    }
  }

  const onAction = () => {
    if (overlay.kind !== 'none') return
    const near = Math.abs(player.x - site.gwen.x) + Math.abs(player.y - site.gwen.y) <= 1
    if (!near) return
    if (!lessonSeen) go({ name: 'lesson', chapter, part: 'intro' })
    else setOverlay({ kind: 'gwen' })
  }

  const unlocked = unlockedChapters()

  useEffect(() => {
    if (overlay.kind !== 'travel') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') setTravelIndex((i) => Math.max(0, i - 1))
      else if (e.key === 'ArrowDown' || e.key === 's') setTravelIndex((i) => Math.min(chapters.length - 1, i + 1))
      else if (e.key === 'Enter' || e.key === ' ') travelTo(travelIndex + 1)
      else if (e.key === 'Escape') setOverlay({ kind: 'none' })
      else return
      e.preventDefault()
      e.stopPropagation()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [overlay.kind, travelIndex])

  const travelTo = (n: number) => {
    if (!unlocked.includes(n)) return
    setOverlay({ kind: 'none' })
    if (n === chapter) return
    delete positions[n]
    go({ name: 'world', chapter: n })
  }

  const frozen = overlay.kind !== 'none' || bookOpen.value

  return (
    <div class="screen world">
      <MapView site={site} coins={coins} player={player} onMove={onMove} onAction={onAction} frozen={frozen} />

      <div class="hud">
        <div class="hud-title">
          {t('chapter')} {ch.number}: {tx(ch.title)}
        </div>
        <div class="hud-sub">
          {tx(ch.site)} — {found} / {ch.coinsToFind} {t('coinsLabel')}
        </div>
      </div>
      <div class="hud-gem" style={{ filter: `drop-shadow(0 0 ${4 + signal * 26}px rgba(255,255,255,${0.2 + signal * 0.8})) brightness(${0.8 + signal * 0.6})` }}>
        <img src={assetUrl(img.gem)} alt="" />
      </div>
      <button class="hud-book" onClick={() => (bookOpen.value = true)} title="B">
        <img src={assetUrl(img.book)} alt="" />
        <span>B</span>
      </button>
      <div class="hud-keys">{t('worldKeys')}</div>

      {overlay.kind === 'message' && <TextBox lines={overlay.lines} onDone={() => setOverlay({ kind: 'none' })} />}

      {overlay.kind === 'found' && (
        <div class="found-overlay">
          <img src={assetUrl(img.coinFound)} alt="" />
          <div class="found-text">{t('foundCoin')}</div>
        </div>
      )}

      {overlay.kind === 'gwen' && (
        <div class="gwen-menu">
          <div class="gwen-menu-title">Gwen</div>
          <button onClick={() => go({ name: 'lesson', chapter, part: 'lesson' })}>{t('readLesson')}</button>
          <button onClick={() => go({ name: 'practice', chapter })}>{t('practice')}</button>
          <button onClick={() => setOverlay({ kind: 'none' })}>{t('nothing')}</button>
        </div>
      )}

      {overlay.kind === 'travel' && (
        <div class="travel">
          <div class="travel-title">{t('journey')}</div>
          <div class="travel-list">
            {chapters.map((c, i) => {
              const open = unlocked.includes(c.number)
              const cdone = save.value.chapterDone.includes(c.number)
              return (
                <button class={`${i === travelIndex ? 'active' : ''} ${open ? '' : 'locked'}`} onMouseEnter={() => setTravelIndex(i)} onClick={() => travelTo(c.number)} disabled={!open}>
                  <span class="travel-num">{c.number}</span>
                  <span class="travel-name">
                    {tx(c.site)}
                    <small>{open ? tx(c.title) : t('locked')}</small>
                  </span>
                  <span class="travel-state">{cdone ? '✓' : open ? `${save.value.chapterFound[c.number] ?? 0}/${c.coinsToFind}` : ''}</span>
                </button>
              )
            })}
          </div>
          <div class="travel-foot">
            {t('travelHint')}
            <button onClick={() => setOverlay({ kind: 'none' })}>{t('stayHere')}</button>
          </div>
        </div>
      )}
    </div>
  )
}

function pickCoin(chapter: number): string {
  const pool = coinsOfChapter(chapter)
  const owned = new Set(save.value.cabinet.map((c) => c.coin))
  const fresh = pool.filter((c) => !owned.has(c.id))
  const candidates = fresh.length ? fresh : pool
  const rng = mulberry32(Date.now() % 1000003)
  return candidates[Math.floor(rng() * candidates.length)].id
}
