import { describe, expect, it } from 'vitest'
import { data } from '../src/data'
import { chapters } from '../src/data/chapters'
import { findLegendTokens, formatRange, mulberry32, questionFor, recordSheet, scoreAnswer } from '../src/game/questions'

const rng = () => mulberry32(42)

describe('dataset', () => {
  it('has coins for every ruler of every chapter', () => {
    for (const ch of chapters) {
      for (const r of ch.rulers) {
        const own = data.coins.filter((c) => c.portrait === r.id)
        expect(own.length, `${r.id} has coins`).toBeGreaterThan(0)
        for (const c of own) expect(c.chapter).toBe(ch.number)
      }
    }
  })

  it('has complete records', () => {
    for (const c of data.coins) {
      expect(c.obvLegend.length).toBeGreaterThan(0)
      expect(c.obvDescription.length).toBeGreaterThan(0)
      expect(c.revDescription.length).toBeGreaterThan(0)
      expect(c.end).toBeGreaterThanOrEqual(c.start)
      expect(data.mints[c.mint]).toBeDefined()
      expect(data.mints[c.mint].lat).toBeDefined()
      expect(data.denominations[c.denomination]).toBeDefined()
      expect(['av', 'ar', 'ae']).toContain(c.material)
    }
  })
})

describe('questions', () => {
  it('builds a record sheet with one answerable question per skill', () => {
    const coin = data.coins.find((c) => c.portrait === 'trajan')!
    const sheet = recordSheet(coin, ['metal', 'denomination', 'ruler', 'legend', 'reverse', 'date', 'mint'], data, 'en', rng())
    expect(sheet.length).toBeGreaterThanOrEqual(6)
    for (const q of sheet) {
      expect(q.options.some((o) => o.id === q.answer), `${q.skill} answer present`).toBe(true)
      expect(new Set(q.options.map((o) => o.id)).size).toBe(q.options.length)
      expect(q.options.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('offers four distinct options for every coin and skill', () => {
    const r = rng()
    for (const coin of data.coins) {
      for (const skill of ['denomination', 'ruler', 'reverse', 'date', 'mint'] as const) {
        const q = questionFor(skill, coin, data, 'de', r)!
        expect(q.options.length, `${coin.id} ${skill}`).toBe(4)
        expect(q.options.filter((o) => o.id === q.answer).length).toBe(1)
        expect(new Set(q.options.map((o) => o.label)).size, `${coin.id} ${skill} labels distinct`).toBe(4)
      }
    }
  })

  it('finds legend abbreviations', () => {
    const tokens = findLegendTokens('IMP CAES NERVA TRAIAN AVG GERM DAC P M TR P COS V P P')
    const abbrs = tokens.map((t) => t.abbr)
    expect(abbrs).toContain('IMP')
    expect(abbrs).toContain('TR P')
    expect(abbrs).toContain('COS')
    expect(abbrs).toContain('DAC')
    expect(abbrs).not.toContain('AVGG')
  })

  it('most coins yield a legend question', () => {
    const r = rng()
    const withLegend = data.coins.filter((c) => questionFor('legend', c, data, 'en', r))
    expect(withLegend.length / data.coins.length).toBeGreaterThan(0.85)
  })

  it('formats dates', () => {
    expect(formatRange(-2, 4, 'en')).toBe('2 BC – AD 4')
    expect(formatRange(98, 117, 'en')).toBe('AD 98–117')
    expect(formatRange(98, 117, 'de')).toBe('98–117 n. Chr.')
    expect(formatRange(-27, -27, 'de')).toBe('27 v. Chr.')
  })

  it('scores answers', () => {
    expect(scoreAnswer(1, false)).toBe(20)
    expect(scoreAnswer(1, true)).toBe(10)
    expect(scoreAnswer(2, false)).toBe(10)
    expect(scoreAnswer(3, false)).toBe(0)
  })
})
