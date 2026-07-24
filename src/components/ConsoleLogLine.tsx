import type { LogEntry } from "../types";

interface ConsoleLogLineProps {
  log: LogEntry;
}

export default function ConsoleLogLine({ log }: ConsoleLogLineProps) {
  return (
    <div>
      <span className="log-time">[{log.time}]</span>{" "}
      <span className={`log-${log.level}`}>{log.level}</span> {log.message}
    </div>
  );
}
