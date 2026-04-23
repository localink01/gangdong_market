import { useApp, type Screen } from "../store";
import { appIcons } from "../icons";

// 상점가 탭이 활성화되어야 하는 모든 화면
const MARKET_SCREENS: Screen[] = [
  "market", "stores", "store", "community", "dangolFeed", "dangolPost",
];
// 마이페이지 탭이 활성화되어야 하는 모든 화면
const MYPAGE_SCREENS: Screen[] = ["mypage", "admin"];

type TabDef = {
  label: string;
  icon: keyof typeof appIcons;
  target: Screen;
  activeFor: Screen[];
};

const tabs: TabDef[] = [
  { label: "포털",   icon: "home",    target: "portal",   activeFor: ["portal"] },
  { label: "상점가", icon: "reader",  target: "market",   activeFor: MARKET_SCREENS },
  { label: "혜택",   icon: "benefit", target: "benefits", activeFor: ["benefits"] },
  { label: "마이",   icon: "person",  target: "mypage",   activeFor: MYPAGE_SCREENS },
];

export function TabBar() {
  const { screen, go } = useApp();
  return (
    <div className="pointer-events-auto sticky bottom-0 z-30 mx-3 mb-3">
      <nav className="glass-strong flex items-center justify-between rounded-[28px] px-2 py-2 shadow-glass">
        {tabs.map((tab) => {
          const active = tab.activeFor.includes(screen);
          const Icon = appIcons[tab.icon];
          return (
            <button
              key={tab.label}
              onClick={() => go(tab.target)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-[11px] transition ${
                active ? "bg-white/80 text-brand-600 shadow-card" : "text-ink-500"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
