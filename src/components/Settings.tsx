import { SlidersHorizontal } from "lucide-react";

export default function Settings() {
  return (
    <div className="h-full flex items-center justify-center p-6 bg-(--bg-primary)">
      <div className="max-w-md w-full rounded-2xl border border-(--border) bg-(--bg-tertiary) p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-(--border-light) bg-(--bg-input) text-(--accent)">
          <SlidersHorizontal size={22} strokeWidth={2} />
        </div>
        <div className="font-semibold uppercase tracking-[0.14em] text-(--text-muted)">
          Settings
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-(--text-primary)">
          Preferences panel coming soon
        </h1>
        <p className="mt-3 text-sm leading-6 text-(--text-secondary)">
          This space will hold editor, workspace, and generation controls once
          the settings surface is ready.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-(--text-muted)">
          <span className="h-2 w-2 rounded-full bg-(--accent)" />
          Placeholder content for layout and spacing
        </div>
      </div>
    </div>
  );
}
