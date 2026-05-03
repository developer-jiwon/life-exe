export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-[#1A1A1A]">
      <h1 className="text-2xl font-bold mb-8">개인정보처리방침</h1>
      <div className="space-y-6 text-sm text-[#6B6B6B] leading-relaxed">

        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">1. Life.exe — 수집하는 개인정보</h2>
          <p>Life.exe는 최소한의 정보만 사용합니다.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>생년월일 (브라우저 localStorage에만 저장, 서버 전송 없음)</li>
            <li>성별 (선택 입력, localStorage에만 저장)</li>
            <li>일일 감정 기록 (localStorage에만 저장)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">2. End Of What — 수집하는 개인정보</h2>
          <p>End Of What(/eow)은 서버에 데이터를 전송하지 않습니다.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>작성한 문장 텍스트 (브라우저 localStorage에만 저장)</li>
            <li>생성된 영상 (사용자 기기에서만 처리, 서버 전송 없음)</li>
          </ul>
          <p className="mt-2">모든 데이터는 사용자의 브라우저에만 저장되며, 외부 서버로 전송되지 않습니다.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">3. 정보의 저장 및 보호</h2>
          <p>Life.exe와 End Of What의 모든 개인정보는 사용자의 기기(localStorage)에만 저장되며, 외부 서버로 전송되지 않습니다. 브라우저 데이터를 초기화하면 저장된 데이터가 삭제됩니다.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">4. 위탁 처리 (호스팅)</h2>
          <p>본 서비스는 Vercel Inc.(미국)에 웹 호스팅을 위탁합니다. 호스팅 과정에서 IP·접속 시간·User-Agent가 일시적으로 기록될 수 있으며, 익명 통계 외 별도 분석 도구는 사용하지 않습니다.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">5. 광고 및 분석 도구 미사용</h2>
          <p>본 서비스는 광고(Google AdSense 등) 및 사용자 추적 분석 도구(Google Analytics 등)를 사용하지 않습니다.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">6. 국외 이전</h2>
          <p>호스팅 위탁사 Vercel Inc.이 미국에 소재하므로, 위 자동 수집 정보가 국외로 이전될 수 있습니다. 「개인정보 보호법」 제28조의8에 따라 고지합니다.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">7. 만 14세 미만 아동</h2>
          <p>본 서비스는 만 14세 미만 아동의 개인정보를 고의로 수집하지 않습니다.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">8. 개인정보 보호책임자 및 문의</h2>
          <p>개인정보 보호책임자: 황지원 (개발·운영자) · <a href="mailto:dev.jiwonnie@gmail.com" className="underline">dev.jiwonnie@gmail.com</a></p>
        </section>

        <p className="text-xs text-[#A0A0A0]">시행일: 2026년 5월 3일</p>
      </div>
    </div>
  )
}
