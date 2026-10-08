import type { Coin, Dataset, Lang, Text } from '../data/types'
import type { Skill } from '../data/chapters'
import { chapters, rulerById } from '../data/chapters'
import { denominations, materialNames } from '../data/denominations'
import { glossary } from '../data/glossary'
import { mintMarkById } from '../data/mintmarks'

export type Option = { id: string; label: string; detail?: string }

export type Question = {
  skill: Skill
  coin: Coin
  prompt: Text
  options: Option[]
  answer: string
  highlight?: string
  hint: Text
}

export type Rng = () => number

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(items: T[], rng: Rng): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function pick<T>(items: T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)]
}

function sampleDistinct<T>(pool: T[], n: number, rng: Rng, key: (x: T) => string, exclude: Set<string>): T[] {
  const seen = new Set(exclude)
  const out: T[] = []
  for (const item of shuffle(pool, rng)) {
    const k = key(item)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(item)
    if (out.length === n) break
  }
  return out
}

export function formatYear(y: number, lang: Lang): string {
  if (y < 0) return lang === 'de' ? `${-y} v. Chr.` : `${-y} BC`
  return lang === 'de' ? `${y} n. Chr.` : `AD ${y}`
}

export function formatRange(start: number, end: number, lang: Lang): string {
  if (start === end) return formatYear(start, lang)
  if (start < 0 && end > 0) return `${formatYear(start, lang)} – ${formatYear(end, lang)}`
  if (start < 0) return lang === 'de' ? `${-start}–${-end} v. Chr.` : `${-start}–${-end} BC`
  return lang === 'de' ? `${start}–${end} n. Chr.` : `AD ${start}–${end}`
}

function text(en: string, de: string): Text {
  return { en, de }
}

export function metalQuestion(coin: Coin, data: Dataset, lang: Lang): Question {
  const ids = ['av', 'ar', 'ae']
  return {
    skill: 'metal',
    coin,
    prompt: text('What metal is the coin made of?', 'Aus welchem Metall besteht die Münze?'),
    options: ids.map((id) => ({ id, label: materialNames[id][lang] })),
    answer: coin.material,
    hint: text(
      'Look at the colour: yellow is gold, grey-white is silver, green or brown is bronze. Antoniniani of the 3rd century count as silver even when little is left.',
      'Achte auf die Farbe: gelb ist Gold, grauweiß Silber, grün oder braun Bronze. Antoniniane des 3. Jahrhunderts zählen als Silber, auch wenn wenig davon übrig ist.',
    ),
  }
}

export function denominationQuestion(coin: Coin, data: Dataset, lang: Lang, rng: Rng): Question {
  const sameMetal = denominations.filter((d) => d.metal === coin.material && d.id !== coin.denomination)
  const others = denominations.filter((d) => d.metal !== coin.material && d.id !== coin.denomination)
  const distractors = [...shuffle(sameMetal, rng), ...shuffle(others, rng)].slice(0, 3)
  const correct = data.denominations[coin.denomination]
  const options = shuffle(
    [
      { id: coin.denomination, label: correct?.[lang] ?? coin.denomination },
      ...distractors.map((d) => ({ id: d.id, label: d.name[lang] })),
    ],
    rng,
  )
  const d = coin.diameter ? `${coin.diameter}` : '?'
  const w = coin.weight ? `${coin.weight}` : '?'
  return {
    skill: 'denomination',
    coin,
    prompt: text('What is the denomination?', 'Welches Nominal ist es?'),
    options,
    answer: coin.denomination,
    hint: text(
      `The specimen measures ${d} mm and weighs ${w} g. Compare with the table of denominations in the Codex.`,
      `Das Stück misst ${d} mm und wiegt ${w} g. Vergleiche mit der Nominaltabelle im Codex.`,
    ),
  }
}

export function rulerQuestion(coin: Coin, data: Dataset, lang: Lang, rng: Rng): Question {
  const chapter = chapters.find((c) => c.number === coin.chapter) ?? chapters[0]
  const poolIds = chapter.rulers.map((r) => r.id).filter((id) => id !== coin.portrait && data.authorities[id])
  const neighbours = chapters
    .filter((c) => Math.abs(c.number - coin.chapter) === 1)
    .flatMap((c) => c.rulers.map((r) => r.id))
    .filter((id) => id !== coin.portrait && data.authorities[id] && !poolIds.includes(id))
  const distractors = [...shuffle(poolIds, rng), ...shuffle(neighbours, rng)].slice(0, 3)
  const name = (id: string) => rulerById(id)?.name[lang] ?? data.authorities[id]?.[lang] ?? id
  const options = shuffle([coin.portrait, ...distractors].map((id) => ({ id, label: name(id) })), rng)
  return {
    skill: 'ruler',
    coin,
    prompt: text('Whose portrait is on the obverse?', 'Wessen Porträt zeigt die Vorderseite?'),
    options,
    answer: coin.portrait,
    hint: text(`The obverse legend reads: ${coin.obvLegend}`, `Die Averslegende lautet: ${coin.obvLegend}`),
  }
}

const legendTokens = glossary
  .filter((g) => g.group !== 'reverse' || ['S C', 'CONSECRATIO', 'FEL TEMP REPARATIO', 'GLORIA EXERCITVS', 'GENIO POPVLI ROMANI', 'SECVRITAS REIPVBLICAE', 'VOT'].includes(g.abbr))
  .map((g) => ({ ...g, pattern: new RegExp(`(^|[^A-Z])${g.abbr.replace(/ /g, '\\s?')}(?=$|[^A-Z])`) }))

export function findLegendTokens(legend: string) {
  const found: { abbr: string; latin: string; meaning: Text }[] = []
  for (const g of legendTokens) {
    if (g.abbr === 'AVG' && /AVGG/.test(legend)) continue
    if (g.abbr === 'CAES' && /CAESARES/.test(legend)) continue
    if (g.pattern.test(legend)) found.push({ abbr: g.abbr, latin: g.latin, meaning: g.meaning })
  }
  return found
}

export function legendQuestion(coin: Coin, data: Dataset, lang: Lang, rng: Rng): Question | undefined {
  const legend = `${coin.obvLegend} / ${coin.revLegend}`
  const tokens = findLegendTokens(legend)
  if (!tokens.length) return undefined
  const target = pick(tokens, rng)
  const distractors = sampleDistinct(glossary, 3, rng, (g) => g.latin, new Set([target.latin]))
  const options = shuffle(
    [{ id: target.latin, label: target.latin, detail: target.meaning[lang] }, ...distractors.map((g) => ({ id: g.latin, label: g.latin, detail: g.meaning[lang] }))],
    rng,
  )
  return {
    skill: 'legend',
    coin,
    prompt: text('What does the highlighted abbreviation mean?', 'Was bedeutet die markierte Abkürzung?'),
    options,
    answer: target.latin,
    highlight: target.abbr,
    hint: text('Check the glossary in the Codex.', 'Sieh im Glossar des Codex nach.'),
  }
}

export function reverseQuestion(coin: Coin, data: Dataset, lang: Lang, rng: Rng): Question {
  const pool = data.coins.filter((c) => c.id !== coin.id && c.revDescription && c.revDescription !== coin.revDescription)
  const near = pool.filter((c) => c.chapter === coin.chapter)
  const distractors = sampleDistinct(near.length >= 3 ? near : pool, 3, rng, (c) => c.revDescription.slice(0, 40), new Set([coin.revDescription.slice(0, 40)]))
  const options = shuffle([coin, ...distractors].map((c) => ({ id: c.id, label: c.revDescription })), rng)
  return {
    skill: 'reverse',
    coin,
    prompt: text('What does the reverse show?', 'Was zeigt die Rückseite?'),
    options,
    answer: coin.id,
    hint: text(`The reverse legend reads: ${coin.revLegend || '(none)'}`, `Die Reverslegende lautet: ${coin.revLegend || '(keine)'}`),
  }
}

export function dateQuestion(coin: Coin, data: Dataset, lang: Lang, rng: Rng): Question {
  const span = Math.max(coin.end - coin.start, 1)
  const width = Math.max(span, 4)
  const ranges = new Set<string>()
  const correct = `${coin.start}:${coin.end}`
  ranges.add(correct)
  const offsets = shuffle([-3, -2, -1, 1, 2, 3, -4, 4], rng)
  for (const k of offsets) {
    const s = coin.start + k * (width + 2)
    const r = `${s}:${s + span}`
    if (!ranges.has(r)) ranges.add(r)
    if (ranges.size === 4) break
  }
  const options = [...ranges]
    .map((r) => r.split(':').map(Number) as [number, number])
    .sort((a, b) => a[0] - b[0])
    .map(([s, e]) => ({ id: `${s}:${e}`, label: formatRange(s, e, lang) }))
  const ruler = rulerById(coin.portrait)
  return {
    skill: 'date',
    coin,
    prompt: text('When was the coin struck?', 'Wann wurde die Münze geprägt?'),
    options,
    answer: correct,
    hint: text(
      `The ruler reigned ${ruler?.reign ?? '?'}. Titles with numbers (TR P, COS) narrow it down further.`,
      `Der Herrscher regierte ${ruler?.reign ?? '?'}. Titel mit Zahlen (TR P, COS) grenzen weiter ein.`,
    ),
  }
}

export function mintQuestion(coin: Coin, data: Dataset, lang: Lang, rng: Rng): Question {
  const pool = Object.keys(data.mints).filter((m) => m !== coin.mint)
  const sameEra = data.coins.filter((c) => Math.abs(c.start - coin.start) < 40 && c.mint !== coin.mint).map((c) => c.mint)
  const distractors = sampleDistinct([...new Set(sameEra)].length >= 3 ? [...new Set(sameEra)] : pool, 3, rng, (m) => m, new Set([coin.mint]))
  const label = (id: string) => data.mints[id]?.[lang] ?? id
  const options = shuffle([coin.mint, ...distractors].map((id) => ({ id, label: label(id) })), rng)
  const mark = mintMarkById[coin.mint]?.marks.slice(0, 3).join(', ') ?? '(no mark)'
  return {
    skill: 'mint',
    coin,
    prompt: text('Where was the coin struck?', 'Wo wurde die Münze geprägt?'),
    options,
    answer: coin.mint,
    hint: text(`Typical marks of this mint in the exergue: ${mark}`, `Typische Zeichen dieser Münzstätte im Abschnitt: ${mark}`),
  }
}

export function questionFor(skill: Skill, coin: Coin, data: Dataset, lang: Lang, rng: Rng): Question | undefined {
  switch (skill) {
    case 'metal':
      return metalQuestion(coin, data, lang)
    case 'denomination':
      return denominationQuestion(coin, data, lang, rng)
    case 'ruler':
      return rulerQuestion(coin, data, lang, rng)
    case 'legend':
      return legendQuestion(coin, data, lang, rng)
    case 'reverse':
      return reverseQuestion(coin, data, lang, rng)
    case 'date':
      return dateQuestion(coin, data, lang, rng)
    case 'mint':
      return mintQuestion(coin, data, lang, rng)
  }
}

export function recordSheet(coin: Coin, skills: Skill[], data: Dataset, lang: Lang, rng: Rng): Question[] {
  const out: Question[] = []
  for (const s of skills) {
    const q = questionFor(s, coin, data, lang, rng)
    if (q) out.push(q)
  }
  return out
}

export const POINTS_PER_QUESTION = 20

export function scoreAnswer(attempts: number, usedHint: boolean): number {
  let p = attempts === 1 ? POINTS_PER_QUESTION : attempts === 2 ? Math.round(POINTS_PER_QUESTION / 2) : 0
  if (usedHint) p = Math.round(p / 2)
  return p
}
