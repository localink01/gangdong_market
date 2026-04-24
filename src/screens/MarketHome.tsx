import { useMemo, useState } from "react";
import { getMarket, storesByMarket } from "../data";
import { appIcons, marketIcons, storeIcons } from "../icons";
import { useApp } from "../store";

type MarketTab = "main" | "stores" | "feed";
type FeedTab = "community" | "dangol";
type ViewMode = "list" | "map";

/* ── 메인 탭 ─────────────────────────────────────────── */
function MarketMain() {
  const { isMember, openMembership, go, communityPosts } = useApp();
  const market = getMarket("godeok-2dong");
  const storeList = storesByMarket(market.id);
  const MarketIcon = marketIcons[market.icon];
  const LockIcon = appIcons.lock;
  const HeartIcon = appIcons.heart;
  const ChatIcon = appIcons.chat;

  return (
    <div className="pb-4">
      {/* 히어로 */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={market.image}
          alt={market.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute right-4 top-6 flex h-12 w-12 items-center justify-center rounded-3xl bg-white/55 backdrop-blur-sm">
          <MarketIcon className="h-7 w-7 text-ink-900" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-white/75">
            고덕2동 · 골목형상점가
          </div>
          <div className="text-xl font-bold leading-tight">
            우리 동네를<br />다시 걷게 만드는 곳
          </div>
          <div className="mt-3">
            {!isMember ? (
              <button
                onClick={openMembership}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink-900 shadow-card"
              >
                멤버십 등록하기
                <span className="rounded-full bg-ink-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                  무료
                </span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                멤버 {market.members + 1}명 가입 중
                <span className="rounded-full bg-brand-400 px-2 py-0.5 text-[10px] font-semibold">
                  활성
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 진행 중 이벤트 */}
      <div className="mx-5 mt-5">
        <div className="mb-2 text-base font-semibold">지금 진행 중</div>
        <div className="rounded-3xl bg-gradient-to-br from-amber-200 to-rose-200 p-4 shadow-card">
          <div className="kicker">이벤트 · D-3</div>
          <div className="mt-0.5 text-base font-bold">골목 봄 축제 쿠폰 발행 중</div>
          <div className="mt-0.5 text-sm text-ink-600">멤버 한정 참여 · 4월 26일까지</div>
          <button
            onClick={() => isMember ? go("benefits") : openMembership()}
            className="mt-3 rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white"
          >
            {isMember ? "혜택 탭에서 쿠폰 받기 →" : "멤버십 등록 후 참여 →"}
          </button>
        </div>
      </div>

      {/* 스탬프투어 미리보기 */}
      <div className="mx-5 mt-4">
        <div className="rounded-3xl glass p-4 shadow-card">
          <div className="kicker mb-1">스탬프투어</div>
          <div className="text-sm font-semibold">고덕 봄 스탬프투어 2026</div>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className={`h-5 w-5 rounded-full border-2 ${
                  i < 2 ? "border-brand-500 bg-brand-500" : "border-ink-200 bg-white/50"
                }`}
              />
            ))}
          </div>
          <div className="mt-1 text-xs text-ink-500">2/10 완료 · 완주 시 아메리카노 쿠폰</div>
          <button
            onClick={() => go("benefits")}
            className="mt-2 text-xs font-semibold text-brand-600"
          >
            혜택 탭에서 계속하기 →
          </button>
        </div>
      </div>

      {/* 멤버 커뮤니티 미리보기 */}
      <div className="mx-5 mt-5">
        <div className="mb-2 text-base font-semibold">멤버 커뮤니티</div>
        <div className="relative">
          <div className={`flex flex-col gap-2 ${!isMember ? "select-none" : ""}`}
            style={!isMember ? { filter: "blur(3px)", pointerEvents: "none" } : {}}>
            {communityPosts.slice(0, 2).map((p) => (
              <article key={p.id} className="glass rounded-2xl p-3 shadow-card">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                  {p.badge === "official" && (
                    <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-sky-700">공식</span>
                  )}
                  {p.badge === "store" && (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-700">가게</span>
                  )}
                  <span className="text-ink-500">{p.author}</span>
                </div>
                <div className="mt-1 text-sm leading-relaxed">{p.body}</div>
                <div className="mt-2 flex gap-3 text-xs text-ink-400">
                  <span className="inline-flex items-center gap-1"><HeartIcon className="h-3 w-3" />{p.likes}</span>
                  <span className="inline-flex items-center gap-1"><ChatIcon className="h-3 w-3" />{p.comments}</span>
                </div>
              </article>
            ))}
          </div>
          {!isMember && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={openMembership}
                className="glass-strong inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-glass"
              >
                <LockIcon className="h-4 w-4" />
                멤버가 되면 전체 대화를 볼 수 있어요
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 참여 점포 미리보기 */}
      <div className="mx-5 mt-5">
        <div className="mb-2 flex items-end justify-between">
          <div className="text-base font-semibold">참여 점포</div>
          <span className="text-xs text-brand-600">{storeList.length}개 참여 중</span>
        </div>
        <div className="flex flex-col gap-2">
          {storeList.slice(0, 3).map((s) => {
            const Icon = storeIcons[s.icon];
            return (
              <div key={s.id} className="glass flex items-center gap-3 rounded-2xl p-3 shadow-card">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient}`}>
                  <Icon className="h-5 w-5 text-ink-900" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="text-xs text-ink-500">{s.category} · {s.hours}</div>
                </div>
                {s.eventLive && (
                  <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                    이벤트
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── 상점가 지도 탭 ─────────────────────────────────────── */
function MarketStores({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
}) {
  const { openStore } = useApp();
  const MapIcon = appIcons.pin;
  const stores = useMemo(() => storesByMarket("godeok-2dong"), []);

  return (
    <div className="pb-4">
      {/* 보기 모드 토글 */}
      <div className="mx-5 mt-3">
        <div className="glass-strong inline-flex rounded-full p-1 shadow-card">
          <button
            onClick={() => setViewMode("map")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              viewMode === "map" ? "bg-ink-900 text-white" : "text-ink-500"
            }`}
          >
            지도로 보기
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              viewMode === "list" ? "bg-ink-900 text-white" : "text-ink-500"
            }`}
          >
            목록으로 보기
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="mx-5 mt-4 flex flex-col gap-2">
          {stores.map((s) => {
            const Icon = storeIcons[s.icon];
            return (
              <button
                key={s.id}
                onClick={() => openStore(s.id)}
                className="glass flex items-center gap-3 rounded-2xl p-3 text-left shadow-card"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient}`}>
                  <Icon className="h-6 w-6 text-ink-900" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-ink-500">{s.category} · {s.address}</div>
                </div>
                {s.eventLive && (
                  <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                    이벤트
                  </span>
                )}
                <span className="text-ink-400">→</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mx-5 mt-4 rounded-3xl glass p-4 shadow-card">
          <div className="relative h-[340px] overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 via-cyan-100 to-sky-200">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.07)_1px,transparent_1px)] bg-[size:28px_28px]" />
            {stores.map((s) => {
              const Icon = storeIcons[s.icon];
              return (
                <button
                  key={s.id}
                  onClick={() => openStore(s.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${s.mapX}%`, top: `${s.mapY}%` }}
                >
                  <div className="glass-strong inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold shadow-card">
                    <MapIcon className="h-3.5 w-3.5 text-brand-700" />
                    <Icon className="h-3.5 w-3.5 text-ink-700" />
                    {s.name}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-ink-500">핀을 누르면 상점 상세 페이지로 이동합니다.</p>
        </div>
      )}
    </div>
  );
}

/* ── 피드 탭 ─────────────────────────────────────────── */
function MarketFeed({
  feedTab,
  setFeedTab,
}: {
  feedTab: FeedTab;
  setFeedTab: (t: FeedTab) => void;
}) {
  const { isMember, openMembership, communityPosts, openStore, openDangolPost } = useApp();
  const HeartIcon = appIcons.heart;
  const ChatIcon = appIcons.chat;
  const LockIcon = appIcons.lock;
  const TimeIcon = appIcons.clock;
  const PersonIcon = appIcons.person;

  const stores = useMemo(() => storesByMarket("godeok-2dong"), []);
  const [selectedStoreId, setSelectedStoreId] = useState("all");

  const allNews = stores.flatMap((s) =>
    s.dangolNews.map((n) => ({ store: s, news: n })),
  );
  const filteredNews =
    selectedStoreId === "all"
      ? allNews
      : allNews.filter((item) => item.store.id === selectedStoreId);

  return (
    <div className="pb-4">
      {/* 피드 서브탭 */}
      <div className="mx-5 mt-3">
        <div className="glass-strong inline-flex rounded-full p-1 shadow-card">
          <button
            onClick={() => setFeedTab("community")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              feedTab === "community" ? "bg-ink-900 text-white" : "text-ink-500"
            }`}
          >
            커뮤니티
          </button>
          <button
            onClick={() => setFeedTab("dangol")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              feedTab === "dangol" ? "bg-ink-900 text-white" : "text-ink-500"
            }`}
          >
            단골 소식
          </button>
        </div>
      </div>

      {feedTab === "community" ? (
        <>
          {/* 글쓰기 입력창 */}
          <div className="mx-5 mt-3">
            <div className="glass flex items-center gap-3 rounded-2xl p-3 shadow-card">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-sky-300">
                <PersonIcon className="h-4 w-4 text-ink-900" />
              </div>
              <input
                placeholder="이 동네 이야기를 나눠보세요"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400"
                readOnly
              />
              <button className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white">
                글쓰기
              </button>
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="mx-5 mt-3 flex gap-2 overflow-x-auto hide-scrollbar">
            {["전체", "가게추천", "쇼핑팁", "생활정보", "이벤트", "공지"].map((c, i) => (
              <button
                key={c}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium shadow-card ${
                  i === 0 ? "bg-ink-900 text-white" : "glass text-ink-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* 피드 목록 */}
          <div className={`mx-5 mt-4 flex flex-col gap-3 ${!isMember ? "select-none" : ""}`}
            style={!isMember ? { filter: "blur(4px)", pointerEvents: "none" } : {}}>
            {communityPosts.map((p) => (
              <article key={p.id} className="glass rounded-3xl p-4 shadow-card">
                <div className="flex items-center gap-2 text-[11px] font-semibold">
                  {p.badge === "official" && (
                    <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-sky-700">공식</span>
                  )}
                  {p.badge === "store" && (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-700">가게</span>
                  )}
                  {!p.badge && (
                    <span className="rounded-full bg-ink-900/5 px-2 py-0.5 text-ink-500">멤버</span>
                  )}
                  <span className="text-ink-500">· {p.author}</span>
                  <span className="text-ink-400">
                    · {p.minsAgo < 60 ? `${p.minsAgo}분 전` : `${Math.round(p.minsAgo / 60)}시간 전`}
                  </span>
                </div>
                <div className="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed">{p.body}</div>
                <div className="mt-3 flex items-center gap-3 text-xs text-ink-500">
                  <span className="inline-flex items-center gap-1"><HeartIcon className="h-3.5 w-3.5" />{p.likes}</span>
                  <span className="inline-flex items-center gap-1"><ChatIcon className="h-3.5 w-3.5" />{p.comments}</span>
                  <span className="ml-auto rounded-full bg-black/5 px-2 py-0.5 text-[10px]">{p.category}</span>
                </div>
              </article>
            ))}
          </div>
          {!isMember && (
            <div className="mx-5 mt-4 flex justify-center">
              <button
                onClick={openMembership}
                className="glass-strong inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-glass"
              >
                <LockIcon className="h-4 w-4" />
                멤버십 등록 후 볼 수 있어요
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {/* 단골 소식 인트로 */}
          <div className="mx-5 mt-3">
            <p className="rounded-2xl bg-brand-500/10 px-3 py-2 text-xs leading-relaxed text-brand-800">
              큰 혜택이 아니어도 이 시기에 꼭 필요한 생활 정보를 공유하는 공간입니다.
            </p>
          </div>

          {/* 가게 필터 */}
          <div className="mx-5 mt-3 flex gap-2 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setSelectedStoreId("all")}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold shadow-card ${
                selectedStoreId === "all" ? "bg-ink-900 text-white" : "glass text-ink-600"
              }`}
            >
              전체
            </button>
            {stores.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStoreId(s.id)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium shadow-card ${
                  selectedStoreId === s.id ? "bg-ink-900 text-white" : "glass text-ink-600"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* 단골 소식 카드 */}
          <div className="mx-5 mt-4 flex flex-col gap-3">
            {filteredNews.map(({ store, news }) => {
              const Icon = storeIcons[store.icon];
              return (
                <article key={store.id + news.id} className="glass rounded-3xl p-4 shadow-card">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br ${store.gradient}`}>
                      <Icon className="h-5 w-5 text-ink-900" />
                    </div>
                    <div>
                      <button
                        onClick={() => openStore(store.id)}
                        className="text-sm font-semibold underline decoration-dotted underline-offset-2"
                      >
                        {store.name}
                      </button>
                      <div className="inline-flex items-center gap-1 ml-2 text-[11px] text-ink-500">
                        <TimeIcon className="h-3 w-3" />
                        {news.timeAgo}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm font-semibold">{news.title}</div>
                  <div className="mt-1 text-sm leading-relaxed text-ink-700 line-clamp-2">{news.body}</div>
                  <button
                    onClick={() => openDangolPost(store.id, news.id)}
                    className="mt-2 text-xs font-semibold text-brand-600"
                  >
                    상세 조회 →
                  </button>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ── 메인 컨테이너 ───────────────────────────────────── */
export function MarketHome() {
  const [marketTab, setMarketTab] = useState<MarketTab>("main");
  const [feedTab, setFeedTab] = useState<FeedTab>("community");
  const [viewMode, setViewMode] = useState<ViewMode>("map");

  const tabLabels: Record<MarketTab, string> = {
    main: "메인",
    stores: "상점가 지도",
    feed: "피드",
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 내부 탭 바 */}
      <div className="border-b border-black/5 bg-white/60 px-5 pb-2.5 pt-2 backdrop-blur-sm">
        <div className="flex gap-1 rounded-full bg-black/5 p-1">
          {(["main", "stores", "feed"] as MarketTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setMarketTab(tab)}
              className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition ${
                marketTab === tab
                  ? "bg-white text-ink-900 shadow-card"
                  : "text-ink-500"
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        {marketTab === "main" && <MarketMain />}
        {marketTab === "stores" && (
          <MarketStores viewMode={viewMode} setViewMode={setViewMode} />
        )}
        {marketTab === "feed" && (
          <MarketFeed feedTab={feedTab} setFeedTab={setFeedTab} />
        )}
      </div>
    </div>
  );
}

