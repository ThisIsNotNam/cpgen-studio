import { useConsoleLogsContext } from "../context/ConsoleLogsContext";
import ConsoleLogLine from "./ConsoleLogLine";

export default function ConsoleLogs() {
  const { logs, clearLogs } = useConsoleLogsContext();

  return (
    <section
      className="w-full h-full flex flex-col bg-(--bg-tertiary)"
      aria-label="Terminal output"
    >
      <div className="h-7.5 shrink-0 bg-(--bg-secondary) border-b border-(--border) flex items-center justify-between px-3 text-(--text-muted)">
        <span className="text-[12px] font-semibold">Terminal</span>
        <button
          type="button"
          className="h-6 px-2.5 border border-(--border) bg-(--bg-tertiary) text-(--text-secondary) rounded text-xs cursor-pointer hover:text-(--text-primary) hover:border-(--border-light)"
          onClick={clearLogs}
        >
          Clear
        </button>
      </div>
      <div
        className="flex-1 min-h-0 overflow-auto px-3.5 py-2.5 font-(--font-mono) text-[13px] leading-[1.7] text-(--text-secondary)"
        id="terminal"
      >
        {logs.map((log) => (
          <ConsoleLogLine key={log.id} log={log} />
        ))}
      </div>
    </section>
  );
}
