import { useMemo, useState } from "react";
import { storesByMarket } from "../data";
import { appIcons, storeIcons } from "../icons";
import { useApp } from "../store";

export function DangolFeed() {
  const { go, openStore, openDangolPost } = useApp();
  const TimeIcon = appIcons.clock;
  const stores = useMemo(() => storesByMarket("godeok-2dong"), []);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("all");

  const allNews = stores.flatMap((s) =>
    s.dangolNews.map((n) => ({ store: s, news: n })),
  );

  const filteredNews =
    selectedStoreId === "all"
      ? allNews
      : allNews.filter((item) => item.store.id === selectedStoreId);

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="mx-5 mt-2">
        <div className="glass-strong inline-flex rounded-full p-1 shadow-card">
          <button
            onClick={() => go("community")}
            className="rounded-full px-3.5 py-1.5 text-xs font-medium text-ink-500"
          >
            커뮤니티
          </button>
          <button className="rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-white">
            단골 소식
          </button>
        </div>
      </div>

      <div className="mx-5 mt-3">
        <p className="rounded-2xl bg-brand-500/10 px-3 py-2 text-xs leading-relaxed text-brand-800">
          큰 혜택이 아니어도 이 시기에 꼭 필요한 생활 정보를 공유하는 공간입니다.
        </p>
      </div>

      <div className="mx-5 mt-3 flex gap-2 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setSelectedStoreId("all")}
          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold shadow-card ${
            selectedStoreId === "all"
              ? "bg-ink-900 text-white"
              : "glass text-ink-600"
          }`}
        >
          전체
        </button>
        {stores.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStoreId(s.id)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium shadow-card ${
              selectedStoreId === s.id
                ? "bg-ink-900 text-white"
                : "glass text-ink-600"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="mx-5 mt-4 flex flex-col gap-3">
        {filteredNews.map(({ store, news }) => {
          const Icon = storeIcons[store.icon];
          return (
            <article
              key={store.id + news.id}
              className="glass rounded-3xl p-4 shadow-card"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br ${store.gradient} text-lg`}
                >
                  <Icon className="h-5 w-5 text-ink-900" />
                </div>
                <button
                  onClick={() => openStore(store.id)}
                  className="text-sm font-semibold text-ink-800 underline underline-offset-2"
                >
                  {store.name}
                </button>
                <div className="ml-auto inline-flex items-center gap-1 text-[11px] text-ink-500">
                  <TimeIcon className="h-3.5 w-3.5" />
                  {news.timeAgo}
                </div>
              </div>

              <h3 className="mt-3 text-[15px] font-semibold text-ink-900">{news.title}</h3>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-700 line-clamp-2">
                {news.body}
              </p>

              <button
                onClick={() => openDangolPost(store.id, news.id)}
                className="mt-3 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold shadow-card"
              >
                상세 조회 →
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
