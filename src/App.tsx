import { useState } from "react";
import { AppProvider, useApp, type Screen } from "./store";
import { PhoneFrame } from "./components/PhoneFrame";
import { TabBar } from "./components/TabBar";
import { AppHeader } from "./components/AppHeader";
import { ToastStack } from "./components/ToastStack";
import { MembershipSheet } from "./components/MembershipSheet";
import { DangolSheet } from "./components/DangolSheet";
import { PortalHome } from "./screens/PortalHome";
import { RegionPortal } from "./screens/RegionPortal";
import { MarketHome } from "./screens/MarketHome";
import { StoreDetail } from "./screens/StoreDetail";
import { CommunityFeed } from "./screens/CommunityFeed";
import { DangolFeed } from "./screens/DangolFeed";
import { DangolPostDetail } from "./screens/DangolPostDetail";
import { StoresExplorer } from "./screens/StoresExplorer";
import { AdminDashboard } from "./screens/AdminDashboard";
import { BenefitsHub } from "./screens/BenefitsHub";
import { MyPage } from "./screens/MyPage";
import { MerchantCouncilDashboard } from "./screens/MerchantCouncilDashboard";
import { DistrictDashboard } from "./screens/DistrictDashboard";
import { StoreAdminDashboard } from "./screens/StoreAdminDashboard";
import { getMarket } from "./data";
import { appIcons } from "./icons";
import { MarketSwitchSheet } from "./components/MarketSwitchSheet";

function NotificationsScreen() {
  const { openStore } = useApp();
  const notifications = [
    { id: 1, type: "event", title: "봄맞이 이벤트 시작!", body: "고덕 베이커리 봄맞이 이벤트가 시작됐어요. 참여 혜택을 확인해보세요.", time: "방금 전", unread: true, storeId: "godeok-bakery" },
    { id: 3, type: "dangol", title: "단골 가게 새 소식", body: "고덕 베이커리 단골 소식: '오늘 오후 3시 이후 크루아상 1+1 진행'", time: "3시간 전", unread: false, storeId: "godeok-bakery" },
    { id: 4, type: "coupon", title: "쿠폰 만료 3일 전", body: "우리농산물 신규 가입 쿠폰이 3일 후 만료돼요. 지금 바로 사용해보세요.", time: "어제", unread: false, storeId: "woori-farm" },
    { id: 5, type: "event", title: "멤버 전용 할인 행사", body: "GO PUB 이번 주말 멤버 전용 10% 할인 행사가 진행돼요.", time: "2일 전", unread: false, storeId: "go-pub" },
  ];

  const typeIcon: Record<string, string> = {
    event: "🎉",
    dangol: "⭐",
    coupon: "🎫",
  };

  return (
    <div className="flex flex-col gap-0.5 pb-6 pt-2">
      {notifications.map((n) => (
        <button
          key={n.id}
          onClick={() => openStore(n.storeId)}
          className={`relative flex items-start gap-3 px-5 py-3.5 text-left ${n.unread ? "bg-emerald-50/60" : ""}`}
        >
          {n.unread && (
            <span className="absolute right-5 top-4 h-2 w-2 rounded-full bg-emerald-500" />
          )}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-card">
            {typeIcon[n.type]}
          </div>
          <div className="flex-1 pr-4">
            <p className={`text-sm ${n.unread ? "font-semibold text-ink-900" : "font-medium text-ink-700"}`}>
              {n.title}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{n.body}</p>
            <p className="mt-1 text-[11px] text-ink-400">{n.time}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

// G-00/M-00은 상단바 없이 화면 자체 컨텍스트를 사용
const NO_HEADER_SCREENS: Screen[] = ["portal", "region"];

const HEADER_TITLES: Record<Screen, string> = {
  portal: "전체 포털",
  region: "지자체 포털",
  market: "상권 홈",
  stores: "가게",
  store: "가게 상세",
  community: "커뮤니티",
  dangolFeed: "단골 소식",
  dangolPost: "단골 소식 상세",
  benefits: "혜택",
  mypage: "마이",
  notifications: "알림",
  merchantCouncilAdmin: "상인회 대시보드",
  districtAdmin: "구청 대시보드",
  storeAdmin: "상점 대시보드",
  admin: "운영 대시보드",
};

// 상권 컨텍스트(상점가명 칩)을 표시하는 화면. 나머지는 타이틀 텍스트 노출.
const MARKET_CHIP_SCREENS: Screen[] = ["market", "stores", "community", "dangolFeed"];

function ScreenBody() {
  const { screen } = useApp();
  switch (screen) {
    case "portal":
      return <PortalHome />;
    case "region":
      return <RegionPortal />;
    case "market":
      return <MarketHome />;
    case "stores":
      return <StoresExplorer />;
    case "store":
      return <StoreDetail />;
    case "community":
      return <CommunityFeed />;
    case "dangolFeed":
      return <DangolFeed />;
    case "dangolPost":
      return <DangolPostDetail />;
    case "benefits":
      return <BenefitsHub />;
    case "mypage":
      return <MyPage />;
    case "notifications":
      return <NotificationsScreen />;
    case "merchantCouncilAdmin":
      return <MerchantCouncilDashboard />;
    case "districtAdmin":
      return <DistrictDashboard />;
    case "storeAdmin":
      return <StoreAdminDashboard />;
    case "admin":
      return <AdminDashboard />;
  }
}

function AppShell() {
  const { screen, activeMarketSlug } = useApp();
  const [marketSwitchOpen, setMarketSwitchOpen] = useState(false);
  const showHeader = !NO_HEADER_SCREENS.includes(screen);
  const showTabBar = screen !== "notifications" && screen !== "portal";
  const showMarketChip = MARKET_CHIP_SCREENS.includes(screen) && !!activeMarketSlug;
  const marketName = showMarketChip ? getMarket(activeMarketSlug).name : undefined;
  return (
    <PhoneFrame>
      {showHeader && (
        <AppHeader
          title={HEADER_TITLES[screen]}
          marketName={marketName}
          onChangeMarket={() => setMarketSwitchOpen(true)}
        />
      )}
      <div className="relative min-h-0 flex-1">
        <div className={`absolute inset-0 overflow-y-auto${showTabBar ? " pb-16" : ""}`}>
          <ScreenBody />
        </div>
        {showTabBar && <TabBar />}
      </div>
      <ToastStack />
      <MembershipSheet />
      <DangolSheet />
      <MarketSwitchSheet
        open={marketSwitchOpen}
        onClose={() => setMarketSwitchOpen(false)}
      />
    </PhoneFrame>
  );
}

type Scenario = {
  id: string;
  group: "주민" | "점포" | "운영";
  no: string;
  title: string;
  desc: string;
  run: (ctx: ReturnType<typeof useApp>) => void;
};

const scenarios: Scenario[] = [
  {
    id: "s01",
    group: "주민",
    no: "S-01",
    title: "G-00 전체 포털",
    desc: "지자체를 선택하는 초기 진입",
    run: (c) => c.go("portal"),
  },
  {
    id: "s02",
    group: "주민",
    no: "S-02",
    title: "M-00 지자체 포털",
    desc: "지자체 내 상권 목록 선택",
    run: (c) => c.go("region"),
  },
  {
    id: "s04",
    group: "주민",
    no: "S-04",
    title: "멤버십 등록",
    desc: "가입 시트 (절차 없음)",
    run: (c) => {
      c.go("market");
      c.openMembership();
    },
  },
  {
    id: "s05",
    group: "주민",
    no: "S-05",
    title: "MK-00 상권 포털",
    desc: "점포 탐색·커뮤니티·혜택 연결",
    run: (c) => { c.go("market"); },
  },
  {
    id: "s08",
    group: "주민",
    no: "S-08",
    title: "혜택 (쿠폰)",
    desc: "멤버 전용 쿠폰함",
    run: (c) => c.go("benefits"),
  },
  {
    id: "s11",
    group: "주민",
    no: "S-11",
    title: "마이페이지",
    desc: "단골 목록 + 멤버십 + 알림",
    run: (c) => c.go("mypage"),
  },
  {
    id: "s03",
    group: "점포",
    no: "S-03",
    title: "가게 상세",
    desc: "단골 등록 전 상태",
    run: (c) => c.openStore("godeok-bakery"),
  },
  {
    id: "s06",
    group: "점포",
    no: "S-06",
    title: "단골 등록",
    desc: "'정보 받아보기' 시트",
    run: (c) => {
      c.openStore("godeok-bakery");
      c.openDangol("godeok-bakery");
    },
  },
  {
    id: "s07",
    group: "점포",
    no: "S-07",
    title: "단골 소식 피드",
    desc: "내 단골 가게 소식 모음",
    run: (c) => c.go("dangolFeed"),
  },
  {
    id: "s13",
    group: "운영",
    no: "S-13",
    title: "운영 대시보드",
    desc: "상점가 담당자 발송 화면",
    run: (c) => c.go("admin"),
  },
];

function ScenarioNav() {
  const ctx = useApp();
  const ReloadIcon = appIcons.reload;
  const groups: Scenario["group"][] = ["주민", "점포", "운영"];
  const isAppMode = ctx.channelMode === "app";
  return (
    <aside className="hidden w-[320px] shrink-0 flex-col gap-4 overflow-y-auto p-6 md:flex">
      <div>
        <div className="kicker">Gangdong-gu · 고덕2동</div>
        <h1 className="mt-1 text-[22px] font-bold leading-tight">
          골목형상점가 데모
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          8개 핵심 화면으로 시연용 프로토타입입니다. 옆의 기기에서 직접
          조작하거나 아래 시나리오로 점프하세요.
        </p>
      </div>

      <div className="glass rounded-2xl p-3 shadow-card">
        <div className="text-[11px] font-semibold text-ink-500">채널 모드</div>
        <div className="mt-2 inline-flex rounded-full bg-white/70 p-1">
          <button
            onClick={() => ctx.setChannelMode("web")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              !isAppMode ? "bg-ink-900 text-white" : "text-ink-500"
            }`}
          >
            Web
          </button>
          <button
            onClick={() => ctx.setChannelMode("app")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              isAppMode ? "bg-ink-900 text-white" : "text-ink-500"
            }`}
          >
            App
          </button>
        </div>
        <div className="mt-2 text-[11px] text-ink-500">
          {isAppMode
            ? `앱 모드 · 고정 지역 ${ctx.appRegionSlug}`
            : "웹 모드 · G-00 진입 허용"}
        </div>
      </div>

      {groups.map((g) => (
        <div key={g}>
          <div className="mb-2 flex items-center gap-2">
            <div className="text-xs font-semibold text-ink-700">{g} 플로우</div>
            <div className="h-px flex-1 bg-black/10" />
          </div>
          <div className="flex flex-col gap-2">
            {scenarios
              .filter((s) => s.group === g)
              .map((s) => (
                <button
                  key={s.id}
                  onClick={() => s.run(ctx)}
                  className="glass group text-left rounded-2xl p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-glass"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-ink-900 px-2 py-0.5 text-[10px] font-bold text-white">
                      {s.no}
                    </span>
                    <span className="text-sm font-semibold">{s.title}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-ink-500">{s.desc}</div>
                </button>
              ))}
          </div>
        </div>
      ))}

      <button
        onClick={() => window.location.reload()}
        className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-2xl bg-white/80 px-3 py-2 text-xs font-semibold text-ink-500 shadow-card"
      >
        <ReloadIcon className="h-3.5 w-3.5" />
        데모 상태 초기화
      </button>
    </aside>
  );
}

function Root() {
  return (
    <div className="ambient-bg flex h-[100dvh] w-full flex-col items-center">
      <div className="relative min-h-0 w-full flex-1">
        <AppShell />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}
