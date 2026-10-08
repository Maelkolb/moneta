import { useEffect, useState } from 'preact/hooks'
import type { Text } from '../data/types'
import { t, tx } from '../state'
import { GwenPortrait } from './art'

export function Dialogue({ lines, onDone, doneLabel, skippable = true }: { lines: Text[]; onDone: () => void; doneLabel?: string; skippable?: boolean }) {
  const [i, setI] = useState(0)
  const last = i >= lines.length - 1

  const advance = () => {
    if (last) onDone()
    else setI(i + 1)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        advance()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div class="dialogue" onClick={advance}>
      <div class="portrait">
        <GwenPortrait />
      </div>
      <div>
        <div class="speaker">Gwen</div>
        <div class="line">{tx(lines[i])}</div>
        <div class="controls" onClick={(e) => e.stopPropagation()}>
          {i > 0 && (
            <button class="btn quiet" onClick={() => setI(i - 1)}>
              {t('back')}
            </button>
          )}
          <button class={`btn ${last ? 'primary' : ''}`} onClick={advance}>
            {last ? doneLabel ?? t('next') : t('next')}
          </button>
          {skippable && !last && (
            <button class="btn quiet" onClick={onDone}>
              {t('skip')}
            </button>
          )}
          <div class="dots">
            {lines.map((_, k) => (
              <i class={k <= i ? 'on' : ''} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
