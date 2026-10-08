import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { sparql, chunks } from './sparql.ts'

const RAW = 'data/raw'
mkdirSync(RAW, { recursive: true })

type Specimen = { coin: string; obv: string; rev: string; weight?: number; diameter?: number }
type TypeRecord = {
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

async function fetchSpecimens(): Promise<Map<string, Specimen[]>> {
  const byType = new Map<string, Specimen[]>()
  const page = 5000
  for (let offset = 0; ; offset += page) {
    const rows = await sparql(`
      SELECT ?type ?coin ?obv ?rev ?w ?d WHERE {
        ?coin nmo:hasCollection nm:ans ; nmo:hasTypeSeriesItem ?type ; nmo:hasObverse ?o ; nmo:hasReverse ?r .
        ?o foaf:depiction ?obv . ?r foaf:depiction ?rev .
        OPTIONAL { ?coin nmo:hasWeight ?w } OPTIONAL { ?coin nmo:hasDiameter ?d }
        FILTER(STRSTARTS(STR(?type), "http://numismatics.org/ocre/id/"))
      } ORDER BY ?type ?coin LIMIT ${page} OFFSET ${offset}`)
    console.log(`specimens offset ${offset}: ${rows.length} rows`)
    for (const r of rows) {
      const list = byType.get(r.type) ?? []
      if (!list.some((s) => s.coin === r.coin)) {
        list.push({
          coin: r.coin,
          obv: r.obv,
          rev: r.rev,
          weight: r.w ? Number(r.w) : undefined,
          diameter: r.d ? Number(r.d) : undefined,
        })
      }
      byType.set(r.type, list)
    }
    if (rows.length < page) break
  }
  return byType
}

function push(target: string[], value?: string) {
  if (value && !target.includes(value)) target.push(value)
}

async function fetchTypes(ids: string[]): Promise<Map<string, TypeRecord>> {
  const types = new Map<string, TypeRecord>()
  const batches = chunks(ids, 55)
  let i = 0
  for (const batch of batches) {
    i++
    const values = batch.map((id) => `<${id}>`).join(' ')
    const rows = await sparql(`
      SELECT ?type ?label ?auth ?portrait ?denom ?mat ?mint ?start ?end ?obvLeg ?obvDesc ?revLeg ?revDesc WHERE {
        VALUES ?type { ${values} }
        ?type skos:prefLabel ?label .
        OPTIONAL { ?type nmo:hasAuthority ?auth }
        OPTIONAL { ?type nmo:hasDenomination ?denom }
        OPTIONAL { ?type nmo:hasMaterial ?mat }
        OPTIONAL { ?type nmo:hasMint ?mint }
        OPTIONAL { ?type nmo:hasStartDate ?start }
        OPTIONAL { ?type nmo:hasEndDate ?end }
        OPTIONAL { ?type nmo:hasObverse ?ob . OPTIONAL { ?ob nmo:hasLegend ?obvLeg } OPTIONAL { ?ob dcterms:description ?obvDesc } OPTIONAL { ?ob nmo:hasPortrait ?portrait } }
        OPTIONAL { ?type nmo:hasReverse ?rv . OPTIONAL { ?rv nmo:hasLegend ?revLeg } OPTIONAL { ?rv dcterms:description ?revDesc } }
      }`)
    console.log(`types batch ${i}/${batches.length}: ${rows.length} rows`)
    for (const r of rows) {
      const t = types.get(r.type) ?? {
        id: r.type,
        label: r.label,
        authority: [],
        portrait: [],
        denomination: [],
        material: [],
        mint: [],
        obvLegend: [],
        obvDescription: [],
        revLegend: [],
        revDescription: [],
        specimens: [],
      }
      push(t.authority, r.auth)
      push(t.portrait, r.portrait)
      push(t.denomination, r.denom)
      push(t.material, r.mat)
      push(t.mint, r.mint)
      if (r.start) t.startDate = Number(r.start)
      if (r.end) t.endDate = Number(r.end)
      push(t.obvLegend, r.obvLeg)
      push(t.obvDescription, r.obvDesc)
      push(t.revLegend, r.revLeg)
      push(t.revDescription, r.revDesc)
      types.set(r.type, t)
    }
  }
  return types
}

async function fetchLabels(ids: string[]) {
  const labels: Record<string, { en?: string; de?: string; lat?: number; long?: number; kinds: string[] }> = {}
  const batches = chunks(ids, 55)
  for (const batch of batches) {
    const values = batch.map((id) => `<${id}>`).join(' ')
    const rows = await sparql(`
      SELECT ?id ?label ?lat ?long ?kind WHERE {
        VALUES ?id { ${values} }
        ?id a ?kind .
        OPTIONAL { ?id skos:prefLabel ?label }
        OPTIONAL { ?id geo:location ?loc . ?loc geo:lat ?lat ; geo:long ?long }
      }`)
    const raw = await rawLabels(batch)
    for (const r of rows) {
      const l = labels[r.id] ?? { kinds: [] }
      if (r.kind && !l.kinds.includes(r.kind)) l.kinds.push(r.kind)
      if (r.lat) { l.lat = Number(r.lat); l.long = Number(r.long) }
      labels[r.id] = l
    }
    for (const [id, langs] of Object.entries(raw)) {
      labels[id] = { ...(labels[id] ?? { kinds: [] }), ...langs }
    }
    console.log(`labels: ${Object.keys(labels).length}`)
  }
  return labels
}

async function rawLabels(ids: string[]) {
  const values = ids.map((id) => `<${id}>`).join(' ')
  const rows = await sparql(`
    SELECT ?id ?en ?de WHERE {
      VALUES ?id { ${values} }
      OPTIONAL { ?id skos:prefLabel ?en FILTER(lang(?en) = "en") }
      OPTIONAL { ?id skos:prefLabel ?de FILTER(lang(?de) = "de") }
    }`)
  const out: Record<string, { en?: string; de?: string }> = {}
  for (const r of rows) out[r.id] = { en: r.en, de: r.de }
  return out
}

const specimenCache = `${RAW}/specimens.json`
let specimens: Map<string, Specimen[]>
if (existsSync(specimenCache)) {
  specimens = new Map(Object.entries(JSON.parse(readFileSync(specimenCache, 'utf8'))))
} else {
  specimens = await fetchSpecimens()
  writeFileSync(specimenCache, JSON.stringify(Object.fromEntries(specimens)))
}
console.log(`types with ANS specimens: ${specimens.size}`)
const types = await fetchTypes([...specimens.keys()])
for (const [id, list] of specimens) {
  const t = types.get(id)
  if (t) t.specimens = list
}
const all = [...types.values()]
writeFileSync(`${RAW}/types.json`, JSON.stringify(all))
console.log(`wrote ${all.length} types`)

const ids = new Set<string>()
for (const t of all) for (const k of ['authority', 'portrait', 'denomination', 'material', 'mint'] as const) for (const v of t[k]) ids.add(v)
const labels = await fetchLabels([...ids])
writeFileSync(`${RAW}/labels.json`, JSON.stringify(labels, null, 1))
console.log(`wrote ${Object.keys(labels).length} labels`)
