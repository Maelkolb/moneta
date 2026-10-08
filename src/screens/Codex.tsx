import { useState } from 'preact/hooks'
import { chapters, type Ruler } from '../data/chapters'
import { denominations, materialNames, materialNote } from '../data/denominations'
import { glossary, personifications } from '../data/glossary'
import { mintMarks } from '../data/mintmarks'
import map from '../data/map.json'
import { coinById, coinImage, data, portraitCoin } from '../data'
import type { Coin } from '../data/types'
import { go, lang, t, tx } from '../state'
import { CoinRecord } from '../ui/CoinRecord'

const tabs = ['rulers', 'denominations', 'glossary', 'reverses', 'mints', 'timeline'] as const
type Tab = (typeof tabs)[number]

const tabLabel: Record<Tab, 'codexRulers' | 'codexDenominations' | 'codexGlossary' | 'codexReverses' | 'codexMints' | 'codexTimeline'> = {
  rulers: 'codexRulers',
  denominations: 'codexDenominations',
  glossary: 'codexGlossary',
  reverses: 'codexReverses',
  mints: 'codexMints',
  timeline: 'codexTimeline',
}

export function Codex({ tab: initial }: { tab?: string }) {
  const [tab, setTab] = useState<Tab>((tabs as readonly string[]).includes(initial ?? '') ? (initial as Tab) : 'rulers')
  const [detail, setDetail] = useState<Coin | null>(null)
  return (
    <div>
      <div class="tabs">
        {tabs.map((k) => (
          <button class={tab === k ? 'active' : ''} onClick={() => setTab(k)}>
            {t(tabLabel[k])}
          </button>
        ))}
      </div>
      <div class="panel">
        {tab === 'rulers' && <Rulers onOpen={setDetail} />}
        {tab === 'denominations' && <Denominations onOpen={setDetail} />}
        {tab === 'glossary' && <Glossary />}
        {tab === 'reverses' && <Reverses onOpen={setDetail} />}
        {tab === 'mints' && <Mints />}
        {tab === 'timeline' && <Timeline />}
      </div>
      {detail && (
        <div class="modal-back" onClick={() => setDetail(null)}>
          <div class="modal" onClick={(e) => e.stopPropagation()}>
            <div class="row between" style="margin-bottom:12px">
              <h2>{detail.ric}</h2>
              <button class="btn quiet" onClick={() => setDetail(null)}>
                {t('close')}
              </button>
            </div>
            <CoinRecord coin={detail} />
          </div>
        </div>
      )}
    </div>
  )
}

function Rulers({ onOpen }: { onOpen: (c: Coin) => void }) {
  return (
    <div>
      {chapters.map((ch) => (
        <div class="codex-section">
          <h2>{tx(ch.title)}</h2>
          <p class="muted">{tx(ch.period)}</p>
          <div class="codex-rulers">
            {ch.rulers.map((r) => (
              <RulerFigure ruler={r} onOpen={onOpen} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function RulerFigure({ ruler, onOpen }: { ruler: Ruler; onOpen: (c: Coin) => void }) {
  const pc = portraitCoin[ruler.id]
  const coin = pc ? coinById(pc) : undefined
  return (
    <figure onClick={() => coin && onOpen(coin)} title={tx(ruler.note)}>
      {pc ? <img src={coinImage(pc, 'obv')} alt={ruler.name.en} loading="lazy" /> : <div class="nocoin" />}
      <figcaption>
        <b>{tx(ruler.name)}</b>
        <span>{ruler.reign}</span>
        <div class="small" style="margin-top:6px;line-height:1.3">
          {tx(ruler.note)}
        </div>
      </figcaption>
    </figure>
  )
}

function Denominations({ onOpen }: { onOpen: (c: Coin) => void }) {
  const l = lang.value
  const example = (id: string) => data.coins.find((c) => c.denomination === id)
  return (
    <div>
      <h2>{t('codexDenominations')}</h2>
      <div class="value-chain">
        <span class="coin-pill">
          <i class="metal-dot metal-av" />1 Aureus
        </span>
        = <span class="coin-pill"><i class="metal-dot metal-ar" />25 Denarii</span>
        = <span class="coin-pill"><i class="metal-dot metal-ae" />100 Sestertii</span>
        = <span class="coin-pill"><i class="metal-dot metal-ae" />200 Dupondii</span>
        = <span class="coin-pill"><i class="metal-dot metal-ae" />400 Asses</span>
      </div>
      {(['av', 'ar', 'ae'] as const).map((m) => (
        <div class="codex-section">
          <h3>
            <i class={`metal-dot metal-${m}`} />
            {materialNames[m][l]}
          </h3>
          <p class="muted small">{materialNote[m][l]}</p>
          <table class="denom-table">
            <thead>
              <tr>
                <th />
                <th>{t('denomination')}</th>
                <th>{t('codexTimeline')}</th>
                <th>Value</th>
                <th>Size</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {denominations
                .filter((d) => d.metal === m)
                .map((d) => {
                  const ex = example(d.id)
                  return (
                    <tr>
                      <td style="width:64px">
                        {ex && <img src={coinImage(ex, 'obv')} alt="" width="56" height="56" style="border-radius:50%;cursor:pointer" onClick={() => onOpen(ex)} loading="lazy" />}
                      </td>
                      <td>
                        <b>{d.name[l]}</b>
                      </td>
                      <td>{d.period[l]}</td>
                      <td>{d.value[l]}</td>
                      <td>{d.size}</td>
                      <td class="small muted">{d.note[l]}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

function Glossary() {
  const l = lang.value
  const groups: { key: (typeof glossary)[number]['group']; title: string }[] = [
    { key: 'rank', title: l === 'de' ? 'Rang' : 'Rank' },
    { key: 'title', title: l === 'de' ? 'Titel' : 'Titles' },
    { key: 'office', title: l === 'de' ? 'Ämter und Datierung' : 'Offices and dating' },
    { key: 'family', title: l === 'de' ? 'Familie' : 'Family' },
    { key: 'victory', title: l === 'de' ? 'Siegestitel' : 'Victory titles' },
    { key: 'reverse', title: l === 'de' ? 'Rückseiten' : 'Reverses' },
    { key: 'mint', title: l === 'de' ? 'Münzzeichen' : 'Mint marks' },
  ]
  return (
    <div>
      <h2>{t('codexGlossary')}</h2>
      <p class="muted">{t('glossaryIntro')}</p>
      <div class="codex-section">
        <h3>{l === 'de' ? 'Eine Legende lesen' : 'Reading a legend'}</h3>
        <p>
          <span class="legend-line" style="display:inline">IMP CAES NERVA TRAIAN AVG GERM DAC P M TR P COS V P P</span>
        </p>
        <p class="small">
          {l === 'de'
            ? 'Imperator Caesar Nerva Traianus Augustus Germanicus Dacicus, Pontifex Maximus, Tribunicia Potestate, Consul zum fünften Mal, Pater Patriae. Trajan war zum fünften Mal Konsul von 103 bis 111: Die Münze fällt in diese Jahre.'
            : 'Imperator Caesar Nerva Traianus Augustus Germanicus Dacicus, Pontifex Maximus, holder of the tribunician power, consul for the fifth time, father of the fatherland. Trajan was consul for the fifth time from 103 to 111: the coin falls in those years.'}
        </p>
      </div>
      {groups.map((g) => (
        <div class="codex-section">
          <h3>{g.title}</h3>
          <div class="glossary">
            {glossary
              .filter((e) => e.group === g.key)
              .map((e) => (
                <div>
                  <b>{e.abbr}</b> <i>{e.latin}</i>
                  <div class="small">{e.meaning[l]}</div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Reverses({ onOpen }: { onOpen: (c: Coin) => void }) {
  const l = lang.value
  const example = (name: string) => {
    const key = name.split(' ')[0].toLowerCase()
    return data.coins.find((c) => c.revDescription.toLowerCase().includes(key))
  }
  return (
    <div>
      <h2>{t('codexReverses')}</h2>
      <p class="muted">{tx(chapters[2].lesson[1])}</p>
      <div class="glossary">
        {personifications.map((p) => {
          const ex = example(p.name)
          return (
            <div class="row" style="align-items:flex-start">
              {ex ? (
                <img src={coinImage(ex, 'rev')} alt="" width="64" height="64" style="border-radius:50%;cursor:pointer;flex:none" onClick={() => onOpen(ex)} loading="lazy" />
              ) : (
                <span style="width:64px;flex:none" />
              )}
              <div>
                <b>{p.name}</b>
                <div class="small">{p.attribute[l]}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Mints() {
  const l = lang.value
  const [active, setActive] = useState<string | null>(null)
  const { width, height, bounds, land } = map as { width: number; height: number; bounds: { west: number; east: number; north: number; south: number }; land: string }
  const project = (lat: number, long: number) => ({
    x: ((long - bounds.west) / (bounds.east - bounds.west)) * width,
    y: ((bounds.north - lat) / (bounds.north - bounds.south)) * height,
  })
  const mints = Object.values(data.mints).filter((m) => m.lat !== undefined && m.long !== undefined)
  const marksOf = (id: string) => mintMarks.find((m) => m.mint === id)
  const coinsAt = (id: string) => data.coins.filter((c) => c.mint === id).length
  return (
    <div>
      <h2>{t('codexMints')}</h2>
      <p class="muted">{t('mintsIntro')}</p>
      <div class="map-wrap">
        <svg viewBox={`0 0 ${width} ${height}`}>
          <path class="land" d={land} />
          {mints.map((m) => {
            const p = project(m.lat!, m.long!)
            const isActive = active === m.id
            return (
              <g onClick={() => setActive(isActive ? null : m.id)}>
                <circle class={`mint ${isActive ? 'active' : ''}`} cx={p.x} cy={p.y} r={isActive ? 9 : 6} />
                {(isActive || coinsAt(m.id) >= 12) && (
                  <text x={p.x + 10} y={p.y - 8}>
                    {m[l]}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
      <div class="mint-list">
        {mints
          .sort((a, b) => a[l].localeCompare(b[l]))
          .map((m) => {
            const mm = marksOf(m.id)
            return (
              <button class={active === m.id ? 'active' : ''} onClick={() => setActive(active === m.id ? null : m.id)}>
                <b>{m[l]}</b>
                {mm && mm.modern[l] !== m[l] && <span class="muted small"> ({mm.modern[l]})</span>}
                {mm && (
                  <div>
                    <code>{mm.marks.join(' ')}</code> <span class="muted small">{mm.active}</span>
                  </div>
                )}
                <div class="small muted">
                  {coinsAt(m.id)} {l === 'de' ? 'Typen im Spiel' : 'types in the game'}
                </div>
              </button>
            )
          })}
      </div>
    </div>
  )
}

function Timeline() {
  const l = lang.value
  const start = -27
  const end = 491
  const colors = ['#7a5a0e', '#8a6a14', '#6f6a3a', '#7a2e2e', '#5a4a38', '#2f3b2a', '#3b4a6a']
  const bounds = [
    [-27, 68],
    [68, 96],
    [96, 192],
    [193, 235],
    [235, 284],
    [284, 337],
    [337, 491],
  ]
  return (
    <div>
      <h2>{t('codexTimeline')}</h2>
      <div class="timeline">
        <div class="bar">
          {chapters.map((c, i) => {
            const [s, e] = bounds[i]
            const w = ((e - s) / (end - start)) * 100
            return (
              <div style={{ width: `${w}%`, background: colors[i] }} title={tx(c.title)} onClick={() => go({ name: 'chapter', chapter: c.number })}>
                {c.number}
              </div>
            )
          })}
        </div>
        <div class="years">
          <span>27 {t('bc')}</span>
          <span>100</span>
          <span>200</span>
          <span>300</span>
          <span>400</span>
          <span>491 {t('ad')}</span>
        </div>
        {chapters.map((c) => (
          <div class="codex-section">
            <h3>
              {c.number}. {tx(c.title)} <span class="muted small">{tx(c.period)}</span>
            </h3>
            <div class="rulers">
              {c.rulers.map((r) => (
                <div>
                  {r.name[l]} <span>{r.reign}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
