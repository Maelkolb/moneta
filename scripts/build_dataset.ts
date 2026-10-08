import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'
import { chapters } from '../src/data/chapters.ts'
import { denominations } from '../src/data/denominations.ts'

type Specimen = { coin: string; obv: string; rev: string; weight?: number; diameter?: number }
type RawType = {
  id: string
  label: string
  authority: string[]
  portrait: string[]
  denomination: string[]
  material: string[]
  mint: string[]
  startDate?: number
  endDate?: number
  obvLegend: string[]
  obvDescription: string[]
  revLegend: string[]
  revDescription: string[]
  specimens: Specimen[]
}
type Label = { en?: string; de?: string; lat?: number; long?: number }

const NM = 'http://nomisma.org/id/'
const OCRE = 'http://numismatics.org/ocre/id/'
const CAP_PER_RULER = 10
const IMAGE_SIZE = 320

const raw = JSON.parse(readFileSync('data/raw/types.json', 'utf8')) as RawType[]
const labels = JSON.parse(readFileSync('data/raw/labels.json', 'utf8')) as Record<string, Label>

const short = (uri: string) => uri.replace(NM, '')
const materialMap: Record<string, 'av' | 'ar' | 'ae'> = {
  av: 'av', au: 'av', electrum: 'av',
  ar: 'ar', billon: 'ar',
  ae: 'ae', cu: 'ae', orichalcum: 'ae', brass: 'ae', bronze: 'ae', pb: 'ae',
}
const denominationAlias: Record<string, string> = {
  follis: 'nummus',
  large_ae2: 'ae2', reduced_ae2: 'ae2', small_ae2: 'ae2',
  reduced_siliqua: 'siliqua', half_siliqua: 'siliqua',
  light_miliarensis: 'miliarense', heavy_miliarensis: 'miliarense', miliarensis: 'miliarense',
  'double-sestertius': 'sestertius',
  aureus_quinarius: 'quinarius_aureus',
  quinarius_aureus: 'quinarius_aureus',
  silver_quinarius: 'quinarius',
  quinarius_argenteus: 'quinarius',
  'ae1': 'ae1', 'ae2': 'ae2', 'ae3': 'ae3', 'ae4': 'ae4',
  ae3_4: 'ae3',
  heavy_miliarense: 'miliarense',
  light_miliarense: 'miliarense',
}
const knownDenominations = new Set(denominations.map((d) => d.id))

const unknownDenominations = new Map<string, number>()
const unknownMaterials = new Map<string, number>()

function normalise(t: RawType) {
  const denomRaw = short(t.denomination[0] ?? '')
  const denom = denominationAlias[denomRaw] ?? denomRaw
  const matRaw = short(t.material[0] ?? '')
  const mat = materialMap[matRaw]
  if (!knownDenominations.has(denom)) unknownDenominations.set(denomRaw, (unknownDenominations.get(denomRaw) ?? 0) + 1)
  if (!mat) unknownMaterials.set(matRaw, (unknownMaterials.get(matRaw) ?? 0) + 1)
  return { denom, mat }
}

function slug(id: string) {
  return id.replace(OCRE, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
}

function bestSpecimen(specs: Specimen[]): Specimen {
  const scored = specs.map((s) => ({ s, score: (s.weight ? 1 : 0) + (s.diameter ? 1 : 0) }))
  scored.sort((a, b) => b.score - a.score)
  return scored[0].s
}

type Selected = ReturnType<typeof toCoin>
function toCoin(t: RawType, chapter: number, denom: string, mat: 'av' | 'ar' | 'ae') {
  const spec = bestSpecimen(t.specimens)
  return {
    id: slug(t.id),
    ocre: t.id.replace(OCRE, ''),
    ric: t.label,
    authority: short(t.authority[0]),
    portrait: short(t.portrait[0] ?? t.authority[0]),
    denomination: denom,
    material: mat,
    mint: short(t.mint[0]),
    start: t.startDate!,
    end: t.endDate!,
    obvLegend: t.obvLegend.join(' or '),
    obvDescription: t.obvDescription[0],
    revLegend: t.revLegend.join(' or '),
    revDescription: t.revDescription[0],
    specimen: spec.coin.replace('http://numismatics.org/collection/', ''),
    weight: spec.weight,
    diameter: spec.diameter,
    chapter,
    obvUrl: spec.obv,
    revUrl: spec.rev,
  }
}

function diversify(cands: Selected[], cap: number): Selected[] {
  const out: Selected[] = []
  const usedDenom = new Map<string, number>()
  const usedMint = new Map<string, number>()
  const usedRev = new Set<string>()
  const remaining = [...cands].sort((a, b) => a.start - b.start)
  while (out.length < cap && remaining.length) {
    let bestIdx = 0
    let bestScore = -Infinity
    remaining.forEach((c, i) => {
      const revKey = c.revDescription.slice(0, 30)
      let score = 0
      score -= (usedDenom.get(c.denomination) ?? 0) * 3
      score -= (usedMint.get(c.mint) ?? 0) * 1.5
      if (usedRev.has(revKey)) score -= 4
      if (c.weight && c.diameter) score += 1
      if (c.material === 'av' && (usedDenom.get(c.denomination) ?? 0) === 0) score += 1
      if (score > bestScore) { bestScore = score; bestIdx = i }
    })
    const [chosen] = remaining.splice(bestIdx, 1)
    out.push(chosen)
    usedDenom.set(chosen.denomination, (usedDenom.get(chosen.denomination) ?? 0) + 1)
    usedMint.set(chosen.mint, (usedMint.get(chosen.mint) ?? 0) + 1)
    usedRev.add(chosen.revDescription.slice(0, 30))
  }
  return out
}

const rulerChapter = new Map<string, number>()
for (const c of chapters) for (const r of c.rulers) rulerChapter.set(r.id, c.number)

const selected: Selected[] = []
const perRuler: Record<string, number> = {}
for (const c of chapters) {
  for (const r of c.rulers) {
    const cands: Selected[] = []
    for (const t of raw) {
      const portrait = short(t.portrait[0] ?? t.authority[0] ?? '')
      const authority = short(t.authority[0] ?? '')
      if (portrait !== r.id) continue
      const authorityChapter = rulerChapter.get(authority)
      if (authorityChapter !== undefined && authorityChapter !== c.number) continue
      if (!t.obvLegend.length || !t.obvDescription.length || !t.revDescription.length) continue
      if (t.startDate === undefined || t.endDate === undefined || !t.mint.length) continue
      if (labels[t.mint[0]]?.lat === undefined) continue
      const { denom, mat } = normalise(t)
      if (!knownDenominations.has(denom) || !mat) continue
      cands.push(toCoin(t, c.number, denom, mat))
    }
    const chosen = diversify(cands, CAP_PER_RULER)
    perRuler[r.id] = chosen.length
    selected.push(...chosen)
  }
}

console.log('per ruler:', perRuler)
console.log('unknown denominations:', [...unknownDenominations.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25))
console.log('unknown materials:', [...unknownMaterials.entries()])
console.log(`selected ${selected.length} types`)

const entity = (id: string) => {
  const l = labels[NM + id] ?? {}
  return { id, en: l.en ?? id, de: l.de ?? l.en ?? id, lat: l.lat, long: l.long }
}
const collect = (key: 'authority' | 'portrait' | 'denomination' | 'mint') => {
  const out: Record<string, ReturnType<typeof entity>> = {}
  for (const c of selected) out[c[key]] = entity(c[key])
  return out
}
const authorities = { ...collect('authority'), ...collect('portrait') }
const mints = collect('mint')
for (const m of Object.values(mints)) if (m.lat === undefined) console.warn('mint without coordinates:', m.id)
const denominationEntities: Record<string, ReturnType<typeof entity>> = {}
for (const d of denominations) denominationEntities[d.id] = { id: d.id, en: d.name.en, de: d.name.de }

const portraitCoin: Record<string, string> = {}
for (const r of chapters.flatMap((c) => c.rulers)) {
  const own = selected.filter((c) => c.portrait === r.id)
  const order = ['av', 'ar', 'billon', 'ae']
  own.sort((a, b) => order.indexOf(a.material) - order.indexOf(b.material))
  if (own[0]) portraitCoin[r.id] = own[0].id
}

mkdirSync('public/coins', { recursive: true })

async function fetchImage(url: string, attempt = 0): Promise<Buffer> {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${res.status} ${url}`)
    return Buffer.from(await res.arrayBuffer())
  } catch (err) {
    if (attempt >= 3) throw err
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)))
    return fetchImage(url, attempt + 1)
  }
}

async function saveImage(url: string, file: string) {
  if (existsSync(file)) return
  const buf = await fetchImage(url)
  await sharp(buf).resize(IMAGE_SIZE, IMAGE_SIZE, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(file)
}

const jobs = selected.flatMap((c) => [
  { url: c.obvUrl, file: `public/coins/${c.id}.obv.webp` },
  { url: c.revUrl, file: `public/coins/${c.id}.rev.webp` },
])
let done = 0
const failed = new Set<string>()
async function worker() {
  while (jobs.length) {
    const job = jobs.shift()!
    try {
      await saveImage(job.url, job.file)
    } catch (err) {
      console.warn('image failed', job.url, String(err))
      failed.add(job.file.replace(/\.(obv|rev)\.webp$/, '').replace('public/coins/', ''))
    }
    done++
    if (done % 100 === 0) console.log(`images ${done}`)
  }
}
await Promise.all(Array.from({ length: 6 }, worker))

const coins = selected
  .filter((c) => !failed.has(c.id))
  .map(({ obvUrl, revUrl, ...c }) => c)

const dataset = { coins, authorities, denominations: denominationEntities, mints, portraitCoin }
writeFileSync('src/data/coins.json', JSON.stringify(dataset))
console.log(`wrote ${coins.length} coins, ${Object.keys(authorities).length} authorities, ${Object.keys(mints).length} mints`)
