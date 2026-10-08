import { mulberry32, shuffle, type Rng } from './questions'

export type Cell = { x: number; y: number }
export type Buried = Cell & { kind: 'coin' | 'junk'; junk?: 'sherd' | 'nail' | 'fibula' | 'bone'; dug: boolean }

export type Field = {
  width: number
  height: number
  player: Cell
  buried: Buried[]
  holes: Cell[]
  obstacles: Cell[]
  daylight: number
}

export const FIELD_W = 14
export const FIELD_H = 9
export const DAYLIGHT = 40

export function newField(seed: number, coins: number, obstacleCount = 10): Field {
  const rng = mulberry32(seed)
  const cells: Cell[] = []
  for (let y = 0; y < FIELD_H; y++) for (let x = 0; x < FIELD_W; x++) cells.push({ x, y })
  const player = { x: Math.floor(FIELD_W / 2), y: FIELD_H - 1 }
  const free = shuffle(
    cells.filter((c) => Math.abs(c.x - player.x) + Math.abs(c.y - player.y) > 2),
    rng,
  )
  const obstacles = free.splice(0, obstacleCount)
  const buried: Buried[] = []
  for (let i = 0; i < coins; i++) {
    const c = free.shift()!
    buried.push({ ...c, kind: 'coin', dug: false })
  }
  const junkKinds: Buried['junk'][] = ['sherd', 'nail', 'fibula', 'bone']
  for (let i = 0; i < 3; i++) {
    const c = free.shift()!
    buried.push({ ...c, kind: 'junk', junk: junkKinds[Math.floor(rng() * junkKinds.length)], dug: false })
  }
  return { width: FIELD_W, height: FIELD_H, player, buried, holes: [], obstacles, daylight: DAYLIGHT }
}

export function isBlocked(field: Field, c: Cell): boolean {
  if (c.x < 0 || c.y < 0 || c.x >= field.width || c.y >= field.height) return true
  return field.obstacles.some((o) => o.x === c.x && o.y === c.y)
}

export function move(field: Field, dx: number, dy: number): Field {
  const target = { x: field.player.x + dx, y: field.player.y + dy }
  if (isBlocked(field, target)) return field
  return { ...field, player: target }
}

export function signal(field: Field): number {
  let best = Infinity
  for (const b of field.buried) {
    if (b.dug) continue
    const d = Math.hypot(b.x - field.player.x, b.y - field.player.y)
    if (d < best) best = d
  }
  if (best === Infinity) return 0
  return Math.max(0, 1 - best / 6.5)
}

export type DigResult = { field: Field; found?: Buried }

export function dig(field: Field): DigResult {
  const { x, y } = field.player
  const daylight = field.daylight - 1
  const hit = field.buried.find((b) => !b.dug && b.x === x && b.y === y)
  if (hit) {
    const buried = field.buried.map((b) => (b === hit ? { ...b, dug: true } : b))
    return { field: { ...field, buried, holes: [...field.holes, { x, y }], daylight }, found: { ...hit, dug: true } }
  }
  if (field.holes.some((h) => h.x === x && h.y === y)) return { field: { ...field, daylight } }
  return { field: { ...field, holes: [...field.holes, { x, y }], daylight } }
}

export function coinsLeft(field: Field): number {
  return field.buried.filter((b) => b.kind === 'coin' && !b.dug).length
}

export function stepToward(field: Field, target: Cell): Field {
  const dx = Math.sign(target.x - field.player.x)
  const dy = Math.sign(target.y - field.player.y)
  if (dx !== 0) {
    const moved = move(field, dx, 0)
    if (moved !== field) return moved
  }
  if (dy !== 0) {
    const moved = move(field, 0, dy)
    if (moved !== field) return moved
  }
  return field
}

export function seedFrom(...parts: number[]): number {
  let h = 2166136261
  for (const p of parts) {
    h ^= p
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export { type Rng }
