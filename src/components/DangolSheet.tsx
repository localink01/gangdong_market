import { getStore } from "../data";
import { appIcons, storeIcons } from "../icons";
import { useApp } from "../store";
import { Sheet } from "./Sheet";

export function DangolSheet() {
  const { showDangolModal, closeDangol, confirmDangol, dangolTargetStoreId } = useApp();
  const store = getStore(dangolTargetStoreId);
  const StoreIcon = store ? storeIcons[store.icon] : appIcons.benefit;
  const TagIcon = appIcons.pin;
  const BenefitIcon = appIcons.benefit;
  const BellIcon = appIcons.bell;
  return (
    <Sheet open={showDangolModal} onClose={closeDangol}>
      <div className="px-1">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${
              store?.gradient ?? "from-amber-200 to-rose-200"
            } text-2xl shadow-card`}
          >
            <StoreIcon className="h-6 w-6 text-ink-900" />
          </div>
          <div>
            <div className="kicker">{store?.category}</div>
            <div className="text-lg font-bold">{store?.name} 단골되기</div>
          </div>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-ink-500">
          이 가게의 소식을 가장 먼저 받아보실 수 있어요. 단골만 볼 수 있는
          혜택과 알림을 받게 됩니다.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {[
            { i: TagIcon, t: "단골 전용 소식", d: "한정 메뉴·오프라인 이벤트" },
            { i: BenefitIcon, t: "단골 쿠폰", d: "이 가게만의 혜택" },
            { i: BellIcon, t: "실시간 알림", d: "새 소식 올라오면 바로 알림" },
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
          등록 시 멤버 닉네임이 가게 사장님에게 공개됩니다. 개인 연락처는
          공유되지 않아요.
        </div>

        <button
          onClick={confirmDangol}
          className="mt-4 w-full rounded-2xl bg-ink-900 px-4 py-3.5 text-sm font-semibold text-white shadow-card"
        >
          정보 받아보기
        </button>
        <button
          onClick={closeDangol}
          className="mt-2 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-ink-500"
        >
          취소
        </button>
      </div>
    </Sheet>
  );
}
