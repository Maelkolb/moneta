export function Legend({ text, highlight }: { text: string; highlight?: string }) {
  if (!text) return <div class="legend-line dim">—</div>
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
