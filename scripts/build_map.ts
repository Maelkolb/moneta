import { readFileSync, writeFileSync } from 'node:fs'
import { feature } from 'topojson-client'

const topo = JSON.parse(readFileSync('node_modules/world-atlas/land-50m.json', 'utf8'))
const land = feature(topo, topo.objects.land) as unknown as { features: { geometry: { type: string; coordinates: number[][][][] | number[][][] } }[] }

export const BOUNDS = { west: -12, east: 48, north: 58, south: 22 }
const W = 1200
const H = Math.round((W * (BOUNDS.north - BOUNDS.south)) / (BOUNDS.east - BOUNDS.west) / Math.cos((40 * Math.PI) / 180))

function project([lon, lat]: number[]) {
  const x = ((lon - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * W
  const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * H
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10]
}

function inside([lon, lat]: number[]) {
  return lon > BOUNDS.west - 5 && lon < BOUNDS.east + 5 && lat > BOUNDS.south - 5 && lat < BOUNDS.north + 5
}

function simplify(pts: number[][], tol: number): number[][] {
  if (pts.length < 3) return pts
  const [a, b] = [pts[0], pts[pts.length - 1]]
  let maxD = 0
  let idx = 0
  for (let i = 1; i < pts.length - 1; i++) {
    const d = pointLineDistance(pts[i], a, b)
    if (d > maxD) { maxD = d; idx = i }
  }
  if (maxD <= tol) return [a, b]
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)]
}

function pointLineDistance(p: number[], a: number[], b: number[]) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len2 = dx * dx + dy * dy
  if (len2 === 0) return Math.hypot(p[0] - a[0], p[1] - a[1])
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2))
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy))
}

const paths: string[] = []
for (const f of land.features) {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates as number[][][]] : (f.geometry.coordinates as number[][][][])
  for (const poly of polys) {
    for (const ring of poly) {
      if (!ring.some(inside)) continue
      const pts = simplify(ring.map(project), 1.2).map((p) => [Math.round(p[0]), Math.round(p[1])])
      if (pts.length < 4) continue
      paths.push('M' + pts.map((p) => p.join(',')).join('L') + 'Z')
    }
  }
}

writeFileSync('src/data/map.json', JSON.stringify({ width: W, height: H, bounds: BOUNDS, land: paths.join('') }))
console.log(`map ${W}x${H}, ${paths.length} rings, ${paths.join('').length} chars`)
