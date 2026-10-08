import { go, save, t, toggleLang, update, resetSave } from '../state'
import { CoinDisc } from '../ui/art'

export function Title() {
  const started = save.value.started
  const start = () => {
    if (started && !confirm(t('resetConfirm'))) return
    resetSave()
    update({ started: true })
    go({ name: 'prologue' })
  }
  return (
    <div class="title-screen">
      <div>
        <CoinDisc />
        <h1>{t('appName')}</h1>
        <div class="sub">{t('tagline')}</div>
        <div class="menu">
          {started && (
            <button class="btn primary" onClick={() => go({ name: 'village' })}>
              {t('continueGame')}
            </button>
          )}
          <button class={`btn ${started ? '' : 'primary'}`} onClick={start}>
            {t('newGame')}
          </button>
          <button class="btn on-dark" onClick={() => go({ name: 'codex' })}>
            {t('codex')}
          </button>
          <button class="btn on-dark" onClick={toggleLang}>
            {t('language')}
          </button>
        </div>
        <div class="title-foot">
          <button class="btn quiet on-dark" onClick={() => go({ name: 'about' })}>
            {t('about')}
          </button>
        </div>
      </div>
    </div>
  )
}
