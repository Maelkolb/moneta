export const ENDPOINT = 'https://nomisma.org/query'

export const PREFIXES = `
PREFIX nmo: <http://nomisma.org/ontology#>
PREFIX nm: <http://nomisma.org/id/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
`

type Binding = Record<string, { type: string; value: string; 'xml:lang'?: string }>

export async function sparql(query: string, attempt = 0): Promise<Record<string, string>[]> {
  try {
    const url = `${ENDPOINT}?query=${encodeURIComponent(PREFIXES + query)}`
    const res = await fetch(url, { headers: { Accept: 'application/sparql-results+json' } })
    if (res.status >= 400 && res.status < 500) throw new Error(`SPARQL ${res.status} (query ${url.length} chars)`)
    if (!res.ok) throw new Error(`SPARQL ${res.status}: ${await res.text()}`)
    const json = (await res.json()) as { results: { bindings: Binding[] } }
    return json.results.bindings.map((b) => {
      const row: Record<string, string> = {}
      for (const [k, v] of Object.entries(b)) row[k] = v.value
      return row
    })
  } catch (err) {
    if (attempt >= 4 || String(err).includes('SPARQL 4')) throw err
    await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)))
    return sparql(query, attempt + 1)
  }
}

export function chunks<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}
