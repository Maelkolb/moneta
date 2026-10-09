import villageText from './village.map.txt?raw'
import type { ImageKey } from './assets'
import type { NpcSpec } from './npcs'
import type { Prop } from './props'
import { mulberry32 } from '../game/questions'

export const TILE = 32
export const COLS = 29
export const ROWS = 20
export const STAGE_W = 928
export const STAGE_H = 640

export type TileCode = 'B' | 'T' | 'G' | 'E' | 'P' | 'S' | 'W' | 'X' | 'H' | 'D' | 'F'

export const tileImage: Record<TileCode, ImageKey> = {
  B: 'border',
  T: 'ground',
  G: 'grass',
  E: 'earth',
  P: 'path',
  S: 'straw',
  W: 'water',
  X: 'path',
  H: 'ground',
  D: 'straw',
  F: 'tentFloor',
}

export const walkable: Record<TileCode, boolean> = { B: false, T: false, G: true, E: true, P: true, S: true, W: false, X: true, H: true, D: true, F: true }
export const diggable: Record<TileCode, boolean> = { B: false, T: false, G: true, E: true, P: false, S: false, W: false, X: false, H: false, D: false, F: false }

export type SceneObject = { img: ImageKey; x: number; y: number; w: number; h: number; blocks?: { x: number; y: number }[]; door?: string }

export type Site = {
  id: string
  chapter: number
  cols: number
  rows: number
  ox: number
  oy: number
  grid: TileCode[][]
  objects: SceneObject[]
  npcs: NpcSpec[]
  props: Prop[]
  start: { x: number; y: number }
  exits: { x: number; y: number }[]
  doors: Record<string, string>
  hiddenCoins: number
  interior?: boolean
}

function parse(text: string): TileCode[][] {
  return text
    .trim()
    .split('\n')
    .map((line) => line.trim().split(/\s+/).map((c) => (c as TileCode) ?? 'B'))
}

function blank(fill: TileCode, cols = COLS, rows = ROWS): TileCode[][] {
  return Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => (x === 0 || y === 0 || x === cols - 1 || y === rows - 1 ? 'B' : fill)),
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

function tent(img: ImageKey, cx: number, cy: number, door?: string): SceneObject {
  return {
    img,
    x: cx * TILE - 32,
    y: cy * TILE - 64,
    w: 128,
    h: 128,
    door,
    blocks: [
      { x: cx, y: cy },
      { x: cx + 1, y: cy },
      { x: cx, y: cy - 1 },
      { x: cx + 1, y: cy - 1 },
    ],
  }
}

function tentAt(img: ImageKey, px: number, py: number, door?: string): SceneObject {
  const cx = Math.floor((px + 40) / TILE)
  const cy = Math.floor((py + 100) / TILE)
  return {
    img,
    x: px,
    y: py,
    w: 128,
    h: 128,
    door,
    blocks: [
      { x: cx, y: cy },
      { x: cx + 1, y: cy },
      { x: cx + 2, y: cy },
      { x: cx + 1, y: cy - 1 },
    ],
  }
}

export function doorCell(o: SceneObject): { x: number; y: number } {
  return { x: Math.floor((o.x + 64) / TILE), y: Math.floor((o.y + 104) / TILE) }
}

const base = (chapter: number, id: string, grid: TileCode[][], rest: Partial<Site>): Site => ({
  id,
  chapter,
  cols: grid[0].length,
  rows: grid.length,
  ox: 0,
  oy: 0,
  grid,
  objects: [],
  npcs: [],
  props: [],
  start: { x: 1, y: 1 },
  exits: [],
  doors: {},
  hiddenCoins: 4,
  ...rest,
})

const gwen = (x: number, y: number): NpcSpec => ({ id: 'gwen', name: { en: 'Gwen', de: 'Gwen' }, sprite: 'gwen', x, y })

function village(): Site {
  const grid = parse(villageText)
  grid[0][1] = 'X'
  grid[7][0] = 'X'
  grid[2][0] = 'B'
  return base(1, 'village', grid, {
    objects: [
      { img: 'statue', x: 460, y: 240, w: 63, h: 112, blocks: [{ x: 14, y: 9 }, { x: 15, y: 9 }, { x: 14, y: 10 }, { x: 15, y: 10 }] },
      tentAt('tent1', 570, 80, 'smith'),
      tentAt('tent2', 200, 420, 'trader'),
      tentAt('tent3', 570, 340, 'seer'),
      tentAt('tent4', 230, 80, 'elder'),
      { img: 'tree', x: 40, y: 480, w: 64, h: 62 },
      { img: 'tree', x: 820, y: 60, w: 64, h: 62 },
      { img: 'tree', x: 840, y: 500, w: 64, h: 62 },
      { img: 'tree', x: 60, y: 300, w: 64, h: 62 },
    ],
    npcs: [
      gwen(16, 11),
      { id: 'child', name: { en: 'Lio', de: 'Lio' }, sprite: 'child', x: 12, y: 15, wander: true },
      { id: 'farmer', name: { en: 'Hanna', de: 'Hanna' }, sprite: 'farmer', x: 22, y: 8, wander: true },
      { id: 'warrior', name: { en: 'Cato', de: 'Cato' }, sprite: 'warrior', x: 2, y: 6 },
    ],
    props: [{ kind: 'well', x: 11, y: 4 }],
    start: { x: 1, y: 1 },
    exits: [
      { x: 1, y: 0 },
      { x: 0, y: 7 },
    ],
    hiddenCoins: 4,
  })
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
  const objects = [tent('tent1', 6, 13, 'camp_veteran'), tent('tent2', 9, 15), tent('tent3', 20, 4, 'camp_clerk'), tent('tent4', 23, 6)]
  return base(2, 'camp', grid, {
    objects: [...objects, ...trees(grid, 6, 21, [{ x: 14, y: 10 }])],
    npcs: [gwen(16, 8), { id: 'camp_guard', name: { en: 'Sentry', de: 'Posten' }, sprite: 'legion', x: 13, y: 12, wander: true }],
    props: [
      { kind: 'cart', x: 20, y: 10 },
      { kind: 'barrel', x: 12, y: 3 },
      { kind: 'barrel', x: 13, y: 3 },
    ],
    start: { x: 1, y: 10 },
    exits: [{ x: 0, y: 10 }],
    hiddenCoins: 4,
  })
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
  const objects = [tent('tent2', 20, 14, 'river_merchant'), tent('tent4', 5, 6, 'river_soldier'), { img: 'statue' as ImageKey, x: 740, y: 400, w: 63, h: 112, blocks: [{ x: 23, y: 14 }, { x: 24, y: 14 }, { x: 23, y: 15 }, { x: 24, y: 15 }] }]
  return base(3, 'river', grid, {
    objects: [...objects, ...trees(grid, 7, 33, [{ x: 13, y: 9 }])],
    npcs: [gwen(15, 13), { id: 'river_fisher', name: { en: 'Fisherman', de: 'Fischer' }, sprite: 'farmer', x: 8, y: 7 }],
    props: [{ kind: 'milestone', x: 12, y: 2 }, { kind: 'amphora', x: 22, y: 12 }],
    start: { x: 1, y: 3 },
    exits: [{ x: 0, y: 3 }],
    hiddenCoins: 5,
  })
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
  const objects = [tent('tent3', 6, 15, 'desert_priest'), tent('tent1', 22, 15, 'desert_trader'), { img: 'statue' as ImageKey, x: 440, y: 150, w: 63, h: 112, blocks: [{ x: 13, y: 6 }, { x: 14, y: 6 }, { x: 14, y: 7 }, { x: 13, y: 7 }] }]
  return base(4, 'desert', grid, {
    objects,
    npcs: [gwen(15, 8), { id: 'desert_camel', name: { en: 'Caravan guide', de: 'Karawanenführer' }, sprite: 'trader', x: 20, y: 11, wander: true }],
    props: [{ kind: 'amphora', x: 9, y: 11 }, { kind: 'sacks', x: 19, y: 11 }, { kind: 'well', x: 15, y: 12 }],
    start: { x: 1, y: 10 },
    exits: [{ x: 0, y: 10 }],
    hiddenCoins: 5,
  })
}

function forest(): Site {
  const grid = blank('G')
  rect(grid, 1, 10, 27, 10, 'P')
  rect(grid, 12, 1, 12, 18, 'P')
  rect(grid, 15, 6, 22, 8, 'E')
  rect(grid, 4, 13, 9, 16, 'E')
  grid[10][0] = 'X'
  const objects = [tent('tent4', 7, 15, 'forest_woman'), tent('tent2', 19, 15, 'forest_officer')]
  return base(5, 'forest', grid, {
    objects: [...objects, ...trees(grid, 26, 55, [{ x: 12, y: 10 }, { x: 14, y: 11 }])],
    npcs: [gwen(14, 11), { id: 'forest_scout', name: { en: 'Scout', de: 'Späher' }, sprite: 'warrior', x: 10, y: 4, wander: true }],
    props: [{ kind: 'fire', x: 13, y: 12 }],
    start: { x: 1, y: 10 },
    exits: [{ x: 0, y: 10 }],
    hiddenCoins: 5,
  })
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
  const objects = [{ img: 'statue' as ImageKey, x: 430, y: 290, w: 63, h: 112, blocks: [{ x: 13, y: 10 }, { x: 14, y: 10 }, { x: 13, y: 11 }, { x: 14, y: 11 }] }, tent('tent1', 8, 4, 'city_mintworker'), tent('tent3', 20, 4, 'city_official')]
  return base(6, 'city', grid, {
    objects,
    npcs: [gwen(16, 9), { id: 'city_citizen', name: { en: 'Citizen', de: 'Bürgerin' }, sprite: 'woman', x: 10, y: 11, wander: true }],
    props: [{ kind: 'well', x: 15, y: 12 }, { kind: 'milestone', x: 4, y: 11 }, { kind: 'cart', x: 18, y: 5 }],
    start: { x: 1, y: 10 },
    exits: [{ x: 0, y: 10 }],
    hiddenCoins: 5,
  })
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
  const objects = [{ img: 'statue' as ImageKey, x: 380, y: 240, w: 63, h: 112, blocks: [{ x: 12, y: 9 }, { x: 13, y: 9 }, { x: 12, y: 10 }, { x: 13, y: 10 }] }, tent('tent2', 5, 17, 'coast_monk'), tent('tent4', 14, 16, 'coast_sailor')]
  return base(7, 'coast', grid, {
    objects: [...objects, ...trees(grid, 5, 77, [{ x: 9, y: 11 }])],
    npcs: [gwen(11, 13), { id: 'coast_child', name: { en: 'Harbour boy', de: 'Hafenjunge' }, sprite: 'child', x: 16, y: 8, wander: true }],
    props: [{ kind: 'amphora', x: 17, y: 6 }, { kind: 'amphora', x: 18, y: 6 }, { kind: 'sacks', x: 16, y: 6 }],
    start: { x: 1, y: 11 },
    exits: [{ x: 0, y: 11 }],
    hiddenCoins: 6,
  })
}

const builders: Record<number, () => Site> = { 1: village, 2: camp, 3: river, 4: desert, 5: forest, 6: city, 7: coast }

export function buildSite(chapter: number): Site {
  const site = builders[chapter]()
  for (const o of site.objects) {
    for (const b of o.blocks ?? []) {
      const code = site.grid[b.y]?.[b.x]
      if (code && code !== 'X' && code !== 'B') site.grid[b.y][b.x] = 'T'
    }
    if (o.door) {
      const d = doorCell(o)
      site.grid[d.y][d.x] = 'H'
      site.doors[`${d.x},${d.y}`] = o.door
    }
  }
  for (const p of site.props) site.grid[p.y][p.x] = 'T'
  if (site.grid[site.start.y][site.start.x] === 'T' || site.grid[site.start.y][site.start.x] === 'B') site.grid[site.start.y][site.start.x] = 'P'
  return site
}

type Room = { npc: NpcSpec; props: Prop[]; straw?: boolean }

const rooms: Record<string, Room> = {
  elder: {
    npc: { id: 'elder', name: { en: 'Brennus', de: 'Brennus' }, sprite: 'elder', x: 4, y: 3 },
    props: [
      { kind: 'fire', x: 6, y: 4 },
      { kind: 'bed', x: 2, y: 1 },
      { kind: 'chest', x: 9, y: 1 },
      { kind: 'shield', x: 5, y: 1 },
      { kind: 'rug', x: 7, y: 5 },
    ],
  },
  smith: {
    npc: { id: 'smith', name: { en: 'Ada', de: 'Ada' }, sprite: 'smith', x: 7, y: 3 },
    props: [
      { kind: 'anvil', x: 5, y: 3 },
      { kind: 'fire', x: 3, y: 2 },
      { kind: 'table', x: 8, y: 1 },
      { kind: 'barrel', x: 2, y: 5 },
      { kind: 'barrel', x: 10, y: 5 },
      { kind: 'scale', x: 10, y: 1 },
    ],
  },
  trader: {
    npc: { id: 'trader', name: { en: 'Marcus', de: 'Marcus' }, sprite: 'trader', x: 6, y: 2 },
    props: [
      { kind: 'table', x: 5, y: 3 },
      { kind: 'chest', x: 2, y: 1 },
      { kind: 'chest', x: 3, y: 1 },
      { kind: 'sacks', x: 9, y: 1 },
      { kind: 'amphora', x: 10, y: 1 },
      { kind: 'amphora', x: 10, y: 2 },
      { kind: 'scale', x: 8, y: 5 },
    ],
  },
  seer: {
    npc: { id: 'seer', name: { en: 'Vara', de: 'Vara' }, sprite: 'seer', x: 6, y: 2 },
    props: [
      { kind: 'altar', x: 5, y: 1 },
      { kind: 'rug', x: 5, y: 3 },
      { kind: 'amphora', x: 2, y: 1 },
      { kind: 'amphora', x: 10, y: 1 },
      { kind: 'shelf', x: 1, y: 5 },
    ],
  },
  camp_veteran: { npc: { id: 'camp_veteran', name: { en: 'Veteran', de: 'Veteran' }, sprite: 'legion', x: 6, y: 2 }, props: [{ kind: 'bed', x: 2, y: 1 }, { kind: 'shield', x: 9, y: 1 }, { kind: 'chest', x: 10, y: 1 }, { kind: 'fire', x: 6, y: 4 }], straw: true },
  camp_clerk: { npc: { id: 'camp_clerk', name: { en: 'Clerk', de: 'Schreiber' }, sprite: 'monk', x: 6, y: 2 }, props: [{ kind: 'table', x: 5, y: 3 }, { kind: 'shelf', x: 8, y: 1 }, { kind: 'chest', x: 2, y: 1 }, { kind: 'scale', x: 2, y: 5 }], straw: true },
  river_merchant: { npc: { id: 'river_merchant', name: { en: 'Merchant', de: 'Händler' }, sprite: 'trader', x: 6, y: 2 }, props: [{ kind: 'table', x: 5, y: 3 }, { kind: 'sacks', x: 2, y: 1 }, { kind: 'amphora', x: 9, y: 1 }, { kind: 'amphora', x: 10, y: 1 }, { kind: 'chest', x: 10, y: 5 }] },
  river_soldier: { npc: { id: 'river_soldier', name: { en: 'Soldier', de: 'Soldat' }, sprite: 'legion', x: 6, y: 2 }, props: [{ kind: 'bed', x: 2, y: 1 }, { kind: 'shield', x: 9, y: 1 }, { kind: 'fire', x: 6, y: 4 }], straw: true },
  desert_priest: { npc: { id: 'desert_priest', name: { en: 'Priest', de: 'Priester' }, sprite: 'monk', x: 6, y: 2 }, props: [{ kind: 'altar', x: 5, y: 1 }, { kind: 'rug', x: 5, y: 3 }, { kind: 'amphora', x: 2, y: 1 }] },
  desert_trader: { npc: { id: 'desert_trader', name: { en: 'Trader', de: 'Händlerin' }, sprite: 'woman', x: 6, y: 2 }, props: [{ kind: 'table', x: 5, y: 3 }, { kind: 'sacks', x: 2, y: 1 }, { kind: 'sacks', x: 3, y: 1 }, { kind: 'scale', x: 9, y: 1 }] },
  forest_woman: { npc: { id: 'forest_woman', name: { en: 'Widow', de: 'Witwe' }, sprite: 'woman', x: 6, y: 2 }, props: [{ kind: 'fire', x: 6, y: 4 }, { kind: 'bed', x: 2, y: 1 }, { kind: 'amphora', x: 10, y: 1 }] },
  forest_officer: { npc: { id: 'forest_officer', name: { en: 'Officer', de: 'Offizier' }, sprite: 'legion', x: 6, y: 2 }, props: [{ kind: 'table', x: 5, y: 3 }, { kind: 'shield', x: 2, y: 1 }, { kind: 'shield', x: 10, y: 1 }, { kind: 'chest', x: 9, y: 5 }], straw: true },
  city_mintworker: { npc: { id: 'city_mintworker', name: { en: 'Mint worker', de: 'Münzarbeiter' }, sprite: 'smith', x: 6, y: 2 }, props: [{ kind: 'anvil', x: 4, y: 3 }, { kind: 'fire', x: 8, y: 3 }, { kind: 'scale', x: 2, y: 1 }, { kind: 'chest', x: 10, y: 1 }] },
  city_official: { npc: { id: 'city_official', name: { en: 'Official', de: 'Beamter' }, sprite: 'monk', x: 6, y: 2 }, props: [{ kind: 'table', x: 5, y: 3 }, { kind: 'shelf', x: 8, y: 1 }, { kind: 'rug', x: 2, y: 4 }] },
  coast_monk: { npc: { id: 'coast_monk', name: { en: 'Monk', de: 'Mönch' }, sprite: 'monk', x: 6, y: 2 }, props: [{ kind: 'altar', x: 5, y: 1 }, { kind: 'shelf', x: 1, y: 4 }, { kind: 'bed', x: 9, y: 5 }] },
  coast_sailor: { npc: { id: 'coast_sailor', name: { en: 'Sailor', de: 'Seemann' }, sprite: 'warrior', x: 6, y: 2 }, props: [{ kind: 'barrel', x: 2, y: 1 }, { kind: 'barrel', x: 3, y: 1 }, { kind: 'sacks', x: 10, y: 1 }, { kind: 'table', x: 5, y: 4 }] },
}

export function buildInterior(id: string, chapter: number): Site {
  const room = rooms[id]
  const cols = 12
  const rows = 8
  const grid = blank(room.straw ? 'S' : 'F', cols, rows)
  grid[rows - 1][6] = 'D'
  const site = base(chapter, id, grid, {
    cols,
    rows,
    ox: (STAGE_W - cols * TILE) / 2,
    oy: (STAGE_H - rows * TILE) / 2 - 20,
    npcs: [room.npc],
    props: room.props,
    start: { x: 6, y: rows - 2 },
    hiddenCoins: 0,
    interior: true,
  })
  for (const p of site.props) {
    const w = p.kind === 'rug' ? 3 : ['bed', 'table', 'shelf', 'altar', 'cart'].includes(p.kind) ? 2 : 1
    const h = p.kind === 'rug' ? 2 : 1
    if (p.kind === 'rug') continue
    for (let dx = 0; dx < w; dx++) for (let dy = 0; dy < h; dy++) if (grid[p.y + dy]?.[p.x + dx]) grid[p.y + dy][p.x + dx] = 'T'
  }
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
  for (let y = 0; y < site.rows; y++) for (let x = 0; x < site.cols; x++) if (diggable[site.grid[y][x]]) cells.push({ x, y })
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
