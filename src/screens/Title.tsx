import { useEffect, useState } from 'preact/hooks'
import { assetUrl, img } from '../engine/assets'
import { unlockAudio } from '../engine/audio'
import { go, resetSave, save, t, toggleLang, update } from '../state'

export function Title() {
  const started = save.value.started
  const [menu, setMenu] = useState(false)

  const newGame = () => {
    resetSave()
    update({ started: true })
    unlockAudio()
    go({ name: 'prologue' })
  }
  const continueGame = () => {
    unlockAudio()
    go({ name: 'world', chapter: Math.max(1, ...save.value.chapterDone.map((n) => Math.min(n + 1, 7))) })
  }
  const press = () => {
    if (started) setMenu(true)
    else newGame()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (menu) continueGame()
        else press()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu, started])

  return (
    <div class="screen title" onClick={() => !menu && press()}>
      <img class="title-img" src={assetUrl(img.title)} alt="Numismatic - The Game" />
      {menu && (
        <div class="title-menu" onClick={(e) => e.stopPropagation()}>
          <button class="menu-btn" onClick={continueGame}>
            {t('continueGame')}
          </button>
          <button
            class="menu-btn"
            onClick={() => {
              if (confirm(t('resetConfirm'))) newGame()
            }}
          >
            {t('newGame')}
          </button>
        </div>
      )}
      <button
        class="corner-btn left"
        onClick={(e) => {
          e.stopPropagation()
          toggleLang()
        }}
      >
        {t('language')}
      </button>
      <div class="corner-note">{t('titleCredit')}</div>
    </div>
  )
}
