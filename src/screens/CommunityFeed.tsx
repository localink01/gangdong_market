import { useRef, useState } from "react";
import { useApp } from "../store";
import { appIcons } from "../icons";
import type { CommunityPost } from "../store";

const CATEGORIES: CommunityPost["category"][] = [
  "가게추천",
  "쇼핑팁",
  "생활정보",
  "소식",
];

export function CommunityFeed() {
  const { communityPosts, isMember, openMembership, go, addCommunityPost } = useApp();
  const PersonIcon = appIcons.person;
  const HeartIcon = appIcons.heart;
  const ChatIcon = appIcons.chat;
  const LockIcon = appIcons.lock;
  const [draft, setDraft] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [draftCategory, setDraftCategory] = useState<CommunityPost["category"]>("가게추천");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    addCommunityPost(trimmed, draftCategory);
    setDraft("");
    setDrafting(false);
  };

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
        {!isMember ? (
          <div className="glass flex items-center gap-3 rounded-2xl p-3 shadow-card opacity-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-sky-300">
              <PersonIcon className="h-4 w-4 text-ink-900" />
            </div>
            <span className="flex-1 text-sm text-ink-400">멤버이면 글을 쓸 수 있어요</span>
          </div>
        ) : drafting ? (
          <div className="glass rounded-2xl p-3 shadow-card">
            <div className="mb-2 flex gap-2 overflow-x-auto hide-scrollbar">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setDraftCategory(c)}
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    draftCategory === c ? "bg-ink-900 text-white" : "glass text-ink-600"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="이 동네 이야기를 나눠보세요"
              rows={3}
              className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-ink-400"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => { setDrafting(false); setDraft(""); }}
                className="rounded-full px-3 py-1.5 text-xs text-ink-500"
              >
                취소
              </button>
              <button
                onClick={submit}
                disabled={!draft.trim()}
                className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
              >
                등록
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => { setDrafting(true); setTimeout(() => inputRef.current?.focus(), 50); }}
            className="glass flex w-full items-center gap-3 rounded-2xl p-3 shadow-card text-left"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-sky-300">
              <PersonIcon className="h-4 w-4 text-ink-900" />
            </div>
            <span className="flex-1 text-sm text-ink-400">이 동네 이야기를 나눠보세요</span>
            <span className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white">글쓰기</span>
          </button>
        )}
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
