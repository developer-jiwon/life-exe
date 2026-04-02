# Life.exe 기획서

## 1. 한 줄 요약

> 내 인생이 몇% 왔는지 픽셀로 보여주고, 매일 한 칸씩 색칠하며, 같은 나이에 뭘 이룬 사람이 있는지 알려주는 앱.

---

## 2. 경쟁앱 분석

| 앱 | 뭘 하냐면 | 차이점 (우리가 이기는 것) |
|---|---------|----------------------|
| Lifetime: Life Progress | 인생을 주(week) 단위 점 격자로 시각화 | 점만 보여줌. 감정 색칠 없음. 위인 비교 없음 |
| Year in Pixels (여러 앱) | 1년 365일 감정 색 기록 | 1년 한정. 인생 전체가 아님 |
| Life Calendar | 주 단위 캘린더 | 시각적으로 밋밋. 게이미피케이션 없음 |
| Memento Mori 류 | "넌 죽는다" 리마인더 | 무겁고 우울. 긍정적 동기부여 없음 |

**우리의 Edge**:
1. "인생 전체" 픽셀 격자 (Year in Pixels를 80년으로 확장)
2. 매일 감정/행동 -> 색칠 (패시브가 아니라 액티브)
3. 위인 비교 ("당신 나이에 OO는 이걸 했다") = 매일 여는 이유
4. 디자인이 압도적으로 예뻐야 함 (기존 앱들 다 밋밋)

---

## 3. 핵심 기능

### MVP (Must Have)

**F1. 온보딩**
- 앱 열면 생년월일만 입력 (DatePicker)
- 성별 선택 (기대수명 계산용, 건너뛰기 가능)
- 즉시 인생 진행률 계산 -> 픽셀 격자 표시
- 로그인/회원가입 없음

**F2. 인생 픽셀 격자 (메인 화면)**
- 80년 = 29,200일 = 픽셀 격자 (가로 365 x 세로 80 또는 적응형 레이아웃)
- 지나간 날 = 색칠됨 (기본 회색)
- 오늘부터 매일 기록한 날 = 감정 색상으로 칠해짐
- 줌인/줌아웃: 핀치 줌
  - 줌아웃 = 인생 전체 추상화
  - 줌인 = 월/주 단위 상세
- 상단에 큰 숫자: "인생 OO.O% 진행 중"

**F3. 오늘 색칠하기**
- 하루 1회, 오늘의 감정/행동 탭
- 감정 선택 (탭 1번으로 끝):
  - 기쁨 = 노랑
  - 평온 = 파랑
  - 에너지 = 초록
  - 피곤 = 보라
  - 슬픔 = 남색
  - 분노 = 빨강
  - 게으름 = 회색
- 선택하면 오늘 픽셀이 해당 색으로 칠해짐
- 안 하면 회색으로 남음 (= 기록 안 한 날)

**F4. 위인 비교 (매일 1명)**
- "당신의 나이(OO세)에..."
  - "스티브 잡스는 애플을 창업했다 (21세)"
  - "J.K. 롤링은 해리포터 첫 장을 썼다 (25세)"
  - "방탄소년단은 빌보드 1위를 했다 (평균 24세)"
- 매일 다른 사람 1명 (Supabase에서 가져오기)
- 주눅이 아니라 영감: "아직 시간 있다" 톤
- 한국인 + 글로벌 인물 섞기

**F5. 다양한 진행률 위젯**
- 올해 몇% 남았나
- 이번 달 몇%
- 이번 주 몇%
- 다음 생일까지 D-day
- (선택) 은퇴까지, 목표 날짜까지

**F6. 공유 카드**
- 인생 픽셀 격자 스냅샷 -> 이미지 생성
- "나의 인생은 OO.O% 진행 중" 텍스트
- 이번 달 감정 요약 (가장 많은 색)
- SNS 공유 버튼 (인스타 스토리 사이즈 지원)

### Nice to Have (Phase 2)

- HealthKit 연동: 걸음수 5000+ = 자동 초록, 수면 7h+ = 자동 파랑
- 위젯: 잠금화면/홈화면에 진행률 표시
- 알림: "오늘 아직 색칠 안 했어요" (저녁 9시)
- 월간/연간 리포트: 감정 통계, 가장 많았던 감정, 패턴 분석
- 커스텀 색상: 유저가 감정별 색상 변경
- 다크모드 / 라이트모드

### Phase 3

- 커뮤니티: 다른 사람 격자 구경 (익명)
- 커플/친구 모드: 두 사람의 격자를 나란히
- Apple Watch 연동

---

## 4. 유저 플로우

```
앱 열기
  -> 첫 실행? -> 생년월일 입력 -> 메인 화면
  -> 재방문? -> 메인 화면 (인생 픽셀 격자)

메인 화면
  -> 오늘 픽셀 탭 -> 감정 선택 (7가지) -> 색칠 완료 + 위인 카드 표시
  -> 줌인/줌아웃 -> 격자 탐색
  -> 상단 진행률 숫자 탭 -> 다양한 진행률 목록
  -> 공유 버튼 -> 카드 생성 -> SNS 공유
  -> 설정 -> 생년월일 수정, 알림, 다크모드
```

---

## 5. 수익 모델

### 무료 (기본)
- 인생 격자 보기
- 매일 감정 색칠
- 위인 비교 1명/일
- 기본 진행률 (인생, 올해)
- 광고 (배너 하단)

### 프리미엄 ($2.99/월, $19.99/년)
- 광고 제거
- 위젯 (잠금화면 + 홈화면)
- HealthKit 자동 색칠
- 월간/연간 리포트
- 커스텀 색상
- 모든 진행률 (은퇴, 커스텀 목표)
- 위인 DB 전체 열람 (무료는 오늘 1명만)

### Supabase 제어
| 키 | 용도 |
|---|---|
| `free_famous_per_day` | 무료 유저 위인 표시 수 (기본 1) |
| `premium_price_monthly` | 월 구독가 |
| `premium_price_yearly` | 연 구독가 |
| `feature_healthkit` | HealthKit 연동 on/off |
| `feature_widget` | 위젯 기능 on/off |
| `feature_report` | 리포트 기능 on/off |

---

## 6. 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | Next.js + TailwindCSS v4 |
| 네이티브 | Capacitor (iOS 우선) |
| 렌더링 | Canvas API (픽셀 격자, 핀치 줌) |
| 데이터 저장 | localStorage (유저 데이터 로컬만) |
| 서버 | Supabase (app_config + 위인 DB만) |
| 광고 | AdMob (배너) |
| 분석 | Firebase Analytics |
| 배포 | Vercel (웹) + App Store (iOS) |

---

## 7. Supabase 원격 제어

### app_config 테이블 (필수 키)
| 키 | 값 | 용도 |
|---|---|---|
| `force_update_enabled` | false | 강제 업데이트 |
| `min_version` | "1.0.0" | 최소 버전 |
| `current_app_version` | "1.0.0" | 현재 버전 |
| `update_message` | "" | 업데이트 안내 |
| `ios_app_store_url` | "" | 스토어 링크 |
| `ad_enabled` | true | 광고 on/off |
| `admob_testing` | true | 테스트 광고 |
| `admob_banner_id` | "" | 배너 광고 ID |
| `announcement_enabled` | false | 공지 |
| `announcement_title` | "" | 공지 제목 |
| `announcement_content` | "" | 공지 내용 |
| `maintenance_mode` | false | 유지보수 |
| `free_famous_per_day` | 1 | 무료 위인 수/일 |
| `iap_enabled` | true | IAP on/off |

### famous_people 테이블 (위인 DB)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| name_ko | text | 이름 (한국어) |
| name_en | text | 이름 (영어) |
| achievement_ko | text | 업적 (한국어) |
| achievement_en | text | 업적 (영어) |
| age_at_achievement | int | 업적 달성 나이 |
| category | text | 카테고리 (기술/예술/스포츠/비즈니스/과학/음악) |
| image_url | text | 초상 이미지 (선택) |

초기 데이터: 100명 이상 (한국인 40 + 글로벌 60)

---

## 8. 데이터 구조 (localStorage)

```typescript
interface LifeExeData {
  birthDate: string          // "1998-03-15"
  gender?: 'male' | 'female' | 'other'
  pixels: Record<string, string>  // { "2026-04-02": "joy", "2026-04-01": "calm" }
  settings: {
    darkMode: boolean
    notificationEnabled: boolean
    notificationTime: string  // "21:00"
  }
  premium: boolean
  onboardingDone: boolean
}
```

감정 -> 색상 매핑:
```typescript
const MOOD_COLORS = {
  joy: '#FFD700',      // 노랑/금
  calm: '#5B9BD5',     // 파랑
  energy: '#70AD47',   // 초록
  tired: '#7B68EE',    // 보라
  sad: '#4472C4',      // 남색
  angry: '#FF6B6B',    // 빨강
  lazy: '#A0A0A0',     // 회색
  none: '#2A2A2A',     // 기록 안 한 날 (진한 회색)
} as const
```

---

## 9. 앱스토어 준비물

| 항목 | 내용 |
|------|------|
| 앱 이름 | **Life.exe** |
| 부제 | 내 인생은 몇 퍼센트? |
| 키워드 | 인생,진행률,픽셀,감정,기록,동기부여,위인,캘린더,루틴,메멘토모리 |
| Primary 카테고리 | Lifestyle |
| Secondary 카테고리 | Health & Fitness |
| 개인정보처리방침 | /privacy |
| 이용약관 | /terms |
| 스크린샷 | 6.7" + 6.1" (Jiwon-studio + /appstore-screenshots) |
| 콘텐츠 등급 | 4+ (컨텐츠 제한 없음) |

### 앱 설명 초안 (한국어)
```
내 인생은 지금 몇 퍼센트?

Life.exe는 당신의 인생을 한눈에 보여줍니다.

29,200개의 픽셀. 그게 당신의 인생입니다.
매일 하나의 픽셀에 오늘의 감정을 색칠하세요.

1년 후, 당신의 인생은 하나의 작품이 됩니다.

- 인생 진행률을 한눈에
- 매일 감정을 픽셀로 기록
- "당신의 나이에 스티브 잡스는..."
- 올해, 이번 달, 이번 주 진행률
- 나만의 인생 작품을 SNS에 공유

아직 칠하지 않은 픽셀이 더 많습니다.
오늘부터 색칠을 시작하세요.
```

### 앱 설명 초안 (English)
```
How far along are you in life?

Life.exe visualizes your entire life as pixels.

29,200 pixels. That's your life.
Color one pixel every day with your mood.

After a year, your life becomes a work of art.

- See your life progress at a glance
- Record daily moods as colored pixels
- "At your age, Steve Jobs founded Apple..."
- Track year, month, and week progress
- Share your life artwork on social media

You have more blank pixels than colored ones.
Start painting today.
```

---

## 10. Analytics 이벤트 (GA4 / Firebase)

| 이벤트 | 설명 |
|--------|------|
| `onboarding_complete` | 생년월일 입력 완료 |
| `pixel_colored` | 오늘 감정 색칠 (mood 파라미터) |
| `famous_viewed` | 위인 카드 봄 |
| `share_tapped` | 공유 버튼 탭 |
| `share_completed` | 실제 공유 완료 |
| `zoom_in` | 격자 줌인 |
| `zoom_out` | 격자 줌아웃 |
| `settings_opened` | 설정 열기 |
| `premium_tapped` | 프리미엄 버튼 탭 |
| `premium_purchased` | 구독 완료 |
| `notification_enabled` | 알림 켜기 |
| `app_opened` | 앱 열기 (daily retention 추적) |

---

## 11. 에러 핸들링

| 상황 | 대응 |
|------|------|
| Supabase 다운 | 위인 표시 안 됨 -> "오늘의 인물을 불러올 수 없습니다" + 로컬 캐시 3일치 |
| 네트워크 없음 | 격자/색칠 전부 로컬이라 정상 동작. 위인만 캐시 |
| 생년월일 미입력 | 메인 화면 진입 불가, 온보딩으로 리다이렉트 |
| localStorage 용량 | 29,200일 x 10byte = ~300KB. 문제 없음 |

---

## 12. MVP 개발 범위 (48시간)

### Day 1 (24h)
- [ ] 프로젝트 셋업 (Next.js + Tailwind + Capacitor)
- [ ] 온보딩 UI (생년월일 입력)
- [ ] 인생 진행률 계산 로직
- [ ] 픽셀 격자 렌더링 (Canvas)
- [ ] 감정 선택 UI + 색칠 로직
- [ ] localStorage 저장/불러오기

### Day 2 (24h)
- [ ] 위인 비교 UI + Supabase 연동
- [ ] 위인 DB 초기 데이터 100명 입력
- [ ] 공유 카드 생성 (html2canvas)
- [ ] 다양한 진행률 (올해, 이번 달)
- [ ] AdMob 배너
- [ ] Capacitor iOS 빌드 테스트

### Post-MVP
- [ ] 핀치 줌
- [ ] HealthKit 연동
- [ ] 위젯
- [ ] 프리미엄 구독 (IAP)
- [ ] 알림
- [ ] 다국어 (영/일)
