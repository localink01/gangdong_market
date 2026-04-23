import { useApp } from "../store";
import { appIcons } from "../icons";

export function CommunityFeed() {
  const { communityPosts, isMember, openMembership, go } = useApp();
  const PersonIcon = appIcons.person;
  const HeartIcon = appIcons.heart;
  const ChatIcon = appIcons.chat;
  const LockIcon = appIcons.lock;
  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* tabs */}
      <div className="mx-5 mt-2">
        <div className="glass-strong inline-flex rounded-full p-1 shadow-card">
          <button className="rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-white">
            커뮤니티
          </button>
          <button
            onClick={() => go("dangolFeed")}
            className="rounded-full px-3.5 py-1.5 text-xs font-medium text-ink-500"
          >
            단골 소식
          </button>
        </div>
      </div>

      {/* composer */}
      <div className="mx-5 mt-3">
        <div className="glass flex items-center gap-3 rounded-2xl p-3 shadow-card">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-sky-300 text-base">
            <PersonIcon className="h-4 w-4 text-ink-900" />
          </div>
          <input
            placeholder="이 동네 이야기를 나눠보세요"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400"
          />
          <button className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white">
            글쓰기
          </button>
        </div>
      </div>

      {/* filters */}
      <div className="mx-5 mt-3 flex gap-2 overflow-x-auto hide-scrollbar">
        {["전체", "가게추천", "쇼핑팁", "생활정보", "이벤트", "공지"].map(
          (c, i) => (
            <button
              key={c}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium shadow-card ${
                i === 0 ? "bg-ink-900 text-white" : "glass text-ink-700"
              }`}
            >
              {c}
            </button>
          ),
        )}
      </div>

      {/* feed */}
      <div className={`mx-5 mt-4 flex flex-col gap-3 ${!isMember ? "locked-blur" : ""}`}>
        {communityPosts.map((p) => (
          <article key={p.id} className="glass rounded-3xl p-4 shadow-card">
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              {p.badge === "official" && (
                <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-sky-700">
                  공식
                </span>
              )}
              {p.badge === "store" && (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-700">
                  가게
                </span>
              )}
              {!p.badge && (
                <span className="rounded-full bg-ink-900/5 px-2 py-0.5 text-ink-500">
                  멤버
                </span>
              )}
              <span className="text-ink-500">· {p.author}</span>
              <span className="text-ink-400">
                · {p.minsAgo < 60 ? `${p.minsAgo}분 전` : `${Math.round(p.minsAgo / 60)}시간 전`}
              </span>
            </div>
            <div className="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed">
              {p.body}
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-ink-500">
              <span className="inline-flex items-center gap-1">
                <HeartIcon className="h-3.5 w-3.5" />
                {p.likes}
              </span>
              <span className="inline-flex items-center gap-1">
                <ChatIcon className="h-3.5 w-3.5" />
                {p.comments}
              </span>
              <span className="ml-auto rounded-full bg-black/5 px-2 py-0.5 text-[10px]">
                {p.category}
              </span>
            </div>
          </article>
        ))}
      </div>

      {!isMember && (
        <div className="absolute inset-x-0 top-48 z-20 flex justify-center px-5">
          <button
            onClick={openMembership}
            className="glass-strong inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-glass"
          >
            <LockIcon className="h-4 w-4" />
            멤버십 등록 후 볼 수 있어요
          </button>
        </div>
      )}
    </div>
  );
}
