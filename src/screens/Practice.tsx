import { useEffect, useState } from 'preact/hooks'
import { coinImage, data } from '../data'
import type { Skill } from '../data/chapters'
import { play, sfxBad, sfxGood } from '../engine/audio'
import { mulberry32, questionFor, shuffle, type Question } from '../game/questions'
import { addXp, bookOpen, go, lang, recordAnswer, t, tx, unlockedChapters } from '../state'
import { Legend } from '../ui/Legend'

const skills: Skill[] = ['metal', 'denomination', 'ruler', 'legend', 'reverse', 'date', 'mint']
const labels = {
  metal: 'skillMetal',
  denomination: 'skillDenomination',
  ruler: 'skillRuler',
  legend: 'skillLegend',
  reverse: 'skillReverse',
  date: 'skillDate',
  mint: 'skillMint',
} as const

type Props = { chapter: number; skill?: Skill; rounds?: number; interior?: string; title?: string }

export function Practice({ chapter, skill: presetSkill, rounds: presetRounds, interior, title }: Props) {
  const ROUNDS = presetRounds ?? 10
  const [skill, setSkill] = useState<Skill>(presetSkill ?? 'ruler')
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [picked, setPicked] = useState<string | null>(null)

  useEffect(() => {
    void play('battle')
  }, [])

  const start = () => {
    const unlocked = unlockedChapters()
    const pool = data.coins.filter((c) => unlocked.includes(c.chapter))
    const rng = mulberry32(Date.now() % 1000000)
    const qs: Question[] = []
    for (const coin of shuffle(pool, rng)) {
      const q = questionFor(skill, coin, data, lang.value, rng)
      if (q) qs.push(q)
      if (qs.length === ROUNDS) break
    }
    setQuestions(qs)
    setIndex(0)
    setResults([])
    setPicked(null)
  }

  const q = questions?.[index]
  const choose = (id: string) => {
    if (!q || picked) return
    setPicked(id)
    const ok = id === q.answer
    recordAnswer(q.skill, ok)
    if (ok) addXp(5)
    ;(ok ? sfxGood : sfxBad)()
    setResults([...results, ok])
  }
  const next = () => {
    setPicked(null)
    setIndex(index + 1)
  }
  const leave = () => go({ name: 'world', chapter, interior })
  useEffect(() => {
    if (presetSkill && !questions) start()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (bookOpen.value) return
      if (e.key === 'Escape') leave()
      else if (e.key === 'Enter') {
        if (!questions) start()
        else if (!q) start()
        else if (picked) next()
      } else if (/^[1-4]$/.test(e.key) && q && !picked) {
        const o = q.options[Number(e.key) - 1]
        if (o) choose(o.id)
      } else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!questions) {
    return (
      <div class="screen identify practice-setup">
        <div class="question-column">
          <div class="sheet-head">
            <span>{t('practice')}</span>
          </div>
          <p class="q-prompt">{t('practiceIntro')}</p>
          <div class="skill-grid">
            {skills.map((s) => (
              <button class={`q-option ${skill === s ? 'right' : ''}`} onClick={() => setSkill(s)}>
                {t(labels[s])}
              </button>
            ))}
          </div>
          <div class="q-buttons">
            <button class="small-btn" onClick={leave}>
              {t('back')} [Esc]
            </button>
            <button class="small-btn primary" onClick={start}>
              {t('practiceStart')} ↵
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!q) {
    const right = results.filter(Boolean).length
    return (
      <div class="screen identify practice-setup">
        <div class="question-column">
          <div class="sheet-head">
            <span>{t('practiceResult')}</span>
            <span>
              {right} / {results.length}
            </span>
          </div>
          <div class="practice-dots">
            {results.map((r) => (
              <i class={r ? 'right' : 'wrong'} />
            ))}
          </div>
          <div class="q-buttons">
            <button class="small-btn" onClick={leave}>
              {t('back')} [Esc]
            </button>
            <button class="small-btn primary" onClick={start}>
              {t('practiceAgain')} ↵
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div class="screen identify">
      <div class="coin-column">
        <figure>
          <img src={coinImage(q.coin, 'obv')} alt="" />
          <figcaption>
            {t('obverse')}
            {q.skill === 'legend' && <Legend text={q.coin.obvLegend} highlight={q.highlight} />}
          </figcaption>
        </figure>
        <figure>
          <img src={coinImage(q.coin, 'rev')} alt="" />
          <figcaption>
            {t('reverse')}
            {q.skill === 'legend' && <Legend text={q.coin.revLegend} highlight={q.highlight} />}
          </figcaption>
        </figure>
      </div>
      <div class="question-column">
        <div class="sheet-head">
          <span>{title ?? t('practice')}</span>
          <span>
            {index + 1} / {ROUNDS}
          </span>
        </div>
        <div class="practice-dots">
          {Array.from({ length: ROUNDS }, (_, i) => (
            <i class={results[i] === undefined ? '' : results[i] ? 'right' : 'wrong'} />
          ))}
        </div>
        <div class="q-prompt">{tx(q.prompt)}</div>
        <div class="q-options">
          {q.options.map((o, i) => {
            const cls = picked ? (o.id === q.answer ? 'right' : o.id === picked ? 'wrong' : '') : ''
            return (
              <button class={`q-option ${cls}`} disabled={!!picked} onClick={() => choose(o.id)}>
                <span class="q-num">{i + 1}</span>
                <span>
                  {o.label}
                  {o.detail && <small>{o.detail}</small>}
                </span>
              </button>
            )
          })}
        </div>
        <div class="q-buttons">
          <button class="small-btn" onClick={leave}>
            {t('back')} [Esc]
          </button>
          {picked && (
            <button class="small-btn primary" onClick={next}>
              {t('next')} ↵
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
