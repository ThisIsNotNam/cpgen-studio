import type { ReactNode } from "react";
import type { SchemaNode, StringNode, ArrayNode } from "../../types";

interface NodeFieldsProps {
  node: SchemaNode;
  onUpdate: (id: string, updated: Partial<SchemaNode>) => void;
}

const INPUT_CLASS =
  "w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] px-2 py-1 rounded outline-none focus:border-[var(--accent)]";
const SELECT_CLASS =
  "w-full bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] px-1.5 py-1 rounded outline-none focus:border-[var(--accent)]";
const LABEL_CLASS = "block text-[10px] text-[var(--text-muted)] mb-1";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className={LABEL_CLASS}>{label}</label>
      {children}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT_CLASS}
      />
    </Field>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={SELECT_CLASS}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export default function NodeFields({ node, onUpdate }: NodeFieldsProps) {
  const update = (patch: Partial<SchemaNode>) => onUpdate(node.id, patch);

  if (node.kind === "loop") {
    return null;
  }

  if (node.kind === "int") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <TextField
          label="Min"
          value={node.min}
          onChange={(v) => update({ min: v })}
        />
        <TextField
          label="Max"
          value={node.max}
          onChange={(v) => update({ max: v })}
        />
      </div>
    );
  }

  if (node.kind === "string") {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <TextField
            label="Length / Var"
            value={node.length}
            onChange={(v) => update({ length: v })}
          />
          <SelectField<StringNode["charset"]>
            label="Charset"
            value={node.charset}
            onChange={(v) => update({ charset: v })}
            options={[
              { value: "lowercase", label: "a-z (Lowercase)" },
              { value: "uppercase", label: "A-Z (Uppercase)" },
              { value: "alphanumeric", label: "a-Z, 0-9" },
              { value: "digits", label: "0-9 (Digits)" },
              { value: "custom", label: "Custom..." },
            ]}
          />
        </div>

        {node.charset === "custom" && (
          <TextField
            label="Custom Characters"
            value={node.customCharset || ""}
            placeholder="e.g. ATGC"
            onChange={(v) => update({ customCharset: v })}
          />
        )}
      </div>
    );
  }

  if (node.kind === "array") {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <TextField
            label="Length / Var"
            value={node.length}
            onChange={(v) => update({ length: v })}
          />
          <SelectField<ArrayNode["elementType"]>
            label="Element"
            value={node.elementType}
            onChange={(v) => update({ elementType: v })}
            options={[
              { value: "int", label: "Integer" },
              { value: "string", label: "String" },
              { value: "float", label: "Float" },
            ]}
          />
          <SelectField<ArrayNode["separator"]>
            label="Separator"
            value={node.separator}
            onChange={(v) => update({ separator: v })}
            options={[
              { value: "space", label: 'Space (" ")' },
              { value: "newline", label: "Newline (\\n)" },
              { value: "comma", label: 'Comma (",")' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <TextField
            label="Elem Min"
            value={node.min}
            onChange={(v) => update({ min: v })}
          />
          <TextField
            label="Elem Max"
            value={node.max}
            onChange={(v) => update({ max: v })}
          />
        </div>
      </div>
    );
  }

  return null;
}
