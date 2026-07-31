import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { usePipelineRunner } from "../hooks/usePipelineRunner";
import type { ConfigState, SchemaNode } from "../types";
import { useConsoleLogsContext } from "./ConsoleLogsContext";
import { useWorkspaceContext } from "./WorkspaceContext";

const STORAGE_KEY = "cpgen_pipeline_config";

interface PipelineContextValue {
  config: ConfigState;
  onConfigChange: (key: keyof ConfigState, value: string | number) => void;
  isRunning: boolean;
  isGenerating: boolean;
  executePipeline: () => void;
  previewSchema: (
    schema: SchemaNode[],
    seed?: number | null,
  ) => Promise<string | undefined>;
}

const PipelineContext = createContext<PipelineContextValue | null>(null);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const { appendLog } = useConsoleLogsContext();
  const { generatorFile, solutionFile, outputPath, generatorMode, nodes } =
    useWorkspaceContext();

  const [config, setConfig] = useState<ConfigState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to restore pipeline config", e);
    }
    return {
      batches: 20,
      problemName: "test",
      indexDelivery: "stdin",
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const onConfigChange = (key: keyof ConfigState, value: string | number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const { isRunning, executePipeline, previewSchema, isGenerating } =
    usePipelineRunner(
      generatorFile,
      solutionFile,
      outputPath,
      config,
      appendLog,
      generatorMode,
      nodes,
    );

  const value: PipelineContextValue = {
    config,
    onConfigChange,
    isRunning,
    isGenerating,
    executePipeline,
    previewSchema,
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
