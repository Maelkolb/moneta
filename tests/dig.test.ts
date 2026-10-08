import { describe, expect, it } from 'vitest'
import { coinsLeft, dig, isBlocked, move, newField, signal, stepToward, FIELD_H, FIELD_W, type Field } from '../src/game/dig'

describe('dig field', () => {
  it('buries coins and junk away from the start', () => {
    const f = newField(7, 3)
    expect(f.buried.filter((b) => b.kind === 'coin').length).toBe(3)
    expect(f.buried.filter((b) => b.kind === 'junk').length).toBe(3)
    for (const b of f.buried) {
      expect(Math.abs(b.x - f.player.x) + Math.abs(b.y - f.player.y)).toBeGreaterThan(2)
      expect(isBlocked(f, b)).toBe(false)
    }
  })

  it('is deterministic for a seed', () => {
    expect(newField(99, 3)).toEqual(newField(99, 3))
    expect(newField(99, 3)).not.toEqual(newField(100, 3))
  })

  it('blocks walls and obstacles', () => {
    let f = newField(1, 3)
    f = { ...f, player: { x: 0, y: 0 } }
    expect(move(f, -1, 0)).toBe(f)
    expect(move(f, 0, -1)).toBe(f)
    const o = f.obstacles[0]
    const beside = { ...f, player: { x: o.x - 1, y: o.y } }
    if (!isBlocked(f, beside.player)) expect(move(beside, 1, 0)).toBe(beside)
  })

  it('signal rises as the player approaches a coin', () => {
    const f = newField(3, 1)
    const coin = f.buried.find((b) => b.kind === 'coin')!
    const far = { ...f, player: { x: coin.x > FIELD_W / 2 ? 0 : FIELD_W - 1, y: coin.y > FIELD_H / 2 ? 0 : FIELD_H - 1 } }
    const near = { ...f, player: { x: coin.x, y: coin.y } }
    expect(signal(near)).toBe(1)
    expect(signal(far)).toBeLessThan(signal(near))
  })

  it('digging on a coin finds it and digging elsewhere leaves a hole', () => {
    const f = newField(5, 2)
    const coin = f.buried.find((b) => b.kind === 'coin')!
    const r = dig({ ...f, player: { x: coin.x, y: coin.y } })
    expect(r.found?.kind).toBe('coin')
    expect(coinsLeft(r.field)).toBe(1)
    expect(r.field.daylight).toBe(f.daylight - 1)
    const empty = dig({ ...f, player: { x: f.player.x, y: f.player.y } })
    expect(empty.found).toBeUndefined()
    expect(empty.field.holes.length).toBe(1)
  })

  it('walks toward a target', () => {
    const f = newField(11, 1)
    let cur: Field = { ...f, obstacles: [] }
    const target = { x: 2, y: 1 }
    for (let i = 0; i < 40; i++) cur = stepToward(cur, target)
    expect(cur.player).toEqual(target)
  })
})
