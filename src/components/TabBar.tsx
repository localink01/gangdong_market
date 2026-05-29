import { useApp, type Screen } from "../store";
import { appIcons } from "../icons";

// 홈 탭: 상권 홈(MK-00)과 지자체 포털(M-00) 모두에서 활성
const HOME_SCREENS: Screen[] = ["region", "market"];
// 가게 탭: 가게 목록과 가게 상세에서 활성
const STORE_SCREENS: Screen[] = ["stores", "store"];
// 커뮤니티 탭: 멤버 커뮤니티와 단골 소식 계열에서 활성
const COMMUNITY_SCREENS: Screen[] = ["community", "dangolFeed", "dangolPost"];
// 마이 탭: 마이페이지, 혜택(쿠폰/스탬프), 운영자 진입에서 활성
const MY_SCREENS: Screen[] = [
  "mypage",
  "benefits",
  "admin",
  "merchantCouncilAdmin",
  "districtAdmin",
  "storeAdmin",
];

type TabDef = {
  label: string;
  icon: keyof typeof appIcons;
  target: Screen;
  activeFor: Screen[];
};

const tabs: TabDef[] = [
  { label: "홈",       icon: "home",    target: "market",    activeFor: HOME_SCREENS },
  { label: "가게",     icon: "reader",  target: "stores",    activeFor: STORE_SCREENS },
  { label: "커뮤니티", icon: "chat",    target: "community", activeFor: COMMUNITY_SCREENS },
  { label: "마이",     icon: "person",  target: "mypage",    activeFor: MY_SCREENS },
];

export function TabBar() {
  const { screen, go, channelMode, trackEvent } = useApp();
  return (
    <div className="pointer-events-none absolute inset-x-3 bottom-6 z-[60]">
      <nav className="glass-strong flex items-center justify-between rounded-[28px] px-2 py-2 shadow-glass">
        {tabs.map((tab) => {
          const active = tab.activeFor.includes(screen);
          const Icon = appIcons[tab.icon];
          return (
            <button
              key={tab.label}
              onClick={() => {
                if (channelMode === "app" && tab.target === "region") {
                  trackEvent("app_home_returned_to_m00");
                }
                go(tab.target);
              }}
              className={`pointer-events-auto flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-[11px] transition ${
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
