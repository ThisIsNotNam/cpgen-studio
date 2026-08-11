import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { memo, useState } from "react";
import type { SchemaNode } from "../../types";
import NodeFields from "./NodeFields";

interface NodeCardProps {
  node: SchemaNode;
  selectedId: string | null;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onUpdate: (id: string, updated: Partial<SchemaNode>) => void;
  onRemove: (id: string) => void;
}

function NodeCard({
  node,
  selectedId,
  onSelect,
  onUpdate,
  onRemove,
}: NodeCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const isSelected = selectedId === node.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: node.id,
  });

  const style = {
    // Translate avoids scale-stretching during reordering
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  const stopInteractivePropagation = (
    e: React.PointerEvent | React.MouseEvent,
  ) => {
    e.stopPropagation();
  };

  const isLoop = node.kind === "loop";
  const fieldKey = isLoop ? "count" : "varName";

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => onSelect(node.id, e)}
      className={`bg-(--bg-tertiary) border rounded overflow-hidden shadow-sm cursor-pointer select-none ${
        isSelected
          ? "border-(--accent) ring-1 ring-(--accent)"
          : "border-(--border) hover:border-(--border-light,#353940)"
      }`}
    >
      {/* Entire Header Bar acts as Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-2 p-2 bg-(--bg-secondary) border-b border-(--border) cursor-grab active:cursor-grabbing touch-none"
      >
        <span className="text-(--text-muted) text-xs">⋮⋮</span>

        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-(--bg-input) text-(--text-secondary) border border-(--border) pointer-events-none">
          {node.kind}
        </span>

        <input
          type="text"
          placeholder={isLoop ? "Count (e.g. T)" : "Var (e.g. N)"}
          value={isLoop ? node.count : node.varName || ""}
          onPointerDown={stopInteractivePropagation}
          onClick={stopInteractivePropagation}
          onChange={(e) => onUpdate(node.id, { [fieldKey]: e.target.value })}
          className="w-20 bg-(--bg-input) border border-(--border) text-(--text-primary) px-1.5 py-0.5 rounded text-xs outline-none focus:border-(--accent) cursor-text"
        />

        <div
          className="ml-auto flex items-center gap-1"
          onPointerDown={stopInteractivePropagation}
          onClick={stopInteractivePropagation}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(!collapsed);
            }}
            className="text-(--text-muted) hover:text-(--text-primary) text-xs px-1 cursor-pointer"
          >
            {collapsed ? "▶" : "▼"}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(node.id);
            }}
            className="text-(--text-muted) hover:text-(--danger,#ef4444) px-1 py-0.5 rounded transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div
          className="p-2 space-y-2 text-xs"
          onPointerDown={stopInteractivePropagation}
        >
          {node.kind === "loop" ? (
            <div className="pl-2 border-l-2 border-(--accent) bg-(--bg-primary) p-2 rounded space-y-2 min-h-12">
              <div className="text-[10px] text-(--text-muted) uppercase font-semibold">
                Loop Container
              </div>

              {node.children.length === 0 ? (
                <div className="text-[11px] text-(--text-muted) italic text-center py-2 border border-dashed border-(--border) rounded">
                  Select this loop to add blocks inside
                </div>
              ) : (
                <SortableContext
                  items={node.children.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {node.children.map((child) => (
                      <NodeCard
                        key={child.id}
                        node={child}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        onUpdate={onUpdate}
                        onRemove={onRemove}
                      />
                    ))}
                  </div>
                </SortableContext>
              )}
            </div>
          ) : (
            <NodeFields node={node} onUpdate={onUpdate} />
          )}
        </div>
      )}
    </div>
  );
}

export default memo(NodeCard);
