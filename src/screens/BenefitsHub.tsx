import { useEffect, useState } from "react";
import { useApp } from "../store";
import { appIcons } from "../icons";

type CouponStatus = "active" | "used" | "expired";
type CouponScope = "owned" | "available";
const ENABLE_STAMP_TOUR = false;

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

const initialOwnedCoupons = [
  {
    id: "c1",
    issuerName: "고덕 베이커리",
    title: "오전 커피 무료 업그레이드",
    desc: "가게 이벤트 참여 보상",
    expires: "2026.04.30",
    status: "active" as CouponStatus,
    sourceLabel: "가게 쿠폰",
  },
  {
    id: "c2",
    issuerName: "고덕2동 상점가 공식",
    title: "봄 축제 기념 10% 할인",
    desc: "모든 참여 가게 적용",
    expires: "2026.05.05",
    status: "active" as CouponStatus,
    sourceLabel: "상권 공식 쿠폰",
  },
  {
    id: "c3",
    issuerName: "우리농산물",
    title: "딸기 1팩 증정",
    desc: "1만원 이상 구매 시",
    expires: "2026.04.15",
    status: "expired" as CouponStatus,
    sourceLabel: "가게 쿠폰",
  },
];

const initialAvailableCoupons = [
  {
    id: "a1",
    issuerName: "고덕2동 상점가 공식",
    title: "신규 멤버 웰컴 3,000원 쿠폰",
    desc: "상권 멤버십 가입 후 즉시 받을 수 있는 공식 쿠폰",
    expires: "2026.05.31",
    eligibility: "member" as const,
    ctaLabel: "지금 받기",
    issued: false,
  },
  {
    id: "a2",
    issuerName: "고덕 베이커리",
    title: "단골 전용 샌드위치 세트 할인",
    desc: "고덕 베이커리 단골 등록 후 받을 수 있는 가게 쿠폰",
    expires: "2026.06.02",
    eligibility: "dangol" as const,
    ctaLabel: "가게 보기",
    storeId: "godeok-bakery",
    issued: false,
  },
  {
    id: "a3",
    issuerName: "우리농산물",
    title: "주말 시식회 현장 쿠폰",
    desc: "이벤트 캘린더에서 일정 확인 후 현장 방문 시 받을 수 있는 쿠폰",
    expires: "2026.05.30",
    eligibility: "event" as const,
    ctaLabel: "일정 보기",
    issued: false,
  },
];

export function BenefitsHub() {
  const { isMember, openMembership, openStore, toast } = useApp();
  const [couponScope, setCouponScope] = useState<CouponScope>("owned");
  const [couponTab, setCouponTab] = useState<CouponStatus | "active">("active");
  const [showCoupon, setShowCoupon] = useState<string | null>(null);
  const [confirmUsing, setConfirmUsing] = useState(false);
  const [ownedCoupons, setOwnedCoupons] = useState(initialOwnedCoupons);
  const [availableCoupons, setAvailableCoupons] = useState(initialAvailableCoupons);
  const StarIcon = appIcons.star;
  const LockIcon = appIcons.lock;

  const activeCoupons = ownedCoupons.filter((c) => c.status === "active");
  const expiredCoupons = ownedCoupons.filter((c) => c.status !== "active");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scope = params.get("scope");
    const status = params.get("status");
    if (scope === "owned" || scope === "available") {
      setCouponScope(scope);
    }
    if (status === "active" || status === "expired") {
      setCouponTab(status);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", "coupon");
    params.set("scope", couponScope);
    if (couponScope === "owned") {
      params.set("status", couponTab);
    } else {
      params.delete("status");
    }

    const nextSearch = params.toString();
    const currentSearch = window.location.search.startsWith("?")
      ? window.location.search.slice(1)
      : window.location.search;

    if (nextSearch !== currentSearch) {
      window.history.replaceState(null, "", `${window.location.pathname}?${nextSearch}`);
    }
  }, [couponScope, couponTab]);

  if (showCoupon) {
    const coupon = ownedCoupons.find((c) => c.id === showCoupon)!;
    const isUsed = coupon.status === "used";

    const handleUseConfirm = () => {
      setOwnedCoupons((cs) =>
        cs.map((c) => (c.id === showCoupon ? { ...c, status: "used" as CouponStatus } : c)),
      );
      toast("쿠폰을 사용했어요");
      setConfirmUsing(false);
      setShowCoupon(null);
    };

    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          {coupon.issuerName}
        </div>
        <div className="text-3xl font-bold leading-tight">{coupon.title}</div>
        <div className="rounded-3xl bg-ink-900 px-8 py-6 font-mono text-lg tracking-widest text-white shadow-card">
          GODEOK-2026-{coupon.id.toUpperCase()}
        </div>
        <div className="text-sm text-ink-500">이 화면을 직원에게 보여주세요</div>
        <div className="text-xs text-ink-400">유효기간 {coupon.expires}</div>

        {isUsed ? (
          <div className="mt-2 rounded-full bg-ink-200 px-6 py-2.5 text-sm font-semibold text-ink-500">
            사용 완료된 쿠폰
          </div>
        ) : confirmUsing ? (
          <div className="mt-2 flex flex-col items-center gap-3">
            <p className="text-sm font-semibold text-ink-800">쿠폰을 사용하시겠어요?</p>
            <p className="text-xs text-ink-400">사용 후에는 취소할 수 없어요</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmUsing(false)}
                className="rounded-full bg-white/80 px-5 py-2.5 text-sm font-semibold shadow-card"
              >
                취소
              </button>
              <button
                onClick={handleUseConfirm}
                className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-card"
              >
                네, 사용할게요
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmUsing(true)}
            className="mt-2 rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-card"
          >
            쿠폰 사용하기
          </button>
        )}

        <button
          onClick={() => { setShowCoupon(null); setConfirmUsing(false); }}
          className="rounded-full bg-white/80 px-6 py-2.5 text-sm font-semibold shadow-card"
        >
          닫기
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* 스탬프투어는 당장 미구현으로 비활성화 */}
      {ENABLE_STAMP_TOUR && (
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
      )}

      {/* 쿠폰함 섹션 */}
      <div className="mx-5 mt-4">
        <div className="mb-2 text-base font-semibold">혜택 쿠폰</div>

        <div className="mb-3 flex gap-2">
          {[
            { id: "owned", label: `내 쿠폰 ${ownedCoupons.length}` },
            { id: "available", label: `받을 수 있는 쿠폰 ${availableCoupons.length}` },
          ].map((scope) => (
            <button
              key={scope.id}
              onClick={() => setCouponScope(scope.id as CouponScope)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-card ${
                couponScope === scope.id ? "bg-ink-900 text-white" : "glass text-ink-600"
              }`}
            >
              {scope.label}
            </button>
          ))}
        </div>

        {couponScope === "owned" && (
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
        )}

        {couponScope === "owned" && !isMember ? (
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
        ) : couponScope === "owned" ? (
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
                <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-ink-500">
                  <span>{c.issuerName}</span>
                  <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px]">{c.sourceLabel}</span>
                </div>
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
        ) : (
          <div className="flex flex-col gap-3">
            <div className="rounded-3xl glass px-4 py-3 text-sm text-ink-600 shadow-card">
              지역 포털의 쿠폰 버튼은 여기로 연결됩니다. 이곳에서는 아직 보유하지 않았지만 지금 받을 수 있는 쿠폰을 확인합니다.
            </div>
            {availableCoupons.map((c) => {
              const canIssue = c.eligibility === "member" && isMember && !c.issued;
              const buttonLabel = c.issued
                ? "이미 받음"
                : c.eligibility === "member"
                  ? (isMember ? c.ctaLabel : "멤버십 가입 후 받기")
                  : c.ctaLabel;

              return (
                <div key={c.id} className="glass rounded-3xl p-4 shadow-card">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] font-semibold text-ink-500">{c.issuerName}</div>
                    <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                      {c.eligibility === "member" ? "멤버 대상" : c.eligibility === "dangol" ? "단골 대상" : "이벤트 연계"}
                    </span>
                  </div>
                  <div className="mt-0.5 text-base font-bold">{c.title}</div>
                  <div className="text-xs text-ink-500">{c.desc}</div>
                  <div className="mt-1 text-[11px] text-ink-400">유효기간 {c.expires}</div>
                  <button
                    disabled={c.issued}
                    onClick={() => {
                      if (c.issued) return;
                      if (c.eligibility === "member") {
                        if (!isMember) {
                          openMembership();
                          return;
                        }
                        setOwnedCoupons((current) => [
                          {
                            id: `owned-${c.id}`,
                            issuerName: c.issuerName,
                            title: c.title,
                            desc: c.desc,
                            expires: c.expires,
                            status: "active",
                            sourceLabel: "지금 받을 수 있는 쿠폰",
                          },
                          ...current,
                        ]);
                        setAvailableCoupons((current) =>
                          current.map((item) => item.id === c.id ? { ...item, issued: true } : item),
                        );
                        toast("쿠폰함에 쿠폰을 담았어요");
                        return;
                      }
                      if (c.eligibility === "dangol" && c.storeId) {
                        openStore(c.storeId);
                        return;
                      }
                      window.history.pushState(null, "", "/regions/gangdong-gu?panel=events&month=2026-05&date=2026-05-29");
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }}
                    className={`mt-3 flex w-full items-center justify-center rounded-2xl py-2.5 text-sm font-semibold shadow-card ${
                      c.issued ? "bg-black/5 text-ink-400" : "bg-ink-900 text-white"
                    }`}
                  >
                    {buttonLabel}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
