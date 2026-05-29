import { markets } from "../data";
import { useApp } from "../store";
import { Sheet } from "./Sheet";
import { marketIcons, type MarketIconKey } from "../icons";

export function MarketSwitchSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { activeRegionSlug, activeMarketSlug, enterMarket, go } = useApp();

  const regionMarkets = markets.filter((m) => m.regionSlug === activeRegionSlug);

  const handleSelect = (marketSlug: string) => {
    if (marketSlug === activeMarketSlug) {
      onClose();
      return;
    }
    enterMarket(activeRegionSlug, marketSlug);
    onClose();
  };

  const handleViewAll = () => {
    onClose();
    go("region");
  };

  return (
    <Sheet open={open} onClose={onClose}>
      {/* 시트 헤더 */}
      <div className="mb-4">
        <div className="text-base font-bold">상권 전환</div>
        <div className="mt-0.5 text-xs text-ink-500">
          탭해서 상권을 바로 바꿀 수 있어요
        </div>
      </div>

      {/* 상권 목록 */}
      <div className="flex flex-col gap-2">
        {regionMarkets.map((market) => {
          const MarketIcon = marketIcons[market.icon as MarketIconKey];
          const isActive = market.id === activeMarketSlug;
          const isComingSoon = market.ready; // ready:true = 준비 중

          return (
            <button
              key={market.id}
              onClick={() => !isComingSoon && handleSelect(market.id)}
              disabled={isComingSoon}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition active:scale-[0.98] ${
                isActive
                  ? "bg-brand-500/10 ring-1 ring-brand-500/30"
                  : "bg-black/[0.04]"
              } ${isComingSoon ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${market.gradient}`}
              >
                <MarketIcon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold">{market.name}</span>
                  {isComingSoon && (
                    <span className="flex-shrink-0 rounded-full bg-ink-900/8 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500">
                      준비 중
                    </span>
                  )}
                  {market.eventLive && (
                    <span className="flex-shrink-0 flex items-center gap-1 rounded-full bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      이벤트
                    </span>
                  )}
                </div>
                <div className="mt-0.5 truncate text-xs text-ink-500">{market.subtitle}</div>
              </div>
              {isActive && (
                <svg
                  className="h-4 w-4 flex-shrink-0 text-brand-500"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12l5 5L20 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* 하단 고정: 전체 보기 */}
      <button
        onClick={handleViewAll}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-ink-900/[0.06] py-3 text-sm font-semibold text-ink-700 transition active:scale-[0.98]"
      >
        상권 전체 보기
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 18l6-6-6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </Sheet>
  );
}
