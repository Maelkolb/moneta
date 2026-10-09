import villageText from './village.map.txt?raw'
import type { ImageKey } from './assets'
import { mulberry32 } from '../game/questions'

export const TILE = 32
export const COLS = 29
export const ROWS = 20
export const STAGE_W = 928
export const STAGE_H = 640

export type TileCode = 'B' | 'T' | 'G' | 'E' | 'P' | 'S' | 'W' | 'X'

export const tileImage: Record<TileCode, ImageKey> = {
  B: 'border',
  T: 'ground',
  G: 'grass',
  E: 'earth',
  P: 'path',
  S: 'straw',
  W: 'water',
  X: 'path',
}

export const walkable: Record<TileCode, boolean> = { B: false, T: false, G: true, E: true, P: true, S: true, W: false, X: true }
export const diggable: Record<TileCode, boolean> = { B: false, T: false, G: true, E: true, P: false, S: false, W: false, X: false }

export type SceneObject = { img: ImageKey; x: number; y: number; w: number; h: number; blocks?: { x: number; y: number }[] }

export type Site = {
  chapter: number
  grid: TileCode[][]
  objects: SceneObject[]
  gwen: { x: number; y: number }
  start: { x: number; y: number }
  exits: { x: number; y: number }[]
  hiddenCoins: number
}

function parse(text: string): TileCode[][] {
  return text
    .trim()
    .split('\n')
    .map((line) => line.trim().split(/\s+/).map((c) => (c as TileCode) ?? 'B'))
}

function blank(fill: TileCode): TileCode[][] {
  return Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => (x === 0 || y === 0 || x === COLS - 1 || y === ROWS - 1 ? 'B' : fill)),
  )
}

function rect(grid: TileCode[][], x0: number, y0: number, x1: number, y1: number, code: TileCode) {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (grid[y]?.[x] !== undefined) grid[y][x] = code
}

function scatter(grid: TileCode[][], code: TileCode, count: number, seed: number, allowed: TileCode[]) {
  const rng = mulberry32(seed)
  let placed = 0
  let guard = 0
  while (placed < count && guard++ < 2000) {
    const x = 1 + Math.floor(rng() * (COLS - 2))
    const y = 1 + Math.floor(rng() * (ROWS - 2))
    if (allowed.includes(grid[y][x])) {
      grid[y][x] = code
      placed++
    }
  }
}

function trees(grid: TileCode[][], count: number, seed: number, avoid: { x: number; y: number }[]): SceneObject[] {
  const rng = mulberry32(seed)
  const out: SceneObject[] = []
  let guard = 0
  while (out.length < count && guard++ < 3000) {
    const x = 1 + Math.floor(rng() * (COLS - 3))
    const y = 1 + Math.floor(rng() * (ROWS - 3))
    if (grid[y][x] !== 'G' && grid[y][x] !== 'T') continue
    if (avoid.some((a) => Math.abs(a.x - x) < 3 && Math.abs(a.y - y) < 3)) continue
    if (out.some((o) => Math.abs(o.x / TILE - x) < 2 && Math.abs(o.y / TILE - y) < 2)) continue
    out.push({ img: 'tree', x: x * TILE - 16, y: y * TILE - 24, w: 64, h: 62, blocks: [{ x, y }, { x: x + 1, y }] })
  }
  return out
}

function tent(img: ImageKey, cx: number, cy: number): SceneObject {
  return {
    img,
    x: cx * TILE - 32,
    y: cy * TILE - 64,
    w: 128,
    h: 128,
    blocks: [
      { x: cx, y: cy },
      { x: cx + 1, y: cy },
      { x: cx, y: cy - 1 },
      { x: cx + 1, y: cy - 1 },
    ],
  }
}

function village(): Site {
  const grid = parse(villageText)
  grid[0][1] = 'X'
  grid[7][0] = 'X'
  grid[2][0] = 'B'
  return {
    chapter: 1,
    grid,
    objects: [
      { img: 'statue', x: 460, y: 240, w: 63, h: 112, blocks: [{ x: 14, y: 9 }, { x: 15, y: 9 }, { x: 14, y: 10 }, { x: 15, y: 10 }] },
      { img: 'tent1', x: 570, y: 80, w: 128, h: 128, blocks: [{ x: 18, y: 5 }, { x: 19, y: 5 }, { x: 20, y: 5 }, { x: 19, y: 4 }] },
      { img: 'tent2', x: 200, y: 420, w: 128, h: 128, blocks: [{ x: 7, y: 15 }, { x: 8, y: 15 }, { x: 9, y: 15 }, { x: 8, y: 16 }] },
      { img: 'tent3', x: 570, y: 340, w: 128, h: 128, blocks: [{ x: 18, y: 13 }, { x: 19, y: 13 }, { x: 20, y: 13 }, { x: 19, y: 12 }] },
      { img: 'tent4', x: 230, y: 80, w: 128, h: 128, blocks: [{ x: 8, y: 5 }, { x: 9, y: 5 }, { x: 10, y: 5 }, { x: 9, y: 4 }] },
      { img: 'tree', x: 40, y: 480, w: 64, h: 62 },
      { img: 'tree', x: 820, y: 60, w: 64, h: 62 },
      { img: 'tree', x: 840, y: 500, w: 64, h: 62 },
      { img: 'tree', x: 60, y: 300, w: 64, h: 62 },
    ],
    gwen: { x: 16, y: 11 },
    start: { x: 1, y: 1 },
    exits: [
      { x: 1, y: 0 },
      { x: 0, y: 7 },
    ],
    hiddenCoins: 4,
  }
}

function camp(): Site {
  const grid = blank('G')
  rect(grid, 1, 9, 27, 10, 'P')
  rect(grid, 14, 1, 15, 18, 'P')
  rect(grid, 4, 3, 11, 6, 'E')
  rect(grid, 18, 13, 25, 16, 'E')
  rect(grid, 5, 12, 10, 15, 'S')
  rect(grid, 18, 3, 24, 6, 'S')
  grid[10][0] = 'X'
  const objects = [tent('tent1', 6, 13), tent('tent2', 9, 15), tent('tent3', 20, 4), tent('tent4', 23, 6)]
  return { chapter: 2, grid, objects: [...objects, ...trees(grid, 6, 21, [{ x: 14, y: 10 }])], gwen: { x: 16, y: 8 }, start: { x: 1, y: 10 }, exits: [{ x: 0, y: 10 }], hiddenCoins: 4 }
}

function river(): Site {
  const grid = blank('G')
  rect(grid, 1, 8, 27, 10, 'W')
  rect(grid, 13, 7, 14, 11, 'P')
  rect(grid, 1, 3, 27, 3, 'P')
  rect(grid, 1, 16, 27, 16, 'P')
  rect(grid, 13, 1, 14, 18, 'P')
  rect(grid, 3, 12, 9, 14, 'E')
  rect(grid, 18, 4, 25, 6, 'E')
  grid[3][0] = 'X'
  const objects = [tent('tent2', 20, 14), tent('tent4', 5, 6), { img: 'statue' as ImageKey, x: 740, y: 400, w: 63, h: 112, blocks: [{ x: 23, y: 14 }, { x: 24, y: 14 }, { x: 23, y: 15 }, { x: 24, y: 15 }] }]
  return { chapter: 3, grid, objects: [...objects, ...trees(grid, 7, 33, [{ x: 13, y: 9 }])], gwen: { x: 15, y: 13 }, start: { x: 1, y: 3 }, exits: [{ x: 0, y: 3 }], hiddenCoins: 5 }
}

function desert(): Site {
  const grid = blank('E')
  rect(grid, 1, 10, 27, 10, 'P')
  rect(grid, 10, 3, 18, 6, 'T')
  rect(grid, 11, 4, 17, 5, 'P')
  rect(grid, 4, 13, 8, 16, 'G')
  rect(grid, 20, 13, 24, 16, 'G')
  scatter(grid, 'B', 10, 44, ['E'])
  grid[10][0] = 'X'
  const objects = [tent('tent3', 6, 15), tent('tent1', 22, 15), { img: 'statue' as ImageKey, x: 440, y: 150, w: 63, h: 112, blocks: [{ x: 13, y: 6 }, { x: 14, y: 6 }, { x: 14, y: 7 }, { x: 13, y: 7 }] }]
  return { chapter: 4, grid, objects, gwen: { x: 15, y: 8 }, start: { x: 1, y: 10 }, exits: [{ x: 0, y: 10 }], hiddenCoins: 5 }
}

function forest(): Site {
  const grid = blank('G')
  rect(grid, 1, 10, 27, 10, 'P')
  rect(grid, 12, 1, 12, 18, 'P')
  rect(grid, 15, 6, 22, 8, 'E')
  rect(grid, 4, 13, 9, 16, 'E')
  grid[10][0] = 'X'
  const objects = [tent('tent4', 7, 15), tent('tent2', 19, 15)]
  return { chapter: 5, grid, objects: [...objects, ...trees(grid, 26, 55, [{ x: 12, y: 10 }, { x: 14, y: 11 }])], gwen: { x: 14, y: 11 }, start: { x: 1, y: 10 }, exits: [{ x: 0, y: 10 }], hiddenCoins: 5 }
}

function city(): Site {
  const grid = blank('P')
  rect(grid, 3, 3, 25, 16, 'T')
  rect(grid, 4, 4, 24, 15, 'P')
  rect(grid, 6, 6, 11, 9, 'G')
  rect(grid, 17, 6, 22, 9, 'G')
  rect(grid, 6, 12, 11, 14, 'E')
  rect(grid, 17, 12, 22, 14, 'E')
  rect(grid, 1, 10, 3, 10, 'P')
  rect(grid, 13, 3, 15, 3, 'P')
  rect(grid, 12, 6, 16, 14, 'S')
  scatter(grid, 'B', 14, 66, ['P'])
  grid[10][0] = 'X'
  const objects = [{ img: 'statue' as ImageKey, x: 430, y: 290, w: 63, h: 112, blocks: [{ x: 13, y: 10 }, { x: 14, y: 10 }, { x: 13, y: 11 }, { x: 14, y: 11 }] }, tent('tent1', 8, 4), tent('tent3', 20, 4)]
  return { chapter: 6, grid, objects, gwen: { x: 16, y: 9 }, start: { x: 1, y: 10 }, exits: [{ x: 0, y: 10 }], hiddenCoins: 5 }
}

function coast(): Site {
  const grid = blank('G')
  rect(grid, 1, 1, 27, 4, 'W')
  rect(grid, 1, 5, 27, 6, 'E')
  rect(grid, 20, 7, 27, 18, 'W')
  rect(grid, 18, 7, 19, 18, 'E')
  rect(grid, 1, 11, 17, 11, 'P')
  rect(grid, 9, 7, 9, 18, 'P')
  rect(grid, 3, 13, 7, 16, 'E')
  grid[11][0] = 'X'
  const objects = [{ img: 'statue' as ImageKey, x: 380, y: 240, w: 63, h: 112, blocks: [{ x: 12, y: 9 }, { x: 13, y: 9 }, { x: 12, y: 10 }, { x: 13, y: 10 }] }, tent('tent2', 5, 17), tent('tent4', 14, 16)]
  return { chapter: 7, grid, objects: [...objects, ...trees(grid, 5, 77, [{ x: 9, y: 11 }])], gwen: { x: 11, y: 13 }, start: { x: 1, y: 11 }, exits: [{ x: 0, y: 11 }], hiddenCoins: 6 }
}

const builders: Record<number, () => Site> = { 1: village, 2: camp, 3: river, 4: desert, 5: forest, 6: city, 7: coast }

export function buildSite(chapter: number): Site {
  const site = builders[chapter]()
  for (const o of site.objects) for (const b of o.blocks ?? []) if (site.grid[b.y]?.[b.x] && site.grid[b.y][b.x] !== 'X') site.grid[b.y][b.x] = site.grid[b.y][b.x] === 'G' || site.grid[b.y][b.x] === 'E' ? 'T' : site.grid[b.y][b.x]
  site.grid[site.gwen.y][site.gwen.x] = 'T'
  if (site.grid[site.start.y][site.start.x] === 'T' || site.grid[site.start.y][site.start.x] === 'B') site.grid[site.start.y][site.start.x] = 'P'
  return site
}

export function isWalkable(site: Site, x: number, y: number): boolean {
  const code = site.grid[y]?.[x]
  if (!code) return false
  return walkable[code]
}

export function placeCoins(site: Site, seed: number): { x: number; y: number }[] {
  const rng = mulberry32(seed)
  const cells: { x: number; y: number }[] = []
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (diggable[site.grid[y][x]]) cells.push({ x, y })
  const out: { x: number; y: number }[] = []
  let guard = 0
  while (out.length < site.hiddenCoins && cells.length && guard++ < 500) {
    const c = cells[Math.floor(rng() * cells.length)]
    if (Math.abs(c.x - site.start.x) + Math.abs(c.y - site.start.y) < 4) continue
    if (out.some((o) => Math.abs(o.x - c.x) + Math.abs(o.y - c.y) < 3)) continue
    out.push(c)
  }
  return out
}
