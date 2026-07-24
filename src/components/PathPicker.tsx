import Section from "./Section";

interface PathPickerProps {
  label: string;
  path: string;
  placeholder: string;
  onChange: (path: string) => void;
  onSubmit: (path: string) => void;
  onBrowse: () => void;
  onClear: () => void;
}

const INPUT_CLASS =
  "flex-1 min-w-0 h-[34px] px-2.5 border border-[var(--border)] rounded-md bg-[var(--bg-input)] text-[var(--text-primary)] text-[13px] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(59,130,246,0.15)]";

const BUTTON_CLASS =
  "h-[34px] px-3 shrink-0 rounded-md border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-[13px] cursor-pointer hover:border-[var(--border-light)] hover:text-[var(--text-primary)]";

export default function PathPicker({
  label,
  path,
  placeholder,
  onChange,
  onSubmit,
  onBrowse,
  onClear,
}: PathPickerProps) {
  return (
    <Section title={label}>
      <div className="flex items-center gap-2 min-w-0">
        <input
          className={INPUT_CLASS}
          type="text"
          value={path}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSubmit(path);
            }
          }}
        />
        <button type="button" className={BUTTON_CLASS} onClick={onBrowse}>
          Browse
        </button>
        <button type="button" className={BUTTON_CLASS} onClick={onClear}>
          Clear
        </button>
      </div>
    </Section>
  );
}
