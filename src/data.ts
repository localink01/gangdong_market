import type { MarketIconKey, StoreIconKey } from "./icons";

export type DangolNews = {
  id: string;
  title: string;
  timeAgo: string;
  body: string;
};

export type Market = {
  id: string;
  name: string;
  subtitle: string;
  members: number;
  eventLive: boolean;
  ready: boolean;
  gradient: string;
  icon: MarketIconKey;
  image: string;
};

export type Store = {
  id: string;
  marketId: string;
  name: string;
  category: string;
  icon: StoreIconKey;
  dangolCount: number;
  hours: string;
  address: string;
  eventLive: boolean;
  gradient: string;
  mapX: number;
  mapY: number;
  couponTitle?: string;
  dangolNews: DangolNews[];
};

export const markets: Market[] = [
  {
    id: "godeok-2dong",
    name: "고덕2동 골목형상점가",
    subtitle: "우리 동네를 다시 걷게 만드는 곳",
    members: 127,
    eventLive: true,
    ready: false,
    gradient: "from-emerald-400 via-teal-400 to-sky-400",
    icon: "home",
    image: "/samples/market-godeok.svg",
  },
  {
    id: "cheonho-rodeo",
    name: "천호 로데오 상점가",
    subtitle: "젊은 감각, 밤까지 깨어있는 거리",
    members: 0,
    eventLive: false,
    ready: true,
    gradient: "from-fuchsia-400 via-rose-400 to-amber-300",
    icon: "rocket",
    image: "/samples/market-cheonho.svg",
  },
  {
    id: "amsa-market",
    name: "암사 전통시장",
    subtitle: "세 살 된 아이도 아는 그 국밥집",
    members: 0,
    eventLive: false,
    ready: true,
    gradient: "from-orange-400 via-amber-300 to-yellow-300",
    icon: "reader",
    image: "/samples/market-amsa.svg",
  },
];

export const stores: Store[] = [
  {
    id: "woori-farm",
    marketId: "godeok-2dong",
    name: "우리농산물",
    category: "농산물",
    icon: "star",
    dangolCount: 44,
    hours: "오전 8시 ~ 오후 8시",
    address: "서울 강동구 고덕동 122-1",
    eventLive: true,
    gradient: "from-lime-200 via-emerald-200 to-green-200",
    mapX: 22,
    mapY: 32,
    couponTitle: "제철 과일 5% 추가 할인",
    dangolNews: [
      {
        id: "n1",
        title: "올해 마지막 딸기 소식",
        timeAgo: "오늘",
        body: "이번주 딸기가 올해 마지막 딸기입니다. 가격이 가장 저렴할 때 구매하세요.",
      },
    ],
  },
  {
    id: "lucky-discount",
    marketId: "godeok-2dong",
    name: "럭키할인마트",
    category: "마트",
    icon: "cube",
    dangolCount: 53,
    hours: "오전 10시 ~ 오후 11시",
    address: "서울 강동구 고덕동 122-8",
    eventLive: true,
    gradient: "from-cyan-200 via-sky-200 to-blue-200",
    mapX: 58,
    mapY: 44,
    couponTitle: "생필품 묶음 할인",
    dangolNews: [
      {
        id: "n1",
        title: "salty 아이스크림 시즌 안내",
        timeAgo: "어제",
        body: "이번달 까지 salty 아이스크림 영업합니다. 아직 안드셔보신 분들은 꼭 드셔보세요.",
      },
    ],
  },
  {
    id: "go-pub",
    marketId: "godeok-2dong",
    name: "GO PUB",
    category: "펍",
    icon: "heart",
    dangolCount: 31,
    hours: "오후 5시 ~ 오전 1시",
    address: "서울 강동구 고덕동 123-20",
    eventLive: true,
    gradient: "from-amber-200 via-orange-200 to-rose-200",
    mapX: 76,
    mapY: 28,
    couponTitle: "응원 세트 예약 할인",
    dangolNews: [
      {
        id: "n1",
        title: "월드컵 단체 관람 공지",
        timeAgo: "3시간 전",
        body: "월드컵 첫 경기 단체 관람합니다. 미리 자리 예약하세요.",
      },
    ],
  },
  {
    id: "godeok-bakery",
    marketId: "godeok-2dong",
    name: "고덕 베이커리",
    category: "베이커리",
    icon: "star",
    dangolCount: 38,
    hours: "오전 9시 ~ 오후 8시",
    address: "서울 강동구 고덕동 123-4",
    eventLive: true,
    gradient: "from-amber-200 via-orange-200 to-rose-200",
    mapX: 36,
    mapY: 70,
    couponTitle: "신메뉴 출시 기념 10% 할인",
    dangolNews: [
      {
        id: "n1",
        title: "크루아상 1+1 안내",
        timeAgo: "오늘 오후 2시",
        body: "오늘 단골 손님 대상으로 크루아상 1+1 행사 진행해요. 3시 이후 방문해주세요.",
      },
      {
        id: "n2",
        title: "신메뉴 선공개",
        timeAgo: "어제",
        body: "다음 주 신메뉴를 단골분들께 먼저 공개합니다.",
      },
    ],
  },
];

export const getStore = (id: string | null) => stores.find((s) => s.id === id);
export const getMarket = (id: string) => markets.find((m) => m.id === id)!;
export const storesByMarket = (marketId: string) =>
  stores.filter((s) => s.marketId === marketId);
