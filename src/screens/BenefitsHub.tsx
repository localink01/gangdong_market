import { useState } from "react";
import { useApp } from "../store";
import { appIcons } from "../icons";

type CouponStatus = "active" | "used" | "expired";

const stampTour = {
  name: "고덕 봄 스탬프투어 2026",
  period: "2026.04.01 ~ 2026.04.30",
  total: 10,
  done: 2,
  reward: "아메리카노 쿠폰 1장",
  stops: [
    { name: "고덕 베이커리", done: true },
    { name: "우리농산물", done: true },
    { name: "고덕 분식집", done: false },
    { name: "고덕 꽃집", done: false },
    { name: "고덕 카페", done: false },
    { name: "럭키마트", done: false },
    { name: "고펍", done: false },
    { name: "고덕 약국", done: false },
    { name: "고덕 문구점", done: false },
    { name: "고덕 세탁소", done: false },
  ],
};

const coupons = [
  {
    id: "c1",
    storeName: "고덕 베이커리",
    title: "아메리카노 무료 쿠폰",
    desc: "스탬프투어 완주 보상",
    expires: "2026.04.30",
    status: "active" as CouponStatus,
  },
  {
    id: "c2",
    storeName: "고덕2동 상점가 공식",
    title: "봄 축제 기념 10% 할인",
    desc: "모든 참여 점포 적용",
    expires: "2026.05.05",
    status: "active" as CouponStatus,
  },
  {
    id: "c3",
    storeName: "우리농산물",
    title: "딸기 1팩 증정",
    desc: "1만원 이상 구매 시",
    expires: "2026.04.15",
    status: "expired" as CouponStatus,
  },
];

export function BenefitsHub() {
  const { isMember, openMembership } = useApp();
  const [couponTab, setCouponTab] = useState<CouponStatus | "active">("active");
  const [showCoupon, setShowCoupon] = useState<string | null>(null);
  const StarIcon = appIcons.star;
  const LockIcon = appIcons.lock;

  const activeCoupons = coupons.filter((c) => c.status === "active");
  const expiredCoupons = coupons.filter((c) => c.status !== "active");

  if (showCoupon) {
    const coupon = coupons.find((c) => c.id === showCoupon)!;
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          {coupon.storeName}
        </div>
        <div className="text-3xl font-bold leading-tight">{coupon.title}</div>
        <div className="rounded-3xl bg-ink-900 px-8 py-6 font-mono text-lg tracking-widest text-white shadow-card">
          GODEOK-2026-{coupon.id.toUpperCase()}
        </div>
        <div className="text-sm text-ink-500">이 화면을 직원에게 보여주세요</div>
        <div className="text-xs text-ink-400">유효기간 {coupon.expires}</div>
        <button
          onClick={() => setShowCoupon(null)}
          className="mt-4 rounded-full bg-white/80 px-6 py-2.5 text-sm font-semibold shadow-card"
        >
          닫기
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* 스탬프투어 섹션 */}
      <div className="mx-5 mt-4">
        <div className="mb-2 text-base font-semibold">스탬프투어</div>
        <div className="rounded-3xl glass-strong p-4 shadow-glass">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold">{stampTour.name}</div>
              <div className="mt-0.5 text-xs text-ink-500">{stampTour.period}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-600">
                {stampTour.done}
                <span className="text-base font-normal text-ink-400">/{stampTour.total}</span>
              </div>
              <div className="text-[11px] text-ink-500">스탬프</div>
            </div>
          </div>

          {/* 스탬프 도장판 */}
          <div className="mt-4 grid grid-cols-5 gap-2">
            {stampTour.stops.map((stop, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                    stop.done
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-ink-200 bg-white/50 text-ink-300"
                  }`}
                >
                  {stop.done ? <StarIcon className="h-4 w-4" /> : i + 1}
                </div>
                <div className="w-full text-center text-[9px] leading-tight text-ink-400 line-clamp-2">
                  {stop.name}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-2xl bg-amber-500/15 px-3 py-2">
            <div className="text-[11px] font-semibold text-amber-800">
              완주 보상: {stampTour.reward}
            </div>
            <div className="mt-0.5 text-[11px] text-amber-600">
              {stampTour.total - stampTour.done}개 더 모으면 완주!
            </div>
          </div>

          <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-ink-900 py-2.5 text-sm font-semibold text-white shadow-card">
            QR 스캔으로 스탬프 찍기
          </button>
        </div>
      </div>

      {/* 쿠폰함 섹션 */}
      <div className="mx-5 mt-6">
        <div className="mb-2 text-base font-semibold">쿠폰함</div>

        {/* 쿠폰 탭 */}
        <div className="mb-3 flex gap-2">
          {(["active", "expired"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setCouponTab(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-card ${
                couponTab === t ? "bg-ink-900 text-white" : "glass text-ink-600"
              }`}
            >
              {t === "active" ? `사용 가능 ${activeCoupons.length}` : `만료됨 ${expiredCoupons.length}`}
            </button>
          ))}
        </div>

        {!isMember ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl glass p-8 text-center shadow-card">
            <LockIcon className="h-8 w-8 text-ink-400" />
            <div className="text-sm font-semibold text-ink-600">
              멤버십 등록 후 쿠폰을 받을 수 있어요
            </div>
            <button
              onClick={openMembership}
              className="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
            >
              멤버십 등록하기
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {(couponTab === "active" ? activeCoupons : expiredCoupons).map((c) => (
              <div
                key={c.id}
                className={`rounded-3xl p-4 shadow-card ${
                  c.status === "expired"
                    ? "glass opacity-50"
                    : "bg-gradient-to-br from-amber-50 to-white border border-amber-200"
                }`}
              >
                <div className="text-[11px] font-semibold text-ink-500">{c.storeName}</div>
                <div className="mt-0.5 text-base font-bold">{c.title}</div>
                <div className="text-xs text-ink-500">{c.desc}</div>
                <div className="mt-1 text-[11px] text-ink-400">유효기간 {c.expires}</div>
                {c.status === "active" && (
                  <button
                    onClick={() => setShowCoupon(c.id)}
                    className="mt-3 flex w-full items-center justify-center rounded-2xl bg-ink-900 py-2.5 text-sm font-semibold text-white shadow-card"
                  >
                    사용하기
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
