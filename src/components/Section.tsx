import type { ReactNode } from "react";

export default function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-[18px]">
      <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-2.5 pb-2 border-b border-[var(--border)]">
        {title}
      </div>
      {children}
    </div>
  );
}
