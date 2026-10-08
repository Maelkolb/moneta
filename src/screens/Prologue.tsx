import { prologue } from '../data/chapters'
import { go, update } from '../state'
import { Dialogue } from '../ui/Dialogue'
import { VillageScene } from '../ui/art'

export function Prologue() {
  const done = () => {
    update({ prologueSeen: true })
    go({ name: 'village' })
  }
  return (
    <div class="panel" style="padding-top:0">
      <VillageScene terrain="meadow" />
      <Dialogue lines={prologue} onDone={done} />
    </div>
  )
}
