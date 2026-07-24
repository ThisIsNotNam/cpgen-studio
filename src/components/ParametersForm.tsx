import { usePipelineContext } from "../context/PipelineContext";
import Section from "./Section";

const ROW_CLASS = "flex items-center gap-3 mb-3";
const LABEL_CLASS =
  "w-[74px] text-right text-[13px] text-[var(--text-secondary)] shrink-0";
const NUMBER_INPUT_CLASS =
  "w-full h-8 px-2.5 bg-[var(--bg-input)] border border-[var(--border)] rounded text-[var(--text-primary)] text-[13px] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(59,130,246,0.15)]";
const RADIO_LABEL_CLASS =
  "flex-1 text-center px-3.5 py-1 rounded text-[12px] cursor-pointer whitespace-nowrap text-[var(--text-muted)] hover:text-[var(--text-secondary)] peer-checked:bg-[var(--accent)] peer-checked:text-white";

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
        className="peer hidden"
        checked={selected}
        onChange={onSelect}
      />
      <label htmlFor={id} className={RADIO_LABEL_CLASS}>
        {label}
      </label>
    </>
  );
}

export default function ParametersForm() {
  const { config, onConfigChange } = usePipelineContext();

  return (
    <Section title="Parameters">
      <div className={ROW_CLASS}>
        <label className={LABEL_CLASS}>Batches</label>
        <div className="flex-1 min-w-0">
          <input
            type="number"
            className={NUMBER_INPUT_CLASS}
            value={config.batches}
            min={1}
            max={100}
            onChange={(event) =>
              onConfigChange("batches", Number(event.target.value) || 1)
            }
          />
        </div>
      </div>

      <div className={ROW_CLASS}>
        <label className={LABEL_CLASS}>Index</label>
        <div className="flex-1 min-w-0 flex gap-0.5 bg-[var(--bg-input)] border border-[var(--border)] rounded-md p-0.5">
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
