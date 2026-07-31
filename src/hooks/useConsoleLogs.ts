import { useCallback, useState } from "react";
import type { LogEntry, LogLevel } from "../types";

const INITIAL_LOGS: LogEntry[] = [
  { id: 1, time: "10:42:03", level: "info", message: "Workspace ready." },
  {
    id: 2,
    time: "10:42:03",
    level: "info",
    message: "Choose generator and solution files to begin.",
  },
];

export function useConsoleLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);

  const appendLog = useCallback((level: LogLevel, message: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLogs((prev) => [
      ...prev,
      { id: Date.now() + prev.length, time, level, message },
    ]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  return { logs, appendLog, clearLogs };
}
