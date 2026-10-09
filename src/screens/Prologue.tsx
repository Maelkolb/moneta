import { prologue } from '../data/chapters'
import { assetUrl, img } from '../engine/assets'
import { play } from '../engine/audio'
import { go, tx, update } from '../state'
import { TextBox } from '../ui/TextBox'
import { useEffect } from 'preact/hooks'

export function Prologue() {
  useEffect(() => {
    void play('town')
  }, [])
  const done = () => {
    update({ prologueSeen: true })
    go({ name: 'world', chapter: 1 })
  }
  return (
    <div class="screen prologue" style={{ backgroundImage: `url(${assetUrl(img.background)})` }}>
      <img class="gwen-portrait" src={assetUrl(img.gwenPortrait)} alt="Gwen" />
      <TextBox lines={prologue.map(tx)} onDone={done} />
    </div>
  )
}
