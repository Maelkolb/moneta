import raw from './coins.json'
import type { Coin, Dataset, Entity } from './types'

type Stored = {
  coins: Coin[]
  authorities: Record<string, Entity>
  denominations: Record<string, Entity>
  mints: Record<string, Entity>
  portraitCoin: Record<string, string>
}

const stored = raw as unknown as Stored

export const data: Dataset = {
  coins: stored.coins,
  authorities: stored.authorities,
  denominations: stored.denominations,
  mints: stored.mints,
  materials: {
    av: { id: 'av', en: 'Gold', de: 'Gold' },
    ar: { id: 'ar', en: 'Silver', de: 'Silber' },
    ae: { id: 'ae', en: 'Bronze', de: 'Bronze' },
  },
}

export const portraitCoin = stored.portraitCoin

const byId = new Map(stored.coins.map((c) => [c.id, c]))

export function coinById(id: string): Coin | undefined {
  return byId.get(id)
}

export function coinsOfChapter(n: number): Coin[] {
  return stored.coins.filter((c) => c.chapter === n)
}

export function coinImage(coin: Coin | string, side: 'obv' | 'rev'): string {
  const id = typeof coin === 'string' ? coin : coin.id
  return `${import.meta.env.BASE_URL}coins/${id}.${side}.webp`
}

export function ocreUrl(coin: Coin): string {
  return `https://numismatics.org/ocre/id/${coin.ocre}`
}

export function ansUrl(coin: Coin): string {
  return `https://numismatics.org/collection/${coin.specimen}`
}
