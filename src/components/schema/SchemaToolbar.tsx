import type { FieldKind } from "../../types";

interface SchemaToolbarProps {
  selectedKind: FieldKind | null;
  onAddNode: (kind: FieldKind) => void;
  onClearSelection: () => void;
}

const ADDABLE_KINDS: { kind: FieldKind; label: string }[] = [
  { kind: "int", label: "+ Int" },
  { kind: "float", label: "+ Float" },
  { kind: "string", label: "+ String" },
  { kind: "array", label: "+ Array" },
  { kind: "loop", label: "+ Loop" },
];

const BUTTON_CLASS =
  "px-2 py-1.5 bg-(--bg-tertiary) hover:bg-(--bg-secondary) border border-(--border) text-(--text-secondary) hover:text-(--text-primary) rounded text-xs transition-colors cursor-pointer";

export default function SchemaToolbar({
  selectedKind,
  onAddNode,
  onClearSelection,
}: SchemaToolbarProps) {
  const isLoopSelected = selectedKind === "loop";

  return (
    <div className="space-y-2 pt-2 border-t border-(--border)">
      <div className="flex items-center justify-between text-[11px] text-(--text-muted)">
        <span>
          Target:{" "}
          <strong className="text-(--text-primary)">
            {isLoopSelected ? "Selected Loop Container" : "Root List"}
          </strong>
        </span>

        {selectedKind && (
          <button
            type="button"
            onClick={onClearSelection}
            className="text-[10px] underline hover:text-(--text-primary) cursor-pointer"
          >
            Target Root
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {ADDABLE_KINDS.map(({ kind, label }) => (
          <button
            key={kind}
            type="button"
            onClick={() => onAddNode(kind)}
            className={BUTTON_CLASS}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
