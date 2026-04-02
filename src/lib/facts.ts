import { getDaysLived, getAge } from './life'
import { t, fmtNum, fmtLargeNum } from './i18n'
import type { Lang } from './i18n'

export interface LifeFact {
  label: string
  value: string
  sub?: string
  align: 'left' | 'center' | 'right'
  size: 'sm' | 'md' | 'lg' | 'xl'
}

// Age-weighted average helper
function ageWeighted(birthDate: string, rateByAge: (age: number) => number): number {
  const age = getAge(birthDate)
  let total = 0
  for (let y = 0; y <= age; y++) {
    total += rateByAge(y) * 365
  }
  const daysThisYear = getDaysLived(birthDate) - age * 365
  total += rateByAge(age) * (daysThisYear - 365)
  return Math.max(0, Math.round(total))
}

const ALIGNS: Array<'left' | 'center' | 'right'> = ['left', 'right', 'center', 'left', 'right', 'center', 'right', 'left']
const SIZES: Array<'sm' | 'md' | 'lg' | 'xl'> = ['xl', 'xl', 'lg', 'lg', 'md', 'lg', 'xl', 'md', 'lg', 'lg']

export function getAllFacts(birthDate: string, lang: Lang = 'ko'): LifeFact[] {
  const days = getDaysLived(birthDate)
  const age = getAge(birthDate)
  const facts: LifeFact[] = []
  let i = 0

  function add(label: string, value: string, sub?: string) {
    facts.push({
      label, value, sub,
      align: ALIGNS[i % ALIGNS.length],
      size: SIZES[i % SIZES.length],
    })
    i++
  }

  const fn = (n: number) => fmtNum(n, lang)
  const fl = (n: number) => fmtLargeNum(n, lang)

  // -- Basic (precise) --
  add(
    t('days_alive', lang),
    `${fn(days)}${t('days', lang)}`,
    t('days_alive_sub', lang, Math.floor(days / 365), days % 365),
  )
  add(
    t('birthdays', lang),
    `${age}${t('times', lang)}`,
    t('next_bday', lang, getDaysUntilBirthday(birthDate)),
  )

  // -- Heart (age-weighted heartrate) --
  const heartbeats = ageWeighted(birthDate, (a) => {
    if (a < 1) return 120 * 60 * 24
    if (a < 5) return 100 * 60 * 24
    if (a < 12) return 85 * 60 * 24
    return 72 * 60 * 24
  })
  add(t('heartbeats', lang), `${fl(heartbeats)} ${t('times', lang)}`, t('heartbeats_sub', lang))

  // -- Breaths --
  const breaths = ageWeighted(birthDate, (a) => {
    if (a < 1) return 40 * 60 * 24
    if (a < 5) return 25 * 60 * 24
    if (a < 12) return 20 * 60 * 24
    return 15 * 60 * 24
  })
  add(t('breaths', lang), `${fl(breaths)} ${t('times', lang)}`)

  // -- Blinks --
  const blinks = ageWeighted(birthDate, (a) => {
    if (a < 1) return 3 * 60 * 16
    if (a < 5) return 8 * 60 * 16
    return 15 * 60 * 16
  })
  add(t('blinks', lang), `${fl(blinks)} ${t('times', lang)}`)

  // -- Sleep --
  const sleepHours = ageWeighted(birthDate, (a) => {
    if (a < 1) return 16
    if (a < 5) return 12
    if (a < 12) return 10
    if (a < 18) return 9
    return 7.5
  })
  const sleepYears = (sleepHours / (365 * 24)).toFixed(1)
  add(t('sleep', lang), `~${sleepYears}${t('years', lang)}`, t('sleep_sub', lang))

  // -- Dreams --
  const dreams = days * 5
  add(t('dreams', lang), `~${fn(dreams)}`, t('dreams_sub', lang))

  // -- Meals --
  const mealsAge = Math.max(0, age - 2)
  const meals = mealsAge * 365 * 3 + Math.min(age, 2) * 365 * 5
  add(t('meals', lang), `~${fn(meals)}${t('meals_unit', lang)}`, t('meals_sub', lang))

  // -- Water --
  const waterL = ageWeighted(birthDate, (a) => {
    if (a < 1) return 0.5
    if (a < 12) return 1
    return 2
  })
  add(t('water', lang), `~${fn(Math.round(waterL))}${t('liters', lang)}`, t('water_sub', lang, Math.round(waterL / 200)))

  // -- Coffee (age >= 15) --
  if (age >= 15) {
    const coffeeYears = age - 15
    const coffees = Math.round(coffeeYears * 365 * 1.3)
    add(t('coffee', lang), `~${fn(coffees)}${t('cups', lang)}`)
  }

  // -- Laughs --
  const laughs = ageWeighted(birthDate, (a) => {
    if (a < 5) return 300
    if (a < 12) return 100
    return 15
  })
  add(t('laughs', lang), `~${fn(laughs)}${t('times', lang)}`, t('laughs_sub', lang))

  // -- Cries --
  const cries = age < 2 ? days * 3 : 2 * 365 * 3 + (age - 2) * 40
  add(t('cries', lang), `~${fn(cries)}${t('times', lang)}`)

  // -- Seasons --
  add(t('seasons', lang), t('seasons_val', lang, age * 4), t('seasons_sub', lang, age))

  // -- Sunrise / Sunset --
  add(t('sunrise', lang), `${fn(days)}${t('times', lang)}`, t('sunrise_sub', lang))
  add(t('sunset', lang), `${fn(days)}${t('times', lang)}`, t('sunset_sub', lang))

  // -- Full moon --
  const fullmoons = Math.floor(days / 29.53)
  add(t('fullmoon', lang), `${fullmoons}${t('times', lang)}`, t('fullmoon_sub', lang))

  // -- Rainbow --
  const rainbows = Math.round(age * 8)
  add(t('rainbow', lang), `~${rainbows}${t('times', lang)}`, t('rainbow_sub', lang))

  // -- Rain --
  const rainyDays = Math.round(days * 0.28)
  add(t('rain', lang), `~${fn(rainyDays)}${t('days', lang)}`, t('rain_sub', lang))

  // -- Mondays / Weekends --
  const mondays = Math.floor(days / 7)
  add(t('mondays', lang), `${fn(mondays)}${t('times', lang)}`, t('mondays_sub', lang))
  const weekends = mondays * 2
  add(t('weekends', lang), `${fn(weekends)}${t('days', lang)}`)

  // -- New Year --
  add(t('newyear', lang), `${age}${t('times', lang)}`, t('newyear_sub', lang))

  // -- Walking --
  const walkKm = ageWeighted(birthDate, (a) => {
    if (a < 1) return 0
    if (a < 5) return 2000 * 0.4 / 1000
    if (a < 12) return 8000 * 0.5 / 1000
    return 6500 * 0.7 / 1000
  })
  const totalKm = Math.round(walkKm)
  add(t('walking', lang), `~${fn(totalKm)}km`, t('walking_sub', lang, ((totalKm / 40075) * 100).toFixed(1)))

  // -- Hair --
  const hairCm = Math.round(age * 15)
  add(t('hair', lang), `~${(hairCm / 100).toFixed(1)}m`, t('hair_sub', lang))

  // -- Nails --
  const nailCm = Math.round(age * 3.5 * 12) / 10
  add(t('nails', lang), `~${nailCm}cm`)

  // -- Skin regeneration --
  const skinCycles = Math.round(days / 27)
  add(t('skin', lang), `${skinCycles}${t('times', lang)}`, t('skin_sub', lang))

  // -- Digital (smartphone) --
  const smartphoneAge = Math.max(0, age - 13)
  if (smartphoneAge > 0) {
    const phoneChecks = smartphoneAge * 365 * 96
    add(t('phone', lang), `~${fn(phoneChecks)}${t('times', lang)}`, t('phone_sub', lang))

    const photos = smartphoneAge * 365 * 4
    add(t('photos', lang), `~${fn(photos)}`)

    const screenHours = smartphoneAge * 365 * 4.5
    const screenYears = (screenHours / (365 * 24)).toFixed(1)
    add(t('screentime', lang), `~${screenYears}${t('years', lang)}`, t('screentime_sub', lang))
  }

  // -- Hours lived --
  const hours = days * 24
  add(t('hours', lang), `${fn(hours)}${t('hours_unit', lang)}`, t('hours_sub', lang, Math.floor(hours / 10000)))

  // -- People met --
  const peopleMet = Math.round(age * 2500)
  add(t('people', lang), `~${fn(peopleMet)}${t('people_unit', lang)}`, t('people_sub', lang))

  // -- 100 years --
  const daysTo100 = (100 * 365) - days
  if (daysTo100 > 0) {
    add(t('to100', lang), `${fn(daysTo100)}${t('days', lang)}`, t('to100_sub', lang, ((daysTo100 / (100 * 365)) * 100).toFixed(1)))
  }

  return facts
}

function getDaysUntilBirthday(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
  if (next.getTime() < today.getTime()) next.setFullYear(next.getFullYear() + 1)
  return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}
