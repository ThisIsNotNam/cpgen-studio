import { useState } from "react";
import { usePipelineContext } from "../context/PipelineContext";
import { useWorkspaceContext } from "../context/WorkspaceContext";
import Section from "./Section";

const ROW_CLASS = "flex items-center gap-3 mb-3";
const LABEL_CLASS =
  "w-[85px] text-[13px] text-(--text-secondary) shrink-0 text-right";
const INPUT_CLASS =
  "w-full h-8 px-2.5 bg-(--bg-input) border border-(--border) rounded text-(--text-primary) text-[13px] outline-none focus:border-(--accent) focus:ring-2 focus:ring-[rgba(59,130,246,0.15)]";

function IndexOption({
  id,
  label,
  selected,
  onSelect,
}: {
  id: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <>
      <input
        type="radio"
        name="idx"
        id={id}
        className="hidden"
        checked={selected}
        onChange={onSelect}
      />
      <label
        htmlFor={id}
        className={`flex-1 text-center px-3.5 py-1 rounded text-[12px] cursor-pointer whitespace-nowrap transition-colors ${
          selected
            ? "bg-(--accent) text-white font-medium"
            : "text-(--text-muted) hover:text-(--text-secondary)"
        }`}
      >
        {label}
      </label>
    </>
  );
}

function PrefixedNumberInput({
  prefix,
  value,
  onChange,
  fallback,
  min,
  max,
  title,
}: {
  prefix: string;
  value: number;
  onChange: (value: number) => void;
  fallback: number;
  min?: number;
  max?: number;
  title: string;
}) {
  const [prevValue, setPrevValue] = useState(value);
  const [inputValue, setInputValue] = useState(String(value));

  if (value !== prevValue) {
    setPrevValue(value);
    setInputValue(String(value));
  }

  const commit = () => {
    const trimmed = inputValue.trim();
    const parsed = trimmed === "" ? NaN : Number(trimmed);
    let next = Number.isFinite(parsed) ? parsed : fallback;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);

    setInputValue(String(next));
    if (next !== value) onChange(next);
  };

  return (
    <div
      className="flex-1 min-w-0 flex items-center bg-(--bg-input) border border-(--border) rounded overflow-hidden focus-within:border-(--accent) focus-within:ring-2 focus-within:ring-[rgba(59,130,246,0.15)]"
      title={title}
    >
      <span className="pl-2.5 text-(--text-muted) text-[13px] select-none">
        {prefix}
      </span>
      <input
        type="number"
        className="w-full h-8 pl-1 pr-2.5 bg-transparent text-(--text-primary) text-[13px] outline-none"
        value={inputValue}
        min={min}
        max={max}
        onChange={(event) => setInputValue(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
      />
    </div>
  );
}

export default function ParametersForm() {
  const { config, onConfigChange } = usePipelineContext();
  const { generatorMode } = useWorkspaceContext();

  return (
    <Section title="Parameters">
      <div className={ROW_CLASS}>
        <label className={LABEL_CLASS}>Batches</label>
        <div className="flex-1 min-w-0 flex gap-2">
          <PrefixedNumberInput
            prefix="#"
            title="Starting index"
            value={config.startIndex}
            fallback={1}
            min={0}
            onChange={(value) => onConfigChange("startIndex", value)}
          />
          <PrefixedNumberInput
            prefix="×"
            title="Batch count"
            value={config.batches}
            fallback={1}
            min={1}
            max={100}
            onChange={(value) => onConfigChange("batches", value)}
          />
        </div>
      </div>

      <div className={ROW_CLASS}>
        <label className={LABEL_CLASS}>Problem name</label>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            className={INPUT_CLASS}
            value={config.problemName}
            onChange={(event) =>
              onConfigChange("problemName", event.target.value)
            }
          />
        </div>
      </div>

      <div className={ROW_CLASS} hidden={generatorMode == "visual"}>
        <label className={LABEL_CLASS}>Index</label>
        <div className="flex-1 min-w-0 flex gap-0.5 bg-(--bg-input) border border-(--border) rounded-md p-0.5">
          <IndexOption
            id="idx-arg"
            label="argv[1]"
            selected={config.indexDelivery === "argv[1]"}
            onSelect={() => onConfigChange("indexDelivery", "argv[1]")}
          />
          <IndexOption
            id="idx-stdin"
            label="stdin"
            selected={config.indexDelivery === "stdin"}
            onSelect={() => onConfigChange("indexDelivery", "stdin")}
          />
        </div>
      </div>
    </Section>
  );
}
