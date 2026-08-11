import { SchemaNode } from "../../types";

export default function NodeCardPreview({ node }: { node: SchemaNode }) {
  const isLoop = node.kind === "loop";
  return (
    <div className="bg-(--bg-tertiary) border border-(--accent) rounded overflow-hidden shadow-lg cursor-grabbing">
      <div className="flex items-center gap-2 p-2 bg-(--bg-secondary)">
        <span className="text-(--text-muted) text-xs">⋮⋮</span>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-(--bg-input) text-(--text-secondary) border border-(--border)">
          {node.kind}
        </span>
        <span className="text-xs text-(--text-primary)">
          {isLoop ? node.count : node.varName || "(unnamed)"}
        </span>
      </div>
    </div>
  );
}
