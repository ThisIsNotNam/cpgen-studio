import { useConsoleLogsContext } from "../context/ConsoleLogsContext";
import ConsoleLogLine from "./ConsoleLogLine";

export default function ConsoleLogs() {
  const { logs, clearLogs } = useConsoleLogsContext();

  return (
    <section className="terminal" aria-label="Terminal output">
      <div className="terminal-header">
        <span className="terminal-title">Terminal</span>
        <button type="button" className="terminal-clear" onClick={clearLogs}>
          Clear
        </button>
      </div>
      <div className="terminal-body" id="terminal">
        {logs.map((log) => (
          <ConsoleLogLine key={log.id} log={log} />
        ))}
      </div>
    </section>
  );
}
