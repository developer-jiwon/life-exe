import type { FamousPerson } from './types'

export const FAMOUS_PEOPLE: FamousPerson[] = [
  // Tech
  { name: '스티브 잡스', nameEn: 'Steve Jobs', achievement: '애플을 공동 창업했다', achievementEn: 'co-founded Apple', achievementJa: 'Appleを共同創業した', achievementZh: '共同创立了苹果', achievementHi: 'Apple की सह-स्थापना की', age: 21, category: 'tech' },
  { name: '마크 저커버그', nameEn: 'Mark Zuckerberg', achievement: '페이스북을 창업했다', achievementEn: 'founded Facebook', achievementJa: 'Facebookを創業した', achievementZh: '创立了Facebook', achievementHi: 'Facebook की स्थापना की', age: 19, category: 'tech' },
  { name: '빌 게이츠', nameEn: 'Bill Gates', achievement: '마이크로소프트를 창업했다', achievementEn: 'founded Microsoft', achievementJa: 'Microsoftを創業した', achievementZh: '创立了微软', achievementHi: 'Microsoft की स्थापना की', age: 20, category: 'tech' },
  { name: '래리 페이지', nameEn: 'Larry Page', achievement: '구글을 창업했다', achievementEn: 'founded Google', achievementJa: 'Googleを創業した', achievementZh: '创立了Google', achievementHi: 'Google की स्थापना की', age: 25, category: 'tech' },
  { name: '잭 도시', nameEn: 'Jack Dorsey', achievement: '트위터를 만들었다', achievementEn: 'created Twitter', achievementJa: 'Twitterを作った', achievementZh: '创建了Twitter', achievementHi: 'Twitter बनाया', age: 29, category: 'tech' },
  { name: '일론 머스크', nameEn: 'Elon Musk', achievement: 'SpaceX를 창업했다', achievementEn: 'founded SpaceX', achievementJa: 'SpaceXを創業した', achievementZh: '创立了SpaceX', achievementHi: 'SpaceX की स्थापना की', age: 31, category: 'tech' },
  { name: '제프 베조스', nameEn: 'Jeff Bezos', achievement: '아마존을 창업했다', achievementEn: 'founded Amazon', achievementJa: 'Amazonを創業した', achievementZh: '创立了亚马逊', achievementHi: 'Amazon की स्थापना की', age: 30, category: 'tech' },
  { name: '이수만', nameEn: 'Lee Soo-man', achievement: 'SM엔터테인먼트를 설립했다', achievementEn: 'founded SM Entertainment', achievementJa: 'SMエンターテインメントを設立した', achievementZh: '创立了SM娱乐', achievementHi: 'SM Entertainment की स्थापना की', age: 43, category: 'tech' },
  { name: '김범수', nameEn: 'Kim Beom-su', achievement: '카카오를 창업했다', achievementEn: 'founded Kakao', achievementJa: 'カカオを創業した', achievementZh: '创立了Kakao', achievementHi: 'Kakao की स्थापना की', age: 34, category: 'tech' },
  { name: '이해진', nameEn: 'Lee Hae-jin', achievement: '네이버를 창업했다', achievementEn: 'founded Naver', achievementJa: 'NAVERを創業した', achievementZh: '创立了Naver', achievementHi: 'Naver की स्थापना की', age: 31, category: 'tech' },

  // Art
  { name: '파블로 피카소', nameEn: 'Pablo Picasso', achievement: '첫 유화를 완성했다', achievementEn: 'completed his first oil painting', achievementJa: '初の油絵を完成させた', achievementZh: '完成了第一幅油画', achievementHi: 'पहली तेल चित्रकारी पूरी की', age: 8, category: 'art' },
  { name: '레오나르도 다빈치', nameEn: 'Leonardo da Vinci', achievement: '모나리자를 그리기 시작했다', achievementEn: 'began painting the Mona Lisa', achievementJa: 'モナ・リザを描き始めた', achievementZh: '开始绘制蒙娜丽莎', achievementHi: 'मोना लिसा बनाना शुरू किया', age: 51, category: 'art' },
  { name: '빈센트 반 고흐', nameEn: 'Vincent van Gogh', achievement: '별이 빛나는 밤을 그렸다', achievementEn: 'painted The Starry Night', achievementJa: '星月夜を描いた', achievementZh: '画了星空', achievementHi: 'The Starry Night बनाई', age: 36, category: 'art' },
  { name: 'J.K. 롤링', nameEn: 'J.K. Rowling', achievement: '해리포터 첫 권을 출간했다', achievementEn: 'published the first Harry Potter book', achievementJa: 'ハリー・ポッター第1巻を出版した', achievementZh: '出版了哈利波特第一本', achievementHi: 'पहली Harry Potter किताब प्रकाशित की', age: 31, category: 'art' },
  { name: '봉준호', nameEn: 'Bong Joon-ho', achievement: '기생충으로 아카데미를 수상했다', achievementEn: 'won the Academy Award with Parasite', achievementJa: 'パラサイトでアカデミー賞を受賞した', achievementZh: '凭寄生虫获得奥斯卡', achievementHi: 'Parasite से Academy Award जीता', age: 50, category: 'art' },
  { name: '무라카미 하루키', nameEn: 'Haruki Murakami', nameJa: '村上春樹', achievement: '바람의 노래를 들어라를 출간했다', achievementEn: 'published Hear the Wind Sing', achievementJa: '風の歌を聴けを出版した', achievementZh: '出版了且听风吟', achievementHi: 'Hear the Wind Sing प्रकाशित की', age: 30, category: 'art' },
  { name: '한강', nameEn: 'Han Kang', achievement: '채식주의자로 맨부커상을 수상했다', achievementEn: 'won the Man Booker Prize with The Vegetarian', achievementJa: '菜食主義者でマンブッカー賞を受賞した', achievementZh: '凭素食者获得布克奖', achievementHi: 'The Vegetarian से Man Booker Prize जीता', age: 46, category: 'art' },
  { name: '백남준', nameEn: 'Nam June Paik', achievement: '비디오 아트를 세계에 알렸다', achievementEn: 'introduced video art to the world', achievementJa: 'ビデオアートを世界に広めた', achievementZh: '将视频艺术推向世界', achievementHi: 'दुनिया को video art से परिचित कराया', age: 32, category: 'art' },

  // Sports
  { name: '리오넬 메시', nameEn: 'Lionel Messi', achievement: 'FC 바르셀로나 1군에 데뷔했다', achievementEn: 'debuted for FC Barcelona first team', achievementJa: 'FCバルセロナのトップチームにデビューした', achievementZh: '在巴萨一线队首秀', achievementHi: 'FC Barcelona की पहली टीम में डेब्यू किया', age: 17, category: 'sports' },
  { name: '손흥민', nameEn: 'Son Heung-min', achievement: 'EPL 득점왕이 됐다', achievementEn: 'became EPL top scorer', achievementJa: 'EPL得点王になった', achievementZh: '成为英超金靴', achievementHi: 'EPL के टॉप स्कोरर बने', age: 29, category: 'sports' },
  { name: '김연아', nameEn: 'Kim Yuna', nameJa: 'キム・ヨナ', achievement: '올림픽 금메달을 땄다', achievementEn: 'won Olympic gold', achievementJa: 'オリンピック金メダルを獲得した', achievementZh: '获得奥运金牌', achievementHi: 'Olympic स्वर्ण पदक जीता', age: 19, category: 'sports' },
  { name: '마이클 조던', nameEn: 'Michael Jordan', achievement: 'NBA 첫 우승을 했다', achievementEn: 'won his first NBA championship', achievementJa: 'NBA初優勝を果たした', achievementZh: '赢得NBA首冠', achievementHi: 'पहली NBA चैंपियनशिप जीती', age: 28, category: 'sports' },
  { name: '오타니 쇼헤이', nameEn: 'Shohei Ohtani', nameJa: '大谷翔平', achievement: 'MLB 투타 겸업 시즌을 시작했다', achievementEn: 'started his two-way MLB season', achievementJa: 'MLB二刀流シーズンを始めた', achievementZh: '开始MLB投打双栖赛季', achievementHi: 'MLB में two-way सीज़न शुरू किया', age: 23, category: 'sports' },
  { name: '이강인', nameEn: 'Lee Kang-in', achievement: 'PSG에 입단했다', achievementEn: 'joined PSG', achievementJa: 'PSGに入団した', achievementZh: '加入巴黎圣日耳曼', achievementHi: 'PSG में शामिल हुए', age: 22, category: 'sports' },
  { name: '타이거 우즈', nameEn: 'Tiger Woods', achievement: '마스터스 최연소 우승을 했다', achievementEn: 'became youngest Masters champion', achievementJa: 'マスターズ最年少優勝を果たした', achievementZh: '成为最年轻的大师赛冠军', achievementHi: 'सबसे कम उम्र के Masters चैंपियन बने', age: 21, category: 'sports' },

  // Business
  { name: '워런 버핏', nameEn: 'Warren Buffett', achievement: '첫 주식을 샀다', achievementEn: 'bought his first stock', achievementJa: '初めて株を買った', achievementZh: '买了第一只股票', achievementHi: 'पहला स्टॉक ख़रीदा', age: 11, category: 'business' },
  { name: '정주영', nameEn: 'Chung Ju-yung', achievement: '현대건설을 세웠다', achievementEn: 'founded Hyundai Construction', achievementJa: '現代建設を設立した', achievementZh: '创立了现代建设', achievementHi: 'Hyundai Construction की स्थापना की', age: 31, category: 'business' },
  { name: '이건희', nameEn: 'Lee Kun-hee', achievement: '삼성 회장에 취임했다', achievementEn: 'became chairman of Samsung', achievementJa: 'サムスン会長に就任した', achievementZh: '就任三星会长', achievementHi: 'Samsung के चेयरमैन बने', age: 45, category: 'business' },
  { name: '오프라 윈프리', nameEn: 'Oprah Winfrey', achievement: '자신의 토크쇼를 시작했다', achievementEn: 'started her own talk show', achievementJa: '自身のトークショーを始めた', achievementZh: '开始了自己的脱口秀', achievementHi: 'अपना टॉक शो शुरू किया', age: 32, category: 'business' },
  { name: '코코 샤넬', nameEn: 'Coco Chanel', achievement: '첫 매장을 열었다', achievementEn: 'opened her first shop', achievementJa: '最初の店をオープンした', achievementZh: '开了第一家店', achievementHi: 'पहली दुकान खोली', age: 27, category: 'business' },
  { name: '백종원', nameEn: 'Baek Jong-won', achievement: '첫 식당을 열었다', achievementEn: 'opened his first restaurant', achievementJa: '最初のレストランをオープンした', achievementZh: '开了第一家餐厅', achievementHi: 'पहला रेस्टोरेंट खोला', age: 26, category: 'business' },

  // Science
  { name: '알베르트 아인슈타인', nameEn: 'Albert Einstein', achievement: '특수상대성이론을 발표했다', achievementEn: 'published special relativity', achievementJa: '特殊相対性理論を発表した', achievementZh: '发表了狭义相对论', achievementHi: 'विशेष सापेक्षता सिद्धांत प्रकाशित किया', age: 26, category: 'science' },
  { name: '마리 퀴리', nameEn: 'Marie Curie', achievement: '노벨 물리학상을 수상했다', achievementEn: 'won the Nobel Prize in Physics', achievementJa: 'ノーベル物理学賞を受賞した', achievementZh: '获得诺贝尔物理学奖', achievementHi: 'भौतिकी का Nobel Prize जीता', age: 36, category: 'science' },
  { name: '스티븐 호킹', nameEn: 'Stephen Hawking', achievement: '블랙홀 이론을 발표했다', achievementEn: 'published his black hole theory', achievementJa: 'ブラックホール理論を発表した', achievementZh: '发表了黑洞理论', achievementHi: 'ब्लैक होल सिद्धांत प्रकाशित किया', age: 32, category: 'science' },
  { name: '찰스 다윈', nameEn: 'Charles Darwin', achievement: '종의 기원을 출간했다', achievementEn: 'published On the Origin of Species', achievementJa: '種の起源を出版した', achievementZh: '出版了物种起源', achievementHi: 'On the Origin of Species प्रकाशित की', age: 50, category: 'science' },
  { name: '이휘소', nameEn: 'Benjamin W. Lee', achievement: '입자물리학 이론을 발표했다', achievementEn: 'published particle physics theories', achievementJa: '素粒子物理学の理論を発表した', achievementZh: '发表了粒子物理学理论', achievementHi: 'कण भौतिकी सिद्धांत प्रकाशित किए', age: 31, category: 'science' },

  // Music
  { name: 'BTS', nameEn: 'BTS', achievement: '빌보드 Hot 100 1위를 했다', achievementEn: 'reached #1 on Billboard Hot 100', achievementJa: 'Billboard Hot 100で1位を獲得した', achievementZh: '登上Billboard Hot 100第一名', achievementHi: 'Billboard Hot 100 में #1 पहुंचे', age: 24, category: 'music' },
  { name: '비틀즈', nameEn: 'The Beatles', achievement: '에드 설리번 쇼에 출연했다', achievementEn: 'appeared on The Ed Sullivan Show', achievementJa: 'エド・サリヴァン・ショーに出演した', achievementZh: '登上艾德沙利文秀', achievementHi: 'The Ed Sullivan Show में आए', age: 23, category: 'music' },
  { name: '모차르트', nameEn: 'Mozart', achievement: '첫 교향곡을 작곡했다', achievementEn: 'composed his first symphony', achievementJa: '最初の交響曲を作曲した', achievementZh: '创作了第一首交响曲', achievementHi: 'पहली सिम्फनी रची', age: 8, category: 'music' },
  { name: '아이유', nameEn: 'IU', achievement: '좋은 날로 음원 차트를 올킬했다', achievementEn: 'topped all music charts with Good Day', achievementJa: 'Good Dayで音源チャートを制覇した', achievementZh: '凭Good Day横扫音源榜', achievementHi: 'Good Day से सभी म्यूज़िक चार्ट में टॉप किया', age: 17, category: 'music' },
  { name: '빌리 아일리시', nameEn: 'Billie Eilish', achievement: '그래미 주요 4개 부문을 석권했다', achievementEn: 'swept 4 major Grammy categories', achievementJa: 'グラミー主要4部門を制覇した', achievementZh: '横扫格莱美四大奖项', achievementHi: '4 प्रमुख Grammy श्रेणियां जीतीं', age: 18, category: 'music' },
  { name: '이문세', nameEn: 'Lee Moon-sae', achievement: '가로수 그늘 아래 서면을 발표했다', achievementEn: 'released Standing Under the Shade of Trees', achievementJa: '街路樹の木陰の下で立てばを発表した', achievementZh: '发表了站在行道树的树荫下', achievementHi: 'Standing Under the Shade of Trees रिलीज़ किया', age: 29, category: 'music' },
  { name: '유재석', nameEn: 'Yoo Jae-suk', achievement: '무한도전으로 국민MC가 됐다', achievementEn: 'became the nation\'s MC with Infinite Challenge', achievementJa: '無限に挑戦で国民MCになった', achievementZh: '凭无限挑战成为国民MC', achievementHi: 'Infinite Challenge से राष्ट्रीय MC बने', age: 34, category: 'entertainment' },
  { name: '박찬욱', nameEn: 'Park Chan-wook', achievement: '올드보이로 칸 심사위원대상을 수상했다', achievementEn: 'won Grand Prix at Cannes with Oldboy', achievementJa: 'オールド・ボーイでカンヌ審査員大賞を受賞した', achievementZh: '凭老男孩获得戛纳评审团大奖', achievementHi: 'Oldboy से Cannes में Grand Prix जीता', age: 40, category: 'entertainment' },

  // Politics
  { name: '넬슨 만델라', nameEn: 'Nelson Mandela', achievement: '남아프리카 대통령이 됐다', achievementEn: 'became President of South Africa', achievementJa: '南アフリカ大統領になった', achievementZh: '成为南非总统', achievementHi: 'दक्षिण अफ़्रीका के राष्ट्रपति बने', age: 76, category: 'politics' },
  { name: '마틴 루터 킹', nameEn: 'Martin Luther King Jr.', achievement: '"I Have a Dream" 연설을 했다', achievementEn: 'gave the "I Have a Dream" speech', achievementJa: '「I Have a Dream」演説を行った', achievementZh: '发表了"我有一个梦想"演讲', achievementHi: '"I Have a Dream" भाषण दिया', age: 34, category: 'politics' },
  { name: '말랄라 유사프자이', nameEn: 'Malala Yousafzai', achievement: '최연소 노벨평화상을 수상했다', achievementEn: 'became youngest Nobel Peace Prize laureate', achievementJa: '最年少ノーベル平和賞を受賞した', achievementZh: '成为最年轻的诺贝尔和平奖得主', achievementHi: 'सबसे कम उम्र में Nobel शांति पुरस्कार जीता', age: 17, category: 'politics' },
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
