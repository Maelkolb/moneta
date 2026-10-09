import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { chapters } from '../data/chapters'
import { coinById, coinsOfChapter } from '../data'
import { assetUrl, img } from '../engine/assets'
import { play, sfxFound, sfxGood } from '../engine/audio'
import { MapView, type Cell } from '../engine/MapView'
import { talks, type NpcSpec } from '../engine/npcs'
import { buildInterior, buildSite, diggable, doorCell, placeCoins, type Site } from '../engine/sites'
import { mulberry32 } from '../game/questions'
import { addXp, bookOpen, go, save, setFlag, t, tx, unlockedChapters } from '../state'
import { TextBox } from '../ui/TextBox'

type Props = { chapter: number; interior?: string }

type Overlay =
  | { kind: 'none' }
  | { kind: 'message'; lines: string[]; speaker?: string; after?: () => void }
  | { kind: 'gwen' }
  | { kind: 'npcMenu'; npc: NpcSpec; quiz: { skill: string; rounds: number }; hint?: 'nearest' | 'count' }
  | { kind: 'travel' }
  | { kind: 'found' }

const positions: Record<string, Cell> = {}
const coinSets: Record<number, Cell[]> = {}

export function World({ chapter, interior }: Props) {
  const ch = chapters.find((c) => c.number === chapter)!
  const [room, setRoom] = useState<string | undefined>(interior)
  const site: Site = useMemo(() => (room ? buildInterior(room, chapter) : buildSite(chapter)), [chapter, room])
  const key = room ? `${chapter}:${room}` : `${chapter}`
  const [player, setPlayer] = useState<Cell>(positions[key] ?? site.start)
  const [coins, setCoins] = useState<Cell[]>(() => coinSets[chapter] ?? placeCoins(buildSite(chapter), chapter * 1000 + Date.now()))
  const [overlay, setOverlay] = useState<Overlay>({ kind: 'none' })
  const [travelIndex, setTravelIndex] = useState(chapter - 1)
  const foundCell = useRef<Cell | null>(null)
  const lessonSeen = save.value.lessonsSeen.includes(chapter)
  const found = save.value.chapterFound[chapter] ?? 0
  const done = save.value.chapterDone.includes(chapter)

  useEffect(() => {
    void play('town')
    if (!lessonSeen && chapter === 1 && !positions[key] && !room) setOverlay({ kind: 'message', lines: [t('findGwen')] })
    if (!lessonSeen && chapter !== 1) go({ name: 'lesson', chapter, part: 'intro' })
    if (found >= ch.coinsToFind && !done) go({ name: 'lesson', chapter, part: 'outro' })
  }, [])

  useEffect(() => {
    setPlayer(positions[key] ?? site.start)
  }, [key])

  useEffect(() => {
    positions[key] = player
    coinSets[chapter] = coins
    if (import.meta.env.DEV) (window as unknown as { monetaWorld?: unknown }).monetaWorld = { player, coins, grid: site.grid, exits: site.exits, npcs: site.npcs, doors: site.doors, room }
  }, [player, coins, site])

  const visibleCoins = room ? [] : coins
  const nearest = visibleCoins.reduce((best, k) => Math.min(best, Math.hypot(k.x - player.x, k.y - player.y)), Infinity)
  const signal = nearest === Infinity ? 0 : Math.max(0, 1 - nearest / 6)

  const enterRoom = (id: string) => {
    delete positions[`${chapter}:${id}`]
    setRoom(id)
  }

  const leaveRoom = () => {
    const outside = buildSite(chapter)
    const door = outside.objects.find((o) => o.door === room)
    if (door) {
      const d = doorCell(door)
      positions[`${chapter}`] = { x: d.x, y: d.y + 1 }
    }
    setRoom(undefined)
  }

  const onMove = (next: Cell) => {
    const code = site.grid[next.y][next.x]
    if (code === 'X') {
      setOverlay({ kind: 'travel' })
      return
    }
    if (code === 'D') {
      leaveRoom()
      return
    }
    if (code === 'H') {
      const id = site.doors[`${next.x},${next.y}`]
      if (id) {
        setPlayer(next)
        setTimeout(() => enterRoom(id), 120)
        return
      }
    }
    if (diggable[code] && !lessonSeen && chapter === 1) {
      setOverlay({ kind: 'message', lines: [t('talkToGwenFirst')] })
      return
    }
    if (code === 'S' && !lessonSeen && chapter === 1 && !room) {
      setPlayer(next)
      go({ name: 'lesson', chapter, part: 'intro' })
      return
    }
    setPlayer(next)
    if (room) return
    const hit = coins.find((c) => c.x === next.x && c.y === next.y)
    if (hit) {
      foundCell.current = hit
      sfxFound()
      setOverlay({ kind: 'found' })
      setTimeout(() => {
        const rest = coins.filter((c) => c !== hit)
        coinSets[chapter] = rest.length ? rest : placeCoins(buildSite(chapter), chapter * 7919 + Date.now())
        setCoins(coinSets[chapter])
        go({ name: 'identify', chapter, coin: pickCoin(chapter) })
      }, 1600)
    }
  }

  const onTalk = (npc: NpcSpec) => {
    if (overlay.kind !== 'none') return
    if (npc.id === 'gwen') {
      if (!lessonSeen) go({ name: 'lesson', chapter, part: 'intro' })
      else setOverlay({ kind: 'gwen' })
      return
    }
    const talk = talks[npc.id]
    if (!talk) return
    const name = tx(npc.name)
    const after = () => {
      if (talk.quiz || talk.hint) setOverlay({ kind: 'npcMenu', npc, quiz: talk.quiz ?? { skill: '', rounds: 0 }, hint: talk.hint })
      else setOverlay({ kind: 'none' })
    }
    if (talk.quest === 'augustus') {
      const state = save.value.flags.elder_quest ?? 0
      const hasAugustus = save.value.cabinet.some((e) => coinById(e.coin)?.portrait === 'augustus')
      if (state >= 2) {
        setOverlay({ kind: 'message', lines: talks.elder_after.lines.map(tx), speaker: name })
      } else if (state === 1 && hasAugustus) {
        setOverlay({
          kind: 'message',
          lines: (talk.questDone ?? []).map(tx),
          speaker: name,
          after: () => {
            setFlag('elder_quest', 2)
            addXp(talk.questReward ?? 50)
            sfxGood()
            setOverlay({ kind: 'message', lines: [t('questReward', { n: talk.questReward ?? 50 })], speaker: name })
          },
        })
      } else if (state === 1) {
        setOverlay({ kind: 'message', lines: talks.elder_waiting.lines.map(tx), speaker: name })
      } else {
        setOverlay({
          kind: 'message',
          lines: talk.lines.map(tx),
          speaker: name,
          after: () => {
            setFlag('elder_quest', 1)
            setOverlay({ kind: 'none' })
          },
        })
      }
      return
    }
    setOverlay({ kind: 'message', lines: talk.lines.map(tx), speaker: name, after })
  }

  const hintText = (kind: 'nearest' | 'count'): string => {
    const all = coinSets[chapter] ?? coins
    if (!all.length) return t('hintNone')
    const outside = buildSite(chapter)
    const near = all.reduce((a, b) => (Math.hypot(a.x - 14, a.y - 10) < Math.hypot(b.x - 14, b.y - 10) ? a : b))
    const dir = (c: Cell) => {
      const ns = c.y < outside.rows / 2 - 2 ? t('north') : c.y > outside.rows / 2 + 2 ? t('south') : ''
      const ew = c.x < outside.cols / 2 - 3 ? t('west') : c.x > outside.cols / 2 + 3 ? t('east') : ''
      return [ns, ew].filter(Boolean).join(' ') || t('middle')
    }
    if (kind === 'count') return t('hintCount', { n: all.length, dirs: all.map(dir).join(', ') })
    return t('hintNearest', { dir: dir(near) })
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
    delete positions[`${n}`]
    go({ name: 'world', chapter: n })
  }

  const frozen = overlay.kind !== 'none' || bookOpen.value

  return (
    <div class="screen world">
      <MapView site={site} coins={visibleCoins} player={player} onMove={onMove} onTalk={onTalk} frozen={frozen} />

      <div class="hud">
        <div class="hud-title">
          {t('chapter')} {ch.number}: {tx(ch.title)}
        </div>
        <div class="hud-sub">
          {room ? tx(site.npcs[0]?.name) : tx(ch.site)} — {found} / {ch.coinsToFind} {t('coinsLabel')}
        </div>
      </div>
      {!room && (
        <div class="hud-gem" style={{ filter: `drop-shadow(0 0 ${4 + signal * 26}px rgba(255,255,255,${0.2 + signal * 0.8})) brightness(${0.8 + signal * 0.6})` }}>
          <img src={assetUrl(img.gem)} alt="" />
        </div>
      )}
      <button class="hud-book" onClick={() => (bookOpen.value = true)} title="B">
        <img src={assetUrl(img.book)} alt="" />
        <span>B</span>
      </button>
      <div class="hud-keys">{room ? t('roomKeys') : t('worldKeys')}</div>

      {overlay.kind === 'message' && (
        <TextBox
          lines={overlay.lines}
          speaker={overlay.speaker}
          onDone={() => {
            if (overlay.after) overlay.after()
            else setOverlay({ kind: 'none' })
          }}
        />
      )}

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

      {overlay.kind === 'npcMenu' && (
        <div class="gwen-menu">
          <div class="gwen-menu-title">{tx(overlay.npc.name)}</div>
          {overlay.quiz.rounds > 0 && (
            <button onClick={() => go({ name: 'practice', chapter, skill: overlay.quiz.skill as never, rounds: overlay.quiz.rounds, interior: room, title: tx(overlay.npc.name) })}>
              {t('npcQuiz')}
            </button>
          )}
          {overlay.hint && <button onClick={() => setOverlay({ kind: 'message', lines: [hintText(overlay.hint!)], speaker: tx(overlay.npc.name) })}>{t('npcHint')}</button>}
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
