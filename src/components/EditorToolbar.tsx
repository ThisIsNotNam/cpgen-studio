import { useWorkspaceContext } from "../context/WorkspaceContext";
import { usePipelineContext } from "../context/PipelineContext";

export default function EditorToolbar() {
  const { activeFileSlot, generatorFile, solutionFile } = useWorkspaceContext();
  const { isRunning, executePipeline } = usePipelineContext();

  const activeFile =
    activeFileSlot === "generator"
      ? generatorFile
      : activeFileSlot === "solution"
        ? solutionFile
        : null;
  const activeFileName = activeFile?.name ?? "No file selected";

  return (
    <div className="toolbar">
      <div className="breadcrumb">
        <span>contest</span>
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
        <span>{activeFileName}</span>
      </div>
      <div className="toolbar-spacer" />
      <button
        className="tool-btn primary"
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
