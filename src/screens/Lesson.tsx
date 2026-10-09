import { useEffect, useState } from 'preact/hooks'
import { chapters } from '../data/chapters'
import { coinImage, coinsOfChapter, portraitCoin } from '../data'
import { assetUrl, img } from '../engine/assets'
import { play } from '../engine/audio'
import { addXp, completeChapter, go, markLessonSeen, t, tx } from '../state'
import { TextBox } from '../ui/TextBox'

type Props = { chapter: number; part: 'intro' | 'lesson' | 'outro' }

export function Lesson({ chapter, part }: Props) {
  const ch = chapters.find((c) => c.number === chapter)!
  const [index, setIndex] = useState(0)
  useEffect(() => {
    void play('town')
  }, [])

  const lines = part === 'intro' ? [...ch.intro, ...ch.lesson] : part === 'lesson' ? ch.lesson : ch.outro
  const lessonStart = part === 'intro' ? ch.intro.length : 0

  const done = () => {
    if (part === 'outro') {
      completeChapter(chapter)
      addXp(100)
      go({ name: 'world', chapter })
      return
    }
    markLessonSeen(chapter)
    go({ name: 'world', chapter })
  }

  const illustration = pickIllustration(chapter, part, index - lessonStart)

  return (
    <div class="screen lesson">
      <img class="gwen-close" src={assetUrl(img.gwenClose)} alt="Gwen" />
      <div class="lesson-art">
        {illustration.kind === 'coin' && (
          <div class="lesson-coin">
            <img src={coinImage(illustration.coin, 'obv')} alt="" />
            <img src={coinImage(illustration.coin, 'rev')} alt="" />
          </div>
        )}
        {illustration.kind === 'book' && <img class="lesson-book" src={assetUrl(img.book)} alt="" />}
        {illustration.kind === 'gem' && <img class="lesson-gem" src={assetUrl(img.gem)} alt="" />}
        {illustration.kind === 'trophy' && <img class="lesson-gem" src={assetUrl(img.trophy)} alt="" />}
        {illustration.kind === 'portraits' && (
          <div class="lesson-portraits">
            {ch.rulers.slice(0, 6).map((r) => {
              const pc = portraitCoin[r.id]
              return pc ? (
                <figure>
                  <img src={coinImage(pc, 'obv')} alt="" />
                  <figcaption>{tx(r.name)}</figcaption>
                </figure>
              ) : null
            })}
          </div>
        )}
      </div>
      <div class="lesson-title">
        {t('chapter')} {ch.number}: {tx(ch.title)}
      </div>
      <TextBox lines={lines.map(tx)} onDone={done} onIndex={setIndex} />
    </div>
  )
}

type Illustration = { kind: 'coin'; coin: string } | { kind: 'book' } | { kind: 'gem' } | { kind: 'trophy' } | { kind: 'portraits' } | { kind: 'none' }

function pickIllustration(chapter: number, part: string, lessonIndex: number): Illustration {
  const coins = coinsOfChapter(chapter)
  const gold = coins.find((c) => c.material === 'av') ?? coins[0]
  const silver = coins.find((c) => c.material === 'ar') ?? coins[0]
  const bronze = coins.find((c) => c.material === 'ae') ?? coins[0]
  if (part === 'outro') return { kind: 'trophy' }
  if (lessonIndex < 0) return { kind: 'portraits' }
  if (chapter === 1) {
    const seq: Illustration[] = [
      { kind: 'coin', coin: gold.id },
      { kind: 'coin', coin: gold.id },
      { kind: 'coin', coin: gold.id },
      { kind: 'book' },
      { kind: 'coin', coin: silver.id },
      { kind: 'portraits' },
      { kind: 'gem' },
      { kind: 'gem' },
    ]
    return seq[Math.min(lessonIndex, seq.length - 1)]
  }
  const byChapter: Record<number, string[]> = {
    2: ['denarius', 'aureus', 'denarius', 'sestertius'],
    3: ['sestertius', 'denarius', 'sestertius', 'aureus'],
    4: ['denarius', 'aureus', 'denarius', 'denarius'],
    5: ['antoninianus', 'antoninianus', 'antoninianus', 'antoninianus'],
    6: ['ae2', 'ae2', 'ae2', 'solidus'],
    7: ['ae3', 'ae2', 'ae3', 'solidus'],
  }
  const want = byChapter[chapter]?.[lessonIndex]
  const coin = coins.find((c) => c.denomination === want) ?? [gold, silver, bronze][lessonIndex % 3]
  return { kind: 'coin', coin: coin.id }
}
