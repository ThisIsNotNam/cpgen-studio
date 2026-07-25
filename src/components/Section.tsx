import type { ReactNode } from "react";

export default function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4.5">
      <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-(--text-muted) mb-2.5 pb-2 border-b border-(--border)">
        {title}
      </div>
      {children}
    </div>
  );
}
