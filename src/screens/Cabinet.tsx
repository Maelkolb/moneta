import { useState } from 'preact/hooks'
import { coinById, coinImage } from '../data'
import { chapters, rulerById, type Skill } from '../data/chapters'
import type { Coin } from '../data/types'
import { go, resetSave, save, t, tx } from '../state'
import { CoinRecord } from '../ui/CoinRecord'

const skillKeys: Record<Skill, 'skillMetal' | 'skillDenomination' | 'skillRuler' | 'skillLegend' | 'skillReverse' | 'skillDate' | 'skillMint'> = {
  metal: 'skillMetal',
  denomination: 'skillDenomination',
  ruler: 'skillRuler',
  legend: 'skillLegend',
  reverse: 'skillReverse',
  date: 'skillDate',
  mint: 'skillMint',
}

export function Cabinet() {
  const s = save.value
  const [detail, setDetail] = useState<Coin | null>(null)
  const entries = [...s.cabinet].reverse()
  return (
    <div>
      <div class="panel">
        <h2>{t('cabinet')}</h2>
        {!entries.length && <p class="muted">{t('cabinetEmpty')}</p>}
        {chapters.map((ch) => {
          const own = entries.filter((e) => e.chapter === ch.number)
          if (!own.length) return null
          return (
            <div class="codex-section">
              <h3>{tx(ch.title)}</h3>
              <div class="cabinet-grid" style="margin-top:12px">
                {own.map((e) => {
                  const c = coinById(e.coin)
                  if (!c) return null
                  return (
                    <button onClick={() => setDetail(c)}>
                      <img src={coinImage(c, 'obv')} alt={c.ric} loading="lazy" />
                      <span>{rulerById(c.portrait)?.name[s.lang] ?? c.portrait}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div class="panel">
        <h2>{t('stats')}</h2>
        <div class="stats-grid" style="margin-top:12px">
          <div class="stat">
            <b>{s.xp}</b>
            <span>{t('xp')}</span>
          </div>
          <div class="stat">
            <b>{s.cabinet.length}</b>
            <span>{t('coinsFound')}</span>
          </div>
          {(Object.keys(skillKeys) as Skill[]).map((k) => {
            const st = s.skills[k]
            const pct = st.asked ? Math.round((st.correct / st.asked) * 100) : null
            return (
              <div class="stat">
                <b>{pct === null ? '–' : `${pct} %`}</b>
                <span>
                  {t(skillKeys[k])} ({st.asked})
                </span>
              </div>
            )
          })}
        </div>
        <div class="row end" style="margin-top:20px">
          <button
            class="btn quiet"
            onClick={() => {
              if (confirm(t('resetConfirm'))) {
                resetSave()
                go({ name: 'title' })
              }
            }}
          >
            {t('resetGame')}
          </button>
        </div>
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
