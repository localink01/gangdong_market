import { useState } from "react";
import { useApp } from "../store";

const STORE_ID = "godeok-bakery";
const STORE_NAME = "고덕 베이커리";

export function StoreAdminDashboard() {
  const { addStoreNews, toast } = useApp();
  const [composing, setComposing] = useState(false);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [notify, setNotify] = useState(true);

  const handlePublish = () => {
    const t = newsTitle.trim();
    const b = newsBody.trim();
    if (!t || !b) return;
    addStoreNews(STORE_ID, STORE_NAME, t, b);
    if (notify) toast(`${t} — 단골 ${86}명에게 알림을 발송했어요`);
    setNewsTitle("");
    setNewsBody("");
    setComposing(false);
  };

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
          <button
            onClick={() => setComposing(true)}
            className="rounded-2xl bg-brand-500/10 px-3 py-3 text-sm font-semibold text-brand-700 shadow-card"
          >
            단골 소식 작성
          </button>
          <button className="rounded-2xl bg-white/80 px-3 py-3 text-sm font-semibold shadow-card">
            오늘의 쿠폰 발행
          </button>
          <button className="rounded-2xl bg-white/80 px-3 py-3 text-sm font-semibold shadow-card">
            알림 발송 관리
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
          <li>• 단골 알림: 오늘 발송 2건</li>
        </ul>
      </div>

      {/* 단골 소식 작성 시트 */}
      {composing && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/30 backdrop-blur-sm">
          <div className="glass-strong rounded-t-3xl p-5 shadow-glass">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold">단골 소식 작성</h2>
              <button
                onClick={() => setComposing(false)}
                className="text-sm text-ink-500"
              >
                닫기
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-500">제목</label>
                <input
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="예: 딸기 크루아상 재입고 🍓"
                  className="w-full rounded-2xl bg-white/60 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-500">내용</label>
                <textarea
                  value={newsBody}
                  onChange={(e) => setNewsBody(e.target.value)}
                  placeholder="단골 손님들께 전하고 싶은 소식을 적어주세요"
                  rows={3}
                  className="w-full resize-none rounded-2xl bg-white/60 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400"
                />
              </div>
              <button
                onClick={() => setNotify((v) => !v)}
                className={`flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-semibold ${
                  notify ? "bg-brand-500/15 text-brand-700" : "bg-white/60 text-ink-500"
                }`}
              >
                <span className={`h-4 w-4 rounded-full border-2 ${notify ? "border-brand-500 bg-brand-500" : "border-ink-300"}`} />
                단골에게 알림 발송
              </button>
            </div>

            <button
              onClick={handlePublish}
              disabled={!newsTitle.trim() || !newsBody.trim()}
              className="mt-4 w-full rounded-2xl bg-brand-500 py-3 text-sm font-semibold text-white shadow-card disabled:opacity-40"
            >
              소식 발행하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
