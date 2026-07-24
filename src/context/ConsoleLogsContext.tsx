import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useConsoleLogs } from "../hooks/useConsoleLogs";
import type { LogEntry, LogLevel } from "../types";

interface ConsoleLogsContextValue {
  logs: LogEntry[];
  appendLog: (level: LogLevel, message: string) => void;
  clearLogs: () => void;
}

const ConsoleLogsContext = createContext<ConsoleLogsContextValue | null>(
  null,
);

export function ConsoleLogsProvider({ children }: { children: ReactNode }) {
  const value = useConsoleLogs();

  return (
    <ConsoleLogsContext.Provider value={value}>
      {children}
    </ConsoleLogsContext.Provider>
  );
}

export function useConsoleLogsContext() {
  const ctx = useContext(ConsoleLogsContext);
  if (!ctx) {
    throw new Error(
      "useConsoleLogsContext must be used within a ConsoleLogsProvider",
    );
  }
  return ctx;
}
