import CPGenStudio from "./components/CPGenStudio";
import { ConsoleLogsProvider } from "./context/ConsoleLogsContext";
import { PipelineProvider } from "./context/PipelineContext";
import { SettingsProvider } from "./context/SettingsContext";
import { WorkspaceProvider } from "./context/WorkspaceContext";

function App() {
  return (
    <div className="w-full h-full min-h-0 antialiased">
      <ConsoleLogsProvider>
        <WorkspaceProvider>
          <PipelineProvider>
            <SettingsProvider>
              <CPGenStudio />
            </SettingsProvider>
          </PipelineProvider>
        </WorkspaceProvider>
      </ConsoleLogsProvider>
    </div>
  );
}

export default App;
