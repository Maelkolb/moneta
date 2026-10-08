import type { Coin } from '../data/types'
import { ansUrl, data, ocreUrl } from '../data'
import { rulerById } from '../data/chapters'
import { formatRange } from '../game/questions'
import { lang, t } from '../state'
import { CoinSides } from './CoinView'

export function CoinRecord({ coin }: { coin: Coin }) {
  const l = lang.value
  const ruler = rulerById(coin.portrait)
  return (
    <div>
      <CoinSides coin={coin} showLegends />
      <div class="result-grid">
        <div>
          <div class="k">RIC</div>
          <div class="v">{coin.ric}</div>
        </div>
        <div>
          <div class="k">{t('ruler')}</div>
          <div class="v">
            {ruler?.name[l] ?? data.authorities[coin.portrait]?.[l] ?? coin.portrait}
            {ruler && <span class="muted small"> ({ruler.reign})</span>}
          </div>
        </div>
        <div>
          <div class="k">{t('denomination')}</div>
          <div class="v">
            {data.denominations[coin.denomination]?.[l] ?? coin.denomination}, {data.materials[coin.material][l].toLowerCase()}
          </div>
        </div>
        <div>
          <div class="k">{t('mint')}</div>
          <div class="v">{data.mints[coin.mint]?.[l] ?? coin.mint}</div>
        </div>
        <div>
          <div class="k">{t('date')}</div>
          <div class="v">{formatRange(coin.start, coin.end, l)}</div>
        </div>
        <div>
          <div class="k">{t('specimen')}</div>
          <div class="v">
            <a href={ansUrl(coin)} target="_blank" rel="noopener">
              ANS {coin.specimen}
            </a>
            {coin.weight ? `, ${coin.weight} g` : ''}
            {coin.diameter ? `, ${coin.diameter} mm` : ''}
          </div>
        </div>
        <div>
          <div class="k">{t('obverse')}</div>
          <div class="v">{coin.obvDescription}</div>
        </div>
        <div>
          <div class="k">{t('reverse')}</div>
          <div class="v">{coin.revDescription}</div>
        </div>
      </div>
      <a class="btn" href={ocreUrl(coin)} target="_blank" rel="noopener">
        {t('viewInOcre')} ↗
      </a>
    </div>
  )
}
