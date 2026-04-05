const STORAGE_KEY = 'eow-sentences'

export interface SavedSentence {
  text: string
  createdAt: number
}

export function getSavedSentences(): SavedSentence[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveSentence(text: string) {
  const saved = getSavedSentences()
  // Don't save duplicates
  if (saved.some(s => s.text === text)) return
  saved.unshift({ text, createdAt: Date.now() })
  // Keep max 50
  if (saved.length > 50) saved.pop()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
}

export function deleteSentence(text: string) {
  const saved = getSavedSentences().filter(s => s.text !== text)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
}
