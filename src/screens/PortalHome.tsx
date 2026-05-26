import { useMemo, useState } from "react";
import { regions } from "../data";
import { useApp } from "../store";

export function PortalHome() {
  const { enterRegion, toast } = useApp();
  const [selectedRegionSlug, setSelectedRegionSlug] = useState("gangdong-gu");
  const selectedRegion = useMemo(
    () => regions.find((region) => region.slug === selectedRegionSlug) ?? regions[0],
    [selectedRegionSlug],
  );

  const onEnterRegion = () => {
    if (selectedRegion.status === "ready") {
      toast(`${selectedRegion.brandName}은 현재 준비 중입니다`);
      return;
    }
    enterRegion(selectedRegion.slug);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* regions */}
      <div className="mx-5 mt-4">
        <div className="mb-2 flex items-end justify-between">
          <h2 className="text-base font-semibold">지자체 선택</h2>
          <span className="text-xs text-ink-400">총 {regions.length}곳</span>
        </div>
        <div className="flex flex-col gap-2">
          {regions.map((region) => (
            <button
              key={region.slug}
              onClick={() => {
                setSelectedRegionSlug(region.slug);
                if (region.status === "ready") {
                  toast(`${region.brandName}은 현재 준비 중입니다`);
                  return;
                }
                enterRegion(region.slug);
              }}
              className={`glass rounded-2xl border p-4 text-left shadow-card transition ${
                selectedRegionSlug === region.slug ? "border-brand-400 bg-brand-50/60" : "border-white/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{region.brandName}</div>
                  <div className="mt-0.5 text-xs text-ink-500">{region.subtitle}</div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    region.status === "live"
                      ? "bg-emerald-500/15 text-emerald-700"
                      : "bg-black/5 text-ink-500"
                  }`}
                >
                  {region.status === "live" ? "운영 중" : "준비 중"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-5 mt-4 rounded-3xl glass p-4 shadow-card">
        <div className="text-xs font-semibold text-ink-500">선택된 지자체</div>
        <div className="mt-1 text-base font-bold">{selectedRegion.brandName}</div>
        <div className="mt-0.5 text-xs text-ink-500">{selectedRegion.subtitle}</div>
        <button
          onClick={onEnterRegion}
          className="mt-3 w-full rounded-2xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          {selectedRegion.status === "ready"
            ? "서비스 준비 중"
            : `${selectedRegion.brandName} 포털로 이동`}
        </button>
      </div>
    </div>
  );
}
