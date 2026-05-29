import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Screen =
  | "portal"     // G-00 전체 포털
  | "region"     // M-00 지자체 포털
  | "market"     // MK-00 상권 포털
  | "stores"     // S-02-1 참여 상점 (호환성 유지)
  | "store"      // S-03
  | "community"  // S-05 (호환성 유지)
  | "dangolFeed" // S-07 (호환성 유지)
  | "dangolPost" // S-07-1 단골 소식 상세
  | "benefits"   // 혜택 탭 (쿠폰 중심)
  | "mypage"     // 마이페이지 탭
  | "notifications" // 알림
  | "merchantCouncilAdmin" // 상인회 대시보드
  | "districtAdmin" // 구청 대시보드
  | "storeAdmin" // 상점 대시보드
  | "admin";    // S-13 운영 대시보드

export type ToastMsg = { id: number; text: string };
export type ChannelMode = "web" | "app";
export type BenefitScope = "owned" | "available";

const DEFAULT_REGION_SLUG =
  (import.meta.env.VITE_APP_REGION_SLUG as string | undefined) ?? "gangdong-gu";
const DEFAULT_MARKET_SLUG = "godeok-2dong";

type ParsedRoute = {
  screen: Screen;
  regionSlug: string;
  marketSlug: string;
  storeId: string | null;
};

function detectChannelMode(): ChannelMode {
  const params = new URLSearchParams(window.location.search);
  const mode =
    params.get("channelMode") ??
    params.get("channel") ??
    params.get("mode") ??
    (import.meta.env.VITE_CHANNEL_MODE as string | undefined);
  return mode === "app" ? "app" : "web";
}

function detectAppRegionSlug(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get("appRegionSlug") ?? params.get("region") ?? DEFAULT_REGION_SLUG;
}

function parseRoute(pathname: string): ParsedRoute {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  if (cleanPath === "/" || cleanPath === "/regions") {
    return {
      screen: "portal",
      regionSlug: DEFAULT_REGION_SLUG,
      marketSlug: DEFAULT_MARKET_SLUG,
      storeId: null,
    };
  }

  const segments = cleanPath.split("/").filter(Boolean);

  if (segments[0] === "regions") {
    const regionSlug = segments[1] ?? DEFAULT_REGION_SLUG;
    const marketsIndex = segments.indexOf("markets");
    if (marketsIndex === -1) {
      return {
        screen: "region",
        regionSlug,
        marketSlug: DEFAULT_MARKET_SLUG,
        storeId: null,
      };
    }

    const marketSlug = segments[marketsIndex + 1] ?? DEFAULT_MARKET_SLUG;
    const storesIndex = segments.indexOf("stores");
    if (storesIndex === -1) {
      return {
        screen: "market",
        regionSlug,
        marketSlug,
        storeId: null,
      };
    }

    const storeId = segments[storesIndex + 1] ?? null;
    return {
      screen: storeId ? "store" : "stores",
      regionSlug,
      marketSlug,
      storeId,
    };
  }

  if (cleanPath.startsWith("/benefits")) {
    return {
      screen: "benefits",
      regionSlug: DEFAULT_REGION_SLUG,
      marketSlug: DEFAULT_MARKET_SLUG,
      storeId: null,
    };
  }
  if (cleanPath.startsWith("/notifications")) {
    return {
      screen: "notifications",
      regionSlug: DEFAULT_REGION_SLUG,
      marketSlug: DEFAULT_MARKET_SLUG,
      storeId: null,
    };
  }
  if (cleanPath.startsWith("/me")) {
    return {
      screen: "mypage",
      regionSlug: DEFAULT_REGION_SLUG,
      marketSlug: DEFAULT_MARKET_SLUG,
      storeId: null,
    };
  }
  if (cleanPath.startsWith("/ops")) {
    return {
      screen: "admin",
      regionSlug: DEFAULT_REGION_SLUG,
      marketSlug: DEFAULT_MARKET_SLUG,
      storeId: null,
    };
  }

  return {
    screen: "portal",
    regionSlug: DEFAULT_REGION_SLUG,
    marketSlug: DEFAULT_MARKET_SLUG,
    storeId: null,
  };
}

function isOutOfRegionRouteInAppMode(
  route: ParsedRoute,
  channelMode: ChannelMode,
  appRegionSlug: string,
) {
  return channelMode === "app" && route.regionSlug !== appRegionSlug;
}

function resolveScreenForRoute(
  route: ParsedRoute,
  channelMode: ChannelMode,
  appRegionSlug: string,
): Screen {
  if (isOutOfRegionRouteInAppMode(route, channelMode, appRegionSlug)) {
    return "region";
  }
  return guardScreen(route.screen, channelMode);
}

function guardScreen(screen: Screen, channelMode: ChannelMode): Screen {
  if (channelMode === "app" && screen === "portal") {
    return "region";
  }
  return screen;
}

function withModeQuery(path: string, channelMode: ChannelMode, appRegionSlug: string) {
  if (channelMode === "web") return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}mode=app&appRegionSlug=${encodeURIComponent(appRegionSlug)}`;
}

function buildPathForScreen(
  screen: Screen,
  channelMode: ChannelMode,
  appRegionSlug: string,
  activeRegionSlug: string,
  activeMarketSlug: string,
  activeStoreId: string | null,
) {
  const regionSlug = channelMode === "app" ? appRegionSlug : activeRegionSlug;
  const buildBenefitsPath = (scope: BenefitScope = "owned", status: "active" | "expired" = "active") => {
    const base = scope === "available"
      ? "/benefits?tab=coupon&scope=available"
      : `/benefits?tab=coupon&scope=owned&status=${status}`;
    return withModeQuery(base, channelMode, appRegionSlug);
  };
  switch (screen) {
    case "portal":
      return withModeQuery("/", channelMode, appRegionSlug);
    case "region":
      return withModeQuery(`/regions/${regionSlug}`, channelMode, appRegionSlug);
    case "market":
      return withModeQuery(
        `/regions/${regionSlug}/markets/${activeMarketSlug}`,
        channelMode,
        appRegionSlug,
      );
    case "stores":
      return withModeQuery(
        `/regions/${regionSlug}/markets/${activeMarketSlug}/stores`,
        channelMode,
        appRegionSlug,
      );
    case "store": {
      const safeStoreId = activeStoreId ?? "godeok-bakery";
      return withModeQuery(
        `/regions/${regionSlug}/markets/${activeMarketSlug}/stores/${safeStoreId}`,
        channelMode,
        appRegionSlug,
      );
    }
    case "community":
      return withModeQuery(
        `/regions/${regionSlug}/markets/${activeMarketSlug}?tab=feed&feedTab=community`,
        channelMode,
        appRegionSlug,
      );
    case "dangolFeed":
      return withModeQuery(
        `/regions/${regionSlug}/markets/${activeMarketSlug}?tab=feed&feedTab=dangol`,
        channelMode,
        appRegionSlug,
      );
    case "dangolPost": {
      const safeStoreId = activeStoreId ?? "godeok-bakery";
      return withModeQuery(
        `/regions/${regionSlug}/markets/${activeMarketSlug}/stores/${safeStoreId}/news/demo`,
        channelMode,
        appRegionSlug,
      );
    }
    case "benefits":
      return buildBenefitsPath();
    case "mypage":
      return withModeQuery("/me", channelMode, appRegionSlug);
    case "notifications":
      return withModeQuery("/notifications", channelMode, appRegionSlug);
    case "merchantCouncilAdmin":
      return "/ops/regions/gangdong-gu/markets/godeok-2dong/dashboard";
    case "districtAdmin":
      return "/ops/regions/gangdong-gu/dashboard";
    case "storeAdmin":
      return "/ops/regions/gangdong-gu/markets/godeok-2dong/stores/godeok-bakery/dashboard";
    case "admin":
      return "/ops";
  }
}

function makeEventName(channelMode: ChannelMode, action: string) {
  return `${channelMode}_${action}`;
}

type State = {
  channelMode: ChannelMode;
  appRegionSlug: string;
  activeRegionSlug: string;
  activeMarketSlug: string;
  screen: Screen;
  history: Screen[];
  isMember: boolean; // 고덕2동 멤버
  dangolStoreIds: string[]; // 단골 등록한 가게 id
  activeStoreId: string | null;
  activeDangolPost: { storeId: string; newsId: string } | null;
  showMembershipModal: boolean;
  showDangolModal: boolean;
  dangolTargetStoreId: string | null;
  toasts: ToastMsg[];
  communityPosts: CommunityPost[];
};

export type CommunityPost = {
  id: string;
  author: string;
  badge?: "official" | "store" | null;
  category: "공지" | "가게추천" | "쇼핑팁" | "생활정보" | "소식";
  body: string;
  minsAgo: number;
  likes: number;
  comments: number;
};

export type StoreNewsItem = {
  id: string;
  storeId: string;
  storeName: string;
  title: string;
  body: string;
  minsAgo: number;
  isNew: boolean;
};

type Ctx = State & {
  go: (s: Screen) => void;
  goToBenefits: (scope?: BenefitScope, status?: "active" | "expired") => void;
  setChannelMode: (mode: ChannelMode) => void;
  enterRegion: (regionSlug: string) => void;
  enterMarket: (regionSlug: string, marketSlug?: string) => void;
  back: () => void;
  openStore: (id: string) => void;
  openDangolPost: (storeId: string, newsId: string) => void;
  openMembership: () => void;
  closeMembership: () => void;
  confirmMembership: () => void;
  openDangol: (storeId: string) => void;
  closeDangol: () => void;
  confirmDangol: () => void;
  sendAdminBroadcast: (title: string, body: string, alsoFeed: boolean) => void;
  addCommunityPost: (body: string, category: CommunityPost["category"]) => void;
  addStoreNews: (storeId: string, storeName: string, title: string, body: string) => void;
  storeNewsItems: StoreNewsItem[];
  toast: (text: string) => void;
  trackEvent: (eventName: string, metadata?: Record<string, unknown>) => void;
};

const AppCtx = createContext<Ctx | null>(null);

const seedPosts: CommunityPost[] = [
  {
    id: "p1",
    author: "고덕 상점가 공식",
    badge: "official",
    category: "공지",
    body: "주말 봄 축제가 시작됩니다. 멤버 한정 10% 쿠폰을 꼭 챙겨가세요!",
    minsAgo: 62,
    likes: 34,
    comments: 8,
  },
  {
    id: "p2",
    author: "이웃주민 A",
    badge: null,
    category: "가게추천",
    body: "고덕 베이커리 크루아상 진짜 맛있어요. 오전에 가야 살 수 있는데 강력 추천합니다.",
    minsAgo: 30,
    likes: 12,
    comments: 3,
  },
  {
    id: "p3",
    author: "고덕 베이커리",
    badge: "store",
    category: "소식",
    body: "오늘 신메뉴 출시했어요. 멤버 분들 먼저 알려드립니다.",
    minsAgo: 120,
    likes: 21,
    comments: 15,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const initialChannelMode = detectChannelMode();
  const initialAppRegionSlug = detectAppRegionSlug();
  const initialRoute = parseRoute(window.location.pathname);
  const shouldForceRegionOnEntry = isOutOfRegionRouteInAppMode(
    initialRoute,
    initialChannelMode,
    initialAppRegionSlug,
  );
  const initialRegionSlug =
    initialChannelMode === "app" ? initialAppRegionSlug : initialRoute.regionSlug;
  const isOutOfRegionAppEntry = shouldForceRegionOnEntry;

  const [channelMode, setChannelModeState] = useState<ChannelMode>(initialChannelMode);
  const [appRegionSlug] = useState(initialAppRegionSlug);
  const [activeRegionSlug, setActiveRegionSlug] = useState(initialRegionSlug);
  const [activeMarketSlug, setActiveMarketSlug] = useState(
    shouldForceRegionOnEntry ? DEFAULT_MARKET_SLUG : initialRoute.marketSlug,
  );
  const [screen, setScreen] = useState<Screen>(
    resolveScreenForRoute(initialRoute, initialChannelMode, initialAppRegionSlug),
  );
  const [history, setHistory] = useState<Screen[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [dangolStoreIds, setDangolStoreIds] = useState<string[]>([]);
  const [activeStoreId, setActiveStoreId] = useState<string | null>(initialRoute.storeId);
  const [activeDangolPost, setActiveDangolPost] = useState<{
    storeId: string;
    newsId: string;
  } | null>(null);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showDangolModal, setShowDangolModal] = useState(false);
  const [dangolTargetStoreId, setDangolTargetStoreId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(seedPosts);
  const [storeNewsItems, setStoreNewsItems] = useState<StoreNewsItem[]>([]);

  const trackEvent = (
    eventName: string,
    metadata: Record<string, unknown> = {},
    modeOverride?: ChannelMode,
  ) => {
    const effectiveMode = modeOverride ?? channelMode;
    const payload = {
      event_name: eventName,
      occurred_at: new Date().toISOString(),
      channel_mode: effectiveMode,
      app_region_slug: effectiveMode === "app" ? appRegionSlug : null,
      entry_path: `${window.location.pathname}${window.location.search}`,
      region_slug: effectiveMode === "app" ? appRegionSlug : activeRegionSlug,
      market_slug: activeMarketSlug,
      store_id: activeStoreId,
      metadata,
    };
    console.info("[analytics]", payload);
  };

  const syncPath = (
    nextScreen: Screen,
    replace = false,
    overrides?: {
      channelMode?: ChannelMode;
      regionSlug?: string;
      marketSlug?: string;
      storeId?: string | null;
    },
  ) => {
    const nextMode = overrides?.channelMode ?? channelMode;
    const nextRegionSlug = overrides?.regionSlug ?? activeRegionSlug;
    const nextMarketSlug = overrides?.marketSlug ?? activeMarketSlug;
    const nextStoreId = overrides?.storeId ?? activeStoreId;
    const nextPath = buildPathForScreen(
      nextScreen,
      nextMode,
      appRegionSlug,
      nextRegionSlug,
      nextMarketSlug,
      nextStoreId,
    );
    const current = `${window.location.pathname}${window.location.search}`;
    if (nextPath === current) return;
    if (replace) {
      window.history.replaceState(null, "", nextPath);
    } else {
      window.history.pushState(null, "", nextPath);
    }
  };

  useEffect(() => {
    const normalizedScreen = resolveScreenForRoute(
      initialRoute,
      initialChannelMode,
      initialAppRegionSlug,
    );
    syncPath(normalizedScreen, true, {
      channelMode: initialChannelMode,
      regionSlug: initialRegionSlug,
      marketSlug: shouldForceRegionOnEntry ? DEFAULT_MARKET_SLUG : initialRoute.marketSlug,
      storeId: initialRoute.storeId,
    });
    if (isOutOfRegionAppEntry) {
      trackEvent("app_out_of_region_blocked", {
        attempted_region_slug: initialRoute.regionSlug,
        redirected_region_slug: initialAppRegionSlug,
      }, "app");
    }
    // mount normalize only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const route = parseRoute(window.location.pathname);
      const nextScreen = resolveScreenForRoute(route, channelMode, appRegionSlug);
      const nextRegionSlug = channelMode === "app" ? appRegionSlug : route.regionSlug;
      const nextMarketSlug =
        isOutOfRegionRouteInAppMode(route, channelMode, appRegionSlug)
          ? DEFAULT_MARKET_SLUG
          : route.marketSlug;

      setActiveRegionSlug(nextRegionSlug);
      setActiveMarketSlug(nextMarketSlug);
      setActiveStoreId(route.storeId);
      setScreen(nextScreen);

      if (isOutOfRegionRouteInAppMode(route, channelMode, appRegionSlug)) {
        syncPath("region", true, {
          channelMode,
          regionSlug: appRegionSlug,
          marketSlug: DEFAULT_MARKET_SLUG,
          storeId: null,
        });
        trackEvent("app_out_of_region_blocked", {
          attempted_region_slug: route.regionSlug,
          redirected_region_slug: appRegionSlug,
          source: "popstate",
        }, "app");
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // keep listener in sync with channel/app region policy
  }, [appRegionSlug, channelMode]);

  const navigate = (
    nextScreen: Screen,
    options?: {
      replace?: boolean;
      channelMode?: ChannelMode;
      regionSlug?: string;
      marketSlug?: string;
      storeId?: string | null;
    },
  ) => {
    setScreen(nextScreen);
    syncPath(nextScreen, options?.replace ?? false, {
      channelMode: options?.channelMode,
      regionSlug: options?.regionSlug,
      marketSlug: options?.marketSlug,
      storeId: options?.storeId,
    });
  };

  const go = (s: Screen) => {
    const next = guardScreen(s, channelMode);
    if (channelMode === "app" && s === "portal") {
      trackEvent(makeEventName(channelMode, "portal_blocked"));
    }
    setHistory((h) => [...h, screen]);
    navigate(next);
    if (next === "region") {
      trackEvent(makeEventName(channelMode, "region_entered"));
    }
  };

  const goToBenefits = (
    scope: BenefitScope = "owned",
    status: "active" | "expired" = "active",
  ) => {
    setHistory((h) => [...h, screen]);
    setScreen("benefits");
    const nextPath =
      scope === "available"
        ? withModeQuery("/benefits?tab=coupon&scope=available", channelMode, appRegionSlug)
        : withModeQuery(
            `/benefits?tab=coupon&scope=owned&status=${status}`,
            channelMode,
            appRegionSlug,
          );
    const current = `${window.location.pathname}${window.location.search}`;
    if (nextPath !== current) {
      window.history.pushState(null, "", nextPath);
    }
  };

  const enterRegion = (regionSlug: string) => {
    const nextRegion = channelMode === "app" ? appRegionSlug : regionSlug;
    setActiveRegionSlug(nextRegion);
    setHistory([]);
    if (channelMode === "web") {
      trackEvent("web_region_selected", { region_slug: nextRegion });
    }
    navigate("region", {
      replace: true,
      regionSlug: nextRegion,
    });
  };

  const enterMarket = (regionSlug: string, marketSlug = DEFAULT_MARKET_SLUG) => {
    const nextRegion = channelMode === "app" ? appRegionSlug : regionSlug;
    setActiveRegionSlug(nextRegion);
    setActiveMarketSlug(marketSlug);
    setHistory((h) => [...h, screen]);
    if (channelMode === "web") {
      trackEvent("web_market_selected", {
        region_slug: nextRegion,
        market_slug: marketSlug,
      });
    }
    navigate("market", {
      regionSlug: nextRegion,
      marketSlug,
    });
    trackEvent(makeEventName(channelMode, "market_entered"), {
      region_slug: nextRegion,
      market_slug: marketSlug,
    });
  };

  const setChannelMode = (mode: ChannelMode) => {
    setChannelModeState(mode);
    const normalizedScreen = guardScreen(screen, mode);
    const nextRegion = mode === "app" ? appRegionSlug : activeRegionSlug;
    if (mode === "app") {
      setActiveRegionSlug(appRegionSlug);
    }
    navigate(normalizedScreen, {
      replace: true,
      channelMode: mode,
      regionSlug: nextRegion,
    });
    trackEvent(makeEventName(mode, "mode_changed"), { from: channelMode, to: mode }, mode);
  };

  const back = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = guardScreen(h[h.length - 1], channelMode);
      navigate(prev, { replace: true });
      return h.slice(0, -1);
    });
  };
  const openStore = (id: string) => {
    setActiveStoreId(id);
    trackEvent(makeEventName(channelMode, "store_entered"), { store_id: id });
    setHistory((h) => [...h, screen]);
    navigate("store", { storeId: id });
  };
  const openDangolPost = (storeId: string, newsId: string) => {
    setActiveDangolPost({ storeId, newsId });
    go("dangolPost");
  };
  const toast = (text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
  };
  const openMembership = () => setShowMembershipModal(true);
  const closeMembership = () => setShowMembershipModal(false);
  const confirmMembership = () => {
    setIsMember(true);
    setShowMembershipModal(false);
    trackEvent(makeEventName(channelMode, "membership_registered"));
    toast("멤버십이 등록되었어요 🎉");
  };
  const openDangol = (storeId: string) => {
    setDangolTargetStoreId(storeId);
    setShowDangolModal(true);
  };
  const closeDangol = () => setShowDangolModal(false);
  const confirmDangol = () => {
    if (dangolTargetStoreId) {
      setDangolStoreIds((ids) =>
        ids.includes(dangolTargetStoreId) ? ids : [...ids, dangolTargetStoreId],
      );
      trackEvent(makeEventName(channelMode, "dangol_registered"), {
        store_id: dangolTargetStoreId,
      });
    }
    setShowDangolModal(false);
    toast("단골이 되었어요");
  };

  const addCommunityPost = (body: string, category: CommunityPost["category"]) => {
    setCommunityPosts((posts) => [
      {
        id: `p${Date.now()}`,
        author: "나",
        badge: null,
        category,
        body,
        minsAgo: 0,
        likes: 0,
        comments: 0,
      },
      ...posts,
    ]);
    trackEvent(makeEventName(channelMode, "community_post_created"), { category });
    toast("게시물을 올렸어요");
  };

  const addStoreNews = (
    storeId: string,
    storeName: string,
    title: string,
    body: string,
  ) => {
    setStoreNewsItems((items) => [
      {
        id: `sn${Date.now()}`,
        storeId,
        storeName,
        title,
        body,
        minsAgo: 0,
        isNew: true,
      },
      ...items,
    ]);
    trackEvent(makeEventName(channelMode, "store_news_published"), { store_id: storeId });
    toast("단골 소식을 발행했어요");
  };

  const sendAdminBroadcast = (title: string, body: string, alsoFeed: boolean) => {
    toast(`${title} — 127명에게 발송되었습니다`);
    if (alsoFeed) {
      setCommunityPosts((posts) => [
        {
          id: `p${Date.now()}`,
          author: "고덕 상점가 공식",
          badge: "official",
          category: "공지",
          body: `${title}\n${body}`,
          minsAgo: 0,
          likes: 0,
          comments: 0,
        },
        ...posts,
      ]);
    }
    trackEvent(makeEventName(channelMode, "notification_sent"), {
      target_type: "market_members",
    });
  };

  const value = useMemo<Ctx>(
    () => ({
      screen,
      channelMode,
      appRegionSlug,
      activeRegionSlug,
      activeMarketSlug,
      history,
      isMember,
      dangolStoreIds,
      activeStoreId,
      activeDangolPost,
      showMembershipModal,
      showDangolModal,
      dangolTargetStoreId,
      toasts,
      communityPosts,
      storeNewsItems,
      go,
      goToBenefits,
      setChannelMode,
      enterRegion,
      enterMarket,
      back,
      openStore,
      openDangolPost,
      openMembership,
      closeMembership,
      confirmMembership,
      openDangol,
      closeDangol,
      confirmDangol,
      sendAdminBroadcast,
      addCommunityPost,
      addStoreNews,
      toast,
      trackEvent,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      screen,
      channelMode,
      appRegionSlug,
      activeRegionSlug,
      activeMarketSlug,
      history,
      isMember,
      dangolStoreIds,
      activeStoreId,
      activeDangolPost,
      showMembershipModal,
      showDangolModal,
      dangolTargetStoreId,
      toasts,
      communityPosts,
      storeNewsItems,
    ],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("AppProvider missing");
  return ctx;
}
