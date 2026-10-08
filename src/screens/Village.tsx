import { chapters } from '../data/chapters'
import { coinsText, go, save, t, tx, unlockedChapters, rank } from '../state'
import { IconCabinet, IconCodex, IconPractice, VillageScene } from '../ui/art'

export function Village() {
  const unlocked = unlockedChapters()
  const s = save.value
  const r = rank.value
  return (
    <div>
      <div class="panel" style="padding:0;overflow:hidden">
        <VillageScene terrain="meadow" />
        <div style="padding:0 32px 24px">
          <h1>{t('village')}</h1>
          <p class="muted">
            {t('rank')}: {tx(r.current.title)}.{' '}
            {r.next && (
              <span>
                {s.xp} / {r.next.xp} {t('xpUnit')} {t('untilRank')} {tx(r.next.title)}.{' '}
              </span>
            )}
            {coinsText(s.cabinet.length)}.
          </p>
        </div>
      </div>

      <div class="hub-actions">
        <button onClick={() => go({ name: 'codex' })}>
          <IconCodex />
          <div>
            <h3>{t('codex')}</h3>
            <p>{t('codexRulers')}, {t('codexDenominations').toLowerCase()}, {t('codexGlossary').toLowerCase()}, {t('codexMints').toLowerCase()}</p>
          </div>
        </button>
        <button onClick={() => go({ name: 'cabinet' })}>
          <IconCabinet />
          <div>
            <h3>{t('cabinet')}</h3>
            <p>{coinsText(s.cabinet.length)}</p>
          </div>
        </button>
        <button onClick={() => go({ name: 'practice' })}>
          <IconPractice />
          <div>
            <h3>{t('practice')}</h3>
            <p>{t('practiceIntro').split('.')[0]}.</p>
          </div>
        </button>
      </div>

      <div class="village-header">
        <h2>{t('journey')}</h2>
      </div>
      <div class="chapter-list">
        {chapters.map((c) => {
          const open = unlocked.includes(c.number)
          const found = s.chapterFound[c.number] ?? 0
          const done = s.chapterDone.includes(c.number)
          const pct = Math.min(100, Math.round((found / c.coinsToFind) * 100))
          return (
            <button class={`chapter-card ${open ? '' : 'locked'}`} disabled={!open} onClick={() => go({ name: 'chapter', chapter: c.number })}>
              <span class="num">
                {t('chapter')} {c.number}
                <span class="years">{tx(c.period)}</span>
              </span>
              <h3>{tx(c.title)}</h3>
              <span class="site">{tx(c.site)}</span>
              <span class="status">
                {!open ? t('locked') : done ? t('completed') : `${found} / ${c.coinsToFind} ${t('coinsFound')}`}
              </span>
              <span class="progress">
                <i style={{ width: `${done ? 100 : pct}%` }} />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
