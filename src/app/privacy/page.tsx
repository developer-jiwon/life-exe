export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-[#1A1A1A]">
      <h1 className="text-2xl font-bold mb-8">개인정보처리방침</h1>
      <div className="space-y-6 text-sm text-[#6B6B6B] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">1. 수집하는 개인정보</h2>
          <p>Life.exe는 최소한의 정보만 사용합니다.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>생년월일 (앱 내 로컬 저장, 서버 전송 없음)</li>
            <li>성별 (선택 입력, 로컬 저장)</li>
            <li>일일 감정 기록 (로컬 저장)</li>
          </ul>
        </section>
        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">2. 정보의 저장 및 보호</h2>
          <p>모든 개인정보는 사용자의 기기(localStorage)에만 저장되며, 외부 서버로 전송되지 않습니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">3. 광고</h2>
          <p>Google AdMob을 통해 광고가 표시될 수 있습니다. AdMob은 광고 개인화를 위해 기기 식별자를 수집할 수 있습니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">4. 분석</h2>
          <p>Firebase Analytics를 통해 앱 사용 통계를 수집합니다. 개인을 식별할 수 없는 익명 데이터만 수집됩니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">5. 문의</h2>
          <p>개인정보 관련 문의: dev.jiwonnie@gmail.com</p>
        </section>
        <p className="text-xs text-[#A0A0A0]">최종 수정일: 2026-04-02</p>
      </div>
    </div>
  )
}
