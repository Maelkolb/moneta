import { useEffect, useRef, useState } from 'preact/hooks'
import type { Coin } from '../data/types'
import { coinImage } from '../data'
import { t } from '../state'

const SIZE = 420

export function Clean({ coin, onDone }: { coin: Coin; onDone: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const dirt = useRef<HTMLCanvasElement | null>(null)
  const image = useRef<HTMLImageElement | null>(null)
  const strokes = useRef(0)
  const [progress, setProgress] = useState(0)
  const finished = useRef(false)

  useEffect(() => {
    const img = new Image()
    img.src = coinImage(coin, 'obv')
    img.onload = () => {
      image.current = img
      dirt.current = makeDirt()
      render()
    }
  }, [coin.id])

  const render = () => {
    const c = canvas.current
    const img = image.current
    const d = dirt.current
    if (!c || !img || !d) return
    const ctx = c.getContext('2d')!
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.save()
    ctx.beginPath()
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.fillStyle = '#1d1810'
    ctx.fillRect(0, 0, SIZE, SIZE)
    const scale = Math.min(SIZE / img.width, SIZE / img.height) * 0.94
    const w = img.width * scale
    const h = img.height * scale
    ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h)
    ctx.drawImage(d, 0, 0)
    ctx.restore()
  }

  const measure = () => {
    const d = dirt.current
    if (!d) return 0
    const tiny = document.createElement('canvas')
    tiny.width = 42
    tiny.height = 42
    const tctx = tiny.getContext('2d')!
    tctx.drawImage(d, 0, 0, 42, 42)
    const px = tctx.getImageData(0, 0, 42, 42).data
    let covered = 0
    let total = 0
    for (let y = 0; y < 42; y++) {
      for (let x = 0; x < 42; x++) {
        const dx = x - 21
        const dy = y - 21
        if (dx * dx + dy * dy > 20 * 20) continue
        total++
        if (px[(y * 42 + x) * 4 + 3] > 60) covered++
      }
    }
    return 1 - covered / total
  }

  const rub = (e: PointerEvent) => {
    if (e.buttons === 0 || finished.current) return
    const c = canvas.current!
    const d = dirt.current
    if (!d) return
    const rect = c.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * SIZE
    const y = ((e.clientY - rect.top) / rect.height) * SIZE
    const ctx = d.getContext('2d')!
    ctx.globalCompositeOperation = 'destination-out'
    const grad = ctx.createRadialGradient(x, y, 6, x, y, 30)
    grad.addColorStop(0, 'rgba(0,0,0,1)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y, 30, 0, Math.PI * 2)
    ctx.fill()
    render()
    strokes.current++
    if (strokes.current % 6 === 0) {
      const p = measure()
      setProgress(p)
      if (p > 0.72) finish()
    }
  }

  const finish = () => {
    if (finished.current) return
    finished.current = true
    const d = dirt.current
    if (d) {
      const ctx = d.getContext('2d')!
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,1)'
      ctx.fillRect(0, 0, SIZE, SIZE)
      render()
    }
    setProgress(1)
    setTimeout(onDone, 700)
  }

  return (
    <div class="clean-layout">
      <div>
        <canvas
          ref={canvas}
          class="clean-canvas"
          width={SIZE}
          height={SIZE}
          onPointerMove={rub}
          onPointerDown={(e) => {
            ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
            rub(e)
          }}
        />
      </div>
      <div>
        <h2>{t('clean')}</h2>
        <p>{t('cleanHint')}</p>
        <div class="meter" style="margin:10px 0 18px">
          <i style={{ width: `${Math.round(progress * 100)}%`, background: '#8a6a14' }} />
        </div>
        <button class="btn quiet" onClick={finish}>
          {t('skip')}
        </button>
      </div>
    </div>
  )
}

function makeDirt(): HTMLCanvasElement {
  const d = document.createElement('canvas')
  d.width = SIZE
  d.height = SIZE
  const ctx = d.getContext('2d')!
  ctx.fillStyle = '#5a4532'
  ctx.beginPath()
  ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2)
  ctx.fill()
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * SIZE
    const y = Math.random() * SIZE
    const r = 2 + Math.random() * 9
    const tone = Math.random()
    ctx.fillStyle = tone < 0.4 ? '#6b533a' : tone < 0.8 ? '#4a3626' : '#7f6a4a'
    ctx.globalAlpha = 0.5 + Math.random() * 0.5
    ctx.beginPath()
    ctx.ellipse(x, y, r, r * (0.5 + Math.random()), Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
  return d
}
