import { useEffect, useMemo, useState } from 'preact/hooks'
import type { ComponentChildren } from 'preact'
import { chapters, rulerById, type Ruler } from '../data/chapters'
import { denominations, materialNames } from '../data/denominations'
import { glossary, personifications } from '../data/glossary'
import { mintMarks } from '../data/mintmarks'
import mapData from '../data/map.json'
import { ansUrl, coinById, coinImage, data, ocreUrl, portraitCoin } from '../data'
import type { Coin } from '../data/types'
import { pageFlip } from '../engine/audio'
import { formatRange } from '../game/questions'
import { bookOpen, bookTab, lang, save, t, tx } from '../state'

type Page = { tab: string; render: () => ComponentChildren }

export function Book() {
  const l = lang.value
  const [detail, setDetail] = useState<Coin | null>(null)
  const pages = useMemo(() => buildPages(l, setDetail), [l, save.value.cabinet.length])
  const spreads = Math.ceil(pages.length / 2)
  const firstOfTab = (tab: string) => Math.floor(Math.max(0, pages.findIndex((p) => p.tab === tab)) / 2)
  const [spread, setSpread] = useState(() => firstOfTab(bookTab.value))

  const flip = (delta: number) => {
    const next = Math.max(0, Math.min(spreads - 1, spread + delta))
    if (next === spread) return
    pageFlip()
    setSpread(next)
    setDetail(null)
  }
  const jump = (tab: string) => {
    pageFlip()
    bookTab.value = tab
    setSpread(firstOfTab(tab))
    setDetail(null)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') flip(1)
      else if (e.key === 'ArrowLeft') flip(-1)
      else return
      e.preventDefault()
      e.stopPropagation()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [spread, spreads])

  const left = pages[spread * 2]
  const right = pages[spread * 2 + 1]
  const tabs: [string, string][] = [
    ['rulers', t('codexRulers')],
    ['denominations', t('codexDenominations')],
    ['glossary', t('codexGlossary')],
    ['reverses', t('codexReverses')],
    ['mints', t('codexMints')],
    ['timeline', t('codexTimeline')],
    ['collection', t('cabinet')],
  ]

  return (
    <div class="book-back" onClick={() => (bookOpen.value = false)}>
      <div class="book" onClick={(e) => e.stopPropagation()}>
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />
        <div class="page left">
          {detail ? <CoinDetail coin={detail} onClose={() => setDetail(null)} /> : left?.render()}
          <span class="page-num">{spread * 2 + 1}</span>
        </div>
        <div class="spine">
          {[0, 1, 2, 3, 4].map(() => (
            <i />
          ))}
        </div>
        <div class="page right">
          {right?.render()}
          <span class="page-num">{spread * 2 + 2}</span>
        </div>
        <button class="flip prev" onClick={() => flip(-1)} disabled={spread === 0} aria-label="previous">
          ‹
        </button>
        <button class="flip next" onClick={() => flip(1)} disabled={spread >= spreads - 1} aria-label="next">
          ›
        </button>
        <div class="book-tabs">
          {tabs.map(([key, label]) => (
            <button class={left?.tab === key || right?.tab === key ? 'active' : ''} onClick={() => jump(key)}>
              {label}
            </button>
          ))}
          <button class="close" onClick={() => (bookOpen.value = false)}>
            {t('close')} [B]
          </button>
        </div>
      </div>
    </div>
  )
}

function Corner({ pos }: { pos: string }) {
  return (
    <svg class={`corner ${pos}`} viewBox="0 0 60 60" aria-hidden="true">
      <path d="M2 58 L2 2 L58 2 L58 12 L14 12 L14 58 Z" fill="#9a9a9a" stroke="#4a4a4a" stroke-width="2" />
      <path d="M8 52 L8 8 L52 8" fill="none" stroke="#d8d8d8" stroke-width="2" />
      <circle cx="12" cy="12" r="3" fill="#3a3a3a" />
    </svg>
  )
}

function buildPages(l: 'en' | 'de', open: (c: Coin) => void): Page[] {
  const pages: Page[] = []
  const rulers = chapters.flatMap((c) => c.rulers.map((r) => ({ r, c })))
  for (let i = 0; i < rulers.length; i += 4) {
    const group = rulers.slice(i, i + 4)
    pages.push({
      tab: 'rulers',
      render: () => (
        <div>
          {i === 0 && <h2 class="page-title">{l === 'de' ? 'Avers – Kaiserporträts' : 'Obverse – Imperial portraits'}</h2>}
          {i !== 0 && group[0].c !== rulers[i - 1].c && <h2 class="page-title small">{tx(group[0].c.title)}</h2>}
          {i === 0 && <div class="page-sub">{tx(group[0].c.title)}</div>}
          <div class="portrait-grid">
            {group.map(({ r }) => (
              <RulerFigure ruler={r} onOpen={open} />
            ))}
          </div>
        </div>
      ),
    })
  }
  if (pages.length % 2) pages.push({ tab: 'rulers', render: () => <div /> })

  const example = (id: string) => data.coins.find((c) => c.denomination === id)
  const ordered = (['av', 'ar', 'ae'] as const).flatMap((m) => denominations.filter((d) => d.metal === m))
  for (let i = 0; i < ordered.length; i += 4) {
    const group = ordered.slice(i, i + 4)
    pages.push({
      tab: 'denominations',
      render: () => (
        <div>
          {i === 0 ? <h2 class="page-title">{l === 'de' ? 'Nominale' : 'Denominations'}</h2> : <h2 class="page-title small">{materialNames[group[0].metal][l]}</h2>}
          {i === 0 && <div class="page-sub">1 Aureus = 25 Denarii = 100 Sestertii = 400 Asses</div>}
          <div class="denom-list">
            {group.map((d) => {
              const ex = example(d.id)
              return (
                <div class="denom-row">
                  {ex ? <img src={coinImage(ex, 'obv')} alt="" onClick={() => open(ex)} /> : <span class="no-img" />}
                  <div>
                    <b>{d.name[l]}</b> <span class="dim">{d.value[l]}</span>
                    <div class="dim small">
                      {materialNames[d.metal][l]}; {d.period[l]}; {d.size}
                    </div>
                    <div class="small">{d.note[l]}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ),
    })
  }
  pages.push({
    tab: 'denominations',
    render: () => (
      <div>
        <h2 class="page-title">{l === 'de' ? 'Aufbau einer Münze' : 'Anatomy of a coin'}</h2>
        <div class="small book-text">
          {l === 'de'
            ? 'Avers: Vorderseite mit dem Porträt und der Legende, den abgekürzten Titeln des Kaisers. Revers: Rückseite mit Gottheit, Personifikation, Sieg oder Bauwerk und eigener Legende. Abschnitt (Exergue): das Feld unter der Reversfigur; ab Diokletian steht hier das Münzzeichen. Lies Legenden im Uhrzeigersinn, V steht für U, Wörter laufen ohne Abstand ineinander.'
            : 'Obverse: the front with the portrait and the legend, the emperor’s abbreviated titles. Reverse: the back with a deity, a personification, a victory or a building and its own legend. Exergue: the segment under the reverse figure; from Diocletian on it carries the mint mark. Read legends clockwise, V stands for U, words run together without spaces.'}
        </div>
        <div class="book-text small" style="margin-top:10px">
          <b>IMP CAES NERVA TRAIAN AVG GERM DAC P M TR P COS V P P</b>
          <br />
          {l === 'de'
            ? 'Imperator Caesar Nerva Traianus Augustus Germanicus Dacicus, Pontifex Maximus, tribunizische Gewalt, zum fünften Mal Konsul, Vater des Vaterlandes. Trajan war 103–111 zum fünften Mal Konsul.'
            : 'Imperator Caesar Nerva Traianus Augustus Germanicus Dacicus, Pontifex Maximus, tribunician power, consul for the fifth time, father of the fatherland. Trajan was consul for the fifth time in 103–111.'}
        </div>
      </div>
    ),
  })

  const perPage = 8
  for (let i = 0; i < glossary.length; i += perPage) {
    const group = glossary.slice(i, i + perPage)
    pages.push({
      tab: 'glossary',
      render: () => (
        <div>
          {i === 0 && <h2 class="page-title">{l === 'de' ? 'Legenden' : 'Legends'}</h2>}
          <div class="gloss-list">
            {group.map((g) => (
              <div class="gloss-row">
                <b>{g.abbr}</b>
                <i>{g.latin}</i>
                <span class="small">{g.meaning[l]}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    })
  }
  if (pages.length % 2) pages.push({ tab: 'glossary', render: () => <div /> })

  const exampleRev = (name: string) => {
    const key = name.split(' ')[0].toLowerCase()
    return data.coins.find((c) => c.revDescription.toLowerCase().includes(key))
  }
  for (let i = 0; i < personifications.length; i += 6) {
    const group = personifications.slice(i, i + 6)
    pages.push({
      tab: 'reverses',
      render: () => (
        <div>
          {i === 0 && <h2 class="page-title">{l === 'de' ? 'Revers – Rückseiten' : 'Reverse types'}</h2>}
          <div class="denom-list">
            {group.map((p) => {
              const ex = exampleRev(p.name)
              return (
                <div class="denom-row">
                  {ex ? <img src={coinImage(ex, 'rev')} alt="" onClick={() => open(ex)} /> : <span class="no-img" />}
                  <div>
                    <b>{p.name}</b>
                    <div class="small">{p.attribute[l]}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ),
    })
  }
  if (pages.length % 2) pages.push({ tab: 'reverses', render: () => <div /> })

  pages.push({ tab: 'mints', render: () => <MintMap l={l} half="west" /> })
  pages.push({ tab: 'mints', render: () => <MintMap l={l} half="east" /> })
  pages.push({
    tab: 'mints',
    render: () => (
      <div>
        <h2 class="page-title">{l === 'de' ? 'Münzzeichen' : 'Mint marks'}</h2>
        <div class="mark-list">
          {mintMarks
            .filter((m) => data.mints[m.mint])
            .map((m) => (
              <div class="mark-row">
                <b>{data.mints[m.mint][l]}</b>
                <span class="marks">{m.marks.slice(0, 5).join(' ')}</span>
                <span class="dim small">{m.active}</span>
              </div>
            ))}
        </div>
      </div>
    ),
  })

  if (pages.length % 2) pages.push({ tab: 'mints', render: () => <div /> })
  pages.push({
    tab: 'timeline',
    render: () => (
      <div>
        <h2 class="page-title">{l === 'de' ? 'Zeitleiste' : 'Timeline'}</h2>
        <div class="tl-list">
          {chapters.slice(0, 4).map((c) => (
            <div class="tl-chapter">
              <b>
                {c.number}. {tx(c.title)}
              </b>{' '}
              <span class="dim">{tx(c.period)}</span>
              <div class="small">{c.rulers.map((r) => `${r.name[l]} (${r.reign})`).join(', ')}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  })
  pages.push({
    tab: 'timeline',
    render: () => (
      <div>
        <div class="tl-list" style="margin-top:34px">
          {chapters.slice(4).map((c) => (
            <div class="tl-chapter">
              <b>
                {c.number}. {tx(c.title)}
              </b>{' '}
              <span class="dim">{tx(c.period)}</span>
              <div class="small">{c.rulers.map((r) => `${r.name[l]} (${r.reign})`).join(', ')}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  })

  const cabinet = [...save.value.cabinet].reverse()
  if (!cabinet.length) {
    pages.push({ tab: 'collection', render: () => <div><h2 class="page-title">{t('cabinet')}</h2><div class="book-text">{t('cabinetEmpty')}</div></div> })
    pages.push({ tab: 'collection', render: () => <CabinetStats /> })
  } else {
    for (let i = 0; i < cabinet.length; i += 4) {
      const group = cabinet.slice(i, i + 4)
      pages.push({
        tab: 'collection',
        render: () => (
          <div>
            {i === 0 && <h2 class="page-title">{t('cabinet')}</h2>}
            <div class="portrait-grid">
              {group.map((e) => {
                const c = coinById(e.coin)
                if (!c) return null
                return (
                  <figure onClick={() => open(c)}>
                    <img src={coinImage(c, 'obv')} alt="" />
                    <figcaption>
                      {rulerById(c.portrait)?.name[l] ?? c.portrait}
                      <small>{data.denominations[c.denomination]?.[l]}</small>
                    </figcaption>
                  </figure>
                )
              })}
            </div>
          </div>
        ),
      })
    }
    pages.push({ tab: 'collection', render: () => <CabinetStats /> })
    if (pages.length % 2) pages.push({ tab: 'collection', render: () => <div /> })
  }
  return pages
}

function RulerFigure({ ruler, onOpen }: { ruler: Ruler; onOpen: (c: Coin) => void }) {
  const pc = portraitCoin[ruler.id]
  const coin = pc ? coinById(pc) : undefined
  return (
    <figure onClick={() => coin && onOpen(coin)} title={tx(ruler.note)}>
      {pc ? <img src={coinImage(pc, 'obv')} alt={ruler.name.en} /> : <span class="no-img" />}
      <figcaption>
        {tx(ruler.name)}
        <small>{ruler.reign}</small>
      </figcaption>
    </figure>
  )
}

function CoinDetail({ coin, onClose }: { coin: Coin; onClose: () => void }) {
  const l = lang.value
  const ruler = rulerById(coin.portrait)
  return (
    <div class="coin-detail">
      <button class="detail-close" onClick={onClose}>
        ‹ {t('back')}
      </button>
      <div class="detail-images">
        <img src={coinImage(coin, 'obv')} alt="" />
        <img src={coinImage(coin, 'rev')} alt="" />
      </div>
      <div class="detail-ric">{coin.ric}</div>
      <table class="result-table small">
<tbody>
        <tr>
          <th>{t('ruler')}</th>
          <td>
            {ruler?.name[l] ?? coin.portrait} {ruler && <span class="dim">({ruler.reign})</span>}
          </td>
        </tr>
        <tr>
          <th>{t('denomination')}</th>
          <td>
            {data.denominations[coin.denomination]?.[l]}, {data.materials[coin.material][l].toLowerCase()}
          </td>
        </tr>
        <tr>
          <th>{t('mint')}</th>
          <td>{data.mints[coin.mint]?.[l]}</td>
        </tr>
        <tr>
          <th>{t('date')}</th>
          <td>{formatRange(coin.start, coin.end, l)}</td>
        </tr>
        <tr>
          <th>{t('legend')}</th>
          <td>
            {coin.obvLegend} / {coin.revLegend || '—'}
          </td>
        </tr>
        <tr>
          <th>{t('reverse')}</th>
          <td>{coin.revDescription}</td>
        </tr>
      </tbody>
</table>
      <div class="detail-links">
        <a href={ocreUrl(coin)} target="_blank" rel="noopener">
          OCRE ↗
        </a>
        <a href={ansUrl(coin)} target="_blank" rel="noopener">
          ANS {coin.specimen} ↗
        </a>
      </div>
    </div>
  )
}

function CabinetStats() {
  const s = save.value
  const keys = ['metal', 'denomination', 'ruler', 'legend', 'reverse', 'date', 'mint'] as const
  const names = { metal: 'skillMetal', denomination: 'skillDenomination', ruler: 'skillRuler', legend: 'skillLegend', reverse: 'skillReverse', date: 'skillDate', mint: 'skillMint' } as const
  return (
    <div>
      <h2 class="page-title">{t('stats')}</h2>
      <div class="book-text">
        {t('xp')}: {s.xp}
        <br />
        {t('coinsLabel')}: {s.cabinet.length}
      </div>
      <div class="stat-list">
        {keys.map((k) => {
          const st = s.skills[k]
          return (
            <div class="stat-row">
              <b>{t(names[k])}</b>
              <span class="small dim">{st.asked}</span>
              <i>{st.asked ? `${Math.round((st.correct / st.asked) * 100)} %` : '–'}</i>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MintMap({ l, half }: { l: 'en' | 'de'; half: 'west' | 'east' }) {
  const { width, height, bounds, land } = mapData as { width: number; height: number; bounds: { west: number; east: number; north: number; south: number }; land: string }
  const [active, setActive] = useState<string | null>(null)
  const project = (lat: number, long: number) => ({
    x: ((long - bounds.west) / (bounds.east - bounds.west)) * width,
    y: ((bounds.north - lat) / (bounds.north - bounds.south)) * height,
  })
  const mints = Object.values(data.mints).filter((m) => m.lat !== undefined)
  const count = (id: string) => data.coins.filter((c) => c.mint === id).length
  const marks = (id: string) => mintMarks.find((m) => m.mint === id)?.marks.slice(0, 3).join(' ')
  const viewW = width * 0.46
  const viewH = height * 0.62
  const viewX = half === 'west' ? width * 0.06 : width * 0.52
  const viewY = height * 0.2
  return (
    <div class={`mint-map ${half}`}>
      <h2 class="page-title">{l === 'de' ? 'Münzstätten' : 'Mints'}</h2>
      <svg viewBox={`${viewX} ${viewY} ${viewW} ${viewH}`}>
        <defs>
          <pattern id="waves" width="28" height="12" patternUnits="userSpaceOnUse">
            <path d="M0 6 Q7 0 14 6 T28 6" fill="none" stroke="#b9a67a" stroke-width="1" opacity="0.5" />
          </pattern>
          <filter id="rough">
            <feTurbulence baseFrequency="0.9" numOctaves="2" result="n" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
        <rect x="0" y="0" width={width} height={height} fill="#d8c69a" />
        <rect x="0" y="0" width={width} height={height} fill="url(#waves)" />
        <path d={land} fill="#f0e2bf" stroke="#6b4e2a" stroke-width="2.5" stroke-linejoin="round" />
        <path d={land} fill="none" stroke="#a88a5a" stroke-width="7" opacity="0.25" />
        {mints.map((m) => {
          const p = project(m.lat!, m.long!)
          const isActive = active === m.id
          const big = count(m.id) >= 10 || isActive
          return (
            <g onClick={() => setActive(isActive ? null : m.id)} style="cursor:pointer">
              <circle cx={p.x} cy={p.y} r={isActive ? 9 : 6} fill="#8b1a1a" stroke="#fff5dc" stroke-width="2" />
              {big && (
                <text x={p.x + 9} y={p.y + 5} font-size="15" font-style="italic" fill="#3a2a10" stroke="#f0e2bf" stroke-width="4" paint-order="stroke">
                  {m[l]}
                </text>
              )}
            </g>
          )
        })}
        <g transform={`translate(${width * 0.9} ${height * 0.28})`}>
          <circle r="34" fill="none" stroke="#6b4e2a" stroke-width="2" />
          <path d="M0 -40 L8 0 L0 40 L-8 0 Z" fill="#8b1a1a" />
          <path d="M-40 0 L0 8 L40 0 L0 -8 Z" fill="#6b4e2a" />
          <text y="-46" text-anchor="middle" font-size="18" fill="#3a2a10">
            N
          </text>
        </g>
      </svg>
      <div class="small mint-caption">
        {active
          ? `${data.mints[active][l]}: ${marks(active) ?? (l === 'de' ? 'ohne Zeichen' : 'no mark')}, ${count(active)} ${l === 'de' ? 'Typen' : 'types'}`
          : t('mintsIntro')}
      </div>
    </div>
  )
}
