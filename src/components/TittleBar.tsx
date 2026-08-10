import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

export default function TitleBar() {
  return (
    <div
      data-tauri-drag-region
      className="h-8 shrink-0 flex items-center justify-between bg-(--bg-secondary) border-b border-(--border) select-none"
    >
      <span
        className="pl-3 text-[12px] text-(--text-muted)"
        data-tauri-drag-region
      >
        CPGen Studio
      </span>
      <div className="flex">
        <button
          type="button"
          onClick={() => appWindow.minimize()}
          className="w-11 h-8 flex items-center justify-center text-(--text-muted) hover:bg-(--bg-tertiary)"
        >
          –
        </button>
        <button
          type="button"
          onClick={() => appWindow.toggleMaximize()}
          className="w-11 h-8 flex items-center justify-center text-(--text-muted) hover:bg-(--bg-tertiary)"
        >
          ☐
        </button>
        <button
          type="button"
          onClick={() => appWindow.close()}
          className="w-11 h-8 flex items-center justify-center text-(--text-muted) hover:bg-red-600 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
