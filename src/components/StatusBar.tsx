export function StatusBar({ light = false }: { light?: boolean }) {
  const color = light ? "text-white" : "text-ink-900";
  return (
    <div
      className={`relative z-30 flex h-11 items-center justify-between px-6 pt-1 text-[13px] font-semibold tabular-nums ${color}`}
    >
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <span>●●●●●</span>
        <span>5G</span>
        <span>100%</span>
      </span>
    </div>
  );
}
