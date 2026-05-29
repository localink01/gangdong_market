import { useEffect, useMemo, useState } from "react";
import { eventsByRegion, getMarket, getRegion, getStore, marketsByRegion } from "../data";
import { appIcons, marketIcons } from "../icons";
import { useApp } from "../store";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function isoDateParts(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

function formatMonthLabel(value: string) {
  const { year, month } = isoDateParts(`${value}-01`);
  return `${year}년 ${month}월`;
}

function formatDayLabel(value: string) {
  const { year, month, day } = isoDateParts(value);
  const weekday = WEEKDAY_LABELS[new Date(year, month - 1, day).getDay()];
  return `${month}.${day} (${weekday})`;
}

function makeMonthGrid(monthValue: string) {
  const [year, month] = monthValue.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - firstWeekday + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return null;
    }
    const isoDay = `${year}-${String(month).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
    return { isoDay, dayNumber };
  });
}

function shiftMonth(monthValue: string, diff: number) {
  const [year, month] = monthValue.split("-").map(Number);
  const next = new Date(year, month - 1 + diff, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
}

function publisherBadgeLabel(publisherType: "region_official" | "market_official" | "store") {
  switch (publisherType) {
    case "region_official":
      return "지자체 공식";
    case "market_official":
      return "상권 공식";
    case "store":
      return "가게";
  }
}

function categoryDotClass(category: "festival" | "coupon" | "night" | "family" | "market") {
  switch (category) {
    case "festival":
      return "bg-rose-500";
    case "coupon":
      return "bg-amber-500";
    case "night":
      return "bg-indigo-500";
    case "family":
      return "bg-emerald-500";
    case "market":
      return "bg-sky-500";
  }
}

function RegionEventCalendar() {
  const { activeRegionSlug, enterMarket, openStore } = useApp();
  const region = getRegion(activeRegionSlug);
  const allEvents = useMemo(() => eventsByRegion(activeRegionSlug), [activeRegionSlug]);
  const initialMonth = new URLSearchParams(window.location.search).get("month") ?? "2026-05";
  const initialDate = new URLSearchParams(window.location.search).get("date") ?? "2026-05-29";
  const [month, setMonth] = useState(initialMonth);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [statusFilter, setStatusFilter] = useState<"all" | "today" | "week" | "live">("all");

  const syncUrl = (nextMonth: string, nextDate: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("panel", "events");
    params.set("month", nextMonth);
    params.set("date", nextDate);
    window.history.pushState(null, "", `${window.location.pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const nextMonth = params.get("month") ?? "2026-05";
      const nextDate = params.get("date") ?? `${nextMonth}-01`;
      setMonth(nextMonth);
      setSelectedDate(nextDate);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const monthGrid = useMemo(() => makeMonthGrid(month), [month]);

  const selectedDateEvents = useMemo(() => {
    const today = "2026-05-29";
    return allEvents
      .filter((event) => {
        const isInSelectedDate = event.startDate <= selectedDate && event.endDate >= selectedDate;
        if (!isInSelectedDate) return false;

        if (statusFilter === "today") return selectedDate === today;
        if (statusFilter === "week") return event.startDate <= "2026-05-31";
        if (statusFilter === "live") return event.startDate <= today && event.endDate >= today;
        return true;
      })
      .sort((left, right) => left.startTime.localeCompare(right.startTime));
  }, [allEvents, selectedDate, statusFilter]);

  const weeklyHighlights = useMemo(
    () => allEvents.filter((event) => event.startDate >= "2026-05-29" && event.startDate <= "2026-05-31"),
    [allEvents],
  );

  const visibleMarketSummaries = useMemo(() => {
    const marketIds = Array.from(new Set(allEvents.map((event) => event.marketId)));
    return marketIds.map((marketId) => {
      const market = getMarket(marketId);
      const marketEvents = allEvents.filter((event) => event.marketId === marketId);
      const nextEvent = [...marketEvents].sort((left, right) => left.startDate.localeCompare(right.startDate))[0];
      return {
        market,
        eventCount: marketEvents.length,
        nextEventDate: nextEvent?.startDate ?? "-",
      };
    });
  }, [allEvents]);

  return (
    <div className="pb-6">
      <div className="px-5 pt-2">
        <div className="kicker">날짜에 맞춰 찾아가는 지역 이벤트</div>
        <h1 className="mt-1 text-[28px] font-bold leading-tight tracking-tight">
          {region?.brandName ?? "지자체 포털"} 이벤트 캘린더
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          상권과 가게가 올린 일정을 날짜별로 보고, 원하는 날에 바로 찾아갈 수 있게 정리했습니다.
        </p>
      </div>

      <div className="mx-5 mt-4 rounded-[28px] bg-gradient-to-br from-sky-950 via-slate-900 to-emerald-950 p-5 text-white shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">지자체 공식 큐레이션</div>
            <div className="mt-2 text-lg font-semibold">이번 주에 방문 날짜를 먼저 고르세요</div>
            <p className="mt-1 text-sm leading-relaxed text-white/70">
              캘린더에서 날짜를 누르면 그날 열리는 상권 행사와 가게 이벤트가 시간순으로 정리됩니다.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-2 text-right backdrop-blur-sm">
            <div className="text-[11px] text-white/65">이번 주 이벤트</div>
            <div className="text-2xl font-bold">{weeklyHighlights.length}</div>
          </div>
        </div>
      </div>

      <div className="mx-5 mt-4 rounded-3xl glass-strong p-4 shadow-card">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              const nextMonth = shiftMonth(month, -1);
              const nextDate = `${nextMonth}-01`;
              setMonth(nextMonth);
              setSelectedDate(nextDate);
              syncUrl(nextMonth, nextDate);
            }}
            className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-semibold text-ink-600"
          >
            이전달
          </button>
          <div className="text-sm font-semibold">{formatMonthLabel(month)}</div>
          <button
            onClick={() => {
              const nextMonth = shiftMonth(month, 1);
              const nextDate = `${nextMonth}-01`;
              setMonth(nextMonth);
              setSelectedDate(nextDate);
              syncUrl(nextMonth, nextDate);
            }}
            className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-semibold text-ink-600"
          >
            다음달
          </button>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { id: "all", label: "전체" },
            { id: "today", label: "오늘" },
            { id: "week", label: "이번주" },
            { id: "live", label: "진행중" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id as typeof statusFilter)}
              className={`rounded-2xl px-3 py-2 text-xs font-semibold ${
                statusFilter === filter.id ? "bg-ink-900 text-white" : "bg-black/5 text-ink-500"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[11px] font-semibold text-ink-400">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-2">
          {monthGrid.map((cell, index) => {
            if (!cell) {
              return <div key={`empty-${index}`} className="h-[84px] rounded-2xl bg-black/[0.03]" />;
            }

            const events = allEvents.filter((event) => event.startDate <= cell.isoDay && event.endDate >= cell.isoDay);
            const primaryEvent = events[0];
            const isSelected = selectedDate === cell.isoDay;
            const isToday = cell.isoDay === "2026-05-29";

            return (
              <button
                key={cell.isoDay}
                onClick={() => {
                  setSelectedDate(cell.isoDay);
                  syncUrl(month, cell.isoDay);
                }}
                className={`flex h-[84px] flex-col rounded-2xl border p-2 text-left transition ${
                  isSelected
                    ? "border-ink-900 bg-ink-900 text-white shadow-card"
                    : isToday
                      ? "border-brand-400 bg-brand-50"
                      : "border-black/5 bg-white/70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{cell.dayNumber}</span>
                  {events.length > 0 && (
                    <span className={`h-2 w-2 rounded-full ${isSelected ? "bg-white" : categoryDotClass(primaryEvent.category)}`} />
                  )}
                </div>
                <div className={`mt-2 text-[11px] leading-tight ${isSelected ? "text-white/80" : "text-ink-500"}`}>
                  {events.length > 0 ? `${events.length}개 일정` : "일정 없음"}
                </div>
                {primaryEvent && (
                  <div className={`mt-auto line-clamp-2 text-[10px] font-semibold ${isSelected ? "text-white" : "text-ink-700"}`}>
                    {getMarket(primaryEvent.marketId).name}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-5 mt-4 rounded-3xl glass p-4 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">선택 날짜 상세</div>
            <div className="mt-1 text-lg font-semibold">{formatDayLabel(selectedDate)}</div>
          </div>
          <div className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-semibold text-ink-500">
            {selectedDateEvents.length}개 일정
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {selectedDateEvents.length === 0 ? (
            <div className="rounded-2xl bg-black/[0.03] px-4 py-6 text-sm text-ink-500">
              선택한 날짜에는 등록된 이벤트가 없습니다.
            </div>
          ) : (
            selectedDateEvents.map((event) => {
              const market = getMarket(event.marketId);
              const store = event.storeId ? getStore(event.storeId) : null;

              return (
                <article key={event.id} className="rounded-3xl bg-white/80 p-4 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                        <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-sky-700">
                          {publisherBadgeLabel(event.publisherType)}
                        </span>
                        <span className="text-ink-400">{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="mt-1 text-base font-semibold">{event.title}</div>
                      <div className="mt-1 text-sm leading-relaxed text-ink-600">{event.summary}</div>
                    </div>
                    <div className="rounded-2xl bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                      {event.highlight}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-ink-500">
                    <div className="rounded-2xl bg-black/[0.03] px-3 py-2">상권: {market.name}</div>
                    <div className="rounded-2xl bg-black/[0.03] px-3 py-2">장소: {event.locationLabel}</div>
                    <div className="rounded-2xl bg-black/[0.03] px-3 py-2">주체: {event.publisherName}</div>
                    <div className="rounded-2xl bg-black/[0.03] px-3 py-2">대상: {event.audienceLabel}</div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => enterMarket(activeRegionSlug, market.id)}
                      className="flex-1 rounded-2xl bg-ink-900 py-2.5 text-sm font-semibold text-white"
                    >
                      상권 보기
                    </button>
                    {store ? (
                      <button
                        onClick={() => openStore(store.id)}
                        className="rounded-2xl bg-black/5 px-4 py-2.5 text-sm font-semibold text-ink-700"
                      >
                        가게 보기
                      </button>
                    ) : (
                      <button
                        onClick={() => enterMarket(activeRegionSlug, market.id)}
                        className="rounded-2xl bg-black/5 px-4 py-2.5 text-sm font-semibold text-ink-700"
                      >
                        일정 보기
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      <div className="mx-5 mt-4">
        <div className="mb-2 flex items-end justify-between">
          <h3 className="text-base font-semibold">이번주 가볼 만한 일정</h3>
          <span className="text-xs text-ink-400">날짜 기반 추천</span>
        </div>
        <div className="flex flex-col gap-3">
          {weeklyHighlights.map((event) => (
            <article key={`${event.id}-highlight`} className="glass rounded-3xl p-4 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold text-ink-500">{formatDayLabel(event.startDate)} · {event.startTime}</div>
                  <div className="mt-1 text-base font-semibold">{event.title}</div>
                  <div className="mt-1 text-sm text-ink-600">{event.highlight} · {getMarket(event.marketId).name}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedDate(event.startDate);
                    if (!event.startDate.startsWith(month)) {
                      const nextMonth = event.startDate.slice(0, 7);
                      setMonth(nextMonth);
                      syncUrl(nextMonth, event.startDate);
                      return;
                    }
                    syncUrl(month, event.startDate);
                  }}
                  className="rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  날짜로 보기
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-5 mt-5">
        <div className="mb-2 flex items-end justify-between">
          <h3 className="text-base font-semibold">참여 상권 일정</h3>
          <span className="text-xs text-ink-400">이번 달 기준</span>
        </div>
        <div className="flex flex-col gap-3">
          {visibleMarketSummaries.map(({ market, eventCount, nextEventDate }) => {
            const Icon = marketIcons[market.icon];
            return (
              <button
                key={market.id}
                onClick={() => enterMarket(activeRegionSlug, market.id)}
                className="glass flex items-center gap-3 rounded-3xl p-4 text-left shadow-card"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${market.gradient}`}>
                  <Icon className="h-6 w-6 text-ink-900" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{market.name}</div>
                  <div className="mt-0.5 text-xs text-ink-500">이번 달 이벤트 {eventCount}개 · 가장 가까운 일정 {formatDayLabel(nextEventDate)}</div>
                </div>
                <span className="text-sm font-semibold text-brand-600">상권 보기</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function RegionPortal() {
  const { activeRegionSlug, enterMarket, goToBenefits, toast, isMember } = useApp();
  const region = getRegion(activeRegionSlug);
  const marketList = marketsByRegion(activeRegionSlug);
  const quickIcons = [appIcons.benefit, appIcons.calendar, appIcons.star];
  const openMarkets = marketList.filter((market) => !market.ready);
  const [panel, setPanel] = useState(() => new URLSearchParams(window.location.search).get("panel") ?? "default");

  useEffect(() => {
    const handlePopState = () => {
      setPanel(new URLSearchParams(window.location.search).get("panel") ?? "default");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (panel === "events") {
    return <RegionEventCalendar />;
  }

  const openPanel = (panelName: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("panel", panelName);
    if (panelName === "events") {
      params.set("month", "2026-05");
      params.set("date", "2026-05-29");
    }
    window.history.pushState(null, "", `${window.location.pathname}?${params.toString()}`);
    setPanel(panelName);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* hero */}
      <div className="px-5 pt-2">
        <div className="kicker">내 근처 골목 상점가의 새로운 이름</div>
        <h1 className="mt-1 text-[28px] font-bold leading-tight tracking-tight">
          {region?.brandName ?? "지자체 포털"}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          지금 근처 9개 상점가의 신선한 소식을 확인하세요.
        </p>
      </div>

      {/* season banner */}
      <div className="mx-5 mt-4 overflow-hidden rounded-3xl shadow-card">
        <div className="relative h-40">
          <img
            src="/samples/hero_image.jpg"
            alt="지자체 이벤트 배너"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="glass rounded-2xl p-3 text-white">
              <div className="text-[11px] font-semibold uppercase tracking-wider opacity-90">
                지자체 캠페인
              </div>
              <div className="text-base font-semibold">
                {region?.brandName ?? "지자체"} 봄 쿠폰 캠페인 · D-3
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* quick access */}
      <div className="mx-5 mt-4 grid grid-cols-2 gap-2">
        {[
          { t: "쿠폰", n: "5" },
          { t: "이벤트", n: String(openMarkets.length) },
        ].map((q, idx) => {
          const Icon = quickIcons[idx];
          return (
            <button
              key={q.t}
              className="glass rounded-2xl px-3 py-3 text-left shadow-card"
              onClick={() => {
                if (q.t === "이벤트") {
                  openPanel("events");
                  return;
                }
                if (q.t === "쿠폰") {
                  goToBenefits("available");
                  return;
                }
                toast(`${q.t} 화면은 MVP 이후에 이어집니다`);
              }}
            >
              <Icon className="h-5 w-5 text-ink-700" />
              <div className="mt-1 text-[11px] font-semibold text-ink-500">{q.t}</div>
              <div className="text-base font-bold">{q.n}</div>
            </button>
          );
        })}
      </div>

      {/* markets */}
      <div className="mx-5 mt-6">
        <div className="mb-2 flex items-end justify-between">
          <h3 className="text-base font-semibold">우리 동네 상점가</h3>
          <span className="text-xs text-ink-400">
            총 {marketList.length}곳 중 {openMarkets.length}곳 운영
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {marketList.map((market) => {
            return (
              <button
                key={market.id}
                onClick={() => {
                  if (market.ready) {
                    toast("준비 중인 상권입니다");
                    return;
                  }
                  enterMarket(activeRegionSlug, market.id);
                }}
                className="group relative overflow-hidden rounded-3xl text-left shadow-card"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={market.image}
                    alt={`${market.name} 샘플 이미지`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
              </div>
                <div className="glass-strong p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{market.name}</div>
                    {isMember && market.id === "godeok-2dong" && (
                      <span className="rounded-full bg-brand-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                        내 시장
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-ink-500">{market.subtitle}</div>
                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    {market.ready ? (
                      <span className="rounded-full bg-black/5 px-2 py-0.5 text-ink-500">
                        준비 중
                      </span>
                    ) : (
                      <>
                        {market.eventLive && (
                          <span className="flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 font-semibold text-rose-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            이벤트 진행 중
                          </span>
                        )}
                        <span className="rounded-full bg-black/5 px-2 py-0.5 text-ink-500">
                          멤버 {market.members}명
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
