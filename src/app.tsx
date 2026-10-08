import { screen, go, save, t, tx, rank, toggleLang } from './state'
import { Title } from './screens/Title'
import { Prologue } from './screens/Prologue'
import { Village } from './screens/Village'
import { ChapterScreen } from './screens/Chapter'
import { Codex } from './screens/Codex'
import { Cabinet } from './screens/Cabinet'
import { Practice } from './screens/Practice'
import { About } from './screens/About'

export function App() {
  const s = screen.value
  const inGame = s.name !== 'title'
  return (
    <div class="stage">
      {inGame && (
        <header class="topbar">
          <button class="brand" onClick={() => go({ name: 'village' })}>
            <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
              <circle cx="16" cy="16" r="14" fill="#c9a227" />
              <circle cx="16" cy="16" r="11" fill="none" stroke="#7a5a0e" stroke-width="1.5" />
            </svg>
            {t('appName')}
          </button>
          <span class="rankline">
            {tx(rank.value.current.title)}
            <span class="xp">
              {save.value.xp} {t('xpUnit')}
            </span>
          </span>
          <nav>
            <button class={s.name === 'village' ? 'active' : ''} onClick={() => go({ name: 'village' })}>
              {t('village')}
            </button>
            <button class={s.name === 'codex' ? 'active' : ''} onClick={() => go({ name: 'codex' })}>
              {t('codex')}
            </button>
            <button class={s.name === 'cabinet' ? 'active' : ''} onClick={() => go({ name: 'cabinet' })}>
              {t('cabinet')}
            </button>
            <button class={s.name === 'practice' ? 'active' : ''} onClick={() => go({ name: 'practice' })}>
              {t('practice')}
            </button>
            <button class="lang" onClick={toggleLang}>
              {t('language')}
            </button>
          </nav>
        </header>
      )}
      {s.name === 'title' && <Title />}
      {s.name === 'prologue' && <Prologue />}
      {s.name === 'village' && <Village />}
      {s.name === 'chapter' && <ChapterScreen chapter={s.chapter} key={s.chapter} />}
      {s.name === 'codex' && <Codex tab={s.tab} />}
      {s.name === 'cabinet' && <Cabinet />}
      {s.name === 'practice' && <Practice />}
      {s.name === 'about' && <About />}
    </div>
  )
}
