const base = `${import.meta.env.BASE_URL}assets/`

export const img = {
  border: 'img/Border_tile.png',
  ground: 'img/Ground_tile.png',
  grass: 'img/Gras_tile1.png',
  earth: 'img/Earth_tile.png',
  path: 'img/Path_tile.png',
  straw: 'img/Straw_tile.jpg',
  water: 'img/Water_tile.png',
  tree: 'img/Tree.png',
  tent1: 'img/Tent1.png',
  tent2: 'img/Tent2.png',
  tent3: 'img/Tent3.png',
  tent4: 'img/Tent4.png',
  statue: 'img/Statue_godess.png',
  gwen: 'img/Gwen_npc.png',
  gwenPortrait: 'img/Character1.png',
  gwenClose: 'img/Character1_tuto.png',
  playerDown: 'img/player_sprite_down.png',
  playerUp: 'img/player_sprite_up.png',
  textbox: 'img/textbox.png',
  pressSpace: 'img/press_space.png',
  afterPressSpace: 'img/after_press_space.png',
  background: 'img/background_img.jpg',
  title: 'img/title_screen.jpg',
  book: 'img/book_icon.png',
  gem: 'img/gemstone.png',
  trophy: 'img/golden_trophy.png',
  coinFound: 'img/coin_found_text.png',
  tentFloor: 'img/Tent_floor.png',
  npc_elder_down: 'img/npc_elder_down.png', npc_elder_up: 'img/npc_elder_up.png',
  npc_smith_down: 'img/npc_smith_down.png', npc_smith_up: 'img/npc_smith_up.png',
  npc_trader_down: 'img/npc_trader_down.png', npc_trader_up: 'img/npc_trader_up.png',
  npc_seer_down: 'img/npc_seer_down.png', npc_seer_up: 'img/npc_seer_up.png',
  npc_child_down: 'img/npc_child_down.png', npc_child_up: 'img/npc_child_up.png',
  npc_farmer_down: 'img/npc_farmer_down.png', npc_farmer_up: 'img/npc_farmer_up.png',
  npc_warrior_down: 'img/npc_warrior_down.png', npc_warrior_up: 'img/npc_warrior_up.png',
  npc_legion_down: 'img/npc_legion_down.png', npc_legion_up: 'img/npc_legion_up.png',
  npc_woman_down: 'img/npc_woman_down.png', npc_woman_up: 'img/npc_woman_up.png',
  npc_monk_down: 'img/npc_monk_down.png', npc_monk_up: 'img/npc_monk_up.png',
} as const

export type ImageKey = keyof typeof img

export function assetUrl(path: string): string {
  return base + path
}

const cache = new Map<string, HTMLImageElement>()

export function loadImage(key: ImageKey): Promise<HTMLImageElement> {
  const url = assetUrl(img[key])
  const cached = cache.get(url)
  if (cached && cached.complete) return Promise.resolve(cached)
  return new Promise((resolve, reject) => {
    const el = new Image()
    el.onload = () => resolve(el)
    el.onerror = reject
    el.src = url
    cache.set(url, el)
  })
}

export async function loadImages(keys: ImageKey[]): Promise<Record<ImageKey, HTMLImageElement>> {
  const out = {} as Record<ImageKey, HTMLImageElement>
  await Promise.all(keys.map(async (k) => (out[k] = await loadImage(k))))
  return out
}
