import type { ReactNode } from "react";

export function Sheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <button
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
        aria-label="닫기"
      />
      <div className="relative w-full animate-slide-up">
        <div className="glass-strong mx-2 mb-2 rounded-[28px] p-5 shadow-glass">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-black/20" />
          {children}
        </div>
      </div>
    </div>
  );
}
