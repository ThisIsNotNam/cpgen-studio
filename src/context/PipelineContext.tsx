import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { usePipelineRunner } from "../hooks/usePipelineRunner";
import { useConsoleLogsContext } from "./ConsoleLogsContext";
import { useWorkspaceContext } from "./WorkspaceContext";
import type { ConfigState } from "../types";

interface PipelineContextValue {
  config: ConfigState;
  onConfigChange: (key: keyof ConfigState, value: string | number) => void;
  isRunning: boolean;
  executePipeline: () => void;
}

const PipelineContext = createContext<PipelineContextValue | null>(null);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const { appendLog } = useConsoleLogsContext();
  const { generatorFile, solutionFile, outputPath } = useWorkspaceContext();

  const [config, setConfig] = useState<ConfigState>({
    batches: 20,
    indexDelivery: "argv[1]",
  });

  const onConfigChange = (key: keyof ConfigState, value: string | number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const { isRunning, executePipeline } = usePipelineRunner(
    generatorFile,
    solutionFile,
    outputPath,
    config,
    appendLog,
  );

  const value: PipelineContextValue = {
    config,
    onConfigChange,
    isRunning,
    executePipeline,
  };

  return (
    <PipelineContext.Provider value={value}>
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipelineContext() {
  const ctx = useContext(PipelineContext);
  if (!ctx) {
    throw new Error(
      "usePipelineContext must be used within a PipelineProvider",
    );
  }
  return ctx;
}
