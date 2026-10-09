import { useEffect, useState } from 'preact/hooks'
import type { ComponentChildren } from 'preact'
import { assetUrl, img } from '../engine/assets'

type Props = {
  lines: string[]
  onDone: () => void
  children?: ComponentChildren
  onIndex?: (i: number) => void
  autoDone?: boolean
}

export function TextBox({ lines, onDone, children, onIndex, autoDone = true }: Props) {
  const [i, setI] = useState(0)
  const last = i >= lines.length - 1
  useEffect(() => onIndex?.(i), [i])

  const advance = () => {
    if (last) {
      if (autoDone) onDone()
      return
    }
    setI(i + 1)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        advance()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (last) onDone()
        else setI(i + 1)
      } else if (e.key === 'Backspace' && i > 0) {
        e.preventDefault()
        setI(i - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div class="textbox" style={{ backgroundImage: `url(${assetUrl(img.textbox)})` }} onClick={advance}>
      <img class="press-space" src={assetUrl(last ? img.afterPressSpace : img.pressSpace)} alt="" />
      <div class="textbox-text">{lines[i]}</div>
      {children}
      {last && (
        <button
          class="enter-btn"
          onClick={(e) => {
            e.stopPropagation()
            onDone()
          }}
        >
          Enter ↵
        </button>
      )}
    </div>
  )
}
