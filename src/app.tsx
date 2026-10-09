import { useEffect } from 'preact/hooks'
import { screen, bookOpen, save } from './state'
import { Stage } from './ui/Stage'
import { Title } from './screens/Title'
import { Prologue } from './screens/Prologue'
import { World } from './screens/World'
import { Lesson } from './screens/Lesson'
import { Identify } from './screens/Identify'
import { Practice } from './screens/Practice'
import { Book } from './screens/Book'
import { applySoundSetting } from './engine/audio'

export function App() {
  const s = screen.value

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (s.name === 'title' || s.name === 'prologue') return
      if (k === 'b' || k === 'tab') {
        e.preventDefault()
        bookOpen.value = !bookOpen.value
      } else if (k === 'escape' && bookOpen.value) {
        bookOpen.value = false
      } else if (k === 'm') {
        save.value = { ...save.value, sound: !save.value.sound }
        applySoundSetting()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [s.name])

  return (
    <Stage>
      {s.name === 'title' && <Title />}
      {s.name === 'prologue' && <Prologue />}
      {s.name === 'world' && <World chapter={s.chapter} key={s.chapter} />}
      {s.name === 'lesson' && <Lesson chapter={s.chapter} part={s.part} key={`${s.chapter}-${s.part}`} />}
      {s.name === 'identify' && <Identify chapter={s.chapter} coinId={s.coin} key={s.coin} />}
      {s.name === 'practice' && <Practice chapter={s.chapter} />}
      {bookOpen.value && <Book />}
    </Stage>
  )
}
