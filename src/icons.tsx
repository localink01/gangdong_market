import {
  BackpackIcon,
  BellIcon,
  CalendarIcon,
  ChatBubbleIcon,
  CubeIcon,
  GearIcon,
  HeartIcon,
  HeartFilledIcon,
  HomeIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  PersonIcon,
  ReaderIcon,
  ReloadIcon,
  RocketIcon,
  SewingPinIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";

export const marketIcons = {
  home: HomeIcon,
  rocket: RocketIcon,
  reader: ReaderIcon,
};

export type MarketIconKey = keyof typeof marketIcons;

export const storeIcons = {
  star: StarFilledIcon,
  cube: CubeIcon,
  heart: HeartFilledIcon,
};

export type StoreIconKey = keyof typeof storeIcons;

export const appIcons = {
  // 하단 탭 4개 전용 아이콘
  home: HomeIcon,        // 포털 탭
  reader: ReaderIcon,    // 상점가 탭
  benefit: BackpackIcon, // 혜택 탭
  person: PersonIcon,    // 마이페이지 탭
  // 기능 아이콘
  explore: MagnifyingGlassIcon,
  feed: ChatBubbleIcon,
  manage: GearIcon,
  star: StarFilledIcon,
  bell: BellIcon,
  lock: LockClosedIcon,
  reload: ReloadIcon,
  heart: HeartIcon,
  chat: ChatBubbleIcon,
  clock: MixerHorizontalIcon,
  pin: SewingPinIcon,
  calendar: CalendarIcon,
};