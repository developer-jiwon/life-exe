const LIFE_EXPECTANCY = 83

export function getLifeExpectancy(): number {
  return LIFE_EXPECTANCY
}

export function getAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export function getDaysLived(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  const diff = today.getTime() - birth.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function getTotalDays(birthDate: string): number {
  return getLifeExpectancy() * 365
}

export function getLifePercentage(birthDate: string): number {
  const lived = getDaysLived(birthDate)
  const total = getTotalDays(birthDate)
  return Math.min((lived / total) * 100, 100)
}

export function getYearPercentage(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const end = new Date(now.getFullYear() + 1, 0, 1)
  const elapsed = now.getTime() - start.getTime()
  const total = end.getTime() - start.getTime()
  return (elapsed / total) * 100
}

export function getMonthPercentage(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const elapsed = now.getTime() - start.getTime()
  const total = end.getTime() - start.getTime()
  return (elapsed / total) * 100
}

export function getWeekPercentage(): number {
  const now = new Date()
  const day = now.getDay()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const totalMinutesInWeek = 7 * 24 * 60
  const elapsed = day * 24 * 60 + hours * 60 + minutes
  return (elapsed / totalMinutesInWeek) * 100
}

export function getDaysUntilBirthday(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBirthday.getTime() < today.getTime()) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  }
  const diff = nextBirthday.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getToday(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}
