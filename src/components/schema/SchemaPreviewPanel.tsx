import { usePipelineContext } from "../../context/PipelineContext";

interface SchemaPreviewPanelProps {
  example: string | null;
  onGenerate: () => void;
}

const DISPLAY_LIMIT = 100_000;

export default function SchemaPreviewPanel({
  example,
  onGenerate,
}: SchemaPreviewPanelProps) {
  const { isGenerating } = usePipelineContext();

  const displayExample =
    example && example.length >= DISPLAY_LIMIT
      ? example.slice(0, DISPLAY_LIMIT)
      : example;

  return (
    <div className="h-full min-h-0 flex flex-col bg-(--bg-primary)">
      <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-(--border)">
        <span className="text-(--text-muted) text-[12px] uppercase tracking-wide">
          Example Output
        </span>
        <button
          type="button"
          onClick={onGenerate}
          className="px-2.5 py-1 bg-(--accent) hover:bg-(--accent-hover) text-white rounded text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isGenerating}
        >
          Generate
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-3">
        {example ? (
          <>
            <pre className="font-mono text-xs whitespace-pre text-(--text-primary)">
              {displayExample}
            </pre>
            {example.length > DISPLAY_LIMIT && (
              <p className="text-(--text-muted) text-xs mt-2">
                Showing first {DISPLAY_LIMIT.toLocaleString()} of{" "}
                {example.length.toLocaleString()} characters.
              </p>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-(--text-muted) text-sm text-center">
            Click Generate to preview an example test case.
          </div>
        )}
      </div>
    </div>
  );
}
