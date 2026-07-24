import CPGenStudio from "./components/CPGenStudio";
import { ConsoleLogsProvider } from "./context/ConsoleLogsContext";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import { PipelineProvider } from "./context/PipelineContext";

function App() {
  return (
    <div className="app-shell">
      <ConsoleLogsProvider>
        <WorkspaceProvider>
          <PipelineProvider>
            <CPGenStudio />
          </PipelineProvider>
        </WorkspaceProvider>
      </ConsoleLogsProvider>
    </div>
  );
}

export default App;
