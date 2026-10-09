export type PropKind = 'fire' | 'bed' | 'chest' | 'table' | 'anvil' | 'altar' | 'amphora' | 'rug' | 'barrel' | 'shield' | 'sacks' | 'scale' | 'shelf' | 'well' | 'milestone' | 'cart'

export type Prop = { kind: PropKind; x: number; y: number; w?: number; h?: number }

export function propSize(kind: PropKind): { w: number; h: number } {
  switch (kind) {
    case 'rug':
      return { w: 3, h: 2 }
    case 'table':
    case 'bed':
    case 'shelf':
    case 'altar':
    case 'cart':
      return { w: 2, h: 1 }
    default:
      return { w: 1, h: 1 }
  }
}

export function drawProp(ctx: CanvasRenderingContext2D, kind: PropKind, px: number, py: number, t: number) {
  const T = 32
  ctx.save()
  switch (kind) {
    case 'fire': {
      ctx.fillStyle = '#6b6b6b'
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2
        ctx.beginPath()
        ctx.arc(px + 16 + Math.cos(a) * 12, py + 20 + Math.sin(a) * 7, 3.5, 0, Math.PI * 2)
        ctx.fill()
      }
      const flick = Math.sin(t / 90) * 2
      const g = ctx.createRadialGradient(px + 16, py + 18, 2, px + 16, py + 18, 40)
      g.addColorStop(0, 'rgba(255,200,80,0.35)')
      g.addColorStop(1, 'rgba(255,120,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(px - 24, py - 24, 80, 80)
      ctx.fillStyle = '#e8641e'
      ctx.beginPath()
      ctx.moveTo(px + 8, py + 20)
      ctx.quadraticCurveTo(px + 10, py + 4 + flick, px + 16, py + 2 - flick)
      ctx.quadraticCurveTo(px + 22, py + 6 - flick, px + 24, py + 20)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#ffd34d'
      ctx.beginPath()
      ctx.moveTo(px + 12, py + 20)
      ctx.quadraticCurveTo(px + 14, py + 10 - flick, px + 16, py + 8 + flick)
      ctx.quadraticCurveTo(px + 18, py + 12, px + 20, py + 20)
      ctx.closePath()
      ctx.fill()
      break
    }
    case 'bed': {
      ctx.fillStyle = '#b89a5c'
      ctx.fillRect(px + 2, py + 6, 60, 22)
      ctx.fillStyle = '#d6b877'
      ctx.fillRect(px + 4, py + 8, 56, 10)
      ctx.fillStyle = '#7a2e2e'
      ctx.fillRect(px + 22, py + 8, 38, 18)
      ctx.fillStyle = '#f1e4c8'
      ctx.fillRect(px + 5, py + 9, 14, 8)
      break
    }
    case 'chest': {
      ctx.fillStyle = '#5a3a1e'
      ctx.fillRect(px + 4, py + 10, 24, 18)
      ctx.fillStyle = '#7a5230'
      ctx.fillRect(px + 4, py + 8, 24, 8)
      ctx.fillStyle = '#c9a227'
      ctx.fillRect(px + 14, py + 14, 4, 6)
      ctx.fillRect(px + 4, py + 16, 24, 2)
      break
    }
    case 'table': {
      ctx.fillStyle = '#4a2e14'
      ctx.fillRect(px + 6, py + 14, 4, 14)
      ctx.fillRect(px + 54, py + 14, 4, 14)
      ctx.fillStyle = '#8a5a30'
      ctx.fillRect(px + 2, py + 6, 60, 10)
      ctx.fillStyle = '#a87a48'
      ctx.fillRect(px + 2, py + 6, 60, 3)
      ctx.fillStyle = '#c9a227'
      ctx.beginPath()
      ctx.arc(px + 20, py + 11, 3, 0, Math.PI * 2)
      ctx.arc(px + 30, py + 10, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#e9d3a4'
      ctx.fillRect(px + 38, py + 7, 16, 8)
      break
    }
    case 'anvil': {
      ctx.fillStyle = '#3a2e1e'
      ctx.fillRect(px + 10, py + 18, 12, 10)
      ctx.fillStyle = '#6a6a72'
      ctx.fillRect(px + 2, py + 8, 28, 10)
      ctx.fillStyle = '#9a9aa4'
      ctx.fillRect(px + 2, py + 8, 28, 3)
      ctx.fillRect(px - 2, py + 10, 6, 5)
      break
    }
    case 'altar': {
      ctx.fillStyle = '#cfc7b6'
      ctx.fillRect(px + 6, py + 10, 52, 18)
      ctx.fillStyle = '#e6e0d2'
      ctx.fillRect(px + 4, py + 8, 56, 5)
      const f = Math.sin(t / 120) * 1.5
      for (const cx of [px + 14, px + 32, px + 50]) {
        ctx.fillStyle = '#f1e4c8'
        ctx.fillRect(cx - 2, py - 2, 4, 10)
        ctx.fillStyle = '#ffd34d'
        ctx.beginPath()
        ctx.ellipse(cx, py - 5 + f, 2.5, 4, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 'amphora': {
      ctx.fillStyle = '#9a5a30'
      ctx.beginPath()
      ctx.moveTo(px + 11, py + 6)
      ctx.lineTo(px + 21, py + 6)
      ctx.quadraticCurveTo(px + 30, py + 16, px + 18, py + 30)
      ctx.lineTo(px + 14, py + 30)
      ctx.quadraticCurveTo(px + 2, py + 16, px + 11, py + 6)
      ctx.fill()
      ctx.fillStyle = '#c07a48'
      ctx.fillRect(px + 10, py + 4, 12, 4)
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      ctx.fillRect(px + 12, py + 10, 3, 12)
      break
    }
    case 'rug': {
      ctx.fillStyle = '#7a2e2e'
      ctx.fillRect(px + 4, py + 4, 88, 56)
      ctx.fillStyle = '#c9a227'
      ctx.strokeStyle = '#c9a227'
      ctx.lineWidth = 2
      ctx.strokeRect(px + 10, py + 10, 76, 44)
      ctx.beginPath()
      ctx.moveTo(px + 48, py + 18)
      ctx.lineTo(px + 62, py + 32)
      ctx.lineTo(px + 48, py + 46)
      ctx.lineTo(px + 34, py + 32)
      ctx.closePath()
      ctx.stroke()
      break
    }
    case 'barrel': {
      ctx.fillStyle = '#7a5230'
      ctx.beginPath()
      ctx.ellipse(px + 16, py + 18, 11, 13, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#5a3a1e'
      ctx.fillRect(px + 5, py + 12, 22, 3)
      ctx.fillRect(px + 5, py + 22, 22, 3)
      break
    }
    case 'shield': {
      ctx.fillStyle = '#8b1a1a'
      ctx.beginPath()
      ctx.ellipse(px + 16, py + 14, 10, 14, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#c9a227'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = '#c9a227'
      ctx.beginPath()
      ctx.arc(px + 16, py + 14, 3, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'sacks': {
      ctx.fillStyle = '#c9b48a'
      ctx.beginPath()
      ctx.ellipse(px + 11, py + 22, 9, 8, 0, 0, Math.PI * 2)
      ctx.ellipse(px + 23, py + 22, 9, 8, 0, 0, Math.PI * 2)
      ctx.ellipse(px + 17, py + 12, 9, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#8a7452'
      ctx.lineWidth = 1
      ctx.stroke()
      break
    }
    case 'scale': {
      ctx.strokeStyle = '#c9a227'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(px + 16, py + 6)
      ctx.lineTo(px + 16, py + 28)
      ctx.moveTo(px + 4, py + 10)
      ctx.lineTo(px + 28, py + 10)
      ctx.moveTo(px + 4, py + 10)
      ctx.lineTo(px + 4, py + 20)
      ctx.moveTo(px + 28, py + 10)
      ctx.lineTo(px + 28, py + 20)
      ctx.stroke()
      ctx.fillStyle = '#c9a227'
      ctx.fillRect(px - 2, py + 20, 12, 2)
      ctx.fillRect(px + 22, py + 20, 12, 2)
      ctx.fillRect(px + 10, py + 28, 12, 3)
      break
    }
    case 'shelf': {
      ctx.fillStyle = '#5a3a1e'
      ctx.fillRect(px + 2, py + 2, 60, 28)
      ctx.fillStyle = '#8a5a30'
      ctx.fillRect(px + 4, py + 12, 56, 3)
      ctx.fillRect(px + 4, py + 24, 56, 3)
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = ['#9a5a30', '#c07a48', '#6a4a2a', '#9a5a30', '#c07a48'][i]
        ctx.fillRect(px + 6 + i * 11, py + 4, 8, 8)
        ctx.fillStyle = '#e9d3a4'
        ctx.fillRect(px + 6 + i * 11, py + 16, 8, 8)
      }
      break
    }
    case 'well': {
      ctx.fillStyle = '#7a7a72'
      ctx.beginPath()
      ctx.ellipse(px + 16, py + 20, 14, 9, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#2a3a5a'
      ctx.beginPath()
      ctx.ellipse(px + 16, py + 19, 9, 5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#5a3a1e'
      ctx.fillRect(px + 4, py + 2, 3, 18)
      ctx.fillRect(px + 25, py + 2, 3, 18)
      ctx.fillRect(px + 2, py, 28, 3)
      break
    }
    case 'milestone': {
      ctx.fillStyle = '#cfc7b6'
      ctx.beginPath()
      ctx.roundRect(px + 9, py + 2, 14, 28, 6)
      ctx.fill()
      ctx.fillStyle = '#8a8070'
      ctx.font = '7px sans-serif'
      ctx.fillText('IMP', px + 10, py + 12)
      ctx.fillText('CAES', px + 9, py + 20)
      break
    }
    case 'cart': {
      ctx.fillStyle = '#7a5230'
      ctx.fillRect(px + 8, py + 6, 48, 14)
      ctx.fillStyle = '#c9b48a'
      ctx.fillRect(px + 12, py + 2, 40, 8)
      ctx.fillStyle = '#3a2e1e'
      ctx.beginPath()
      ctx.arc(px + 18, py + 22, 7, 0, Math.PI * 2)
      ctx.arc(px + 46, py + 22, 7, 0, Math.PI * 2)
      ctx.fill()
      break
    }
  }
  ctx.restore()
  void T
}
