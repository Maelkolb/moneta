import { useMemo, useState } from 'preact/hooks'
import type { Coin } from '../data/types'
import type { Skill } from '../data/chapters'
import { data } from '../data'
import { recordSheet, scoreAnswer, mulberry32, type Question } from '../game/questions'
import { good, bad } from '../game/audio'
import { lang, save, t, tx, recordAnswer } from '../state'
import { CoinSides } from '../ui/CoinView'

type Props = {
  coin: Coin
  skills: Skill[]
  seed: number
  onDone: (score: number, maxScore: number) => void
}

const fieldLabel: Record<Skill, 'metal' | 'denomination' | 'ruler' | 'legend' | 'reverse' | 'date' | 'mint'> = {
  metal: 'metal',
  denomination: 'denomination',
  ruler: 'ruler',
  legend: 'legend',
  reverse: 'reverse',
  date: 'date',
  mint: 'mint',
}

export function Identify({ coin, skills, seed, onDone }: Props) {
  const questions = useMemo(() => recordSheet(coin, skills, data, lang.value, mulberry32(seed)), [coin.id, seed, lang.value])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [attempts, setAttempts] = useState(0)
  const [hint, setHint] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const [wrongIds, setWrongIds] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const q: Question | undefined = questions[index]
  const maxScore = questions.length * 20
  const soundOn = save.value.sound

  const choose = (id: string) => {
    if (!q || picked === q.answer || revealed) return
    const n = attempts + 1
    setAttempts(n)
    if (id === q.answer) {
      setPicked(id)
      const pts = scoreAnswer(n, hint)
      setScore(score + pts)
      recordAnswer(q.skill, n === 1)
      if (soundOn) good()
    } else {
      setWrongIds([...wrongIds, id])
      if (soundOn) bad()
      if (n >= 2) {
        recordAnswer(q.skill, false)
        setRevealed(true)
      }
    }
  }

  const next = () => {
    if (!q) return
    const label = q.options.find((o) => o.id === q.answer)?.label ?? ''
    const nextAnswers = { ...answers, [q.skill]: label }
    setAnswers(nextAnswers)
    if (index + 1 >= questions.length) {
      onDone(score, maxScore)
      return
    }
    setIndex(index + 1)
    setAttempts(0)
    setHint(false)
    setPicked(null)
    setWrongIds([])
    setRevealed(false)
  }

  const solved = picked === q?.answer || revealed

  return (
    <div class="identify-layout">
      <div class="panel">
        <CoinSides coin={coin} highlight={q?.skill === 'legend' ? q.highlight : undefined} showLegends={q?.skill === 'legend'} />
        {(coin.diameter || coin.weight) && (
          <p class="small muted" style="margin-top:12px">
            {coin.diameter ? `${coin.diameter} mm` : ''}
            {coin.diameter && coin.weight ? ', ' : ''}
            {coin.weight ? `${coin.weight} g` : ''}
          </p>
        )}
      </div>
      <div class="panel">
        <div class="row between">
          <h2>{t('recordSheet')}</h2>
          <span class="score-pill">
            {score} / {maxScore} {t('points')}
          </span>
        </div>
        <div class="record" style="margin-top:12px">
          {questions.map((qq, i) => (
            <div class={`field ${i === index ? 'current' : i > index ? 'pending' : ''}`}>
              <span class="k">{t(fieldLabel[qq.skill])}</span>
              <span class="v">{answers[qq.skill] ?? (i === index ? '…' : '')}</span>
            </div>
          ))}
        </div>

        {q && (
          <div class="question">
            <h2>{tx(q.prompt)}</h2>
            <div class="options">
              {q.options.map((o) => {
                const cls = o.id === picked ? 'right' : wrongIds.includes(o.id) ? 'wrong' : revealed && o.id === q.answer ? 'right' : ''
                return (
                  <button class={cls} disabled={solved || wrongIds.includes(o.id)} onClick={() => choose(o.id)}>
                    {o.label}
                    {o.detail && <span class="detail">{o.detail}</span>}
                  </button>
                )
              })}
            </div>
            {hint && !solved && <div class="feedback">{tx(q.hint)}</div>}
            {solved && (
              <div class={`feedback ${picked === q.answer ? 'good' : 'bad'}`}>
                {picked === q.answer ? (
                  <span>
                    {t('correct')}, +{scoreAnswer(attempts, hint)} {t('points')}
                  </span>
                ) : (
                  <span>{t('wrong')}. {q.options.find((o) => o.id === q.answer)?.label}</span>
                )}
              </div>
            )}
            <div class="row end" style="margin-top:14px">
              {!solved && !hint && (
                <button class="btn quiet" onClick={() => setHint(true)} title={t('hintCost')}>
                  {t('hint')}
                </button>
              )}
              {solved && (
                <button class="btn primary" onClick={next}>
                  {index + 1 >= questions.length ? t('recordComplete') : t('next')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
