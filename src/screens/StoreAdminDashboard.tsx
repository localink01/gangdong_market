export function StoreAdminDashboard() {
  const kpis = [
    { label: "내 단골", value: "86", unit: "명" },
    { label: "이번주 방문", value: "57", unit: "건" },
    { label: "쿠폰 사용", value: "24", unit: "건" },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="mx-5 pt-3">
        <div className="kicker">고덕 베이커리</div>
        <h1 className="mt-1 text-[22px] font-bold tracking-tight">상점 운영 대시보드</h1>
      </div>

      <div className="mx-5 mt-4 grid grid-cols-3 gap-2">
        {kpis.map((k) => (
          <div key={k.label} className="glass rounded-2xl p-3 shadow-card">
            <div className="text-[11px] font-semibold text-ink-500">{k.label}</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold">{k.value}</span>
              <span className="text-[11px] text-ink-500">{k.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-5 mt-4 rounded-3xl glass-strong p-4 shadow-glass">
        <div className="kicker">운영 도구</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button className="rounded-2xl bg-white/80 px-3 py-3 text-sm font-semibold shadow-card">
            단골 소식 작성
          </button>
          <button className="rounded-2xl bg-white/80 px-3 py-3 text-sm font-semibold shadow-card">
            오늘의 쿠폰 발행
          </button>
          <button className="rounded-2xl bg-white/80 px-3 py-3 text-sm font-semibold shadow-card">
            스탬프 QR 보기
          </button>
          <button className="rounded-2xl bg-white/80 px-3 py-3 text-sm font-semibold shadow-card">
            방문 기록 확인
          </button>
        </div>
      </div>

      <div className="mx-5 mt-4 rounded-3xl glass p-4 shadow-card">
        <div className="text-sm font-semibold">최근 활동</div>
        <ul className="mt-2 space-y-2 text-xs text-ink-600">
          <li>• 단골 소식 발행: 딸기 크루아상 재입고</li>
          <li>• 쿠폰 사용: 오전 타임 11건</li>
          <li>• 스탬프 적립: 오늘 누적 23건</li>
        </ul>
      </div>
    </div>
  );
}
