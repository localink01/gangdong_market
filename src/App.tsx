import { AppProvider, useApp, type Screen } from "./store";
import { PhoneFrame } from "./components/PhoneFrame";
import { TabBar } from "./components/TabBar";
import { AppHeader } from "./components/AppHeader";
import { ToastStack } from "./components/ToastStack";
import { MembershipSheet } from "./components/MembershipSheet";
import { DangolSheet } from "./components/DangolSheet";
import { PortalHome } from "./screens/PortalHome";
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
import { appIcons } from "./icons";

function NotificationsScreen() {
  const { openStore } = useApp();
  const notifications = [
    { id: 1, type: "event", title: "봄맞이 이벤트 시작!", body: "고덕 베이커리 봄맞이 이벤트가 시작됐어요. 참여 혜택을 확인해보세요.", time: "방금 전", unread: true, storeId: "godeok-bakery" },
    { id: 2, type: "stamp", title: "스탬프 2개 적립 완료", body: "럭키할인마트에서 스탬프가 적립됐어요. 10개 모으면 경품을 드려요!", time: "1시간 전", unread: true, storeId: "lucky-discount" },
    { id: 3, type: "dangol", title: "단골 가게 새 소식", body: "고덕 베이커리 단골 소식: '오늘 오후 3시 이후 크루아상 1+1 진행'", time: "3시간 전", unread: false, storeId: "godeok-bakery" },
    { id: 4, type: "coupon", title: "쿠폰 만료 3일 전", body: "우리농산물 신규 가입 쿠폰이 3일 후 만료돼요. 지금 바로 사용해보세요.", time: "어제", unread: false, storeId: "woori-farm" },
    { id: 5, type: "event", title: "멤버 전용 할인 행사", body: "GO PUB 이번 주말 멤버 전용 10% 할인 행사가 진행돼요.", time: "2일 전", unread: false, storeId: "go-pub" },
  ];

  const typeIcon: Record<string, string> = {
    event: "🎉",
    stamp: "🔖",
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

// 포털은 자체 히어로 이미지를 사용
const NO_HEADER_SCREENS: Screen[] = ["portal"];

const HEADER_TITLES: Record<Screen, string> = {
  portal: "강동구 골목형상점가",
  market: "고덕2동 골목형상점가",
  stores: "참여 상점 보기",
  store: "가게 상세",
  community: "커뮤니티",
  dangolFeed: "단골 소식",
  dangolPost: "단골 소식 상세",
  benefits: "혜택",
  mypage: "마이페이지",
  notifications: "알림",
  merchantCouncilAdmin: "상인회 대시보드",
  districtAdmin: "구청 대시보드",
  storeAdmin: "상점 대시보드",
  admin: "운영 대시보드",
};

function ScreenBody() {
  const { screen } = useApp();
  switch (screen) {
    case "portal":
      return <PortalHome />;
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
  const { screen } = useApp();
  const showHeader = !NO_HEADER_SCREENS.includes(screen);
  const showTabBar = screen !== "notifications";
  return (
    <PhoneFrame>
      {showHeader && <AppHeader title={HEADER_TITLES[screen]} />}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className={showTabBar ? "flex min-h-0 flex-1 flex-col pb-16" : "flex min-h-0 flex-1 flex-col"}>
          <ScreenBody />
        </div>
        {showTabBar && <TabBar />}
      </div>
      <ToastStack />
      <MembershipSheet />
      <DangolSheet />
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
    title: "포털 홈",
    desc: "강동구 9개 상점가를 한 눈에",
    run: (c) => c.go("portal"),
  },
  {
    id: "s02",
    group: "주민",
    no: "S-02",
    title: "시장 홈 (비멤버)",
    desc: "고덕2동 · 멤버십 진입 전",
    run: (c) => c.go("market"),
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
    title: "커뮤니티 피드",
    desc: "멤버 전용 이야기",
    run: (c) => { c.go("market"); },
  },
  {
    id: "s08",
    group: "주민",
    no: "S-08",
    title: "혜택 (스탬프투어 + 쿠폰)",
    desc: "스탬툤판 + 쿠폰함",
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
    <div className="ambient-bg flex min-h-full w-full items-stretch justify-center">
      <ScenarioNav />
      <div className="flex w-full flex-1 items-stretch justify-center md:items-center md:py-6">
        <div className="relative h-[100dvh] w-full md:h-[880px] md:max-h-[92vh] md:w-auto">
          <AppShell />
        </div>
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
