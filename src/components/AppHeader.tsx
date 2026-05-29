import { useApp } from "../store";
import { appIcons } from "../icons";

export function AppHeader({
  title,
  marketName,
  onChangeMarket,
  onBack,
  transparent = false,
}: {
  title?: string;
  marketName?: string;
  onChangeMarket?: () => void;
  onBack?: () => void;
  transparent?: boolean;
}) {
  const { back, history, go } = useApp();
  const BellIcon = appIcons.bell;
  const canBack = history.length > 0;
  return (
    <div
      className={`sticky top-0 z-20 flex items-center justify-between px-4 py-2 ${
        transparent ? "" : "glass-strong"
      }`}
    >
      <button
        onClick={onBack ?? back}
        disabled={!canBack && !onBack}
        className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
          canBack || onBack ? "bg-white/80 shadow-card" : "opacity-0"
        }`}
        aria-label="뒤로가기"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {marketName ? (
        <button
          onClick={onChangeMarket}
          className="flex max-w-[60%] items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 text-[12px] font-semibold shadow-card transition active:scale-[0.98]"
        >
          <span className="truncate">{marketName}</span>
          <span className="text-ink-400">▾</span>
        </button>
      ) : (
        <h1 className="text-[15px] font-semibold">{title}</h1>
      )}
      <button
        onClick={() => go("notifications")}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-card transition active:scale-95"
        aria-label="알림"
      >
        <BellIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
