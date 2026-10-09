import { useEffect, useMemo, useState } from 'preact/hooks'
import { chapters, rulerById } from '../data/chapters'
import { ansUrl, coinById, coinImage, data, ocreUrl } from '../data'
import { play, sfxBad, sfxGood } from '../engine/audio'
import { assetUrl, img } from '../engine/assets'
import { formatRange, mulberry32, recordSheet, scoreAnswer, type Question } from '../game/questions'
import { addToCabinet, addXp, bookOpen, go, lang, recordAnswer, t, tx } from '../state'
import { Legend } from '../ui/Legend'

type Props = { chapter: number; coinId: string }

const fieldLabel = {
  metal: 'metal',
  denomination: 'denomination',
  ruler: 'ruler',
  legend: 'legend',
  reverse: 'reverse',
  date: 'date',
  mint: 'mint',
} as const

export function Identify({ chapter, coinId }: Props) {
  const coin = coinById(coinId)!
  const ch = chapters.find((c) => c.number === chapter)!
  const seed = useMemo(() => Date.now() % 100000, [coinId])
  const questions = useMemo(() => recordSheet(coin, ch.skills, data, lang.value, mulberry32(seed)), [coinId, lang.value])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [attempts, setAttempts] = useState(0)
  const [hint, setHint] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const [wrongIds, setWrongIds] = useState<string[]>([])
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [zoom, setZoom] = useState<'obv' | 'rev' | null>(null)

  useEffect(() => {
    void play('battle')
  }, [])

  const q: Question | undefined = questions[index]
  const maxScore = questions.length * 20
  const solved = picked === q?.answer || revealed

  const choose = (id: string) => {
    if (!q || solved) return
    const n = attempts + 1
    setAttempts(n)
    if (id === q.answer) {
      setPicked(id)
      setScore(score + scoreAnswer(n, hint))
      recordAnswer(q.skill, n === 1)
      sfxGood()
    } else {
      setWrongIds([...wrongIds, id])
      sfxBad()
      if (n >= 2) {
        recordAnswer(q.skill, false)
        setRevealed(true)
      }
    }
  }

  const next = () => {
    if (!q) return
    const label = q.options.find((o) => o.id === q.answer)?.label ?? ''
    setAnswers({ ...answers, [q.skill]: label })
    if (index + 1 >= questions.length) {
      addXp(score)
      addToCabinet({ coin: coin.id, chapter, score, foundAt: Date.now() })
      setFinished(true)
      return
    }
    setIndex(index + 1)
    setAttempts(0)
    setHint(false)
    setPicked(null)
    setWrongIds([])
    setRevealed(false)
  }

  const leave = () => go({ name: 'world', chapter, returnFrom: 'identify' })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (bookOpen.value) return
      if (e.key === 'Enter') {
        e.preventDefault()
        if (finished) leave()
        else if (solved) next()
      } else if (/^[1-4]$/.test(e.key) && q && !solved && !finished) {
        const o = q.options[Number(e.key) - 1]
        if (o && !wrongIds.includes(o.id)) choose(o.id)
      } else if (e.key.toLowerCase() === 'h' && !solved && !finished) setHint(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const l = lang.value
  const ruler = rulerById(coin.portrait)

  return (
    <div class="screen identify">
      <div class="coin-column">
        <figure onClick={() => setZoom('obv')}>
          <img src={coinImage(coin, 'obv')} alt={coin.obvDescription} />
          <figcaption>
            {t('obverse')}
            {(q?.skill === 'legend' || finished) && <Legend text={coin.obvLegend} highlight={finished ? undefined : q?.highlight} />}
          </figcaption>
        </figure>
        <figure onClick={() => setZoom('rev')}>
          <img src={coinImage(coin, 'rev')} alt={coin.revDescription} />
          <figcaption>
            {t('reverse')}
            {(q?.skill === 'legend' || finished) && <Legend text={coin.revLegend} highlight={finished ? undefined : q?.highlight} />}
          </figcaption>
        </figure>
        <div class="coin-measure">
          {coin.diameter ? `${coin.diameter} mm` : ''}
          {coin.diameter && coin.weight ? ', ' : ''}
          {coin.weight ? `${coin.weight} g` : ''}
        </div>
      </div>

      {!finished && q && (
        <div class="question-column">
          <div class="sheet-head">
            <span>{t('recordSheet')}</span>
            <span>
              {score} / {maxScore}
            </span>
          </div>
          <div class="sheet-fields">
            {questions.map((qq, i) => (
              <span class={`sheet-field ${i === index ? 'current' : i > index ? 'pending' : 'done'}`}>
                <b>{t(fieldLabel[qq.skill])}</b> {answers[qq.skill] ?? ''}
              </span>
            ))}
          </div>
          <div class="q-prompt">{tx(q.prompt)}</div>
          <div class="q-options">
            {q.options.map((o, i) => {
              const cls = o.id === picked ? 'right' : wrongIds.includes(o.id) ? 'wrong' : revealed && o.id === q.answer ? 'right' : ''
              return (
                <button class={`q-option ${cls}`} disabled={solved || wrongIds.includes(o.id)} onClick={() => choose(o.id)}>
                  <span class="q-num">{i + 1}</span>
                  <span>
                    {o.label}
                    {o.detail && <small>{o.detail}</small>}
                  </span>
                </button>
              )
            })}
          </div>
          <div class="q-foot">
            {hint && !solved && <div class="q-hint">{tx(q.hint)}</div>}
            {solved && (
              <div class={`q-feedback ${picked === q.answer ? 'good' : 'bad'}`}>
                {picked === q.answer ? `${t('correct')}, +${scoreAnswer(attempts, hint)} ${t('points')}` : `${t('wrong')}: ${q.options.find((o) => o.id === q.answer)?.label}`}
              </div>
            )}
            <div class="q-buttons">
              {!solved && !hint && (
                <button class="small-btn" onClick={() => setHint(true)}>
                  {t('hint')} [H]
                </button>
              )}
              <button class="small-btn" onClick={() => (bookOpen.value = true)}>
                <img src={assetUrl(img.book)} alt="" /> {t('book')} [B]
              </button>
              {solved && (
                <button class="small-btn primary" onClick={next}>
                  {index + 1 >= questions.length ? t('recordComplete') : t('next')} ↵
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {finished && (
        <div class="question-column result">
          <div class="sheet-head">
            <span>{t('recordComplete')}</span>
            <span>
              +{score} {t('xpUnit')}
            </span>
          </div>
          <div class="result-ric">{coin.ric}</div>
          <table class="result-table">
<tbody>
            <tr>
              <th>{t('ruler')}</th>
              <td>
                {ruler?.name[l] ?? data.authorities[coin.portrait]?.[l] ?? coin.portrait}
                {ruler && <span class="dim"> ({ruler.reign})</span>}
              </td>
            </tr>
            <tr>
              <th>{t('denomination')}</th>
              <td>
                {data.denominations[coin.denomination]?.[l] ?? coin.denomination}, {data.materials[coin.material][l].toLowerCase()}
              </td>
            </tr>
            <tr>
              <th>{t('mint')}</th>
              <td>{data.mints[coin.mint]?.[l] ?? coin.mint}</td>
            </tr>
            <tr>
              <th>{t('date')}</th>
              <td>{formatRange(coin.start, coin.end, l)}</td>
            </tr>
            <tr>
              <th>{t('obverse')}</th>
              <td>{coin.obvDescription}</td>
            </tr>
            <tr>
              <th>{t('reverse')}</th>
              <td>{coin.revDescription}</td>
            </tr>
            <tr>
              <th>{t('specimen')}</th>
              <td>
                <a href={ansUrl(coin)} target="_blank" rel="noopener">
                  ANS {coin.specimen}
                </a>
              </td>
            </tr>
          </tbody>
</table>
          <div class="q-buttons">
            <a class="small-btn" href={ocreUrl(coin)} target="_blank" rel="noopener">
              OCRE ↗
            </a>
            <button class="small-btn primary" onClick={leave}>
              {t('continueGame')} ↵
            </button>
          </div>
          <div class="result-note">{t('addedToCabinet')}</div>
        </div>
      )}

      {zoom && (
        <div class="zoom" onClick={() => setZoom(null)}>
          <img src={coinImage(coin, zoom)} alt="" />
        </div>
      )}
    </div>
  )
}
