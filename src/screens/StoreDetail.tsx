import { getStore } from "../data";
import { appIcons, storeIcons } from "../icons";
import { useApp } from "../store";

export function StoreDetail() {
  const { activeStoreId, isMember, dangolStoreIds, openMembership, openDangol, go } = useApp();
  const store = getStore(activeStoreId) ?? getStore("godeok-bakery")!;
  const isDangol = dangolStoreIds.includes(store.id);
  const StoreIcon = storeIcons[store.icon];
  const PinIcon = appIcons.pin;
  const TimeIcon = appIcons.clock;
  const LockIcon = appIcons.lock;
  const CouponIcon = appIcons.benefit;

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* hero */}
      <div className={`relative h-56 bg-gradient-to-br ${store.gradient}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.5),transparent_55%)]" />
        <div className="absolute right-5 top-12 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/40 backdrop-blur-sm">
          <StoreIcon className="h-9 w-9 text-ink-900" />
        </div>
      </div>

      <div className="mx-5 -mt-10">
        {/* basic */}
        <div className="glass-strong rounded-3xl p-4 shadow-glass">
          <div className="kicker">{store.category} · 고덕2동</div>
          <div className="mt-0.5 text-[20px] font-bold">{store.name}</div>
          <div className="mt-2 grid grid-cols-1 gap-1 text-[13px] text-ink-500">
            <div className="inline-flex items-center gap-1.5">
              <PinIcon className="h-3.5 w-3.5" />
              {store.address}
            </div>
            <div className="inline-flex items-center gap-1.5">
              <TimeIcon className="h-3.5 w-3.5" />
              {store.hours}
            </div>
          </div>
        </div>

        {/* dangol CTA */}
        <div className="mt-3 rounded-3xl glass p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">
              단골 {store.dangolCount}명이 소식을 받고 있어요
            </div>
            {isDangol && (
              <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                단골
              </span>
            )}
          </div>

          {!isMember ? (
            <button
              onClick={openMembership}
              className="mt-3 flex w-full items-center justify-between rounded-2xl bg-black/5 px-4 py-3 text-ink-500"
            >
              <span className="inline-flex items-center gap-2 font-semibold">
                <LockIcon className="h-4 w-4" />
                멤버십 등록 후 이용 가능
              </span>
              <span>→</span>
            </button>
          ) : !isDangol ? (
            <button
              onClick={() => openDangol(store.id)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-900 px-4 py-3 font-semibold text-white shadow-card"
            >
              정보 받아보기
            </button>
          ) : (
            <div className="mt-3 rounded-2xl bg-brand-500/10 px-4 py-3 text-center text-sm font-semibold text-brand-700">
              단골 소식이 아래에 표시됩니다
            </div>
          )}
        </div>

        {/* dangol news section */}
        <div className="mt-4">
          <div className="mb-2 flex items-end justify-between">
            <h2 className="text-base font-semibold">단골 소식</h2>
            {isDangol && (
              <button
                onClick={() => go("dangolFeed")}
                className="text-xs text-brand-600"
              >
                전체 보기 →
              </button>
            )}
          </div>
          <div className="relative">
            <div className={`flex flex-col gap-2 ${!isDangol ? "locked-blur" : ""}`}>
              {store.dangolNews.map((n) => (
                <div key={n.id} className="glass rounded-2xl p-3 shadow-card">
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-500">
                    <TimeIcon className="h-3.5 w-3.5" />
                    {n.timeAgo}
                  </div>
                  <div className="mt-1 text-sm">{n.body}</div>
                </div>
              ))}
            </div>
            {!isDangol && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-strong rounded-full px-4 py-2 text-xs font-semibold">
                  {isMember
                    ? "정보 받아보기 후 열람할 수 있어요"
                    : "멤버십 등록 후 이용 가능"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* coupon */}
        {store.couponTitle && (
          <div className="mt-4 rounded-3xl bg-gradient-to-br from-amber-200 to-rose-200 p-4 shadow-card">
            <div className="kicker">진행 중 혜택</div>
            <div className="mt-0.5 inline-flex items-center gap-1.5 text-base font-semibold">
              <CouponIcon className="h-4 w-4" />
              {store.couponTitle}
            </div>
            <div className="mt-1 text-xs text-ink-500">~ 2026.04.30</div>
            <button className="mt-3 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold shadow-card">
              쿠폰 받기
            </button>
          </div>
        )}

        {/* stamp */}
        <div className="mt-4 glass rounded-3xl p-4 shadow-card">
          <div className="kicker">스탬프 적립 현황</div>
          <div className="mt-2 flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`h-6 w-6 rounded-full ${
                  i < 2 ? "bg-brand-500" : "bg-black/10"
                }`}
              />
            ))}
            <span className="ml-2 text-xs text-ink-500">2 / 5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
