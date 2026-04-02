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

// Seeded PRNG (mulberry32) — deterministic per seed
function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Fisher-Yates shuffle with seeded RNG
function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Generate a numeric seed from birthDate + today's date
function dateSeed(birthDate: string): number {
  const today = new Date()
  const dateStr = `${birthDate}-${Date.now()}`
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

interface RawFact {
  label: string
  value: string
  sub?: string
  pinFirst?: boolean  // always include, placed at start
  pinLast?: boolean   // always include, placed at end
}

function buildFactPool(birthDate: string, lang: Lang): RawFact[] {
  const days = getDaysLived(birthDate)
  const age = getAge(birthDate)
  const pool: RawFact[] = []

  const fn = (n: number) => fmtNum(n, lang)
  const fl = (n: number) => fmtLargeNum(n, lang)
  const smartphoneAge = Math.max(0, age - 13)

  // Helper for lang-specific inline text (for new facts without i18n keys)
  const L = (ko: string, en: string) => lang === 'ko' ? ko : lang === 'ja' ? ko : lang === 'zh' ? ko : lang === 'hi' ? en : en

  // ===== PINNED: FIRST =====
  pool.push({
    label: t('days_alive', lang),
    value: `${fn(days)}${t('days', lang)}`,
    sub: t('days_alive_sub', lang, Math.floor(days / 365), days % 365),
    pinFirst: true,
  })

  // ===== PINNED: LAST =====
  const daysTo100 = (100 * 365) - days
  if (daysTo100 > 0) {
    pool.push({
      label: t('to100', lang),
      value: `${fn(daysTo100)}${t('days', lang)}`,
      sub: t('to100_sub', lang, ((daysTo100 / (100 * 365)) * 100).toFixed(1)),
      pinLast: true,
    })
  }

  // ===== ORIGINAL FACTS =====

  pool.push({
    label: t('birthdays', lang),
    value: `${age}${t('times', lang)}`,
    sub: t('next_bday', lang, getDaysUntilBirthday(birthDate)),
  })

  // Heart
  const heartbeats = ageWeighted(birthDate, (a) => {
    if (a < 1) return 120 * 60 * 24
    if (a < 5) return 100 * 60 * 24
    if (a < 12) return 85 * 60 * 24
    return 72 * 60 * 24
  })
  pool.push({
    label: t('heartbeats', lang),
    value: `${fl(heartbeats)} ${t('times', lang)}`,
    sub: t('heartbeats_sub', lang),
  })

  // Breaths
  const breaths = ageWeighted(birthDate, (a) => {
    if (a < 1) return 40 * 60 * 24
    if (a < 5) return 25 * 60 * 24
    if (a < 12) return 20 * 60 * 24
    return 15 * 60 * 24
  })
  pool.push({
    label: t('breaths', lang),
    value: `${fl(breaths)} ${t('times', lang)}`,
  })

  // Blinks
  const blinks = ageWeighted(birthDate, (a) => {
    if (a < 1) return 3 * 60 * 16
    if (a < 5) return 8 * 60 * 16
    return 15 * 60 * 16
  })
  pool.push({
    label: t('blinks', lang),
    value: `${fl(blinks)} ${t('times', lang)}`,
  })

  // Sleep
  const sleepHours = ageWeighted(birthDate, (a) => {
    if (a < 1) return 16
    if (a < 5) return 12
    if (a < 12) return 10
    if (a < 18) return 9
    return 7.5
  })
  const sleepYears = (sleepHours / (365 * 24)).toFixed(1)
  pool.push({
    label: t('sleep', lang),
    value: `~${sleepYears}${t('years', lang)}`,
    sub: t('sleep_sub', lang),
  })

  // Dreams
  const dreams = days * 5
  pool.push({
    label: t('dreams', lang),
    value: `~${fn(dreams)}`,
    sub: t('dreams_sub', lang),
  })

  // Meals
  const mealsAge = Math.max(0, age - 2)
  const meals = mealsAge * 365 * 3 + Math.min(age, 2) * 365 * 5
  pool.push({
    label: t('meals', lang),
    value: `~${fn(meals)}${t('meals_unit', lang)}`,
    sub: t('meals_sub', lang),
  })

  // Water
  const waterL = ageWeighted(birthDate, (a) => {
    if (a < 1) return 0.5
    if (a < 12) return 1
    return 2
  })
  pool.push({
    label: t('water', lang),
    value: `~${fn(Math.round(waterL))}${t('liters', lang)}`,
    sub: t('water_sub', lang, Math.round(waterL / 200)),
  })

  // Coffee
  if (age >= 15) {
    const coffeeYears = age - 15
    const coffees = Math.round(coffeeYears * 365 * 1.3)
    pool.push({
      label: t('coffee', lang),
      value: `~${fn(coffees)}${t('cups', lang)}`,
    })
  }

  // Laughs
  const laughs = ageWeighted(birthDate, (a) => {
    if (a < 5) return 300
    if (a < 12) return 100
    return 15
  })
  pool.push({
    label: t('laughs', lang),
    value: `~${fn(laughs)}${t('times', lang)}`,
    sub: t('laughs_sub', lang),
  })

  // Cries
  const cries = age < 2 ? days * 3 : 2 * 365 * 3 + (age - 2) * 40
  pool.push({
    label: t('cries', lang),
    value: `~${fn(cries)}${t('times', lang)}`,
  })

  // Seasons
  pool.push({
    label: t('seasons', lang),
    value: t('seasons_val', lang, age * 4),
    sub: t('seasons_sub', lang, age),
  })

  // Sunrise / Sunset
  pool.push({
    label: t('sunrise', lang),
    value: `${fn(days)}${t('times', lang)}`,
    sub: t('sunrise_sub', lang),
  })
  pool.push({
    label: t('sunset', lang),
    value: `${fn(days)}${t('times', lang)}`,
    sub: t('sunset_sub', lang),
  })

  // Full moon
  const fullmoons = Math.floor(days / 29.53)
  pool.push({
    label: t('fullmoon', lang),
    value: `${fullmoons}${t('times', lang)}`,
    sub: t('fullmoon_sub', lang),
  })

  // Rainbow
  const rainbows = Math.round(age * 8)
  pool.push({
    label: t('rainbow', lang),
    value: `~${rainbows}${t('times', lang)}`,
    sub: t('rainbow_sub', lang),
  })

  // Rain
  const rainyDays = Math.round(days * 0.28)
  pool.push({
    label: t('rain', lang),
    value: `~${fn(rainyDays)}${t('days', lang)}`,
    sub: t('rain_sub', lang),
  })

  // Mondays / Weekends
  const mondays = Math.floor(days / 7)
  pool.push({
    label: t('mondays', lang),
    value: `${fn(mondays)}${t('times', lang)}`,
    sub: t('mondays_sub', lang),
  })
  const weekends = mondays * 2
  pool.push({
    label: t('weekends', lang),
    value: `${fn(weekends)}${t('days', lang)}`,
  })

  // New Year
  pool.push({
    label: t('newyear', lang),
    value: `${age}${t('times', lang)}`,
    sub: t('newyear_sub', lang),
  })

  // Walking
  const walkKm = ageWeighted(birthDate, (a) => {
    if (a < 1) return 0
    if (a < 5) return 2000 * 0.4 / 1000
    if (a < 12) return 8000 * 0.5 / 1000
    return 6500 * 0.7 / 1000
  })
  const totalKm = Math.round(walkKm)
  pool.push({
    label: t('walking', lang),
    value: `~${fn(totalKm)}km`,
    sub: t('walking_sub', lang, ((totalKm / 40075) * 100).toFixed(1)),
  })

  // Hair
  const hairCm = Math.round(age * 15)
  pool.push({
    label: t('hair', lang),
    value: `~${(hairCm / 100).toFixed(1)}m`,
    sub: t('hair_sub', lang),
  })

  // Nails
  const nailCm = Math.round(age * 3.5 * 12) / 10
  pool.push({
    label: t('nails', lang),
    value: `~${nailCm}cm`,
  })

  // Skin regeneration
  const skinCycles = Math.round(days / 27)
  pool.push({
    label: t('skin', lang),
    value: `${skinCycles}${t('times', lang)}`,
    sub: t('skin_sub', lang),
  })

  // Digital (smartphone)
  if (smartphoneAge > 0) {
    const phoneChecks = smartphoneAge * 365 * 96
    pool.push({
      label: t('phone', lang),
      value: `~${fn(phoneChecks)}${t('times', lang)}`,
      sub: t('phone_sub', lang),
    })

    const photos = smartphoneAge * 365 * 4
    pool.push({
      label: t('photos', lang),
      value: `~${fn(photos)}${lang === 'ko' ? '장' : ''}`,
    })

    const screenHours = smartphoneAge * 365 * 4.5
    const screenYears = (screenHours / (365 * 24)).toFixed(1)
    pool.push({
      label: t('screentime', lang),
      value: `~${screenYears}${t('years', lang)}`,
      sub: t('screentime_sub', lang),
    })
  }

  // Hours lived
  const hours = days * 24
  pool.push({
    label: t('hours', lang),
    value: `${fn(hours)}${t('hours_unit', lang)}`,
    sub: t('hours_sub', lang, Math.floor(hours / 10000)),
  })

  // People met
  const peopleMet = Math.round(age * 2500)
  pool.push({
    label: t('people', lang),
    value: `~${fn(peopleMet)}${t('people_unit', lang)}`,
    sub: t('people_sub', lang),
  })


  // =========================================================================
  // NEW FACTS (70+)
  // =========================================================================

  // --- BODY ---

  // Blood pumped: ~7,570L/day
  const bloodL = Math.round(days * 7570)
  pool.push({
    label: L('심장이 펌프한 혈액', 'Blood your heart pumped'),
    value: `${fl(bloodL)}L`,
    sub: L('하루 약 7,570리터, 멈춘 적 없이', '~7,570L per day, never stopped'),
  })

  // Skin shed: ~0.7kg/year
  const skinShedKg = (age * 0.7).toFixed(1)
  pool.push({
    label: L('벗겨진 피부', 'Skin you\'ve shed'),
    value: `~${skinShedKg}kg`,
    sub: L('평생 약 35kg, 먼지의 대부분은 당신', '~35kg in a lifetime — most dust is you'),
  })

  // Tears: ~10L per year (basal + reflex + emotional)
  const tearsL = Math.round(age * 10)
  pool.push({
    label: L('흘린 눈물', 'Tears produced'),
    value: `~${fn(tearsL)}L`,
    sub: L('기초눈물 + 반사눈물 + 감정눈물 모두', 'Basal + reflex + emotional tears combined'),
  })

  // Steps taken: ~7,000/day average (age-weighted)
  const steps = ageWeighted(birthDate, (a) => {
    if (a < 1) return 0
    if (a < 5) return 3000
    if (a < 12) return 10000
    if (a < 18) return 8000
    if (a < 65) return 7000
    return 4000
  })
  pool.push({
    label: L('걸은 걸음 수', 'Steps taken'),
    value: `${fl(steps)}`,
    sub: L('하루 평균 약 7,000걸음', '~7,000 steps per day on average'),
  })

  // Red blood cells created: ~200 billion/day
  const rbcCreated = days * 200_000_000_000
  pool.push({
    label: L('만들어진 적혈구', 'Red blood cells created'),
    value: `${fl(rbcCreated)}`,
    sub: L('매일 2,000억 개씩, 지금 이 순간에도', '200 billion per day, even right now'),
  })

  // Cells died and replaced: ~330 billion/day
  const cellsReplaced = days * 330_000_000_000
  pool.push({
    label: L('교체된 세포', 'Cells replaced'),
    value: `${fl(cellsReplaced)}`,
    sub: L('매일 3,300억 개의 세포가 새로 태어난다', '330 billion cells reborn each day'),
  })

  // Heart beats today so far
  const now = new Date()
  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes()
  const heartrateNow = age < 12 ? 85 : 72
  const heartbeatsToday = minutesSinceMidnight * heartrateNow
  pool.push({
    label: L('오늘 심장이 뛴 횟수', 'Heartbeats so far today'),
    value: `~${fn(heartbeatsToday)}${t('times', lang)}`,
    sub: L('오늘 하루도 쉬지 않는 중', 'Your heart hasn\'t rested today either'),
  })

  // Saliva: ~1L/day (from age 1)
  const salivaL = ageWeighted(birthDate, (a) => {
    if (a < 1) return 0.3
    return 1.0
  })
  pool.push({
    label: L('만들어진 침', 'Saliva produced'),
    value: `~${fn(Math.round(salivaL))}L`,
    sub: L('하루에 약 1리터, 평생이면 수영장 절반', '~1L/day, half a swimming pool in a lifetime'),
  })

  // Sneezes: ~4/day average
  const sneezes = days * 4
  pool.push({
    label: L('재채기 횟수', 'Times you sneezed'),
    value: `~${fn(sneezes)}${t('times', lang)}`,
    sub: L('시속 160km의 바람을 만들었다', 'Each one at ~160km/h wind speed'),
  })

  // Yawns: ~8/day
  const yawns = days * 8
  pool.push({
    label: L('하품 횟수', 'Times you yawned'),
    value: `~${fn(yawns)}${t('times', lang)}`,
    sub: L('읽는 것만으로도 전염된다', 'Even reading this can be contagious'),
  })

  // --- FOOD ---

  // Eggs eaten: ~250/year (from age 2)
  const eggsAge = Math.max(0, age - 2)
  const eggs = Math.round(eggsAge * 250)
  pool.push({
    label: L('먹은 달걀', 'Eggs eaten'),
    value: `~${fn(eggs)}${L('개', '')}`,
    sub: L('닭 약 10마리가 평생 낳는 양', '~10 chickens\' lifetime production'),
  })

  // Rice/bread: culture-specific
  if (lang === 'ko' || lang === 'ja' || lang === 'zh') {
    // Rice: ~60kg/year in Korea (from age 2)
    const riceAge = Math.max(0, age - 2)
    const riceKg = Math.round(riceAge * 60)
    pool.push({
      label: L('먹은 쌀', 'Rice consumed'),
      value: `~${fn(riceKg)}kg`,
      sub: L('쌀 한 톨 한 톨이 모여서', 'Every single grain adds up'),
    })
  } else {
    // Bread: ~20kg/year Western average (from age 2)
    const breadAge = Math.max(0, age - 2)
    const breadKg = Math.round(breadAge * 20)
    pool.push({
      label: 'Bread consumed',
      value: `~${fn(breadKg)}kg`,
      sub: 'Slice by slice, loaf by loaf',
    })
  }

  // Glasses of water: ~8/day (from age 5)
  const waterGlasses = ageWeighted(birthDate, (a) => {
    if (a < 1) return 0
    if (a < 5) return 4
    return 8
  })
  pool.push({
    label: L('마신 물잔 수', 'Glasses of water'),
    value: `~${fn(waterGlasses)}${L('잔', '')}`,
  })

  // Teeth brushed: ~2/day from age 2
  const brushAge = Math.max(0, age - 2)
  const teethBrushed = brushAge * 365 * 2
  pool.push({
    label: L('양치질 횟수', 'Times brushed teeth'),
    value: `~${fn(teethBrushed)}${t('times', lang)}`,
    sub: L('하루 두 번, 꾸준히', 'Twice a day, every day'),
  })

  // Culture-specific food
  if (lang === 'ko') {
    // Ramen: ~80 servings/year in Korea (from age 5)
    const ramenAge = Math.max(0, age - 5)
    const ramen = Math.round(ramenAge * 80)
    pool.push({
      label: '먹은 라면',
      value: `~${fn(ramen)}${L('봉지', '')}`,
      sub: '한국인의 소울푸드',
    })

    // Kimchi: ~18kg/year
    const kimchiAge = Math.max(0, age - 3)
    const kimchiKg = Math.round(kimchiAge * 18)
    pool.push({
      label: '먹은 김치',
      value: `~${fn(kimchiKg)}kg`,
      sub: '배추 한 포기 한 포기',
    })
  } else {
    // Pizza: ~40 slices/year Western average (from age 5)
    const pizzaAge = Math.max(0, age - 5)
    const pizza = Math.round(pizzaAge * 40)
    pool.push({
      label: 'Pizza slices eaten',
      value: `~${fn(pizza)}`,
      sub: 'One slice at a time',
    })
  }

  // Chocolate: ~4kg/year (from age 5)
  const chocoAge = Math.max(0, age - 5)
  const chocoKg = (chocoAge * 4).toFixed(0)
  pool.push({
    label: L('먹은 초콜릿', 'Chocolate consumed'),
    value: `~${fn(Number(chocoKg))}kg`,
    sub: L('달콤한 위로의 무게', 'The weight of sweet comfort'),
  })

  // --- DIGITAL (from age 13) ---

  if (smartphoneAge > 0) {
    // Text messages: ~40/day
    const texts = smartphoneAge * 365 * 40
    pool.push({
      label: L('보낸 메시지', 'Text messages sent'),
      value: `~${fn(texts)}`,
      sub: L('한 글자 한 글자에 마음을 담아', 'Every message carried a piece of you'),
    })

    // Emails received: ~30/day
    const emails = smartphoneAge * 365 * 30
    pool.push({
      label: L('받은 이메일', 'Emails received'),
      value: `~${fn(emails)}`,
      sub: L('그중 읽은 건 절반도 안 될 거다', 'You probably read less than half'),
    })

    // Google searches: ~4/day
    const searches = smartphoneAge * 365 * 4
    pool.push({
      label: L('검색한 횟수', 'Google searches'),
      value: `~${fn(searches)}${t('times', lang)}`,
      sub: L('모든 궁금증의 기록', 'A record of all your curiosities'),
    })

    // YouTube videos: ~5/day
    const ytVideos = smartphoneAge * 365 * 5
    pool.push({
      label: L('본 영상', 'Videos watched'),
      value: `~${fn(ytVideos)}`,
      sub: L('추천 알고리즘이 당신을 잘 안다', 'The algorithm knows you well'),
    })

    // Phone battery charges: ~1/day
    const charges = smartphoneAge * 365
    pool.push({
      label: L('폰 충전 횟수', 'Phone battery charges'),
      value: `~${fn(charges)}${t('times', lang)}`,
      sub: L('배터리 1%의 초조함', 'The anxiety of 1% battery'),
    })

    // Passwords entered: ~8/day
    const passwords = smartphoneAge * 365 * 8
    pool.push({
      label: L('비밀번호 입력', 'Passwords entered'),
      value: `~${fn(passwords)}${t('times', lang)}`,
      sub: L('그리고 잊어버린 횟수는...', 'And how many times you forgot them...'),
    })

    // WiFi networks: ~3 unique/week
    const wifi = Math.round(smartphoneAge * 52 * 3)
    pool.push({
      label: L('연결한 WiFi', 'WiFi networks connected'),
      value: `~${fn(wifi)}`,
      sub: L('"비밀번호가 뭐예요?"', '"What\'s the WiFi password?"'),
    })

    // App downloads: ~30/year
    const apps = smartphoneAge * 30
    pool.push({
      label: L('다운로드한 앱', 'Apps downloaded'),
      value: `~${fn(apps)}`,
      sub: L('그중 아직 쓰는 건 몇 개?', 'How many do you still use?'),
    })

    // Selfies: ~2/day
    const selfies = smartphoneAge * 365 * 2
    pool.push({
      label: L('찍은 셀카', 'Selfies taken'),
      value: `~${fn(selfies)}`,
      sub: L('최소 3번은 다시 찍었을 거다', 'At least 3 retakes each time'),
    })

    // Notifications: ~80/day
    const notifs = smartphoneAge * 365 * 80
    pool.push({
      label: L('받은 알림', 'Notifications received'),
      value: `~${fn(notifs)}`,
      sub: L('무음 모드가 된 날도 많았을 거다', 'Silent mode was your best friend'),
    })
  }

  // --- SOCIAL ---

  // Words spoken: ~16,000/day (age-weighted)
  const words = ageWeighted(birthDate, (a) => {
    if (a < 1) return 0
    if (a < 3) return 500
    if (a < 6) return 5000
    if (a < 12) return 10000
    return 16000
  })
  pool.push({
    label: L('말한 단어 수', 'Words spoken'),
    value: `${fl(words)}`,
    sub: L('하루에 약 16,000단어', '~16,000 words per day'),
  })

  // Times said hello: ~5/day (from age 3)
  const hellos = ageWeighted(birthDate, (a) => {
    if (a < 3) return 0
    if (a < 6) return 3
    return 5
  })
  pool.push({
    label: L('"안녕" 이라고 한 횟수', 'Times said "hello"'),
    value: `~${fn(hellos)}${t('times', lang)}`,
    sub: L('모든 관계는 인사에서 시작된다', 'Every relationship started with a greeting'),
  })

  // Hugs: kids 8/day -> adults 2/day
  const hugs = ageWeighted(birthDate, (a) => {
    if (a < 1) return 12
    if (a < 5) return 8
    if (a < 12) return 4
    return 2
  })
  pool.push({
    label: L('안아준 횟수', 'Hugs given & received'),
    value: `~${fn(hugs)}${t('times', lang)}`,
    sub: L('20초의 포옹이 스트레스를 줄인다', 'A 20-second hug reduces stress'),
  })

  // Friends: Dunbar's number
  const friends = Math.min(150, Math.round(age * 5))
  pool.push({
    label: L('의미 있는 인연', 'Meaningful connections'),
    value: `~${friends}${t('people_unit', lang)}`,
    sub: L('던바의 수: 인간이 유지할 수 있는 관계는 ~150명', 'Dunbar\'s number: ~150 stable relationships'),
  })

  // Conversations had: ~10/day (from age 3)
  const convos = ageWeighted(birthDate, (a) => {
    if (a < 3) return 0
    if (a < 6) return 5
    return 10
  })
  pool.push({
    label: L('나눈 대화', 'Conversations had'),
    value: `~${fn(convos)}`,
    sub: L('어떤 대화는 인생을 바꿨다', 'Some conversations changed your life'),
  })

  // --- TIME ---

  // Fridays lived
  const fridays = Math.floor(days / 7)
  pool.push({
    label: L('겪은 금요일', 'Fridays lived'),
    value: `${fn(fridays)}${t('times', lang)}`,
    sub: L('매주 기다린 그 날', 'The day you waited for every week'),
  })

  // Friday the 13ths: ~1.7/year
  const fri13 = Math.round(age * 1.72)
  pool.push({
    label: L('13일의 금요일', 'Friday the 13ths'),
    value: `~${fri13}${t('times', lang)}`,
    sub: L('그래도 별일 없었잖아', 'And nothing bad happened, right?'),
  })

  // Leap years
  const leapYears = Math.floor(age / 4)
  pool.push({
    label: L('겪은 윤년', 'Leap years lived through'),
    value: `${leapYears}${t('times', lang)}`,
    sub: L('2월 29일이 선물처럼 찾아온 날', 'When February 29th appeared like a gift'),
  })

  // Hours spent eating: ~1.5h/day
  const eatingHours = Math.round(days * 1.5)
  const eatingYears = (eatingHours / (365 * 24)).toFixed(1)
  pool.push({
    label: L('식사에 쓴 시간', 'Time spent eating'),
    value: `~${eatingYears}${t('years', lang)}`,
    sub: L('하루 약 1.5시간, 맛있게', '~1.5 hours a day, savoring each bite'),
  })

  // Hours in bathroom: ~30min/day
  const bathroomHours = Math.round(days * 0.5)
  const bathroomYears = (bathroomHours / (365 * 24)).toFixed(1)
  pool.push({
    label: L('화장실에서 보낸 시간', 'Time spent in the bathroom'),
    value: `~${bathroomYears}${t('years', lang)}`,
    sub: L('스마트폰 시대엔 더 길어졌을 거다', 'Probably longer in the smartphone era'),
  })

  // Hours commuting (from age 20): ~1h/day
  if (age >= 20) {
    const commuteAge = age - 20
    const commuteHours = commuteAge * 365
    const commuteYears = (commuteHours / (365 * 24)).toFixed(1)
    pool.push({
      label: L('출퇴근/이동 시간', 'Time spent commuting'),
      value: `~${commuteYears}${t('years', lang)}`,
      sub: L('하루 1시간, 인생의 일부', '~1 hour per day of your life'),
    })
  }

  // Hours spent waiting: ~30min/day
  const waitingHours = Math.round(days * 0.5)
  const waitingYears = (waitingHours / (365 * 24)).toFixed(1)
  pool.push({
    label: L('기다린 시간', 'Time spent waiting'),
    value: `~${waitingYears}${t('years', lang)}`,
    sub: L('줄 서기, 신호등, 배달, 답장...', 'Lines, traffic lights, deliveries, replies...'),
  })

  // Percentage of life sleeping
  const sleepPct = ((sleepHours / (days * 24)) * 100).toFixed(0)
  pool.push({
    label: L('인생 중 잠잔 비율', '% of life spent sleeping'),
    value: `~${sleepPct}%`,
    sub: L('깨어있는 시간이 진짜 당신의 인생', 'Your waking hours are your real life'),
  })

  // Percentage of life in school (age 6-18)
  if (age >= 6) {
    const schoolYears = Math.min(12, Math.max(0, age - 6))
    const schoolPct = ((schoolYears / age) * 100).toFixed(0)
    pool.push({
      label: L('인생 중 학교에 있던 비율', '% of life in school'),
      value: `~${schoolPct}%`,
      sub: L(`약 ${schoolYears}년간의 배움의 시간`, `~${schoolYears} years of learning`),
    })
  }

  // Percentage of life working (from age 22)
  if (age >= 22) {
    const workYears = age - 22
    const workPct = ((workYears / age) * 100).toFixed(0)
    pool.push({
      label: L('인생 중 일한 비율', '% of life spent working'),
      value: `~${workPct}%`,
      sub: L(`약 ${workYears}년간의 노동`, `~${workYears} years of work`),
    })
  }

  // Minutes lived
  const minutesLived = days * 24 * 60
  pool.push({
    label: L('살아온 분', 'Minutes lived'),
    value: `${fl(minutesLived)}`,
    sub: L('이 순간에도 1분이 지나간다', 'Another minute passes as you read this'),
  })

  // Seconds alive
  const secondsLived = days * 24 * 60 * 60
  pool.push({
    label: L('살아온 초', 'Seconds lived'),
    value: `${fl(secondsLived)}`,
    sub: L('1초 1초가 모여 당신이 됐다', 'Every second added up to become you'),
  })

  // --- NATURE ---

  // Trees providing oxygen: 7-8 trees/year
  const trees = Math.round(age * 7.5)
  pool.push({
    label: L('당신의 산소를 만든 나무', 'Trees that provided your oxygen'),
    value: `~${trees}${L('그루', ' trees')}`,
    sub: L('매년 약 7~8그루가 당신을 위해 숨 쉰다', '7-8 trees breathe for you each year'),
  })

  // CO2 exhaled: ~200ml/breath, ~15 breaths/min awake
  const co2Liters = Math.round(breaths * 0.2)
  pool.push({
    label: L('내쉰 CO₂', 'CO₂ you exhaled'),
    value: `~${fn(co2Liters)}L`,
    sub: L('그 CO₂가 식물의 양분이 된다', 'Plants turned your CO₂ into food'),
  })

  // Distance Earth traveled around sun: ~940M km/year
  const earthKm = Math.round(age * 940_000_000)
  pool.push({
    label: L('지구와 함께 이동한 거리', 'Distance traveled with Earth'),
    value: `${fl(earthKm)}km`,
    sub: L('태양 주위를 초속 30km로', 'Orbiting the sun at 30km/s'),
  })

  // Eclipses: ~4-5 per year (solar + lunar combined, visible somewhere)
  const eclipses = Math.round(age * 4.5)
  pool.push({
    label: L('일어난 일식/월식', 'Solar & lunar eclipses'),
    value: `~${eclipses}${t('times', lang)}`,
    sub: L('직접 본 건 몇 번일까?', 'How many did you actually see?'),
  })

  // Earth rotations = days lived
  pool.push({
    label: L('지구가 자전한 횟수', 'Times Earth rotated'),
    value: `${fn(days)}${t('times', lang)}`,
    sub: L('당신과 함께 매일 한 바퀴', 'One spin with you every day'),
  })

  // Stars visible on a clear night: ~4,500
  pool.push({
    label: L('맑은 밤에 보이는 별', 'Stars visible on a clear night'),
    value: `~4,500`,
    sub: L('우리 은하에만 2,000억 개의 별이 있다', '200 billion stars in our galaxy alone'),
  })

  // Meteor showers witnessed (age-based, ~12/year visible)
  const meteorShowers = age * 12
  pool.push({
    label: L('볼 수 있었던 유성우', 'Meteor showers you could have seen'),
    value: `~${meteorShowers}${t('times', lang)}`,
    sub: L('밤하늘을 올려다본 적 있나요?', 'Did you look up at the night sky?'),
  })

  // --- MORE BODY ---

  // Bones at birth vs now
  const bones = age < 1 ? 270 : age < 25 ? Math.round(270 - (age * (270 - 206) / 25)) : 206
  pool.push({
    label: L('지금 뼈의 개수', 'Bones in your body'),
    value: `~${bones}${L('개', '')}`,
    sub: L('태어날 때 270개, 성인은 206개', 'Born with 270, adults have 206'),
  })

  // Bacteria in your body: ~38 trillion
  pool.push({
    label: L('몸속 미생물', 'Microbes in your body'),
    value: `~38${L('조', 'T')}`,
    sub: L('인간 세포보다 더 많다', 'More than your own human cells'),
  })

  // Blood cycles through body: ~1,000 times/day
  const bloodCycles = days * 1000
  pool.push({
    label: L('혈액이 몸을 순환한 횟수', 'Times blood circulated your body'),
    value: `${fl(bloodCycles)}${t('times', lang)}`,
    sub: L('하루에 약 1,000번', '~1,000 times per day'),
  })

  // Taste buds replaced: every 10 days
  const tasteBudCycles = Math.round(days / 10)
  pool.push({
    label: L('미각 세포 교체 횟수', 'Taste bud regenerations'),
    value: `~${fn(tasteBudCycles)}${t('times', lang)}`,
    sub: L('10일마다 새로운 맛의 시작', 'New taste buds every 10 days'),
  })

  // Distance blood traveled: ~19,000km/day
  const bloodTravelKm = days * 19000
  pool.push({
    label: L('혈액이 이동한 거리', 'Distance your blood traveled'),
    value: `${fl(bloodTravelKm)}km`,
    sub: L('하루 약 19,000km, 지구 반 바퀴', '~19,000km/day — halfway around Earth'),
  })

  // --- MISC LIFE ---

  // Times you woke up
  pool.push({
    label: L('잠에서 깬 횟수', 'Times you woke up'),
    value: `~${fn(days)}${t('times', lang)}`,
    sub: L('매일 아침 새로운 기회', 'A new chance every morning'),
  })

  // Showers/baths: ~1/day (from age 1)
  const showers = Math.max(0, age - 1) * 365
  pool.push({
    label: L('씻은 횟수', 'Showers & baths'),
    value: `~${fn(showers)}${t('times', lang)}`,
    sub: L('샤워에서 떠오른 아이디어들', 'All those shower thoughts'),
  })

  // Times you got dressed
  pool.push({
    label: L('옷을 입은 횟수', 'Times you got dressed'),
    value: `~${fn(days)}${t('times', lang)}`,
    sub: L('"오늘 뭐 입지?" 매일의 고민', '"What should I wear?" — daily dilemma'),
  })

  // Books that could have been read: ~30min/day reading speed
  const booksCouldRead = Math.round(age * 12)
  pool.push({
    label: L('읽을 수 있었던 책', 'Books you could have read'),
    value: `~${fn(booksCouldRead)}${L('권', '')}`,
    sub: L('하루 30분이면 한 달에 1권', '30 min/day = 1 book per month'),
  })

  // Songs heard: ~20/day (from age 5)
  const songsAge = Math.max(0, age - 5)
  const songs = songsAge * 365 * 20
  pool.push({
    label: L('들은 노래', 'Songs listened to'),
    value: `~${fn(songs)}`,
    sub: L('어떤 노래는 시간여행을 시킨다', 'Some songs are time machines'),
  })

  // Doors opened: ~20/day
  const doors = days * 20
  pool.push({
    label: L('열어본 문', 'Doors you opened'),
    value: `~${fn(doors)}`,
    sub: L('모든 문 뒤에 새로운 세계', 'A new world behind every door'),
  })

  // Times you looked in a mirror: ~8/day (from age 3)
  const mirrorAge = Math.max(0, age - 3)
  const mirrorLooks = mirrorAge * 365 * 8
  pool.push({
    label: L('거울을 본 횟수', 'Times you looked in a mirror'),
    value: `~${fn(mirrorLooks)}${t('times', lang)}`,
    sub: L('거울 속 당신은 계속 달라지고 있다', 'The person in the mirror keeps changing'),
  })

  // Handshakes: ~1/day from age 6
  const handshakeAge = Math.max(0, age - 6)
  const handshakes = handshakeAge * 365
  pool.push({
    label: L('악수 횟수', 'Handshakes given'),
    value: `~${fn(handshakes)}`,
    sub: L('손에 담긴 첫인상', 'A first impression in your palm'),
  })

  // Decisions per day: ~35,000 (adult)
  const decisions = ageWeighted(birthDate, (a) => {
    if (a < 3) return 0
    if (a < 12) return 5000
    return 35000
  })
  pool.push({
    label: L('내린 결정', 'Decisions you made'),
    value: `${fl(decisions)}`,
    sub: L('어른은 하루에 약 35,000번 선택한다', 'Adults make ~35,000 decisions per day'),
  })

  // Times you said "thank you": ~3/day from age 3
  const thankAge = Math.max(0, age - 3)
  const thanks = thankAge * 365 * 3
  pool.push({
    label: L('"감사합니다" 한 횟수', 'Times you said "thank you"'),
    value: `~${fn(thanks)}${t('times', lang)}`,
    sub: L('작은 감사가 세상을 바꾼다', 'Small gratitude changes the world'),
  })

  // --- EMOTIONAL (text-based) ---

  pool.push({
    label: L('살아낸 최악의 날', 'Worst days survived'),
    value: '100%',
    sub: L('당신은 모든 최악의 날을 이겨냈다', 'You survived 100% of your worst days'),
  })

  pool.push({
    label: L('지금 이 순간', 'Right now'),
    value: L('가장 젊은 날', 'Your youngest day'),
    sub: L('앞으로 당신이 가장 젊은 순간은 바로 지금', 'The youngest you\'ll ever be again is right now'),
  })

  pool.push({
    label: L('같은 생일의 사람', 'People sharing your birthday'),
    value: `~${fn(Math.round(8_000_000_000 / 365))}${t('people_unit', lang)}`,
    sub: L('지금 이 순간에도 누군가와 같은 날 태어났다', 'Someone right now shares your exact birthday'),
  })

  // Times the sun rose just for you (= same as days, but emotional framing)
  pool.push({
    label: L('당신을 위해 뜬 아침', 'Mornings that dawned for you'),
    value: `${fn(days)}`,
    sub: L('내일도 해는 뜬다', 'The sun will rise again tomorrow'),
  })

  // Your unique genome
  pool.push({
    label: L('당신의 DNA 조합 확률', 'Odds of your exact DNA'),
    value: L('400조 분의 1', '1 in 400 trillion'),
    sub: L('당신이 태어난 것 자체가 기적', 'Your very existence is a miracle'),
  })

  // Smiles received: ~15/day
  const smiles = ageWeighted(birthDate, (a) => {
    if (a < 1) return 30
    if (a < 5) return 20
    return 15
  })
  pool.push({
    label: L('받은 미소', 'Smiles received'),
    value: `~${fn(smiles)}${t('times', lang)}`,
    sub: L('미소는 0.5초 만에 전염된다', 'A smile is contagious in 0.5 seconds'),
  })

  return pool
}


export function getAllFacts(birthDate: string, lang: Lang = 'ko'): LifeFact[] {
  const pool = buildFactPool(birthDate, lang)

  // Separate pinned facts
  const pinFirst = pool.filter(f => f.pinFirst)
  const pinLast = pool.filter(f => f.pinLast)
  const rest = pool.filter(f => !f.pinFirst && !f.pinLast)

  // Seeded shuffle of the rest, consistent within a day
  const seed = dateSeed(birthDate)
  const rng = mulberry32(seed)
  const shuffled = seededShuffle(rest, rng)

  // Select ~35 from shuffled (minus pinned slots)
  const TARGET = 35
  const selectCount = Math.min(TARGET - pinFirst.length - pinLast.length, shuffled.length)
  const selected = shuffled.slice(0, selectCount)

  // Combine: first pinned, then selected, then last pinned
  const combined: RawFact[] = [...pinFirst, ...selected, ...pinLast]

  // Assign layout (align/size) based on index
  return combined.map((f, i): LifeFact => ({
    label: f.label,
    value: f.value,
    sub: f.sub,
    align: ALIGNS[i % ALIGNS.length],
    size: SIZES[i % SIZES.length],
  }))
}

function getDaysUntilBirthday(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
  if (next.getTime() < today.getTime()) next.setFullYear(next.getFullYear() + 1)
  return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}
