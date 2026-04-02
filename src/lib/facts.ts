import { getDaysLived, getAge } from './life'

export interface LifeFact {
  label: string
  value: string
  sub?: string
  align: 'left' | 'center' | 'right'
  size: 'sm' | 'md' | 'lg' | 'xl'
}

// 나이별 가중 평균 계산 헬퍼
function ageWeighted(birthDate: string, rateByAge: (age: number) => number): number {
  const age = getAge(birthDate)
  let total = 0
  for (let y = 0; y <= age; y++) {
    total += rateByAge(y) * 365
  }
  // 올해 남은 일수 보정
  const daysThisYear = getDaysLived(birthDate) - age * 365
  total += rateByAge(age) * (daysThisYear - 365) // 이미 full year 더했으므로 차이만
  return Math.max(0, Math.round(total))
}

function fmt(n: number): string {
  if (n >= 1_000_000_000) return `~${(n / 1_000_000_000).toFixed(1)}억`
  if (n >= 100_000_000) return `~${Math.round(n / 100_000_000)}억`
  if (n >= 10_000) return `~${n.toLocaleString()}`
  return `${n.toLocaleString()}`
}

const ALIGNS: Array<'left' | 'center' | 'right'> = ['left', 'right', 'center', 'left', 'right', 'center', 'right', 'left']
const SIZES: Array<'sm' | 'md' | 'lg' | 'xl'> = ['xl', 'xl', 'lg', 'lg', 'md', 'lg', 'xl', 'md', 'lg', 'lg']

export function getAllFacts(birthDate: string): LifeFact[] {
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

  // ── 기본 (정확) ──
  add('이 세상에 온 지', `${days.toLocaleString()}일`, `${Math.floor(days / 365)}년 ${days % 365}일째`)
  add('보낸 생일', `${age}번`, `다음 생일까지 ${getDaysUntilBirthday(birthDate)}일`)

  // ── 심장 (나이별 심박수 가중 평균) ──
  // 신생아 120, 유아 100, 아동 85, 성인 72
  const heartbeats = ageWeighted(birthDate, (a) => {
    if (a < 1) return 120 * 60 * 24
    if (a < 5) return 100 * 60 * 24
    if (a < 12) return 85 * 60 * 24
    return 72 * 60 * 24
  })
  add('당신의 심장은', `${fmt(heartbeats)} 번`, '쉬지 않고, 하루도 빠짐없이')

  // ── 호흡 (나이별) ──
  // 신생아 40회/분, 유아 25, 아동 20, 성인 15
  const breaths = ageWeighted(birthDate, (a) => {
    if (a < 1) return 40 * 60 * 24
    if (a < 5) return 25 * 60 * 24
    if (a < 12) return 20 * 60 * 24
    return 15 * 60 * 24
  })
  add('숨을 쉰 횟수', `${fmt(breaths)} 번`)

  // ── 눈 깜빡임 ──
  // 신생아 3회/분, 성인 15~20회/분, 평균 15
  const blinks = ageWeighted(birthDate, (a) => {
    if (a < 1) return 3 * 60 * 16 // 깨어있는 16시간
    if (a < 5) return 8 * 60 * 16
    return 15 * 60 * 16
  })
  add('눈을 깜빡인 횟수', `${fmt(blinks)} 번`)

  // ── 수면 (나이별) ──
  // 신생아 16시간, 유아 12, 아동 10, 청소년 9, 성인 7.5
  const sleepHours = ageWeighted(birthDate, (a) => {
    if (a < 1) return 16
    if (a < 5) return 12
    if (a < 12) return 10
    if (a < 18) return 9
    return 7.5
  })
  const sleepYears = (sleepHours / (365 * 24)).toFixed(1)
  add('잠으로 보낸 시간', `~${sleepYears}년`, '인생의 약 1/3은 꿈속에서')

  // ── 꿈 ──
  // 하룻밤 평균 4~6개 꿈, 평균 5
  const dreams = days * 5
  add('꾼 꿈', `~${dreams.toLocaleString()}개`, '대부분은 깨면 잊혀진다')

  // ── 식사 (만2세부터 3끼) ──
  const mealsAge = Math.max(0, age - 2)
  const meals = mealsAge * 365 * 3 + Math.min(age, 2) * 365 * 5 // 아기는 하루 5회 수유/이유식
  add('먹은 끼니', `~${meals.toLocaleString()}끼`, '매일 세 끼, 감사한 일')

  // ── 마신 물 ──
  // 성인 2L/일, 아이 1L, 아기 0.5L
  const waterL = ageWeighted(birthDate, (a) => {
    if (a < 1) return 0.5
    if (a < 12) return 1
    return 2
  })
  add('마신 물', `~${Math.round(waterL).toLocaleString()}L`, `욕조 ${Math.round(waterL / 200)}개 분량`)

  // ── 커피 (만15세부터) ──
  if (age >= 15) {
    const coffeeYears = age - 15
    const coffees = Math.round(coffeeYears * 365 * 1.3) // 한국 평균 1.3잔/일
    add('마신 커피', `~${coffees.toLocaleString()}잔`, `쌓으면 약 ${Math.round(coffees * 0.1)}m`)
  }

  // ── 웃음 ──
  // 아이 300회/일, 성인 15회/일
  const laughs = ageWeighted(birthDate, (a) => {
    if (a < 5) return 300
    if (a < 12) return 100
    return 15
  })
  add('웃은 횟수', `~${laughs.toLocaleString()}번`, '아이일 때 하루 300번, 어른은 15번')

  // ── 울음 ──
  // 아기 3시간/일, 성인 연 30~50회
  const cries = age < 2 ? days * 3 : 2 * 365 * 3 + (age - 2) * 40
  add('울은 횟수', `~${cries.toLocaleString()}번`)

  // ── 계절 ──
  add('지나간 계절', `${age * 4}번의 봄여름가을겨울`, `${age}번의 벚꽃, ${age}번의 첫눈`)

  // ── 일출/일몰 ──
  add('뜬 해', `${days.toLocaleString()}번`, '그중 직접 본 일출은?')
  add('진 해', `${days.toLocaleString()}번`, '기억나는 일몰은 몇 번일까')

  // ── 보름달 ──
  const fullmoons = Math.floor(days / 29.53)
  add('보름달', `${fullmoons}번`, '매달 한 번, 어김없이')

  // ── 무지개 ──
  const rainbows = Math.round(age * 8) // 연평균 ~8회 목격 가능
  add('본 무지개', `~${rainbows}번`, '봤는데 기억 못 하는 것도 있을 거다')

  // ── 비 ──
  const rainyDays = Math.round(days * 0.28) // 한국 연간 약 100일 비
  add('비 온 날', `~${rainyDays.toLocaleString()}일`, '우산 없이 나간 날은?')

  // ── 월요일/주말 ──
  const mondays = Math.floor(days / 7)
  add('겪은 월요일', `${mondays.toLocaleString()}번`, '그래도 다 살아냈다')
  const weekends = mondays * 2
  add('보낸 주말', `${weekends.toLocaleString()}일`, `인생의 ${((weekends / days) * 100).toFixed(0)}%`)

  // ── 새해 ──
  add('맞이한 새해', `${age}번`, '올해 목표는 이뤘나요?')

  // ── 걷기 (만1세부터, 나이별) ──
  const walkKm = ageWeighted(birthDate, (a) => {
    if (a < 1) return 0
    if (a < 5) return 2000 * 0.4 / 1000 // 2000보, 보폭 40cm
    if (a < 12) return 8000 * 0.5 / 1000
    return 6500 * 0.7 / 1000
  })
  const totalKm = Math.round(walkKm)
  add('걸은 거리', `~${totalKm.toLocaleString()}km`, `지구 한 바퀴의 ${((totalKm / 40075) * 100).toFixed(1)}%`)

  // ── 머리카락 ──
  const hairCm = Math.round(age * 15) // ~15cm/년
  add('자란 머리카락', `~${(hairCm / 100).toFixed(1)}m`, '안 잘랐으면 지금쯤...')

  // ── 손톱 ──
  const nailCm = Math.round(age * 3.5 * 12) / 10 // 3.5mm/월
  add('자란 손톱', `~${nailCm}cm`)

  // ── 피부 재생 ──
  const skinCycles = Math.round(days / 27)
  add('피부 재생', `${skinCycles}번`, '27일마다 새 피부')

  // ── 디지털 (스마트폰 보급 후) ──
  const smartphoneAge = Math.max(0, age - 13) // 만13세부터 스마트폰
  if (smartphoneAge > 0) {
    const phoneChecks = smartphoneAge * 365 * 96 // 하루 96회
    add('스마트폰 확인', `~${phoneChecks.toLocaleString()}번`, '하루 평균 96번')

    const photos = smartphoneAge * 365 * 4 // 하루 4장
    add('찍은 사진', `~${photos.toLocaleString()}장`)

    const screenHours = smartphoneAge * 365 * 4.5 // 하루 4.5시간
    const screenYears = (screenHours / (365 * 24)).toFixed(1)
    add('스크린 타임', `~${screenYears}년`, '깨어있는 시간의 약 30%')
  }

  // ── 시간 (정확) ──
  const hours = days * 24
  add('살아온 시간', `${hours.toLocaleString()}시간`, `만 시간의 법칙 ${Math.floor(hours / 10000)}번`)

  // ── 만난 사람 ──
  // 평생 약 80,000명과 마주침, 의미 있는 관계는 ~150명 (던바의 수)
  const peopleMet = Math.round(age * 2500) // 연간 ~2,500명
  add('스쳐간 사람', `~${peopleMet.toLocaleString()}명`, '그중 이름을 아는 사람은 ~150명')

  // ── 추가 신체 ──
  const redBloodCells = Math.round(days * 200_000_000_000 / 1_000_000_000_000) // 하루 2000억개 생성
  add('만들어진 적혈구', `~${redBloodCells}조 개`, '매일 2000억 개씩, 멈추지 않고')

  const km_blood = Math.round(days * 19000 / 1000) // 하루 혈액 19,000km 순환
  add('혈액이 이동한 거리', `~${km_blood.toLocaleString()}만km`, `지구-달 왕복 ${Math.round(km_blood * 1000 / 384400)}번`)

  // ── 음식 상세 ──
  const rice = Math.round(Math.max(0, age - 1) * 365 * 0.3) // 하루 0.3kg
  add('먹은 밥', `~${rice.toLocaleString()}kg`, `쌀 ${Math.round(rice / 60)}포대`)

  const chocolate = Math.round(Math.max(0, age - 5) * 4) // 연간 4kg (한국 평균 ~2kg, 넉넉히)
  if (chocolate > 0) add('먹은 초콜릿', `~${chocolate}kg`)

  // ── 활동 ──
  const showers = Math.round(Math.max(0, age - 1) * 365 * 0.9) // 90% 확률 매일
  add('한 샤워', `~${showers.toLocaleString()}번`)

  const toothbrush = Math.round(Math.max(0, age - 2) * 365 * 2) // 하루 2번
  add('양치질', `~${toothbrush.toLocaleString()}번`, '하루 두 번, 빼먹은 날도 있겠지')

  const toilet = Math.round(days * 6.5) // 하루 6~7회
  add('화장실', `~${toilet.toLocaleString()}번`)

  // ── 감정 ──
  const hugs = Math.round(age < 5 ? age * 365 * 8 : 5 * 365 * 8 + Math.max(0, age - 5) * 365 * 2)
  add('받은 포옹', `~${hugs.toLocaleString()}번`, '아기 때 하루 8번, 어른은 하루 2번')

  const words = Math.round(Math.max(0, age - 2) * 365 * 16000) // 하루 16,000단어
  add('말한 단어', `~${(words / 1_000_000).toFixed(0)}만 단어`, '하루 평균 16,000단어')

  // ── 환경 ──
  const trash = Math.round(age * 365) // 하루 ~1kg
  add('버린 쓰레기', `~${trash.toLocaleString()}kg`, `${(trash / 1000).toFixed(1)}톤`)

  const co2 = Math.round(age * 6.5 * 1000) // 한국 1인당 연간 ~6.5톤 CO2
  add('배출한 CO₂', `~${(co2 / 1000).toFixed(1)}톤`)

  const trees_oxygen = Math.round(days / 2) // 나무 2그루가 1명 1일 산소 공급
  add('산소를 준 나무', `~${trees_oxygen.toLocaleString()}그루·일`, '매일 나무 2그루가 당신을 살렸다')

  // ── 우주 ──
  const earthRotations = days // 지구 자전 = 하루
  add('지구 자전', `${earthRotations.toLocaleString()}바퀴`, '당신과 함께 돌았다')

  const sunOrbit = (days / 365.25).toFixed(1) // 태양 공전
  add('태양 공전', `${sunOrbit}바퀴`, `시속 107,000km로`)

  const distanceInSpace = Math.round(days * 2_574_000) // 태양계가 은하 중심을 돌며 하루 ~257만km 이동
  add('우주에서 이동한 거리', `~${(distanceInSpace / 1_000_000_000).toFixed(1)}억km`, '가만히 있어도 우주는 움직인다')

  // ── 100세 ──
  const daysTo100 = (100 * 365) - days
  if (daysTo100 > 0) {
    add('100세까지', `${daysTo100.toLocaleString()}일`, `아직 ${((daysTo100 / (100 * 365)) * 100).toFixed(1)}% 남았다`)
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
