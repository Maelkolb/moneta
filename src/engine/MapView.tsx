import { useEffect, useRef, useState } from 'preact/hooks'
import { loadImages, type ImageKey } from './assets'
import { COLS, ROWS, STAGE_H, STAGE_W, TILE, isWalkable, tileImage, type Site } from './sites'

export type Cell = { x: number; y: number }

type Props = {
  site: Site
  coins: Cell[]
  player: Cell
  onMove: (next: Cell) => void
  onAction: () => void
  frozen: boolean
}

const STEP_MS = 140

export function MapView({ site, coins, player, onMove, onAction, frozen }: Props) {
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
  const onActionRef = useRef(onAction)
  onActionRef.current = onAction

  useEffect(() => {
    void loadImages(['border', 'ground', 'grass', 'earth', 'path', 'straw', 'water', 'tree', 'tent1', 'tent2', 'tent3', 'tent4', 'statue', 'gwen', 'playerDown', 'playerUp']).then(setImages)
  }, [])

  const tryMove = (dx: number, dy: number) => {
    if (frozenRef.current) return
    const p = playerRef.current
    const next = { x: p.x + dx, y: p.y + dy }
    if (dy < 0) facing.current = 'up'
    if (dy > 0) facing.current = 'down'
    if (next.x === site.gwen.x && next.y === site.gwen.y) {
      onActionRef.current()
      return
    }
    if (!isWalkable(site, next.x, next.y)) return
    onMoveRef.current(next)
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
      } else if ((k === ' ' || k === 'enter') && !frozenRef.current) {
        e.preventDefault()
        onActionRef.current()
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
    const c = canvas.current
    if (!c || !images) return
    let raf = 0
    const render = () => {
      draw(c, images, site, coins, playerRef.current, facing.current)
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
            if (!frozenRef.current) onActionRef.current()
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

function draw(c: HTMLCanvasElement, images: Record<ImageKey, HTMLImageElement>, site: Site, coins: Cell[], player: Cell, facing: 'up' | 'down') {
  const ctx = c.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, STAGE_W, STAGE_H)
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const code = site.grid[y][x]
      ctx.drawImage(images[tileImage[code]], x * TILE, y * TILE, TILE, TILE)
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
  for (const o of site.objects) {
    items.push({ y: o.y + o.h, draw: () => ctx.drawImage(images[o.img], o.x, o.y, o.w, o.h) })
  }
  const gx = site.gwen.x * TILE - 8
  const gy = site.gwen.y * TILE - 34
  items.push({ y: gy + 64, draw: () => ctx.drawImage(images.gwen, gx, gy, 48, 64) })
  const sprite = facing === 'up' ? images.playerUp : images.playerDown
  const bob = Math.sin(t / 160) * 1
  items.push({ y: player.y * TILE + TILE, draw: () => ctx.drawImage(sprite, player.x * TILE + 4, player.y * TILE - 4 + bob, 24, 30) })
  items.sort((a, b) => a.y - b.y)
  for (const it of items) it.draw()
}
