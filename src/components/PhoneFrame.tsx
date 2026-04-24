import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[430px] flex-col overflow-hidden">
      <div className="app-bg relative flex h-full flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
