import { useWorkspaceContext } from "../context/WorkspaceContext";
import { usePipelineContext } from "../context/PipelineContext";

export default function EditorToolbar() {
  const { activeFile } = useWorkspaceContext();
  const { isRunning, executePipeline } = usePipelineContext();
  const activeFileName = activeFile?.name ?? "No file selected";

  return (
    <div className="h-[42px] shrink-0 bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center gap-2 px-3.5">
      <div className="flex items-center gap-1.5 text-[13px] text-[var(--text-muted)] min-w-0">
        <span className="text-[var(--text-secondary)] whitespace-nowrap">
          contest
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span className="text-[var(--text-secondary)] whitespace-nowrap">
          {activeFileName}
        </span>
      </div>
      <div className="flex-1" />
      <button
        className="h-[30px] px-3.5 rounded-md border cursor-pointer inline-flex items-center gap-1.5 text-[13px] bg-[var(--accent)] border-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={executePipeline}
        disabled={isRunning}
        type="button"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        {isRunning ? "Running..." : "Run"}
      </button>
    </div>
  );
}
