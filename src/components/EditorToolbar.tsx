import { ChevronRight, Play } from "lucide-react";
import { usePipelineContext } from "../context/PipelineContext";
import { useWorkspaceContext } from "../context/WorkspaceContext";

export default function EditorToolbar() {
  const { activeFile, generatorMode } = useWorkspaceContext();
  const { isRunning, executePipeline } = usePipelineContext();
  const activeFileName = activeFile?.name ?? "No file selected";

  return (
    <div className="h-10.5 shrink-0 bg-(--bg-secondary) border-b border-(--border) flex items-center gap-2 px-3.5">
      <div className="flex items-center gap-1.5 text-[13px] text-(--text-muted) min-w-0">
        <span className="text-(--text-secondary) whitespace-nowrap">
          Workspace
        </span>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-(--text-secondary) whitespace-nowrap">
          {generatorMode != "visual" ? activeFileName : "Visual builder"}
        </span>
      </div>
      <div className="flex-1" />
      <button
        className="h-7 px-3 rounded-sm border cursor-pointer inline-flex items-center gap-1.5 text-[13px] bg-(--accent) border-(--accent) text-white hover:bg-(--accent-hover) disabled:opacity-50 disabled:cursor-wait"
        onClick={executePipeline}
        disabled={isRunning}
        type="button"
      >
        <Play size={14} strokeWidth={2} fill="currentColor" />
        {isRunning ? "Running..." : "Run"}
      </button>
    </div>
  );
}
