export function DistrictDashboard() {
  const summary = [
    { label: "연결 상점가", value: "9", unit: "개" },
    { label: "월간 활성 사용자", value: "2,430", unit: "명" },
    { label: "쿠폰 사용률", value: "41", unit: "%" },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="mx-5 pt-3">
        <div className="kicker">강동구청 지역경제과</div>
        <h1 className="mt-1 text-[22px] font-bold tracking-tight">구청 운영 대시보드</h1>
      </div>

      <div className="mx-5 mt-4 grid grid-cols-3 gap-2">
        {summary.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-3 shadow-card">
            <div className="text-[11px] font-semibold text-ink-500">{s.label}</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold">{s.value}</span>
              <span className="text-[11px] text-ink-500">{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-5 mt-4 rounded-3xl glass-strong p-4 shadow-glass">
        <div className="kicker">상점가 비교</div>
        <div className="mt-2 flex flex-col gap-2">
          <div className="rounded-2xl bg-white/80 px-3 py-2.5 text-sm shadow-card">
            1위 고덕2동 골목형상점가 · 방문 전환율 18.2%
          </div>
          <div className="rounded-2xl bg-white/80 px-3 py-2.5 text-sm shadow-card">
            2위 천호동 골목형상점가 · 방문 전환율 15.4%
          </div>
          <div className="rounded-2xl bg-white/80 px-3 py-2.5 text-sm shadow-card">
            3위 상일동 골목형상점가 · 방문 전환율 13.8%
          </div>
        </div>
      </div>

      <div className="mx-5 mt-4 rounded-3xl glass p-4 shadow-card">
        <div className="text-sm font-semibold">리포트</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button className="rounded-2xl bg-white/80 px-3 py-2.5 text-sm font-semibold shadow-card">
            월간 보고서
          </button>
          <button className="rounded-2xl bg-white/80 px-3 py-2.5 text-sm font-semibold shadow-card">
            CSV 내보내기
          </button>
        </div>
      </div>
    </div>
  );
}
