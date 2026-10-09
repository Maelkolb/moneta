import { useEffect, useRef, useState } from 'preact/hooks'
import { loadImages, type ImageKey } from './assets'
import { STAGE_H, STAGE_W, TILE, isWalkable, tileImage, type Site } from './sites'
import type { NpcSpec } from './npcs'
import { drawProp } from './props'

export type Cell = { x: number; y: number }

type Props = {
  site: Site
  coins: Cell[]
  player: Cell
  onMove: (next: Cell) => void
  onTalk: (npc: NpcSpec) => void
  frozen: boolean
}

const STEP_MS = 140
const ALL_IMAGES: ImageKey[] = [
  'border', 'ground', 'grass', 'earth', 'path', 'straw', 'water', 'tentFloor', 'tree', 'tent1', 'tent2', 'tent3', 'tent4', 'statue', 'gwen', 'playerDown', 'playerUp',
  'npc_elder_down', 'npc_elder_up', 'npc_smith_down', 'npc_smith_up', 'npc_trader_down', 'npc_trader_up', 'npc_seer_down', 'npc_seer_up', 'npc_child_down', 'npc_child_up',
  'npc_farmer_down', 'npc_farmer_up', 'npc_warrior_down', 'npc_warrior_up', 'npc_legion_down', 'npc_legion_up', 'npc_woman_down', 'npc_woman_up', 'npc_monk_down', 'npc_monk_up',
]

type NpcState = { spec: NpcSpec; x: number; y: number; facing: 'up' | 'down' }

export function MapView({ site, coins, player, onMove, onTalk, frozen }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<Record<ImageKey, HTMLImageElement> | null>(null)
  const held = useRef<Set<string>>(new Set())
  const lastStep = useRef(0)
  const facing = useRef<'up' | 'down'>('down')
  const playerRef = useRef(player)
  playerRef.current = player
  const frozenRef = useRef(frozen)
  frozenRef.current = frozen
  const onMoveRef = useRef(onMove)
  onMoveRef.current = onMove
  const onTalkRef = useRef(onTalk)
  onTalkRef.current = onTalk
  const npcs = useRef<NpcState[]>([])

  useEffect(() => {
    npcs.current = site.npcs.map((n) => ({ spec: n, x: n.x, y: n.y, facing: n.facing ?? 'down' }))
  }, [site])

  useEffect(() => {
    void loadImages(ALL_IMAGES).then(setImages)
  }, [])

  const npcAt = (x: number, y: number) => npcs.current.find((n) => n.x === x && n.y === y)

  const tryMove = (dx: number, dy: number) => {
    if (frozenRef.current) return
    const p = playerRef.current
    const next = { x: p.x + dx, y: p.y + dy }
    if (dy < 0) facing.current = 'up'
    if (dy > 0) facing.current = 'down'
    const npc = npcAt(next.x, next.y)
    if (npc) {
      npc.facing = dy > 0 ? 'up' : 'down'
      onTalkRef.current(npc.spec)
      return
    }
    if (!isWalkable(site, next.x, next.y)) return
    onMoveRef.current(next)
  }

  const action = () => {
    if (frozenRef.current) return
    const p = playerRef.current
    const dy = facing.current === 'up' ? -1 : 1
    const target = npcAt(p.x, p.y + dy) ?? npcAt(p.x - 1, p.y) ?? npcAt(p.x + 1, p.y) ?? npcAt(p.x, p.y - dy)
    if (target) {
      target.facing = target.y > p.y ? 'up' : 'down'
      onTalkRef.current(target.spec)
    }
  }

  useEffect(() => {
    const dirOf = (k: string): [number, number] | null => {
      switch (k) {
        case 'arrowup':
        case 'w':
          return [0, -1]
        case 'arrowdown':
        case 's':
          return [0, 1]
        case 'arrowleft':
        case 'a':
          return [-1, 0]
        case 'arrowright':
        case 'd':
          return [1, 0]
      }
      return null
    }
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (dirOf(k)) {
        e.preventDefault()
        if (!held.current.has(k)) {
          held.current.add(k)
          const [dx, dy] = dirOf(k)!
          tryMove(dx, dy)
          lastStep.current = performance.now()
        }
      } else if (k === ' ' || k === 'enter') {
        if (frozenRef.current) return
        e.preventDefault()
        action()
      }
    }
    const up = (e: KeyboardEvent) => held.current.delete(e.key.toLowerCase())
    const blur = () => held.current.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    const id = setInterval(() => {
      if (held.current.size === 0) return
      if (performance.now() - lastStep.current < STEP_MS) return
      const k = [...held.current].pop()!
      const d = dirOf(k)
      if (!d) return
      tryMove(d[0], d[1])
      lastStep.current = performance.now()
    }, 30)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
      clearInterval(id)
    }
  }, [site])

  useEffect(() => {
    const id = setInterval(() => {
      if (frozenRef.current) return
      const p = playerRef.current
      for (const n of npcs.current) {
        if (!n.spec.wander || Math.random() < 0.5) continue
        const dirs: [number, number][] = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]
        const [dx, dy] = dirs[Math.floor(Math.random() * 4)]
        const nx = n.x + dx
        const ny = n.y + dy
        if (!isWalkable(site, nx, ny)) continue
        const code = site.grid[ny][nx]
        if (code === 'X' || code === 'H' || code === 'D') continue
        if (Math.abs(nx - n.spec.x) > 4 || Math.abs(ny - n.spec.y) > 4) continue
        if ((nx === p.x && ny === p.y) || npcAt(nx, ny)) continue
        if (Math.abs(nx - p.x) + Math.abs(ny - p.y) <= 1) continue
        n.x = nx
        n.y = ny
        n.facing = dy < 0 ? 'up' : 'down'
      }
    }, 650)
    return () => clearInterval(id)
  }, [site])

  useEffect(() => {
    const c = canvas.current
    if (!c || !images) return
    let raf = 0
    const render = () => {
      draw(c, images, site, coins, playerRef.current, facing.current, npcs.current)
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)
    return () => cancelAnimationFrame(raf)
  }, [images, site, coins])

  const pad = (dx: number, dy: number) => (e: Event) => {
    e.preventDefault()
    tryMove(dx, dy)
  }

  return (
    <div class="map-wrap">
      <canvas ref={canvas} width={STAGE_W} height={STAGE_H} />
      <div class="touch-pad">
        <button onPointerDown={pad(0, -1)} aria-label="up">
          ▲
        </button>
        <button onPointerDown={pad(-1, 0)} aria-label="left">
          ◀
        </button>
        <button
          onPointerDown={(e) => {
            e.preventDefault()
            action()
          }}
          aria-label="action"
        >
          ●
        </button>
        <button onPointerDown={pad(1, 0)} aria-label="right">
          ▶
        </button>
        <button onPointerDown={pad(0, 1)} aria-label="down">
          ▼
        </button>
      </div>
    </div>
  )
}

function spriteFor(images: Record<ImageKey, HTMLImageElement>, n: NpcState): { img: HTMLImageElement; w: number; h: number; dx: number; dy: number } {
  if (n.spec.sprite === 'gwen') return { img: images.gwen, w: 48, h: 64, dx: -8, dy: -34 }
  const key = `npc_${n.spec.sprite}_${n.facing}` as ImageKey
  if (n.spec.sprite === 'child') return { img: images[key], w: 20, h: 25, dx: 6, dy: 2 }
  return { img: images[key], w: 24, h: 30, dx: 4, dy: -4 }
}

function draw(c: HTMLCanvasElement, images: Record<ImageKey, HTMLImageElement>, site: Site, coins: Cell[], player: Cell, facing: 'up' | 'down', npcs: NpcState[]) {
  const ctx = c.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.fillStyle = site.interior ? '#0b0906' : '#000'
  ctx.fillRect(0, 0, STAGE_W, STAGE_H)
  ctx.save()
  ctx.translate(site.ox, site.oy)
  for (let y = 0; y < site.rows; y++) {
    for (let x = 0; x < site.cols; x++) {
      const code = site.grid[y][x]
      ctx.drawImage(images[tileImage[code]], x * TILE, y * TILE, TILE, TILE)
      if (code === 'H' || code === 'D') {
        ctx.fillStyle = 'rgba(0,0,0,0.45)'
        ctx.fillRect(x * TILE + 6, y * TILE + 2, TILE - 12, TILE - 4)
      }
    }
  }
  const t = performance.now()
  const nearest = coins.reduce((best, k) => Math.min(best, Math.hypot(k.x - player.x, k.y - player.y)), Infinity)
  const signal = nearest === Infinity ? 0 : Math.max(0, 1 - nearest / 6)
  if (signal > 0) {
    const pulse = (t % 1100) / 1100
    const px = player.x * TILE + TILE / 2
    const py = player.y * TILE + TILE / 2
    ctx.strokeStyle = `rgba(255,255,255,${(0.7 * signal * (1 - pulse)).toFixed(3)})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(px, py, 8 + pulse * (16 + signal * 40), 0, Math.PI * 2)
    ctx.stroke()
  }

  type Drawable = { y: number; draw: () => void }
  const items: Drawable[] = []
  for (const o of site.objects) items.push({ y: o.y + o.h, draw: () => ctx.drawImage(images[o.img], o.x, o.y, o.w, o.h) })
  for (const p of site.props) {
    const h = p.kind === 'rug' ? 2 : 1
    items.push({ y: p.kind === 'rug' ? 0 : p.y * TILE + h * TILE - 2, draw: () => drawProp(ctx, p.kind, p.x * TILE, p.y * TILE, t) })
  }
  for (const n of npcs) {
    const s = spriteFor(images, n)
    items.push({ y: n.y * TILE + TILE, draw: () => ctx.drawImage(s.img, n.x * TILE + s.dx, n.y * TILE + s.dy, s.w, s.h) })
  }
  const sprite = facing === 'up' ? images.playerUp : images.playerDown
  const bob = Math.sin(t / 160) * 1
  items.push({ y: player.y * TILE + TILE, draw: () => ctx.drawImage(sprite, player.x * TILE + 4, player.y * TILE - 4 + bob, 24, 30) })
  items.sort((a, b) => a.y - b.y)
  for (const it of items) it.draw()
  if (site.interior) {
    ctx.strokeStyle = '#2a1a0c'
    ctx.lineWidth = 6
    ctx.strokeRect(-3, -3, site.cols * TILE + 6, site.rows * TILE + 6)
  }
  ctx.restore()
}
