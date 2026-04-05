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
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">4. 광고</h2>
          <p>Google AdSense를 통해 광고가 표시될 수 있습니다. AdSense는 광고 개인화를 위해 쿠키 및 기기 식별자를 수집할 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">5. 분석</h2>
          <p>Google Analytics를 통해 사이트 사용 통계를 수집합니다. 개인을 식별할 수 없는 익명 데이터만 수집됩니다.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">6. 문의</h2>
          <p>개인정보 관련 문의: <a href="mailto:dev.jiwonnie@gmail.com" className="underline">dev.jiwonnie@gmail.com</a></p>
        </section>

        <p className="text-xs text-[#A0A0A0]">최종 수정일: 2026-04-05</p>
      </div>
    </div>
  )
}
