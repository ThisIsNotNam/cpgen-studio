import { Code2, Settings } from "lucide-react";
import { tabSlot } from "../types";

interface SidebarProps {
  activeTab: tabSlot;
  onSelectTab: (tab: tabSlot) => void;
}

export default function Sidebar({ activeTab, onSelectTab }: SidebarProps) {
  return (
    <aside className="w-11 h-full shrink-0 border-r border-(--border) bg-background flex flex-col items-center py-3 space-y-2 select-none">
      <button
        onClick={() => onSelectTab("editor")}
        className={`p-2.5 rounded-lg transition-colors ${
          activeTab === "editor"
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
        }`}
        title="Editor"
      >
        <Code2 className="w-5 h-5" />
      </button>

      <button
        onClick={() => onSelectTab("settings")}
        className={`p-2.5 rounded-lg transition-colors ${
          activeTab === "settings"
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
        }`}
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
    </aside>
  );
}
