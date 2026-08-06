import { useEffect, useState } from "react";
import { useSettingsContext } from "../context/SettingsContext";
import Section from "./Section";

const ROW_CLASS = "flex items-center gap-3 mb-3";
const LABEL_CLASS =
  "w-[85px] text-[13px] text-(--text-secondary) shrink-0 text-right";
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

export default function Settings() {
  const {
    fontSize,
    fontFamily,
    onSettingChange: onSettingChange,
    error,
    setError,
  } = useSettingsContext();

  const [fontSizeInput, setFontSizeInput] = useState(String(fontSize));

  useEffect(() => {
    setFontSizeInput(String(fontSize));
  }, [fontSize]);

  const commitFontSize = () => {
    const parsed = Number(fontSizeInput);
    const clamped = Number.isFinite(parsed)
      ? Math.min(32, Math.max(8, Math.round(parsed)))
      : fontSize;
    setFontSizeInput(String(clamped));
    if (clamped !== fontSize) onSettingChange("fontSize", clamped);
  };

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
                value={fontSizeInput}
                min={8}
                max={32}
                onChange={(event) => setFontSizeInput(event.target.value)}
                onBlur={commitFontSize}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.currentTarget.blur();
                }}
              />
            </div>
          </div>

          <div className={ROW_CLASS}>
            <label className={LABEL_CLASS}>Font family</label>
            <div className="flex-1 min-w-0">
              <select
                className={INPUT_CLASS}
                value={fontFamily}
                onChange={(event) =>
                  onSettingChange("fontFamily", event.target.value)
                }
              >
                {FONT_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
