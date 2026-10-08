export type Text = { en: string; de: string }
export type Lang = keyof Text

export type Coin = {
  id: string
  ocre: string
  ric: string
  authority: string
  portrait: string
  denomination: string
  material: 'av' | 'ar' | 'ae'
  mint: string
  start: number
  end: number
  obvLegend: string
  obvDescription: string
  revLegend: string
  revDescription: string
  specimen: string
  weight?: number
  diameter?: number
  chapter: number
}

export type Entity = { id: string; en: string; de: string; lat?: number; long?: number }

export type Dataset = {
  coins: Coin[]
  authorities: Record<string, Entity>
  denominations: Record<string, Entity>
  mints: Record<string, Entity>
  materials: Record<string, Entity>
}
