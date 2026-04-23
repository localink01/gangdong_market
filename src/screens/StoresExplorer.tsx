import { storesByMarket } from "../data";
import { appIcons, storeIcons } from "../icons";
import { useApp } from "../store";
import { useMemo, useState } from "react";

type ViewMode = "list" | "map";

export function StoresExplorer() {
  const { openStore } = useApp();
  const [mode, setMode] = useState<ViewMode>("list");
  const stores = useMemo(() => storesByMarket("godeok-2dong"), []);
  const MapIcon = appIcons.pin;

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="mx-5 mt-2">
        <div className="glass-strong inline-flex rounded-full p-1 shadow-card">
          <button
            onClick={() => setMode("list")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${
              mode === "list" ? "bg-ink-900 text-white" : "text-ink-500"
            }`}
          >
            목록으로 보기
          </button>
          <button
            onClick={() => setMode("map")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${
              mode === "map" ? "bg-ink-900 text-white" : "text-ink-500"
            }`}
          >
            지도로 보기
          </button>
        </div>
      </div>

      {mode === "list" ? (
        <div className="mx-5 mt-4 flex flex-col gap-2">
          {stores.map((s) => {
            const Icon = storeIcons[s.icon];
            return (
              <button
                key={s.id}
                onClick={() => openStore(s.id)}
                className="glass flex items-center gap-3 rounded-2xl p-3 text-left shadow-card"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient}`}
                >
                  <Icon className="h-6 w-6 text-ink-900" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-ink-500">
                    {s.category} · {s.address}
                  </div>
                </div>
                <span className="text-ink-400">→</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mx-5 mt-4 rounded-3xl glass p-4 shadow-card">
          <div className="relative h-[360px] overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 via-cyan-100 to-sky-200">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
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
          <p className="mt-3 text-xs text-ink-500">
            핀을 누르면 상점 상세 페이지로 이동합니다.
          </p>
        </div>
      )}
    </div>
  );
}
