import { useState } from 'preact/hooks'
import type { Coin } from '../data/types'
import { coinImage } from '../data'
import { t } from '../state'

export function CoinSides({ coin, highlight, showLegends }: { coin: Coin; highlight?: string; showLegends?: boolean }) {
  const [zoom, setZoom] = useState<'obv' | 'rev' | null>(null)
  return (
    <div>
      <div class="coin-sides">
        <figure>
          <img src={coinImage(coin, 'obv')} alt={coin.obvDescription} onClick={() => setZoom('obv')} />
          <figcaption>{t('obverse')}</figcaption>
          {showLegends && <Legend text={coin.obvLegend} highlight={highlight} />}
        </figure>
        <figure>
          <img src={coinImage(coin, 'rev')} alt={coin.revDescription} onClick={() => setZoom('rev')} />
          <figcaption>{t('reverse')}</figcaption>
          {showLegends && <Legend text={coin.revLegend} highlight={highlight} />}
        </figure>
      </div>
      {zoom && (
        <div class="zoom-back" onClick={() => setZoom(null)}>
          <img src={coinImage(coin, zoom)} alt="" />
        </div>
      )}
    </div>
  )
}

export function Legend({ text, highlight }: { text: string; highlight?: string }) {
  if (!text) return <div class="legend-line muted">—</div>
  if (!highlight) return <div class="legend-line">{text}</div>
  const pattern = new RegExp(`(^|[^A-Z])(${highlight.replace(/ /g, '\\s?')})(?=$|[^A-Z])`)
  const m = text.match(pattern)
  if (!m || m.index === undefined) return <div class="legend-line">{text}</div>
  const start = m.index + m[1].length
  const end = start + m[2].length
  return (
    <div class="legend-line">
      {text.slice(0, start)}
      <mark>{text.slice(start, end)}</mark>
      {text.slice(end)}
    </div>
  )
}
