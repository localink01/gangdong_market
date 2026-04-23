import { useState } from "react";
import { useApp } from "../store";

export function AdminDashboard() {
  const { sendAdminBroadcast, go } = useApp();
  const [title, setTitle] = useState("봄 축제 멤버 한정 쿠폰 안내");
  const [body, setBody] = useState(
    "주말 봄 축제 기간 동안 멤버 한정 10% 쿠폰을 발행했습니다. 앱에서 확인해주세요!",
  );
  const [alsoFeed, setAlsoFeed] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="mx-5 pt-3">
        <div className="kicker">상권 담당자 · 고덕2동</div>
        <h1 className="mt-1 text-[22px] font-bold tracking-tight">운영 대시보드</h1>
      </div>

      {/* KPI */}
      <div className="mx-5 mt-4 grid grid-cols-3 gap-2">
        {[
          { l: "멤버십", v: "127", s: "명" },
          { l: "이번달 신규", v: "+14", s: "명" },
          { l: "읽음률", v: "68", s: "%" },
        ].map((k) => (
          <div key={k.l} className="glass rounded-2xl p-3 shadow-card">
            <div className="text-[11px] font-semibold text-ink-500">{k.l}</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold">{k.v}</span>
              <span className="text-[11px] text-ink-500">{k.s}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast form */}
      <div className="mx-5 mt-4 glass-strong rounded-3xl p-4 shadow-glass">
        <div className="flex items-center justify-between">
          <div>
            <div className="kicker">알림 발송</div>
            <div className="text-sm font-semibold">전체 멤버 127명 (수신 동의 86명)</div>
          </div>
          <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
            ready
          </span>
        </div>

        <label className="mt-3 block">
          <span className="text-[11px] font-semibold text-ink-500">제목</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-2xl bg-white/80 px-3 py-2.5 text-sm shadow-card outline-none"
          />
        </label>

        <label className="mt-3 block">
          <span className="text-[11px] font-semibold text-ink-500">메시지</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="mt-1 w-full resize-none rounded-2xl bg-white/80 px-3 py-2.5 text-sm shadow-card outline-none"
          />
        </label>

        <label className="mt-3 flex items-center justify-between rounded-2xl bg-white/60 px-3 py-2.5 text-sm shadow-card">
          <span>멤버 커뮤니티 피드에도 함께 게시</span>
          <input
            type="checkbox"
            checked={alsoFeed}
            onChange={(e) => setAlsoFeed(e.target.checked)}
            className="h-5 w-9 appearance-none rounded-full bg-black/10 transition checked:bg-brand-500 relative
              before:absolute before:left-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:shadow
              checked:before:translate-x-4 before:transition"
          />
        </label>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              sendAdminBroadcast(title, body, alsoFeed);
              if (alsoFeed) go("community");
            }}
            className="flex-1 rounded-2xl bg-ink-900 px-4 py-3 text-sm font-semibold text-white shadow-card"
          >
            발송하기
          </button>
          <button className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold shadow-card">
            미리보기
          </button>
        </div>
      </div>

      {/* send history */}
      <div className="mx-5 mt-4">
        <div className="mb-2 text-xs font-semibold text-ink-500">최근 발송</div>
        <div className="glass rounded-3xl p-4 shadow-card text-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">봄 축제 사전 안내</div>
              <div className="text-[11px] text-ink-500">2026.04.22 · 127명 발송</div>
            </div>
            <div className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
              읽음 68%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
