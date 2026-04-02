import type { FamousPerson } from './types'

export const FAMOUS_PEOPLE: FamousPerson[] = [
  // Tech
  { name: '스티브 잡스', nameEn: 'Steve Jobs', achievement: '애플을 공동 창업했다', age: 21, category: 'tech' },
  { name: '마크 저커버그', nameEn: 'Mark Zuckerberg', achievement: '페이스북을 창업했다', age: 19, category: 'tech' },
  { name: '빌 게이츠', nameEn: 'Bill Gates', achievement: '마이크로소프트를 창업했다', age: 20, category: 'tech' },
  { name: '래리 페이지', nameEn: 'Larry Page', achievement: '구글을 창업했다', age: 25, category: 'tech' },
  { name: '잭 도시', nameEn: 'Jack Dorsey', achievement: '트위터를 만들었다', age: 29, category: 'tech' },
  { name: '일론 머스크', nameEn: 'Elon Musk', achievement: 'SpaceX를 창업했다', age: 31, category: 'tech' },
  { name: '제프 베조스', nameEn: 'Jeff Bezos', achievement: '아마존을 창업했다', age: 30, category: 'tech' },
  { name: '이수만', nameEn: 'Lee Soo-man', achievement: 'SM엔터테인먼트를 설립했다', age: 43, category: 'tech' },
  { name: '김범수', nameEn: 'Kim Beom-su', achievement: '카카오를 창업했다', age: 34, category: 'tech' },
  { name: '이해진', nameEn: 'Lee Hae-jin', achievement: '네이버를 창업했다', age: 31, category: 'tech' },

  // Art
  { name: '파블로 피카소', nameEn: 'Pablo Picasso', achievement: '첫 유화를 완성했다', age: 8, category: 'art' },
  { name: '레오나르도 다빈치', nameEn: 'Leonardo da Vinci', achievement: '모나리자를 그리기 시작했다', age: 51, category: 'art' },
  { name: '빈센트 반 고흐', nameEn: 'Vincent van Gogh', achievement: '별이 빛나는 밤을 그렸다', age: 36, category: 'art' },
  { name: 'J.K. 롤링', nameEn: 'J.K. Rowling', achievement: '해리포터 첫 권을 출간했다', age: 31, category: 'art' },
  { name: '봉준호', nameEn: 'Bong Joon-ho', achievement: '기생충으로 아카데미를 수상했다', age: 50, category: 'art' },
  { name: '무라카미 하루키', nameEn: 'Haruki Murakami', achievement: '바람의 노래를 들어라를 출간했다', age: 30, category: 'art' },
  { name: '한강', nameEn: 'Han Kang', achievement: '채식주의자로 맨부커상을 수상했다', age: 46, category: 'art' },
  { name: '백남준', nameEn: 'Nam June Paik', achievement: '비디오 아트를 세계에 알렸다', age: 32, category: 'art' },

  // Sports
  { name: '리오넬 메시', nameEn: 'Lionel Messi', achievement: 'FC 바르셀로나 1군에 데뷔했다', age: 17, category: 'sports' },
  { name: '손흥민', nameEn: 'Son Heung-min', achievement: 'EPL 득점왕이 됐다', age: 29, category: 'sports' },
  { name: '김연아', nameEn: 'Kim Yuna', achievement: '올림픽 금메달을 땄다', age: 19, category: 'sports' },
  { name: '마이클 조던', nameEn: 'Michael Jordan', achievement: 'NBA 첫 우승을 했다', age: 28, category: 'sports' },
  { name: '오타니 쇼헤이', nameEn: 'Shohei Ohtani', achievement: 'MLB 투타 겸업 시즌을 시작했다', age: 23, category: 'sports' },
  { name: '이강인', nameEn: 'Lee Kang-in', achievement: 'PSG에 입단했다', age: 22, category: 'sports' },
  { name: '타이거 우즈', nameEn: 'Tiger Woods', achievement: '마스터스 최연소 우승을 했다', age: 21, category: 'sports' },

  // Business
  { name: '워런 버핏', nameEn: 'Warren Buffett', achievement: '첫 주식을 샀다', age: 11, category: 'business' },
  { name: '정주영', nameEn: 'Chung Ju-yung', achievement: '현대건설을 세웠다', age: 31, category: 'business' },
  { name: '이건희', nameEn: 'Lee Kun-hee', achievement: '삼성 회장에 취임했다', age: 45, category: 'business' },
  { name: '오프라 윈프리', nameEn: 'Oprah Winfrey', achievement: '자신의 토크쇼를 시작했다', age: 32, category: 'business' },
  { name: '코코 샤넬', nameEn: 'Coco Chanel', achievement: '첫 매장을 열었다', age: 27, category: 'business' },
  { name: '백종원', nameEn: 'Baek Jong-won', achievement: '첫 식당을 열었다', age: 26, category: 'business' },

  // Science
  { name: '알베르트 아인슈타인', nameEn: 'Albert Einstein', achievement: '특수상대성이론을 발표했다', age: 26, category: 'science' },
  { name: '마리 퀴리', nameEn: 'Marie Curie', achievement: '노벨 물리학상을 수상했다', age: 36, category: 'science' },
  { name: '스티븐 호킹', nameEn: 'Stephen Hawking', achievement: '블랙홀 이론을 발표했다', age: 32, category: 'science' },
  { name: '찰스 다윈', nameEn: 'Charles Darwin', achievement: '종의 기원을 출간했다', age: 50, category: 'science' },
  { name: '이휘소', nameEn: 'Benjamin W. Lee', achievement: '입자물리학 이론을 발표했다', age: 31, category: 'science' },

  // Music
  { name: 'BTS', nameEn: 'BTS', achievement: '빌보드 Hot 100 1위를 했다', age: 24, category: 'music' },
  { name: '비틀즈', nameEn: 'The Beatles', achievement: '에드 설리번 쇼에 출연했다', age: 23, category: 'music' },
  { name: '모차르트', nameEn: 'Mozart', achievement: '첫 교향곡을 작곡했다', age: 8, category: 'music' },
  { name: '아이유', nameEn: 'IU', achievement: '좋은 날로 음원 차트를 올킬했다', age: 17, category: 'music' },
  { name: '빌리 아일리시', nameEn: 'Billie Eilish', achievement: '그래미 주요 4개 부문을 석권했다', age: 18, category: 'music' },
  { name: '이문세', nameEn: 'Lee Moon-sae', achievement: '가로수 그늘 아래 서면을 발표했다', age: 29, category: 'music' },
  { name: '유재석', nameEn: 'Yoo Jae-suk', achievement: '무한도전으로 국민MC가 됐다', age: 34, category: 'entertainment' },
  { name: '박찬욱', nameEn: 'Park Chan-wook', achievement: '올드보이로 칸 심사위원대상을 수상했다', age: 40, category: 'entertainment' },

  // Politics
  { name: '넬슨 만델라', nameEn: 'Nelson Mandela', achievement: '남아프리카 대통령이 됐다', age: 76, category: 'politics' },
  { name: '마틴 루터 킹', nameEn: 'Martin Luther King Jr.', achievement: '"I Have a Dream" 연설을 했다', age: 34, category: 'politics' },
  { name: '말랄라 유사프자이', nameEn: 'Malala Yousafzai', achievement: '최연소 노벨평화상을 수상했다', age: 17, category: 'politics' },
]

export function getFamousPersonForToday(userAge: number): FamousPerson {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))

  const nearAge = FAMOUS_PEOPLE.filter(p => Math.abs(p.age - userAge) <= 5)
  const pool = nearAge.length >= 3 ? nearAge : FAMOUS_PEOPLE

  const index = dayOfYear % pool.length
  return pool[index]
}

export function getFamousPeople(userAge: number, count: number): FamousPerson[] {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))

  const sorted = [...FAMOUS_PEOPLE].sort((a, b) => {
    const diffA = Math.abs(a.age - userAge)
    const diffB = Math.abs(b.age - userAge)
    return diffA - diffB
  })

  const startIdx = dayOfYear % Math.max(1, sorted.length - count)
  return sorted.slice(startIdx, startIdx + count)
}
