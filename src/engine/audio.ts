import { assetUrl } from './assets'
import { save } from '../state'

type Track = 'town' | 'battle'

const files: Record<Track, string> = {
  town: 'sound/town_theme.ogg',
  battle: 'sound/battle_theme.ogg',
}

const players = new Map<Track, HTMLAudioElement>()
let current: Track | null = null
let unlocked = false

function player(track: Track): HTMLAudioElement {
  let p = players.get(track)
  if (!p) {
    p = new Audio(assetUrl(files[track]))
    p.loop = true
    p.volume = track === 'battle' ? 0.35 : 0.5
    players.set(track, p)
  }
  return p
}

export function unlockAudio() {
  unlocked = true
  if (current) void play(current)
}

export async function play(track: Track) {
  current = track
  if (!unlocked || !save.value.sound) return
  for (const [t, p] of players) if (t !== track && !p.paused) fade(p)
  const p = player(track)
  if (!p.paused) return
  p.volume = track === 'battle' ? 0.35 : 0.5
  try {
    await p.play()
  } catch {}
}

export function stopMusic() {
  current = null
  for (const p of players.values()) if (!p.paused) fade(p)
}

function fade(p: HTMLAudioElement) {
  const start = p.volume
  let step = 0
  const id = setInterval(() => {
    step++
    p.volume = Math.max(0, start * (1 - step / 12))
    if (step >= 12) {
      clearInterval(id)
      p.pause()
      p.currentTime = 0
    }
  }, 80)
}

export function applySoundSetting() {
  if (!save.value.sound) {
    for (const p of players.values()) p.pause()
  } else if (current) {
    void play(current)
  }
}

let flipSound: HTMLAudioElement | undefined
export function pageFlip() {
  if (!save.value.sound) return
  if (!flipSound) flipSound = new Audio(assetUrl('sound/flippingPage.mp3'))
  flipSound.currentTime = 0
  flipSound.volume = 0.6
  void flipSound.play().catch(() => {})
}

let ctx: AudioContext | undefined
function audioCtx() {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return undefined
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function tone(freq: number, duration = 0.1, gain = 0.06, type: OscillatorType = 'sine') {
  if (!save.value.sound) return
  const c = audioCtx()
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

export function sfxFound() {
  tone(880, 0.2)
  setTimeout(() => tone(1175, 0.25), 90)
  setTimeout(() => tone(1568, 0.45), 180)
}

export function sfxGood() {
  tone(660, 0.1)
  setTimeout(() => tone(990, 0.16), 80)
}

export function sfxBad() {
  tone(220, 0.2, 0.06, 'triangle')
}
