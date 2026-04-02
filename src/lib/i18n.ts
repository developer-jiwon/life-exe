export type Lang = 'ko' | 'en' | 'ja' | 'zh' | 'hi'

const T: Record<string, Record<Lang, string>> = {
  // UI
  'edit': { ko: 'Edit', en: 'Edit', ja: 'Edit', zh: 'Edit', hi: 'Edit' },
  'of_your_life': { ko: 'of your life', en: 'of your life', ja: 'of your life', zh: 'of your life', hi: 'of your life' },
  'life_expectancy': { ko: '기대수명 {0}세 기준', en: 'life expectancy {0}y', ja: '平均寿命{0}歳基準', zh: '预期寿命{0}岁', hi: 'जीवन प्रत्याशा {0} वर्ष' },
  'share': { ko: 'Share my life', en: 'Share my life', ja: 'Share my life', zh: 'Share my life', hi: 'Share my life' },
  'every_moment': { ko: 'Every moment counts.', en: 'Every moment counts.', ja: 'Every moment counts.', zh: 'Every moment counts.', hi: 'Every moment counts.' },
  'today': { ko: '오늘', en: 'Today', ja: '今日', zh: '今天', hi: 'आज' },
  'today_sub': { ko: '1일', en: '1 day', ja: '1日', zh: '1天', hi: '1 दिन' },
  'today_msg': { ko: '지금 이 순간도 당신의 인생입니다', en: 'This moment is also your life', ja: 'この瞬間もあなたの人生です', zh: '此刻也是你的人生', hi: 'यह पल भी आपकी ज़िंदगी है' },
  'at_your_age': { ko: 'at your age', en: 'at your age', ja: 'あなたの年齢で', zh: '在你这个年纪', hi: 'आपकी उम्र में' },
  'right_now': { ko: 'Right now. Your age.', en: 'Right now. Your age.', ja: '今まさに、あなたの年齢。', zh: '就是现在，你的年龄。', hi: 'अभी। आपकी उम्र।' },
  'years_ago': { ko: '{0}세 — {1}년 전', en: 'age {0} — {1}y ago', ja: '{0}歳 — {1}年前', zh: '{0}岁 — {1}年前', hi: '{0} वर्ष — {1} साल पहले' },
  'years_left': { ko: '{0}세 — 아직 {1}년', en: 'age {0} — {1}y from now', ja: '{0}歳 — あと{1}年', zh: '{0}岁 — 还有{1}年', hi: '{0} वर्ष — अभी {1} साल' },

  // Fact labels
  'days_alive': { ko: '이 세상에 온 지', en: 'Days alive', ja: 'この世に生まれて', zh: '来到这个世界', hi: 'इस दुनिया में आए' },
  'days_alive_sub': { ko: '{0}년 {1}일째', en: '{0}y {1}d', ja: '{0}年{1}日目', zh: '{0}年{1}天', hi: '{0} साल {1} दिन' },
  'birthdays': { ko: '보낸 생일', en: 'Birthdays', ja: '過ごした誕生日', zh: '过过的生日', hi: 'मनाए गए जन्मदिन' },
  'next_bday': { ko: '다음 생일까지 {0}일', en: '{0}d to next birthday', ja: '次の誕生日まで{0}日', zh: '距下次生日{0}天', hi: 'अगले जन्मदिन तक {0} दिन' },
  'heartbeats': { ko: '당신의 심장은', en: 'Your heart has beaten', ja: 'あなたの心臓は', zh: '你的心脏跳动了', hi: 'आपका दिल धड़का' },
  'heartbeats_sub': { ko: '쉬지 않고, 하루도 빠짐없이', en: 'Without rest, not a single day missed', ja: '休むことなく、一日も欠かさず', zh: '不曾停歇，一天不落', hi: 'बिना रुके, एक दिन भी नहीं छोड़ा' },
  'breaths': { ko: '숨을 쉰 횟수', en: 'Breaths taken', ja: '呼吸した回数', zh: '呼吸次数', hi: 'सांसें ली गईं' },
  'blinks': { ko: '눈을 깜빡인 횟수', en: 'Times you blinked', ja: '瞬きした回数', zh: '眨眼次数', hi: 'पलकें झपकीं' },
  'sleep': { ko: '잠으로 보낸 시간', en: 'Time spent sleeping', ja: '眠りに費やした時間', zh: '睡眠时间', hi: 'नींद में बिताया समय' },
  'sleep_sub': { ko: '인생의 약 1/3은 꿈속에서', en: '~1/3 of your life was in dreams', ja: '人生の約1/3は夢の中で', zh: '人生约1/3在梦中度过', hi: 'जीवन का ~1/3 सपनों में' },
  'dreams': { ko: '꾼 꿈', en: 'Dreams dreamt', ja: '見た夢', zh: '做过的梦', hi: 'देखे गए सपने' },
  'dreams_sub': { ko: '대부분은 깨면 잊혀진다', en: 'Most are forgotten upon waking', ja: 'ほとんどは目覚めると忘れる', zh: '大多数醒来就忘了', hi: 'ज़्यादातर जागने पर भूल जाते हैं' },
  'meals': { ko: '먹은 끼니', en: 'Meals eaten', ja: '食べた食事', zh: '吃过的饭', hi: 'खाए गए भोजन' },
  'meals_sub': { ko: '매일 세 끼, 감사한 일', en: 'Three meals a day, something to be grateful for', ja: '毎日三食、感謝すべきこと', zh: '每天三餐，值得感恩', hi: 'रोज़ तीन वक्त, शुक्रगुज़ार' },
  'water': { ko: '마신 물', en: 'Water consumed', ja: '飲んだ水', zh: '喝过的水', hi: 'पी गया पानी' },
  'water_sub': { ko: '욕조 {0}개 분량', en: '{0} bathtubs worth', ja: '浴槽{0}杯分', zh: '相当于{0}浴缸', hi: '{0} बाथटब जितना' },
  'coffee': { ko: '마신 커피', en: 'Coffees consumed', ja: '飲んだコーヒー', zh: '喝过的咖啡', hi: 'पी गई कॉफ़ी' },
  'laughs': { ko: '웃은 횟수', en: 'Times you laughed', ja: '笑った回数', zh: '笑过的次数', hi: 'हंसी की बार' },
  'laughs_sub': { ko: '아이일 때 하루 300번, 어른은 15번', en: 'Kids laugh 300x/day, adults 15x', ja: '子供は1日300回、大人は15回', zh: '孩子每天笑300次，大人15次', hi: 'बच्चे 300 बार/दिन, बड़े 15 बार' },
  'cries': { ko: '울은 횟수', en: 'Times you cried', ja: '泣いた回数', zh: '哭过的次数', hi: 'रोने की बार' },
  'seasons': { ko: '지나간 계절', en: 'Seasons passed', ja: '過ぎた季節', zh: '经过的季节', hi: 'बीते मौसम' },
  'seasons_val': { ko: '{0}번의 봄여름가을겨울', en: '{0} springs, summers, autumns, winters', ja: '{0}回の春夏秋冬', zh: '{0}次春夏秋冬', hi: '{0} बार बसंत, गर्मी, पतझड़, सर्दी' },
  'seasons_sub': { ko: '{0}번의 벚꽃, {0}번의 첫눈', en: '{0} cherry blossoms, {0} first snows', ja: '{0}回の桜、{0}回の初雪', zh: '{0}次樱花，{0}次初雪', hi: '{0} बार चेरी ब्लॉसम, {0} बार पहली बर्फ' },
  'sunrise': { ko: '뜬 해', en: 'Sunrises', ja: '昇った太陽', zh: '升起的太阳', hi: 'उगे सूरज' },
  'sunrise_sub': { ko: '그중 직접 본 일출은?', en: 'How many did you actually watch?', ja: 'そのうち実際に見た日の出は？', zh: '其中你亲眼看过几次？', hi: 'कितने आपने खुद देखे?' },
  'sunset': { ko: '진 해', en: 'Sunsets', ja: '沈んだ太陽', zh: '落下的太阳', hi: 'डूबे सूरज' },
  'sunset_sub': { ko: '기억나는 일몰은 몇 번일까', en: 'How many sunsets do you remember?', ja: '覚えている夕日はいくつ？', zh: '记得几次日落？', hi: 'कितने सूर्यास्त याद हैं?' },
  'fullmoon': { ko: '보름달', en: 'Full moons', ja: '満月', zh: '满月', hi: 'पूर्णिमा' },
  'fullmoon_sub': { ko: '매달 한 번, 어김없이', en: 'Once a month, without fail', ja: '毎月一度、欠かさず', zh: '每月一次，从不缺席', hi: 'हर महीने, बिना चूके' },
  'rainbow': { ko: '본 무지개', en: 'Rainbows seen', ja: '見た虹', zh: '看过的彩虹', hi: 'देखे गए इंद्रधनुष' },
  'rainbow_sub': { ko: '봤는데 기억 못 하는 것도 있을 거다', en: 'Some you saw but forgot', ja: '見たけど覚えていないものもあるはず', zh: '有些看过但忘了', hi: 'कुछ देखे पर भूल गए' },
  'rain': { ko: '비 온 날', en: 'Rainy days', ja: '雨の日', zh: '下雨天', hi: 'बारिश के दिन' },
  'rain_sub': { ko: '우산 없이 나간 날은?', en: 'Days without an umbrella?', ja: '傘なしで出かけた日は？', zh: '没带伞出门的日子？', hi: 'बिना छाते के कितने दिन?' },
  'mondays': { ko: '겪은 월요일', en: 'Mondays survived', ja: '乗り越えた月曜日', zh: '经历的周一', hi: 'गुज़ारे सोमवार' },
  'mondays_sub': { ko: '그래도 다 살아냈다', en: 'And you survived them all', ja: 'それでも全部乗り越えた', zh: '但你都挺过来了', hi: 'फिर भी सब झेल लिए' },
  'weekends': { ko: '보낸 주말', en: 'Weekends', ja: '過ごした週末', zh: '度过的周末', hi: 'बिताए सप्ताहांत' },
  'newyear': { ko: '맞이한 새해', en: 'New Years', ja: '迎えた新年', zh: '迎接的新年', hi: 'मनाए नए साल' },
  'newyear_sub': { ko: '올해 목표는 이뤘나요?', en: 'Did you achieve this year\'s goals?', ja: '今年の目標は達成した？', zh: '今年的目标实现了吗？', hi: 'इस साल का लक्ष्य पूरा हुआ?' },
  'walking': { ko: '걸은 거리', en: 'Distance walked', ja: '歩いた距離', zh: '走过的距离', hi: 'चली गई दूरी' },
  'walking_sub': { ko: '지구 한 바퀴의 {0}%', en: '{0}% around the Earth', ja: '地球一周の{0}%', zh: '绕地球{0}%', hi: 'पृथ्वी का {0}%' },
  'hair': { ko: '자란 머리카락', en: 'Hair grown', ja: '伸びた髪', zh: '长出的头发', hi: 'बढ़े बाल' },
  'hair_sub': { ko: '안 잘랐으면 지금쯤...', en: 'If you never cut it...', ja: '切らなかったら今頃…', zh: '如果没剪过的话...', hi: 'अगर कभी कटवाए नहीं होते...' },
  'nails': { ko: '자란 손톱', en: 'Nails grown', ja: '伸びた爪', zh: '长出的指甲', hi: 'बढ़े नाखून' },
  'skin': { ko: '피부 재생', en: 'Skin regenerations', ja: '肌の再生', zh: '皮肤再生', hi: 'त्वचा का पुनर्जनन' },
  'skin_sub': { ko: '27일마다 새 피부', en: 'New skin every 27 days', ja: '27日ごとに新しい肌', zh: '每27天换新皮肤', hi: 'हर 27 दिन में नई त्वचा' },
  'phone': { ko: '스마트폰 확인', en: 'Phone checks', ja: 'スマホ確認', zh: '看手机次数', hi: 'फ़ोन चेक' },
  'phone_sub': { ko: '하루 평균 96번', en: '~96 times per day', ja: '1日平均96回', zh: '每天约96次', hi: 'रोज़ औसतन 96 बार' },
  'photos': { ko: '찍은 사진', en: 'Photos taken', ja: '撮った写真', zh: '拍过的照片', hi: 'खींची गई तस्वीरें' },
  'screentime': { ko: '스크린 타임', en: 'Screen time', ja: 'スクリーンタイム', zh: '屏幕时间', hi: 'स्क्रीन टाइम' },
  'screentime_sub': { ko: '깨어있는 시간의 약 30%', en: '~30% of waking hours', ja: '起きている時間の約30%', zh: '清醒时间的约30%', hi: 'जागने के समय का ~30%' },
  'hours': { ko: '살아온 시간', en: 'Hours lived', ja: '生きてきた時間', zh: '活过的小时', hi: 'जीए गए घंटे' },
  'hours_sub': { ko: '만 시간의 법칙 {0}번', en: '10,000-hour rule × {0}', ja: '1万時間の法則 {0}回', zh: '一万小时定律 {0}次', hi: '10,000 घंटे का नियम × {0}' },
  'people': { ko: '스쳐간 사람', en: 'People crossed paths with', ja: 'すれ違った人', zh: '擦肩而过的人', hi: 'मिले लोग' },
  'people_sub': { ko: '그중 이름을 아는 사람은 ~150명', en: 'You know ~150 by name', ja: 'そのうち名前を知っているのは約150人', zh: '其中知道名字的约150人', hi: 'जिनमें ~150 का नाम जानते हैं' },
  'to100': { ko: '100세까지', en: 'Until 100', ja: '100歳まで', zh: '到100岁', hi: '100 साल तक' },
  'to100_sub': { ko: '아직 {0}% 남았다', en: 'Still {0}% left', ja: 'まだ{0}%残っている', zh: '还剩{0}%', hi: 'अभी {0}% बाकी है' },
  // famous person
  'famous_at_your_age': { ko: '당신의 나이({0}세)에...', en: 'At your age ({0})...', ja: 'あなたの年齢({0}歳)で...', zh: '在你这个年纪({0}岁)...', hi: 'आपकी उम्र ({0}) में...' },
  'famous_suffix': { ko: '은(는)', en: '', ja: 'は', zh: '', hi: '' },
  'famous_years_ago': { ko: '{0}세 — 지금보다 {1}년 전', en: 'age {0} — {1}y ago', ja: '{0}歳 — {1}年前', zh: '{0}岁 — {1}年前', hi: '{0} वर्ष — {1} साल पहले' },
  'famous_years_left': { ko: '{0}세 — 아직 {1}년 남았다', en: 'age {0} — {1}y from now', ja: '{0}歳 — あと{1}年', zh: '{0}岁 — 还有{1}年', hi: '{0} वर्ष — अभी {1} साल बाकी' },
  'famous_right_now': { ko: '바로 지금 당신의 나이!', en: 'Right now. Your age!', ja: '今まさに、あなたの年齢！', zh: '就是现在，你的年龄！', hi: 'अभी। आपकी उम्र!' },
  'save': { ko: '저장', en: 'Save', ja: '保存', zh: '保存', hi: 'सेव करें' },
  'try_my_birthday': { ko: '내 생일로 해보기', en: 'Try with my birthday', ja: '自分の誕生日で試す', zh: '用我的生日试试', hi: 'मेरे जन्मदिन से आज़माएं' },
  // units
  'days': { ko: '일', en: ' days', ja: '日', zh: '天', hi: ' दिन' },
  'times': { ko: '번', en: ' times', ja: '回', zh: '次', hi: ' बार' },
  'years': { ko: '년', en: ' years', ja: '年', zh: '年', hi: ' साल' },
  'cups': { ko: '잔', en: ' cups', ja: '杯', zh: '杯', hi: ' कप' },
  'meals_unit': { ko: '끼', en: ' meals', ja: '食', zh: '顿', hi: ' भोजन' },
  'liters': { ko: 'L', en: 'L', ja: 'L', zh: 'L', hi: 'L' },
  'hours_unit': { ko: '시간', en: ' hours', ja: '時間', zh: '小时', hi: ' घंटे' },
  'people_unit': { ko: '명', en: ' people', ja: '人', zh: '人', hi: ' लोग' },
}

export function t(key: string, lang: Lang, ...args: (string | number)[]): string {
  const template = T[key]?.[lang] ?? T[key]?.['ko'] ?? key
  return args.reduce<string>((s, arg, i) => s.replaceAll(`{${i}}`, String(arg)), template)
}

export function getLangFromStorage(): Lang {
  if (typeof window === 'undefined') return 'ko'
  return (localStorage.getItem('life-exe-lang') as Lang) || 'ko'
}

export function saveLang(lang: Lang): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('life-exe-lang', lang)
}

/** Locale string for Intl formatting */
const LOCALE_MAP: Record<Lang, string> = {
  ko: 'ko-KR', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN', hi: 'hi-IN',
}

export function fmtNum(n: number, lang: Lang): string {
  return n.toLocaleString(LOCALE_MAP[lang])
}

export function fmtLargeNum(n: number, lang: Lang): string {
  const locale = LOCALE_MAP[lang]
  if (lang === 'ko' || lang === 'ja' || lang === 'zh') {
    if (n >= 1_000_000_000_000) return `~${(n / 1_000_000_000_000).toFixed(1)}${lang === 'ko' ? '조' : lang === 'ja' ? '兆' : '万亿'}`
    if (n >= 50_000_000) return `~${(n / 100_000_000).toFixed(1)}${lang === 'ko' ? '억' : lang === 'ja' ? '億' : '亿'}`
    if (n >= 10_000) return `~${n.toLocaleString(locale)}`
    return n.toLocaleString(locale)
  }
  if (n >= 1_000_000_000) return `~${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `~${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000) return `~${n.toLocaleString(locale)}`
  return n.toLocaleString(locale)
}

import type { FamousPerson } from './types'

export function getLocalizedFamous(person: FamousPerson, lang: Lang): { name: string; achievement: string } {
  switch (lang) {
    case 'en': return { name: person.nameEn, achievement: person.achievementEn ?? person.achievement }
    case 'ja': return { name: person.nameJa ?? person.nameEn, achievement: person.achievementJa ?? person.achievement }
    case 'zh': return { name: person.nameZh ?? person.nameEn, achievement: person.achievementZh ?? person.achievement }
    case 'hi': return { name: person.nameHi ?? person.nameEn, achievement: person.achievementHi ?? person.achievement }
    default: return { name: person.name, achievement: person.achievement }
  }
}
