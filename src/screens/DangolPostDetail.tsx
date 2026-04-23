import { getStore } from "../data";
import { appIcons, storeIcons } from "../icons";
import { useApp } from "../store";

export function DangolPostDetail() {
  const { activeDangolPost, openStore } = useApp();
  const ClockIcon = appIcons.clock;
  const InfoIcon = appIcons.calendar;

  if (!activeDangolPost) {
    return (
      <div className="flex flex-1 items-center justify-center px-8 text-center text-sm text-ink-500">
        선택된 단골 소식이 없습니다.
      </div>
    );
  }

  const store = getStore(activeDangolPost.storeId);
  const news = store?.dangolNews.find((n) => n.id === activeDangolPost.newsId);

  if (!store || !news) {
    return (
      <div className="flex flex-1 items-center justify-center px-8 text-center text-sm text-ink-500">
        게시글 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const StoreIcon = storeIcons[store.icon];

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <article className="mx-5 mt-4 rounded-3xl glass p-5 shadow-card">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-2 py-1 text-[11px] font-semibold text-brand-700">
          <InfoIcon className="h-3.5 w-3.5" />
          이 기간에 꼭 필요한 정보
        </div>

        <h2 className="mt-3 text-[20px] font-bold leading-snug">{news.title}</h2>

        <button
          onClick={() => openStore(store.id)}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-card"
        >
          <StoreIcon className="h-4 w-4" />
          작성자: {store.name}
        </button>

        <div className="mt-3 inline-flex items-center gap-1 text-xs text-ink-500">
          <ClockIcon className="h-3.5 w-3.5" />
          {news.timeAgo}
        </div>

        <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-ink-800">
          {news.body}
        </p>
      </article>
    </div>
  );
}
