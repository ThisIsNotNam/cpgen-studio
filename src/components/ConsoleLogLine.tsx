import type { LogEntry } from "../types";

interface ConsoleLogLineProps {
  log: LogEntry;
}

const LEVEL_COLOR: Record<LogEntry["level"], string> = {
  info: "text-[#60a5fa]",
  success: "text-(--success)",
  warn: "text-(--warning)",
  error: "text-(--danger)",
  dim: "text-(--text-muted)",
  cmd: "text-[#c084fc]",
};

export default function ConsoleLogLine({ log }: ConsoleLogLineProps) {
  return (
    <div>
      <span className="text-(--text-muted)">[{log.time}]</span>{" "}
      <span className={LEVEL_COLOR[log.level]}>{log.level}</span> {log.message}
    </div>
  );
}
