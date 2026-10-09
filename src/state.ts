import { signal, computed, effect } from '@preact/signals'
import type { Lang, Text } from './data/types'
import { strings, type StringKey } from './i18n/strings'
import { ranks, chapters, type Skill } from './data/chapters'

export type CabinetEntry = { coin: string; chapter: number; score: number; foundAt: number }
export type SkillStats = Record<Skill, { asked: number; correct: number }>

export type Save = {
  version: 1
  lang: Lang
  sound: boolean
  started: boolean
  prologueSeen: boolean
  xp: number
  lessonsSeen: number[]
  chapterFound: Record<number, number>
  chapterDone: number[]
  cabinet: CabinetEntry[]
  skills: SkillStats
}

const KEY = 'moneta.save.v1'

const emptySkills = (): SkillStats => ({
  metal: { asked: 0, correct: 0 },
  denomination: { asked: 0, correct: 0 },
  ruler: { asked: 0, correct: 0 },
  legend: { asked: 0, correct: 0 },
  reverse: { asked: 0, correct: 0 },
  date: { asked: 0, correct: 0 },
  mint: { asked: 0, correct: 0 },
})

export function freshSave(lang: Lang = 'en'): Save {
  return {
    version: 1,
    lang,
    sound: true,
    started: false,
    prologueSeen: false,
    xp: 0,
    lessonsSeen: [],
    chapterFound: {},
    chapterDone: [],
    cabinet: [],
    skills: emptySkills(),
  }
}

function load(): Save {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Save>
      return { ...freshSave(), ...parsed, skills: { ...emptySkills(), ...(parsed.skills ?? {}) } }
    }
  } catch {}
  const browserLang = typeof navigator !== 'undefined' && navigator.language.startsWith('de') ? 'de' : 'en'
  return freshSave(browserLang)
}

export const save = signal<Save>(load())

effect(() => {
  try {
    localStorage.setItem(KEY, JSON.stringify(save.value))
  } catch {}
})

export function update(patch: Partial<Save> | ((s: Save) => Partial<Save>)) {
  const current = save.value
  const next = typeof patch === 'function' ? patch(current) : patch
  save.value = { ...current, ...next }
}

export const lang = computed(() => save.value.lang)

export function t(key: StringKey, vars?: Record<string, string | number>): string {
  let s = strings[key][lang.value]
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v))
  return s
}

export function tx(text: Text | undefined): string {
  if (!text) return ''
  return text[lang.value] ?? text.en
}

export function toggleLang() {
  update({ lang: lang.value === 'en' ? 'de' : 'en' })
}

export const rank = computed(() => {
  const xp = save.value.xp
  let current = ranks[0]
  for (const r of ranks) if (xp >= r.xp) current = r
  const next = ranks.find((r) => r.xp > xp)
  return { current, next }
})

export function unlockedChapters(): number[] {
  const done = save.value.chapterDone
  const highest = done.length ? Math.max(...done) : 0
  return chapters.filter((c) => c.number <= highest + 1).map((c) => c.number)
}

export function recordAnswer(skill: Skill, correct: boolean) {
  update((s) => ({
    skills: { ...s.skills, [skill]: { asked: s.skills[skill].asked + 1, correct: s.skills[skill].correct + (correct ? 1 : 0) } },
  }))
}

export function addXp(amount: number) {
  update((s) => ({ xp: s.xp + amount }))
}

export function addToCabinet(entry: CabinetEntry) {
  update((s) => ({
    cabinet: [...s.cabinet, entry],
    chapterFound: { ...s.chapterFound, [entry.chapter]: (s.chapterFound[entry.chapter] ?? 0) + 1 },
  }))
}

export function completeChapter(n: number) {
  update((s) => ({ chapterDone: s.chapterDone.includes(n) ? s.chapterDone : [...s.chapterDone, n] }))
}

export function markLessonSeen(n: number) {
  update((s) => ({ lessonsSeen: s.lessonsSeen.includes(n) ? s.lessonsSeen : [...s.lessonsSeen, n] }))
}

export function resetSave() {
  save.value = { ...freshSave(lang.value), sound: save.value.sound }
}

export type Screen =
  | { name: 'title' }
  | { name: 'prologue' }
  | { name: 'world'; chapter: number; returnFrom?: 'identify' | 'lesson' }
  | { name: 'lesson'; chapter: number; part: 'intro' | 'lesson' | 'outro' }
  | { name: 'identify'; chapter: number; coin: string }
  | { name: 'practice'; chapter: number }

export const screen = signal<Screen>({ name: 'title' })
export const bookOpen = signal(false)
export const bookTab = signal<string>('rulers')

export function go(next: Screen) {
  screen.value = next
}

export const currentChapter = signal(1)
