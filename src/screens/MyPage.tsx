import { useState } from "react";
import { getStore, storesByMarket } from "../data";
import { appIcons, storeIcons } from "../icons";
import { useApp } from "../store";

export function MyPage() {
  const { isMember, dangolStoreIds, openMembership, openStore, go } = useApp();
  const BellIcon = appIcons.bell;
  const PersonIcon = appIcons.person;
  const HeartIcon = appIcons.heart;
  const GearIcon = appIcons.manage;
  const StarIcon = appIcons.star;

  const [notifMarket, setNotifMarket] = useState(true);
  const [notifDangol, setNotifDangol] = useState(true);

  const dangolStores = dangolStoreIds
    .map((id) => getStore(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getStore>>[];

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* 프로필 */}
      <div className="mx-5 mt-4">
        <div className="glass-strong flex items-center gap-4 rounded-3xl p-4 shadow-glass">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-sky-300">
            <PersonIcon className="h-7 w-7 text-ink-900" />
          </div>
          <div className="flex-1">
            <div className="text-base font-bold">이웃주민</div>
            <div className="text-xs text-ink-500">
              {isMember ? "고덕2동 골목형상점가 멤버" : "비멤버"}
            </div>
          </div>
          <button className="rounded-full glass px-3 py-1.5 text-xs font-semibold shadow-card">
            수정
          </button>
        </div>
      </div>

      {/* 내 멤버십 */}
      <div className="mx-5 mt-5">
        <div className="mb-2 text-base font-semibold">내 멤버십</div>
        {isMember ? (
          <div className="rounded-3xl glass p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-white">
                <StarIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">고덕2동 골목형상점가</div>
                <div className="text-xs text-ink-500">2026.04.23 가입</div>
              </div>
              <button
                onClick={() => go("market")}
                className="rounded-full glass px-3 py-1.5 text-xs font-semibold shadow-card"
              >
                상점가로 →
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-3xl glass p-6 text-center shadow-card">
            <div className="text-sm text-ink-500">아직 가입한 상점가가 없어요</div>
            <button
              onClick={openMembership}
              className="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
            >
              멤버십 등록하기
            </button>
          </div>
        )}
      </div>

      {/* 내 단골 가게 */}
      <div className="mx-5 mt-5">
        <div className="mb-2 flex items-end justify-between">
          <div className="text-base font-semibold">내 단골 가게</div>
          <span className="text-xs text-ink-500">{dangolStores.length}곳</span>
        </div>

        {dangolStores.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-3xl glass p-6 text-center shadow-card">
            <HeartIcon className="h-8 w-8 text-ink-300" />
            <div className="text-sm text-ink-500">
              아직 단골 등록한 가게가 없어요
            </div>
            <button
              onClick={() => go("market")}
              className="mt-1 text-xs font-semibold text-brand-600"
            >
              가게 둘러보기 →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {dangolStores.map((store) => {
              const Icon = storeIcons[store.icon];
              return (
                <button
                  key={store.id}
                  onClick={() => openStore(store.id)}
                  className="glass flex items-center gap-3 rounded-2xl p-3 text-left shadow-card"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${store.gradient}`}
                  >
                    <Icon className="h-5 w-5 text-ink-900" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{store.name}</div>
                    <div className="text-xs text-ink-500">{store.category}</div>
                  </div>
                  <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                    단골
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 알림 설정 */}
      <div className="mx-5 mt-5">
        <div className="mb-2 text-base font-semibold">알림 설정</div>
        <div className="rounded-3xl glass p-4 shadow-card flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">상점가 멤버 알림</div>
              <div className="text-xs text-ink-500">공지, 이벤트, 쿠폰 알림</div>
            </div>
            <button
              onClick={() => setNotifMarket((v) => !v)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                notifMarket ? "bg-brand-500" : "bg-ink-200"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  notifMarket ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="h-px bg-black/5" />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">단골 소식 알림</div>
              <div className="text-xs text-ink-500">단골 등록 가게의 새 소식</div>
            </div>
            <button
              onClick={() => setNotifDangol((v) => !v)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                notifDangol ? "bg-brand-500" : "bg-ink-200"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  notifDangol ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 운영 대시보드 */}
      <div className="mx-5 mt-5">
        <div className="mb-2 text-base font-semibold">운영 대시보드</div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => go("merchantCouncilAdmin")}
            className="flex w-full items-center gap-3 rounded-3xl glass px-4 py-3.5 text-left shadow-card"
          >
            <GearIcon className="h-5 w-5 text-ink-600" />
            <div className="flex-1">
              <div className="text-sm font-semibold">상인회 대시보드</div>
              <div className="text-xs text-ink-500">상점가 공지·이벤트 운영 및 참여 현황</div>
            </div>
            <span className="text-ink-400">→</span>
          </button>

          <button
            onClick={() => go("districtAdmin")}
            className="flex w-full items-center gap-3 rounded-3xl glass px-4 py-3.5 text-left shadow-card"
          >
            <BellIcon className="h-5 w-5 text-ink-600" />
            <div className="flex-1">
              <div className="text-sm font-semibold">구청 대시보드</div>
              <div className="text-xs text-ink-500">상점가별 성과 통계와 정책 리포트</div>
            </div>
            <span className="text-ink-400">→</span>
          </button>

          <button
            onClick={() => go("storeAdmin")}
            className="flex w-full items-center gap-3 rounded-3xl glass px-4 py-3.5 text-left shadow-card"
          >
            <HeartIcon className="h-5 w-5 text-ink-600" />
            <div className="flex-1">
              <div className="text-sm font-semibold">상점 대시보드</div>
              <div className="text-xs text-ink-500">내 가게 단골·쿠폰·소식 발행 관리</div>
            </div>
            <span className="text-ink-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
