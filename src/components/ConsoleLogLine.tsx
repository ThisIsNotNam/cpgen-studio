import type { LogEntry } from "../types";

interface ConsoleLogLineProps {
  log: LogEntry;
}

const LEVEL_COLOR: Record<LogEntry["level"], string> = {
  info: "text-[#60a5fa]",
  success: "text-[var(--success)]",
  warn: "text-[var(--warning)]",
  error: "text-[var(--danger)]",
  dim: "text-[var(--text-muted)]",
  cmd: "text-[#c084fc]",
};

export default function ConsoleLogLine({ log }: ConsoleLogLineProps) {
  return (
    <div>
      <span className="text-[var(--text-muted)]">[{log.time}]</span>{" "}
      <span className={LEVEL_COLOR[log.level]}>{log.level}</span> {log.message}
    </div>
  );
}
