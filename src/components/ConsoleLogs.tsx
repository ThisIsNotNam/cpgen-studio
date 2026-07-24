import { useConsoleLogsContext } from "../context/ConsoleLogsContext";
import ConsoleLogLine from "./ConsoleLogLine";

export default function ConsoleLogs() {
  const { logs, clearLogs } = useConsoleLogsContext();

  return (
    <section
      className="w-full h-full flex flex-col bg-[var(--bg-tertiary)]"
      aria-label="Terminal output"
    >
      <div className="h-[30px] shrink-0 bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center justify-between px-3 text-[var(--text-muted)]">
        <span className="text-[12px] font-semibold">Terminal</span>
        <button
          type="button"
          className="h-6 px-2.5 border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded text-xs cursor-pointer hover:text-[var(--text-primary)] hover:border-[var(--border-light)]"
          onClick={clearLogs}
        >
          Clear
        </button>
      </div>
      <div
        className="flex-1 min-h-0 overflow-auto px-3.5 py-2.5 font-[family-name:var(--font-mono)] text-[13px] leading-[1.7] text-[var(--text-secondary)]"
        id="terminal"
      >
        {logs.map((log) => (
          <ConsoleLogLine key={log.id} log={log} />
        ))}
      </div>
    </section>
  );
}
