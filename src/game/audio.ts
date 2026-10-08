let ctx: AudioContext | undefined

function audio(): AudioContext | undefined {
  if (typeof window === 'undefined') return undefined
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return undefined
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function beep(freq: number, duration = 0.08, gain = 0.08, type: OscillatorType = 'sine') {
  const c = audio()
  if (!c) return
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(gain, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration)
  osc.connect(g).connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + duration)
}

export function thud() {
  const c = audio()
  if (!c) return
  const buffer = c.createBuffer(1, c.sampleRate * 0.12, c.sampleRate)
  const d = buffer.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 2
  const src = c.createBufferSource()
  src.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 300
  const g = c.createGain()
  g.gain.value = 0.5
  src.connect(filter).connect(g).connect(c.destination)
  src.start()
}

export function chime() {
  beep(880, 0.25, 0.08)
  setTimeout(() => beep(1175, 0.3, 0.08), 90)
  setTimeout(() => beep(1568, 0.5, 0.08), 180)
}

export function good() {
  beep(660, 0.12, 0.06)
  setTimeout(() => beep(990, 0.18, 0.06), 80)
}

export function bad() {
  beep(220, 0.2, 0.07, 'triangle')
}

export function flip() {
  beep(300, 0.05, 0.03, 'triangle')
}
