import { useState } from "react";
import { useSettingsContext } from "../context/SettingsContext";
import type { SettingKey } from "../types";
import Section from "./Section";

const ROW_CLASS = "flex items-center gap-3 mb-3 items-start";
const LABEL_CLASS =
  "w-[85px] text-[13px] text-(--text-secondary) shrink-0 text-right pt-1.5";
const INPUT_CLASS =
  "w-full h-8 px-2.5 bg-(--bg-input) border border-(--border) rounded text-(--text-primary) text-[13px] outline-none focus:border-(--accent) focus:ring-2 focus:ring-[rgba(59,130,246,0.15)]";

const FONT_OPTIONS = [
  {
    label: "SF Mono",
    value:
      '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },
  {
    label: "JetBrains Mono",
    value: '"JetBrains Mono", "Fira Code", Consolas, monospace',
  },
  {
    label: "System Monospace",
    value: "ui-monospace, Menlo, Consolas, monospace",
  },
];

function useCommittedSetting<T extends number | string>(
  key: SettingKey,
  currentValue: T,
  onSettingChange: (key: SettingKey, value: number | string) => void,
  parse: (raw: string) => T | null,
  clamp?: (value: T) => T,
) {
  const [prevValue, setPrevValue] = useState(currentValue);
  const [inputValue, setInputValue] = useState(String(currentValue));

  if (currentValue !== prevValue) {
    setPrevValue(currentValue);
    setInputValue(String(currentValue));
  }

  const commit = (raw: string = inputValue) => {
    const parsed = parse(raw);
    const next =
      parsed === null ? currentValue : clamp ? clamp(parsed) : parsed;
    setInputValue(String(next));
    if (next !== currentValue) onSettingChange(key, next);
  };

  return { inputValue, setInputValue, commit };
}

const parseFontSize = (raw: string): number | null => {
  if (raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};
const clampFontSize = (n: number) => Math.min(32, Math.max(8, Math.round(n)));

const parseFontFamily = (raw: string): string | null => {
  const trimmed = raw.trim();
  return trimmed === "" ? null : trimmed;
};

export default function Settings() {
  const {
    fontSize,
    fontFamily,
    onSettingChange: onSettingChange,
    error,
    setError,
  } = useSettingsContext();

  const fontSizeField = useCommittedSetting(
    "fontSize",
    fontSize,
    onSettingChange,
    parseFontSize,
    clampFontSize,
  );

  const fontFamilyField = useCommittedSetting(
    "fontFamily",
    fontFamily,
    onSettingChange,
    parseFontFamily,
  );

  return (
    <div className="h-full flex items-center justify-center p-6 bg-(--bg-primary)">
      <div className="w-full h-full rounded-lg border border-(--border) bg-(--bg-tertiary) p-6">
        {error && (
          <div className="mb-4 px-3 py-2 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-[13px] flex items-center justify-between gap-2">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="shrink-0 text-red-400/70 hover:text-red-400 leading-none"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}
        <Section title="Editor">
          <div className={ROW_CLASS}>
            <label className={LABEL_CLASS}>Font size</label>
            <div className="flex-1 min-w-0">
              <input
                type="number"
                className={INPUT_CLASS}
                value={fontSizeField.inputValue}
                min={8}
                max={32}
                onChange={(event) =>
                  fontSizeField.setInputValue(event.target.value)
                }
                onBlur={() => fontSizeField.commit()}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.currentTarget.blur();
                }}
              />
            </div>
          </div>

          <div className={ROW_CLASS}>
            <label className={`${LABEL_CLASS}`}>Font family</label>
            <div className="flex-1 min-w-0">
              <input
                type="text"
                autoComplete="off"
                className={INPUT_CLASS}
                value={fontFamilyField.inputValue}
                onChange={(event) =>
                  fontFamilyField.setInputValue(event.target.value)
                }
                onBlur={() => fontFamilyField.commit()}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.currentTarget.blur();
                }}
                placeholder='"Fira Code", monospace'
              />
              <div className="flex gap-1.5 mt-1.5">
                {FONT_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      fontFamilyField.commit(opt.value);
                    }}
                    className="px-2 py-1 text-[11px] rounded border border-(--border) text-(--text-muted) hover:text-(--text-primary) hover:border-(--accent)"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
