export type Mood = 'joy' | 'calm' | 'energy' | 'tired' | 'sad' | 'angry' | 'lazy'

export interface LifeData {
  birthDate: string
  gender?: 'male' | 'female' | 'other'
  pixels: Record<string, Mood>
  onboardingDone: boolean
  parents?: { label: string; date: string }[]
  parentsSkipped?: boolean
}

export interface FamousPerson {
  name: string
  nameEn: string
  nameJa?: string
  nameZh?: string
  nameHi?: string
  achievement: string
  achievementEn?: string
  achievementJa?: string
  achievementZh?: string
  achievementHi?: string
  age: number
  category: 'tech' | 'art' | 'sports' | 'business' | 'science' | 'music' | 'politics' | 'entertainment'
}

export const MOOD_CONFIG: Record<Mood, { color: string; label: string; emoji: string }> = {
  joy:    { color: '#F5C842', label: '기쁨',   emoji: '' },
  calm:   { color: '#7EB8DA', label: '평온',   emoji: '' },
  energy: { color: '#6BC5A0', label: '에너지', emoji: '' },
  tired:  { color: '#A78BBA', label: '피곤',   emoji: '' },
  sad:    { color: '#5B7BA5', label: '슬픔',   emoji: '' },
  angry:  { color: '#E87461', label: '분노',   emoji: '' },
  lazy:   { color: '#B8B0A8', label: '게으름', emoji: '' },
}

export const CATEGORY_COLORS: Record<FamousPerson['category'], string> = {
  tech: '#5B9BD5',
  art: '#A78BBA',
  sports: '#6BC5A0',
  business: '#F5C842',
  science: '#7EB8DA',
  music: '#E87461',
  politics: '#5B7BA5',
  entertainment: '#B8B0A8',
}
