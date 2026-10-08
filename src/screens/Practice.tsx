import { useState } from 'preact/hooks'
import { data } from '../data'
import type { Skill } from '../data/chapters'
import type { Coin } from '../data/types'
import { mulberry32, questionFor, shuffle, type Question } from '../game/questions'
import { good, bad } from '../game/audio'
import { addXp, lang, recordAnswer, save, t, tx, unlockedChapters } from '../state'
import { CoinSides } from '../ui/CoinView'

const skills: Skill[] = ['metal', 'denomination', 'ruler', 'legend', 'reverse', 'date', 'mint']
const labels: Record<Skill, 'skillMetal' | 'skillDenomination' | 'skillRuler' | 'skillLegend' | 'skillReverse' | 'skillDate' | 'skillMint'> = {
  metal: 'skillMetal',
  denomination: 'skillDenomination',
  ruler: 'skillRuler',
  legend: 'skillLegend',
  reverse: 'skillReverse',
  date: 'skillDate',
  mint: 'skillMint',
}

const ROUNDS = 10

export function Practice() {
  const [skill, setSkill] = useState<Skill>('ruler')
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [picked, setPicked] = useState<string | null>(null)

  const start = () => {
    const unlocked = unlockedChapters()
    const pool = data.coins.filter((c) => unlocked.includes(c.chapter))
    const rng = mulberry32(Date.now() % 1000000)
    const qs: Question[] = []
    for (const coin of shuffle(pool, rng)) {
      const q = questionFor(skill, coin as Coin, data, lang.value, rng)
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
    if (save.value.sound) (ok ? good : bad)()
    setResults([...results, ok])
  }
  const next = () => {
    setPicked(null)
    setIndex(index + 1)
  }

  if (!questions) {
    return (
      <div class="panel">
        <h2>{t('practice')}</h2>
        <p class="muted">{t('practiceIntro')}</p>
        <div class="skill-grid" style="margin:16px 0 20px">
          {skills.map((s) => (
            <button class={skill === s ? 'active' : ''} onClick={() => setSkill(s)}>
              {t(labels[s])}
            </button>
          ))}
        </div>
        <button class="btn primary" onClick={start}>
          {t('practiceStart')}
        </button>
      </div>
    )
  }

  if (!q) {
    const right = results.filter(Boolean).length
    return (
      <div class="panel">
        <h2>{t('practiceResult')}</h2>
        <div class="practice-progress" style="margin:16px 0">
          {results.map((r) => (
            <i class={r ? 'right' : 'wrong'} />
          ))}
        </div>
        <p style="font-size:1.4rem">
          {right} / {results.length}
        </p>
        <div class="row">
          <button class="btn primary" onClick={start}>
            {t('practiceAgain')}
          </button>
          <button class="btn" onClick={() => setQuestions(null)}>
            {t('back')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div class="identify-layout">
      <div class="panel">
        <CoinSides coin={q.coin} highlight={q.skill === 'legend' ? q.highlight : undefined} showLegends={q.skill === 'legend'} />
      </div>
      <div class="panel">
        <div class="practice-progress">
          {Array.from({ length: ROUNDS }, (_, i) => (
            <i class={results[i] === undefined ? '' : results[i] ? 'right' : 'wrong'} />
          ))}
        </div>
        <h2>{tx(q.prompt)}</h2>
        <div class="options" style="margin-top:12px">
          {q.options.map((o) => {
            const cls = picked ? (o.id === q.answer ? 'right' : o.id === picked ? 'wrong' : '') : ''
            return (
              <button class={cls} disabled={!!picked} onClick={() => choose(o.id)}>
                {o.label}
                {o.detail && <span class="detail">{o.detail}</span>}
              </button>
            )
          })}
        </div>
        {picked && (
          <div class="row end" style="margin-top:14px">
            <button class="btn primary" onClick={next}>
              {t('next')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
