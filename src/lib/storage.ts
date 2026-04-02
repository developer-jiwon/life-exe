import type { LifeData, Mood } from './types'

const STORAGE_KEY = 'life-exe-data'

const DEFAULT_DATA: LifeData = {
  birthDate: '1994-04-30',
  pixels: {},
  onboardingDone: true,
}

export function loadData(): LifeData {
  if (typeof window === 'undefined') return DEFAULT_DATA
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_DATA
    return JSON.parse(raw) as LifeData
  } catch {
    return DEFAULT_DATA
  }
}

export function saveData(data: LifeData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function saveBirthDate(birthDate: string, gender?: 'male' | 'female' | 'other'): void {
  const data = loadData()
  data.birthDate = birthDate
  data.gender = gender
  data.onboardingDone = true
  saveData(data)
}

export function saveMood(date: string, mood: Mood): void {
  const data = loadData()
  data.pixels[date] = mood
  saveData(data)
}

export function getTodayMood(): Mood | null {
  const data = loadData()
  const today = new Date()
  const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return data.pixels[key] ?? null
}
