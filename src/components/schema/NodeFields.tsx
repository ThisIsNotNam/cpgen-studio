import type { SchemaNode, StringNode, ArrayNode } from "../../types.ts";

interface NodeFieldsProps {
  node: SchemaNode;
  onUpdate: (id: string, updated: Partial<SchemaNode>) => void;
}

export default function NodeFields({ node, onUpdate }: NodeFieldsProps) {
  if (node.kind === "loop") {
    return null;
  }

  if (node.kind === "int") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-[var(--text-muted)] mb-1">
            Min
          </label>
          <input
            type="text"
            value={node.min}
            onChange={(e) => onUpdate(node.id, { min: e.target.value })}
            className="w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] px-2 py-1 rounded outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div>
          <label className="block text-[10px] text-[var(--text-muted)] mb-1">
            Max
          </label>
          <input
            type="text"
            value={node.max}
            onChange={(e) => onUpdate(node.id, { max: e.target.value })}
            className="w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] px-2 py-1 rounded outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>
    );
  }

  if (node.kind === "string") {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] mb-1">
              Length / Var
            </label>
            <input
              type="text"
              value={node.length}
              onChange={(e) => onUpdate(node.id, { length: e.target.value })}
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] px-2 py-1 rounded outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] mb-1">
              Charset
            </label>
            <select
              value={node.charset}
              onChange={(e) =>
                onUpdate(node.id, {
                  charset: e.target.value as StringNode["charset"],
                })
              }
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] px-1.5 py-1 rounded outline-none focus:border-[var(--accent)]"
            >
              <option value="lowercase">a-z (Lowercase)</option>
              <option value="uppercase">A-Z (Uppercase)</option>
              <option value="alphanumeric">a-Z, 0-9</option>
              <option value="digits">0-9 (Digits)</option>
              <option value="custom">Custom...</option>
            </select>
          </div>
        </div>

        {node.charset === "custom" && (
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] mb-1">
              Custom Characters
            </label>
            <input
              type="text"
              placeholder="e.g. ATGC"
              value={node.customCharset || ""}
              onChange={(e) =>
                onUpdate(node.id, { customCharset: e.target.value })
              }
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] px-2 py-1 rounded outline-none focus:border-[var(--accent)]"
            />
          </div>
        )}
      </div>
    );
  }

  if (node.kind === "array") {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] mb-1">
              Length / Var
            </label>
            <input
              type="text"
              value={node.length}
              onChange={(e) => onUpdate(node.id, { length: e.target.value })}
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] px-2 py-1 rounded outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] mb-1">
              Element
            </label>
            <select
              value={node.elementType}
              onChange={(e) =>
                onUpdate(node.id, {
                  elementType: e.target.value as ArrayNode["elementType"],
                })
              }
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] px-1 py-1 rounded outline-none focus:border-[var(--accent)]"
            >
              <option value="int">Integer</option>
              <option value="string">String</option>
              <option value="float">Float</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] mb-1">
              Separator
            </label>
            <select
              value={node.separator}
              onChange={(e) =>
                onUpdate(node.id, {
                  separator: e.target.value as ArrayNode["separator"],
                })
              }
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] px-1 py-1 rounded outline-none focus:border-[var(--accent)]"
            >
              <option value="space">Space (" ")</option>
              <option value="newline">Newline (\n)</option>
              <option value="comma">Comma (",")</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] mb-1">
              Elem Min
            </label>
            <input
              type="text"
              value={node.min}
              onChange={(e) => onUpdate(node.id, { min: e.target.value })}
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] px-2 py-1 rounded outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] mb-1">
              Elem Max
            </label>
            <input
              type="text"
              value={node.max}
              onChange={(e) => onUpdate(node.id, { max: e.target.value })}
              className="w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] px-2 py-1 rounded outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
