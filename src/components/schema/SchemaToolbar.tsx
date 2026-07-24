import type { FieldKind } from "../../types.tsx";

interface SchemaToolbarProps {
  selectedKind: FieldKind | null;
  onAddNode: (kind: FieldKind) => void;
  onClearSelection: () => void;
}

export default function SchemaToolbar({
  selectedKind,
  onAddNode,
  onClearSelection,
}: SchemaToolbarProps) {
  const isLoopSelected = selectedKind === "loop";

  return (
    <div className="space-y-2 pt-2 border-t border-[var(--border)]">
      {/* Target Container Badge */}
      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
        <span>
          Target:{" "}
          <strong className="text-[var(--text-primary)]">
            {isLoopSelected ? "Selected Loop Container" : "Root List"}
          </strong>
        </span>

        {selectedKind && (
          <button
            type="button"
            onClick={onClearSelection}
            className="text-[10px] underline hover:text-[var(--text-primary)] cursor-pointer"
          >
            Target Root
          </button>
        )}
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-1.5">
        <button
          type="button"
          onClick={() => onAddNode("int")}
          className="px-2 py-1.5 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded text-xs transition-colors cursor-pointer"
        >
          + Int
        </button>
        <button
          type="button"
          onClick={() => onAddNode("string")}
          className="px-2 py-1.5 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded text-xs transition-colors cursor-pointer"
        >
          + String
        </button>
        <button
          type="button"
          onClick={() => onAddNode("array")}
          className="px-2 py-1.5 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded text-xs transition-colors cursor-pointer"
        >
          + Array
        </button>
        <button
          type="button"
          onClick={() => onAddNode("loop")}
          className="px-2 py-1.5 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded text-xs transition-colors cursor-pointer"
        >
          + Loop
        </button>
      </div>
    </div>
  );
}
