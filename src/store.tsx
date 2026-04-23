import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Screen =
  | "portal"     // S-01 포털 탭
  | "market"     // S-02 상점가 탭 루트 (내부 탭 포함)
  | "stores"     // S-02-1 참여 상점 (호환성 유지)
  | "store"      // S-03
  | "community"  // S-05 (호환성 유지)
  | "dangolFeed" // S-07 (호환성 유지)
  | "dangolPost" // S-07-1 단골 소식 상세
  | "benefits"   // 혜택 탭 (스탬프투어 + 쿠폰함)
  | "mypage"     // 마이페이지 탭
  | "notifications" // 알림
  | "merchantCouncilAdmin" // 상인회 대시보드
  | "districtAdmin" // 구청 대시보드
  | "storeAdmin" // 상점 대시보드
  | "admin";    // S-13 운영 대시보드

export type ToastMsg = { id: number; text: string };

type State = {
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

type Ctx = State & {
  go: (s: Screen) => void;
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
  toast: (text: string) => void;
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
  const [screen, setScreen] = useState<Screen>("portal");
  const [history, setHistory] = useState<Screen[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [dangolStoreIds, setDangolStoreIds] = useState<string[]>([]);
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const [activeDangolPost, setActiveDangolPost] = useState<{
    storeId: string;
    newsId: string;
  } | null>(null);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showDangolModal, setShowDangolModal] = useState(false);
  const [dangolTargetStoreId, setDangolTargetStoreId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(seedPosts);

  const go = (s: Screen) => {
    setHistory((h) => [...h, screen]);
    setScreen(s);
  };
  const back = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setScreen(prev);
      return h.slice(0, -1);
    });
  };
  const openStore = (id: string) => {
    setActiveStoreId(id);
    go("store");
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
    }
    setShowDangolModal(false);
    toast("단골이 되었어요");
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
  };

  const value = useMemo<Ctx>(
    () => ({
      screen,
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
      go,
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
      toast,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      screen,
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
    ],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("AppProvider missing");
  return ctx;
}
