import { useApp } from "../store";

export function ToastStack() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none absolute inset-x-0 top-14 z-[60] flex flex-col items-center gap-2 px-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="glass-dark pointer-events-auto animate-slide-up rounded-2xl px-4 py-2.5 text-sm shadow-glass"
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
