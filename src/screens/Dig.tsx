import { useEffect, useRef, useState } from 'preact/hooks'
import type { Chapter } from '../data/chapters'
import { dig as digField, move, signal, stepToward, type Buried, type Field } from '../game/dig'
import { beep, thud, chime } from '../game/audio'
import { save, t } from '../state'
import { Crystal } from '../ui/art'

const CELL = 56

type Props = {
  chapter: Chapter
  field: Field
  onField: (f: Field) => void
  onFound: (b: Buried) => void
  onLeave: () => void
  message?: { text: string; id: number }
}

const palettes: Record<Chapter['terrain'], { base: string; speck: string; hole: string; obstacle: 'tree' | 'tent' | 'column' | 'rock' | 'reed' }> = {
  meadow: { base: '#6f8f55', speck: '#7fa063', hole: '#4a3521', obstacle: 'tree' },
  camp: { base: '#8c7a5a', speck: '#9a8766', hole: '#4a3521', obstacle: 'tent' },
  river: { base: '#6a8c5c', speck: '#789a69', hole: '#3e2f1e', obstacle: 'reed' },
  desert: { base: '#d6b77a', speck: '#e0c48a', hole: '#8a6a3d', obstacle: 'column' },
  forest: { base: '#3f5a35', speck: '#4a6a3e', hole: '#2a1d10', obstacle: 'tree' },
  city: { base: '#a89f86', speck: '#b3aa90', hole: '#4a3521', obstacle: 'column' },
  coast: { base: '#8fb08a', speck: '#a0bf98', hole: '#5a4a32', obstacle: 'rock' },
}

export function Dig({ chapter, field, onField, onFound, onLeave, message }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [toast, setToast] = useState<string | null>(null)
  const target = useRef<{ x: number; y: number } | null>(null)
  const fieldRef = useRef(field)
  fieldRef.current = field
  const sig = signal(field)
  const soundOn = save.value.sound

  useEffect(() => {
    if (!message) return
    setToast(message.text)
    const id = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(id)
  }, [message?.id])

  const doDig = () => {
    const result = digField(fieldRef.current)
    onField(result.field)
    if (result.found) {
      if (result.found.kind === 'coin') {
        if (soundOn) chime()
        onFound(result.found)
      } else {
        if (soundOn) thud()
        const key = `junk${capitalise(result.found.junk ?? 'sherd')}` as 'junkSherd' | 'junkNail' | 'junkFibula' | 'junkBone'
        show(t(key))
      }
    } else {
      if (soundOn) thud()
      show(t('nothingHere'))
    }
  }

  const show = (text: string) => {
    setToast(text)
    setTimeout(() => setToast((cur) => (cur === text ? null : cur)), 2200)
  }

  const step = (dx: number, dy: number) => {
    target.current = null
    const next = move(fieldRef.current, dx, dy)
    if (next !== fieldRef.current) onField(next)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (['arrowup', 'w'].includes(k)) step(0, -1)
      else if (['arrowdown', 's'].includes(k)) step(0, 1)
      else if (['arrowleft', 'a'].includes(k)) step(-1, 0)
      else if (['arrowright', 'd'].includes(k)) step(1, 0)
      else if (k === ' ' || k === 'enter') doDig()
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const tg = target.current
      if (!tg) return
      const f = fieldRef.current
      if (f.player.x === tg.x && f.player.y === tg.y) {
        target.current = null
        return
      }
      const next = stepToward(f, tg)
      if (next === f) target.current = null
      else onField(next)
    }, 110)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!soundOn || sig <= 0.02) return
    const bucket = Math.round(sig * 10) / 10
    const interval = 950 - bucket * 820
    const id = setInterval(() => beep(480 + bucket * 700, 0.06, 0.05 + bucket * 0.05), interval)
    return () => clearInterval(id)
  }, [Math.round(sig * 10), soundOn])

  useEffect(() => {
    const c = canvas.current
    if (!c) return
    draw(c, field, chapter, sig)
    if (import.meta.env.DEV) (window as unknown as { monetaField?: Field }).monetaField = field
  }, [field, sig, chapter])

  const onPointer = (e: PointerEvent) => {
    const c = canvas.current!
    const rect = c.getBoundingClientRect()
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * field.width)
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * field.height)
    if (x === field.player.x && y === field.player.y) doDig()
    else target.current = { x, y }
  }

  return (
    <div class="dig-layout">
      <div>
        <canvas ref={canvas} class="dig-canvas" width={field.width * CELL} height={field.height * CELL} onPointerDown={onPointer} />
        <p class="small muted" style="margin-top:10px">
          {t('digHint')}
        </p>
      </div>
      <div class="dig-side panel deep">
        <div class="crystal">
          <Crystal level={sig} />
        </div>
        <div>
          <div class="caps">{t('signal')}</div>
          <div class="meter">
            <i style={{ width: `${Math.round(sig * 100)}%` }} />
          </div>
        </div>
        <div>
          <div class="caps">{t('energy')}</div>
          <div class="meter">
            <i style={{ width: `${Math.round((field.daylight / 40) * 100)}%`, background: '#e2b84a' }} />
          </div>
        </div>
        <button class="btn primary dig" onClick={doDig}>
          {t('dig')}
        </button>
        <div class="dpad">
          <span class="empty" />
          <button onClick={() => step(0, -1)} aria-label="up">
            ↑
          </button>
          <span class="empty" />
          <button onClick={() => step(-1, 0)} aria-label="left">
            ←
          </button>
          <button onClick={doDig} aria-label="dig">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M4 20 L14 10" stroke="#5a4a38" stroke-width="2.5" stroke-linecap="round" />
              <path d="M12 6 l6 6 l-3 3 l-6 -6 z" fill="#8a8a92" stroke="#2a2118" stroke-width="1.2" />
            </svg>
          </button>
          <button onClick={() => step(1, 0)} aria-label="right">
            →
          </button>
          <span class="empty" />
          <button onClick={() => step(0, 1)} aria-label="down">
            ↓
          </button>
          <span class="empty" />
        </div>
        <button class="btn quiet" onClick={onLeave}>
          {t('leaveSite')}
        </button>
      </div>
      {toast && <div class="toast">{toast}</div>}
    </div>
  )
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function hash(x: number, y: number, k: number) {
  let h = (x * 374761393 + y * 668265263 + k * 1274126177) >>> 0
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0
  return (h ^ (h >>> 16)) / 4294967296
}

function draw(c: HTMLCanvasElement, field: Field, chapter: Chapter, sig: number) {
  const ctx = c.getContext('2d')!
  const pal = palettes[chapter.terrain]
  const W = field.width * CELL
  const H = field.height * CELL
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = pal.base
  ctx.fillRect(0, 0, W, H)
  for (let y = 0; y < field.height; y++) {
    for (let x = 0; x < field.width; x++) {
      for (let k = 0; k < 7; k++) {
        const px = x * CELL + hash(x, y, k) * CELL
        const py = y * CELL + hash(x, y, k + 11) * CELL
        ctx.fillStyle = hash(x, y, k + 23) > 0.5 ? pal.speck : shade(pal.base, -10)
        ctx.beginPath()
        ctx.ellipse(px, py, 3 + hash(x, y, k + 31) * 4, 2, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.07)'
  ctx.lineWidth = 1
  for (let x = 0; x <= field.width; x++) {
    ctx.beginPath()
    ctx.moveTo(x * CELL, 0)
    ctx.lineTo(x * CELL, H)
    ctx.stroke()
  }
  for (let y = 0; y <= field.height; y++) {
    ctx.beginPath()
    ctx.moveTo(0, y * CELL)
    ctx.lineTo(W, y * CELL)
    ctx.stroke()
  }

  for (const h of field.holes) {
    const found = field.buried.find((b) => b.dug && b.x === h.x && b.y === h.y)
    const cx = h.x * CELL + CELL / 2
    const cy = h.y * CELL + CELL / 2
    ctx.fillStyle = pal.hole
    ctx.beginPath()
    ctx.ellipse(cx, cy + 4, 18, 11, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = shade(pal.base, -25)
    ctx.beginPath()
    ctx.ellipse(cx - 20, cy - 6, 7, 4, -0.4, 0, Math.PI * 2)
    ctx.ellipse(cx + 21, cy - 4, 6, 4, 0.4, 0, Math.PI * 2)
    ctx.fill()
    if (found?.kind === 'coin') {
      ctx.fillStyle = '#c9a227'
      ctx.strokeStyle = '#7a5a0e'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(cx, cy + 2, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    } else if (found) {
      ctx.fillStyle = '#9a9a92'
      ctx.fillRect(cx - 6, cy, 12, 4)
    }
  }

  for (const o of field.obstacles) drawObstacle(ctx, o.x * CELL + CELL / 2, o.y * CELL + CELL / 2, pal.obstacle, hash(o.x, o.y, 5))

  const px = field.player.x * CELL + CELL / 2
  const py = field.player.y * CELL + CELL / 2
  if (sig > 0.02) {
    const pulse = (Date.now() % 1000) / 1000
    ctx.strokeStyle = `rgba(200,160,255,${(0.6 * sig * (1 - pulse)).toFixed(3)})`
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(px, py, 14 + pulse * (20 + sig * 40), 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.beginPath()
  ctx.ellipse(px, py + 20, 14, 5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#4a3a6a'
  ctx.beginPath()
  ctx.moveTo(px - 12, py + 20)
  ctx.quadraticCurveTo(px - 14, py - 4, px, py - 10)
  ctx.quadraticCurveTo(px + 14, py - 4, px + 12, py + 20)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#f1d9c4'
  ctx.beginPath()
  ctx.arc(px, py - 10, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#3b2d66'
  ctx.beginPath()
  ctx.arc(px, py - 13, 9, Math.PI, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = `rgba(180,140,255,${0.5 + sig * 0.5})`
  ctx.beginPath()
  ctx.moveTo(px + 12, py - 2)
  ctx.lineTo(px + 17, py + 4)
  ctx.lineTo(px + 12, py + 12)
  ctx.lineTo(px + 7, py + 4)
  ctx.closePath()
  ctx.fill()
}

function drawObstacle(ctx: CanvasRenderingContext2D, cx: number, cy: number, kind: string, r: number) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)'
  ctx.beginPath()
  ctx.ellipse(cx, cy + 20, 20, 7, 0, 0, Math.PI * 2)
  ctx.fill()
  if (kind === 'tree') {
    ctx.fillStyle = '#5d4b32'
    ctx.fillRect(cx - 4, cy + 4, 8, 18)
    ctx.fillStyle = r > 0.5 ? '#3f6a33' : '#4a7a3c'
    ctx.beginPath()
    ctx.ellipse(cx, cy - 4, 20, 22, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.12)'
    ctx.beginPath()
    ctx.ellipse(cx - 6, cy - 12, 10, 10, 0, 0, Math.PI * 2)
    ctx.fill()
  } else if (kind === 'tent') {
    ctx.fillStyle = r > 0.5 ? '#b3845a' : '#9a6e4a'
    ctx.beginPath()
    ctx.moveTo(cx - 24, cy + 18)
    ctx.lineTo(cx, cy - 20)
    ctx.lineTo(cx + 24, cy + 18)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#3a2c1a'
    ctx.beginPath()
    ctx.moveTo(cx - 6, cy + 18)
    ctx.lineTo(cx, cy)
    ctx.lineTo(cx + 6, cy + 18)
    ctx.closePath()
    ctx.fill()
  } else if (kind === 'column') {
    ctx.fillStyle = '#e6dcc3'
    ctx.fillRect(cx - 8, cy - 16 + r * 10, 16, 34 - r * 10)
    ctx.fillStyle = '#cfc4a6'
    ctx.fillRect(cx - 11, cy - 20 + r * 10, 22, 6)
    ctx.fillRect(cx - 11, cy + 16, 22, 5)
  } else if (kind === 'rock') {
    ctx.fillStyle = '#8f8a7a'
    ctx.beginPath()
    ctx.ellipse(cx, cy + 4, 18, 13, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    ctx.beginPath()
    ctx.ellipse(cx - 5, cy - 2, 8, 5, r, 0, Math.PI * 2)
    ctx.fill()
  } else if (kind === 'reed') {
    ctx.strokeStyle = '#4f7a4a'
    ctx.lineWidth = 3
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath()
      ctx.moveTo(cx + i * 6, cy + 20)
      ctx.quadraticCurveTo(cx + i * 8, cy, cx + i * 7 + 2, cy - 18 - r * 6)
      ctx.stroke()
    }
    ctx.fillStyle = '#6a4a2a'
    for (let i = -1; i <= 1; i++) ctx.fillRect(cx + i * 10 - 2, cy - 18, 4, 10)
  }
}

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amount))
  const b = Math.max(0, Math.min(255, (n & 255) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
