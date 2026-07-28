export function generatePlaceholder(): string {
  const lineCount = 3 + Math.floor(Math.random() * 4);
  const lines: string[] = [];
  for (let i = 0; i < lineCount; i++) {
    const cols = 1 + Math.floor(Math.random() * 5);
    const values = Array.from({ length: cols }, () =>
      Math.floor(Math.random() * 1000),
    );
    lines.push(values.join(" "));
  }
  return lines.join("\n");
}

interface SchemaPreviewPanelProps {
  example: string | null;
  onGenerate: () => void;
}

export default function SchemaPreviewPanel({
  example,
  onGenerate,
}: SchemaPreviewPanelProps) {
  return (
    <div className="h-full min-h-0 flex flex-col bg-(--bg-primary)">
      <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-(--border)">
        <span className="text-(--text-muted) text-[12px] uppercase tracking-wide">
          Example Output
        </span>
        <button
          type="button"
          onClick={onGenerate}
          className="px-2.5 py-1 bg-(--accent) hover:bg-(--accent-hover) text-white rounded text-xs font-semibold transition-colors cursor-pointer"
        >
          Generate
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-3">
        {example ? (
          <pre className="font-mono text-xs whitespace-pre-wrap text-(--text-primary)">
            {example}
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center text-(--text-muted) text-sm text-center">
            Click Generate to preview an example test case.
          </div>
        )}
      </div>
    </div>
  );
}
