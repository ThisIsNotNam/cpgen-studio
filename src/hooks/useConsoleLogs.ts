import { useCallback, useState } from "react";
import type { LogEntry, LogLevel } from "../types";

function getCurrentTimeString() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function createInitialLogs(): LogEntry[] {
  const time = getCurrentTimeString();
  return [
    { id: 1, time, level: "info", message: "Workspace ready." },
    {
      id: 2,
      time,
      level: "info",
      message: "Choose generator and solution files to begin.",
    },
  ];
}

export function useConsoleLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(() => createInitialLogs());

  const appendLog = useCallback((level: LogLevel, message: string) => {
    const time = getCurrentTimeString();
    setLogs((prev) => [
      ...prev,
      { id: Date.now() + prev.length, time, level, message },
    ]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  return { logs, appendLog, clearLogs };
}
