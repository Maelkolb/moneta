import { useEffect, useState } from 'preact/hooks'
import type { ComponentChildren } from 'preact'
import { STAGE_H, STAGE_W } from '../engine/sites'

export function Stage({ children }: { children: ComponentChildren }) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const fit = () => {
      const s = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H, 1.4)
      setScale(Math.max(0.3, s))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return (
    <div class="stage-outer" style={{ width: STAGE_W * scale, height: STAGE_H * scale }}>
      <div class="stage" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  )
}
