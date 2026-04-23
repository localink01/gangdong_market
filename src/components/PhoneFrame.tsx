import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[430px] flex-col overflow-hidden md:max-w-[420px] md:rounded-[48px] md:border md:border-black/10 md:shadow-[0_30px_80px_-20px_rgba(16,24,40,0.35)]">
      {/* iPhone notch (visible on md+) */}
      <div className="pointer-events-none absolute left-1/2 top-2 z-40 hidden h-6 w-32 -translate-x-1/2 rounded-full bg-black/95 md:block" />
      <div className="app-bg relative flex h-full flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
