import { useState } from "react";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SchemaNode } from "../../types";
import NodeFields from "./NodeFields";

interface NodeCardProps {
  node: SchemaNode;
  selectedId: string | null;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onUpdate: (id: string, updated: Partial<SchemaNode>) => void;
  onRemove: (id: string) => void;
}

export default function NodeCard({
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => onSelect(node.id, e)}
      className={`bg-[var(--bg-tertiary)] border rounded overflow-hidden shadow-sm cursor-pointer select-none ${
        isSelected
          ? "border-[var(--accent)] ring-1 ring-[var(--accent)]"
          : "border-[var(--border)] hover:border-[var(--border-light,#353940)]"
      }`}
    >
      {/* Entire Header Bar acts as Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-2 p-2 bg-[var(--bg-secondary)] border-b border-[var(--border)] cursor-grab active:cursor-grabbing touch-none"
      >
        <span className="text-[var(--text-muted)] text-xs">⋮⋮</span>

        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[var(--bg-input)] text-[var(--text-secondary)] border border-[var(--border)] pointer-events-none">
          {node.kind}
        </span>

        {node.kind !== "loop" && (
          <input
            type="text"
            placeholder="Var (e.g. N)"
            value={node.varName || ""}
            onPointerDown={stopInteractivePropagation}
            onClick={stopInteractivePropagation}
            onChange={(e) => onUpdate(node.id, { varName: e.target.value })}
            className="w-20 bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] px-1.5 py-0.5 rounded text-xs outline-none focus:border-[var(--accent)] cursor-text"
          />
        )}

        <div
          className="ml-auto flex items-center gap-1"
          onPointerDown={stopInteractivePropagation}
          onClick={stopInteractivePropagation}
        >
          {node.kind !== "loop" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed(!collapsed);
              }}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs px-1 cursor-pointer"
            >
              {collapsed ? "▶" : "▼"}
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(node.id);
            }}
            className="text-[var(--text-muted)] hover:text-[var(--danger,#ef4444)] px-1 py-0.5 rounded transition-colors cursor-pointer text-xs"
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
            <div className="pl-2 border-l-2 border-[var(--accent)] bg-[var(--bg-primary)] p-2 rounded space-y-2 min-h-[48px]">
              <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                Loop Container
              </div>

              {node.children.length === 0 ? (
                <div className="text-[11px] text-[var(--text-muted)] italic text-center py-2 border border-dashed border-[var(--border)] rounded">
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
