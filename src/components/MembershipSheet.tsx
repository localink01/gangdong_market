import { useApp } from "../store";
import { appIcons } from "../icons";
import { Sheet } from "./Sheet";

export function MembershipSheet() {
  const { showMembershipModal, closeMembership, confirmMembership } = useApp();
  const HomeIcon = appIcons.explore;
  const FeedIcon = appIcons.feed;
  const BellIcon = appIcons.bell;
  const BenefitIcon = appIcons.benefit;
  return (
    <Sheet open={showMembershipModal} onClose={closeMembership}>
      <div className="px-1">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-400 text-2xl shadow-card">
            <HomeIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="kicker">고덕2동 골목형상점가</div>
            <div className="text-lg font-bold">멤버십 등록</div>
          </div>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-ink-500">
          이 시장의 소식을 받아보시려면 멤버십 등록이 필요해요. 등록은
          <b className="text-ink-900"> 가입 절차 없이</b> 바로 시작하고, 언제든지 해제할 수
          있어요.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {[
            { i: FeedIcon, t: "멤버 커뮤니티 접근", d: "공지·가게 추천·꿀팁" },
            { i: BellIcon, t: "이벤트/쿠폰 알림", d: "주요 소식 놓치지 않기" },
            { i: BenefitIcon, t: "멤버 한정 혜택", d: "스탬프 투어, 멤버 전용 쿠폰" },
          ].map((b) => (
            <div key={b.t} className="glass flex items-center gap-3 rounded-2xl p-3">
              <b.i className="h-5 w-5 text-ink-700" />
              <div className="flex-1">
                <div className="text-sm font-semibold">{b.t}</div>
                <div className="text-xs text-ink-500">{b.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-black/5 p-3 text-[11px] text-ink-500">
          등록 시 닉네임과 관심 카테고리가 상점가 운영진에게 공유됩니다. 개인
          연락처는 공개되지 않아요.
        </div>

        <button
          onClick={confirmMembership}
          className="mt-4 w-full rounded-2xl bg-ink-900 px-4 py-3.5 text-sm font-semibold text-white shadow-card"
        >
          멤버십 등록하기
        </button>
        <button
          onClick={closeMembership}
          className="mt-2 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-ink-500"
        >
          나중에 할게요
        </button>
      </div>
    </Sheet>
  );
}
