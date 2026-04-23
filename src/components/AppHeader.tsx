import { useApp } from "../store";
import { appIcons } from "../icons";

export function AppHeader({
  title,
  onBack,
  transparent = false,
}: {
  title?: string;
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
      <h1 className="text-[15px] font-semibold">{title}</h1>
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
