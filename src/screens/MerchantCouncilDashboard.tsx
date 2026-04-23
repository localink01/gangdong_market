export function MerchantCouncilDashboard() {
  const kpis = [
    { label: "멤버십", value: "127", unit: "명" },
    { label: "참여 점포", value: "18", unit: "곳" },
    { label: "이벤트 참여율", value: "62", unit: "%" },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="mx-5 pt-3">
        <div className="kicker">고덕2동 상인회</div>
        <h1 className="mt-1 text-[22px] font-bold tracking-tight">상인회 운영 대시보드</h1>
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
        <div className="kicker">빠른 실행</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button className="rounded-2xl bg-white/80 px-3 py-3 text-sm font-semibold shadow-card">
            공지 발행
          </button>
          <button className="rounded-2xl bg-white/80 px-3 py-3 text-sm font-semibold shadow-card">
            이벤트 등록
          </button>
          <button className="rounded-2xl bg-white/80 px-3 py-3 text-sm font-semibold shadow-card">
            쿠폰 발행
          </button>
          <button className="rounded-2xl bg-white/80 px-3 py-3 text-sm font-semibold shadow-card">
            참여 점포 관리
          </button>
        </div>
      </div>

      <div className="mx-5 mt-4 rounded-3xl glass p-4 shadow-card">
        <div className="text-sm font-semibold">오늘 할 일</div>
        <ul className="mt-2 space-y-2 text-xs text-ink-600">
          <li>• 주말 공동 이벤트 배너 확정</li>
          <li>• 미참여 점포 3곳 참여 안내</li>
          <li>• 스탬프투어 2코스 공지 게시</li>
        </ul>
      </div>
    </div>
  );
}
