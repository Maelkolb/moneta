import { useState } from 'preact/hooks'
import { chapters } from '../data/chapters'
import { coinImage, coinsOfChapter, portraitCoin } from '../data'
import type { Coin } from '../data/types'
import { newField, seedFrom, type Field, type Buried, DAYLIGHT } from '../game/dig'
import { mulberry32 } from '../game/questions'
import { addToCabinet, addXp, completeChapter, go, save, t, tx, update } from '../state'
import { Dialogue } from '../ui/Dialogue'
import { VillageScene } from '../ui/art'
import { CoinRecord } from '../ui/CoinRecord'
import { Dig } from './Dig'
import { Clean } from './Clean'
import { Identify } from './Identify'

type Phase = 'intro' | 'lesson' | 'hub' | 'dig' | 'clean' | 'identify' | 'result' | 'outro'

const COINS_PER_FIELD = 3

export function ChapterScreen({ chapter }: { chapter: number }) {
  const ch = chapters.find((c) => c.number === chapter)!
  const seen = save.value.lessonsSeen.includes(chapter)
  const [phase, setPhase] = useState<Phase>(seen ? 'hub' : 'intro')
  const [field, setField] = useState<Field>(() => newField(seedFrom(chapter, Date.now()), COINS_PER_FIELD))
  const [coin, setCoin] = useState<Coin | null>(null)
  const [lastScore, setLastScore] = useState<{ score: number; max: number } | null>(null)
  const [message, setMessage] = useState<{ text: string; id: number } | undefined>()
  const [seed, setSeed] = useState(1)

  const found = save.value.chapterFound[chapter] ?? 0
  const done = save.value.chapterDone.includes(chapter)

  const pickCoin = (): Coin => {
    const pool = coinsOfChapter(chapter)
    const owned = new Set(save.value.cabinet.map((c) => c.coin))
    const fresh = pool.filter((c) => !owned.has(c.id))
    const candidates = fresh.length ? fresh : pool
    const rng = mulberry32(seedFrom(chapter, Date.now(), candidates.length))
    return candidates[Math.floor(rng() * candidates.length)]
  }

  const onFound = (_b: Buried) => {
    const c = pickCoin()
    setCoin(c)
    setSeed(Date.now() % 100000)
    setPhase('clean')
  }

  const onField = (f: Field) => {
    if (f.daylight <= 0) {
      setMessage({ text: t('nightfall'), id: Date.now() })
      setField(newField(seedFrom(chapter, Date.now()), COINS_PER_FIELD))
      return
    }
    const left = f.buried.filter((b) => b.kind === 'coin' && !b.dug).length
    if (left === 0 && f.buried.some((b) => b.dug && b.kind === 'coin')) {
      setField({ ...newField(seedFrom(chapter, Date.now() + 1), COINS_PER_FIELD), daylight: f.daylight })
      return
    }
    setField(f)
  }

  const onIdentified = (score: number, max: number) => {
    if (!coin) return
    setLastScore({ score, max })
    addXp(score)
    addToCabinet({ coin: coin.id, chapter, score, foundAt: Date.now() })
    setPhase('result')
  }

  const afterResult = () => {
    const nowFound = save.value.chapterFound[chapter] ?? 0
    if (nowFound >= ch.coinsToFind && !done) setPhase('outro')
    else setPhase('dig')
  }

  const finishOutro = () => {
    completeChapter(chapter)
    addXp(100)
    go({ name: 'village' })
  }

  const finishLesson = () => {
    update((s) => ({ lessonsSeen: s.lessonsSeen.includes(chapter) ? s.lessonsSeen : [...s.lessonsSeen, chapter] }))
    setPhase('hub')
  }

  return (
    <div>
      <div class="chapter-head">
        <div class="period">
          {t('chapter')} {ch.number}
          <span class="years">{tx(ch.period)}</span>
        </div>
        <h1>{tx(ch.title)}</h1>
      </div>

      {phase === 'intro' && (
        <div class="panel" style="padding-top:0">
          <VillageScene terrain={ch.terrain} />
          <Dialogue lines={ch.intro} onDone={() => setPhase('lesson')} />
        </div>
      )}

      {phase === 'lesson' && (
        <div class="panel">
          <div class="caps" style="margin-bottom:10px">
            {t('lesson')}
          </div>
          <Dialogue lines={ch.lesson} onDone={finishLesson} doneLabel={t('startDig')} />
        </div>
      )}

      {phase === 'hub' && (
        <div>
          <div class="panel" style="padding:0;overflow:hidden">
            <VillageScene terrain={ch.terrain} />
            <div style="padding:0 32px 26px">
              <h2>{tx(ch.site)}</h2>
              <p class="muted">{tx(ch.siteNote)}</p>
              <div class="ruler-strip">
                {ch.rulers.map((r) => {
                  const pc = portraitCoin[r.id]
                  return (
                    <figure>
                      {pc ? <img src={coinImage(pc, 'obv')} alt={r.name.en} /> : <div class="nocoin" />}
                      {tx(r.name)}
                    </figure>
                  )
                })}
              </div>
              <p>
                {found} / {ch.coinsToFind} {t('coinsFound')}
                {done && <span class="muted"> ({t('completed').toLowerCase()})</span>}
              </p>
              <div class="row">
                <button class="btn primary" onClick={() => setPhase('dig')}>
                  {t('startDig')}
                </button>
                <button class="btn" onClick={() => setPhase('lesson')}>
                  {t('readLesson')}
                </button>
                <button class="btn quiet" onClick={() => go({ name: 'village' })}>
                  {t('toVillage')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === 'dig' && (
        <Dig chapter={ch} field={field} onField={onField} onFound={onFound} onLeave={() => setPhase('hub')} message={message} />
      )}

      {phase === 'clean' && coin && (
        <div class="panel">
          <Clean coin={coin} onDone={() => setPhase('identify')} />
        </div>
      )}

      {phase === 'identify' && coin && <Identify coin={coin} skills={ch.skills} seed={seed} onDone={onIdentified} />}

      {phase === 'result' && coin && (
        <div class="panel">
          <div class="row between">
            <h2>{t('recordComplete')}</h2>
            {lastScore && (
              <span class="score-pill">
                +{lastScore.score} {t('xpUnit')}
              </span>
            )}
          </div>
          <p class="muted">{t('addedToCabinet')}</p>
          <CoinRecord coin={coin} />
          <div class="row end" style="margin-top:20px">
            <button class="btn primary" onClick={afterResult}>
              {(save.value.chapterFound[chapter] ?? 0) >= ch.coinsToFind && !done ? t('next') : t('continueDig')}
            </button>
          </div>
        </div>
      )}

      {phase === 'outro' && (
        <div class="panel">
          <div class="caps" style="margin-bottom:10px">
            {t('chapterDone')}
          </div>
          <Dialogue lines={ch.outro} onDone={finishOutro} doneLabel={t('toVillage')} skippable={false} />
        </div>
      )}
    </div>
  )
}

export { DAYLIGHT }
