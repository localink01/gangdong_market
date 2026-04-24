import { markets } from "../data";
import { appIcons, marketIcons } from "../icons";
import { useApp } from "../store";

export function PortalHome() {
  const { go, isMember, toast } = useApp();
  const quickIcons = [appIcons.benefit, appIcons.calendar, appIcons.star];
  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* hero */}
      <div className="px-5 pt-2">
        <div className="kicker">강동 골목형 상점가의 새로운 이름</div>
        <h1 className="mt-1 text-[28px] font-bold leading-tight tracking-tight">
          강동 골목 here
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          지금 근처 9개 상점가의 신선한 소식을 확인하세요.
        </p>
      </div>

      {/* season banner */}
      <div className="mx-5 mt-4 overflow-hidden rounded-3xl shadow-card">
        <div className="relative h-40">
          <img
            src="/samples/hero_image.jpg"
            alt="봄맞이 이벤트 배너"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="glass rounded-2xl p-3 text-white">
              <div className="text-[11px] font-semibold uppercase tracking-wider opacity-90">
                봄맞이 이벤트
              </div>
              <div className="text-base font-semibold">
                고덕 봄 스탬프투어 · D-3
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* quick access */}
      <div className="mx-5 mt-4 grid grid-cols-3 gap-2">
        {[
          { t: "쿠폰", n: "5" },
          { t: "스탬프", n: "2/10" },
          { t: "이벤트", n: "3" },
        ].map((q, idx) => {
          const Icon = quickIcons[idx];
          return (
          <button
            key={q.t}
            className="glass rounded-2xl px-3 py-3 text-left shadow-card"
            onClick={() => toast(`${q.t} 화면은 MVP 이후에 이어집니다`)}
          >
            <Icon className="h-5 w-5 text-ink-700" />
            <div className="mt-1 text-[11px] font-semibold text-ink-500">
              {q.t}
            </div>
            <div className="text-base font-bold">{q.n}</div>
          </button>
          );
        })}
      </div>

      {/* markets */}
      <div className="mx-5 mt-6">
        <div className="mb-2 flex items-end justify-between">
          <h2 className="text-base font-semibold">우리 동네 상점가</h2>
          <span className="text-xs text-ink-400">총 9곳 중 3곳 운영</span>
        </div>
        <div className="flex flex-col gap-3">
          {markets.map((m) => (
            <button
              key={m.id}
              onClick={() => go("market")}
              className="group relative overflow-hidden rounded-3xl text-left shadow-card"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={m.image}
                  alt={`${m.name} 샘플 이미지`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm">
                  {(() => {
                    const Icon = marketIcons[m.icon];
                    return <Icon className="h-5 w-5 text-ink-900" />;
                  })()}
                </div>
              </div>
              <div className="glass-strong p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{m.name}</div>
                  {isMember && m.id === "godeok-2dong" && (
                    <span className="rounded-full bg-brand-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                      내 시장
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-ink-500">{m.subtitle}</div>
                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  {m.ready ? (
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-ink-500">
                      준비 중
                    </span>
                  ) : (
                    <>
                      {m.eventLive && (
                        <span className="flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 font-semibold text-rose-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          이벤트 진행 중
                        </span>
                      )}
                      <span className="rounded-full bg-black/5 px-2 py-0.5 text-ink-500">
                        멤버 {m.members}명
                      </span>
                    </>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
