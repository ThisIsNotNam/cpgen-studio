import type { WorkspaceFile, WorkspaceSlot } from "../types";

interface FileSwitcherTabsProps {
  generatorFile: WorkspaceFile | null;
  solutionFile: WorkspaceFile | null;
  activeFileSlot: WorkspaceSlot | null;
  onActiveFileSlotChange: (slot: WorkspaceSlot | null) => void;
}

export default function FileSwitcherTabs({
  generatorFile,
  solutionFile,
  activeFileSlot,
  onActiveFileSlotChange,
}: FileSwitcherTabsProps) {
  return (
    <div className="section">
      <div className="section-title">Open files</div>
      <div className="file-switcher">
        <button
          type="button"
          className={`file-switcher-tab ${activeFileSlot === "generator" ? "active" : ""}`}
          onClick={() => onActiveFileSlotChange("generator")}
          disabled={!generatorFile}
        >
          {generatorFile?.name ?? "Generator"}
        </button>
        <button
          type="button"
          className={`file-switcher-tab ${activeFileSlot === "solution" ? "active" : ""}`}
          onClick={() => onActiveFileSlotChange("solution")}
          disabled={!solutionFile}
        >
          {solutionFile?.name ?? "Solution"}
        </button>
      </div>
    </div>
  );
}
