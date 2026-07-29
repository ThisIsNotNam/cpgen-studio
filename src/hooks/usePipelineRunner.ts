import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { useEffect, useRef, useState } from "react";
import type {
  ConfigState,
  GeneratorMode,
  LogLevel,
  SchemaNode,
  WorkspaceFile,
} from "../types";

interface StatusPayload {
  step: string;
  message: string;
}

export function usePipelineRunner(
  generatorFile: WorkspaceFile | null,
  solutionFile: WorkspaceFile | null,
  outputPath: string | null,
  config: ConfigState,
  appendLog: (level: LogLevel, message: string) => void,
  generatorMode: GeneratorMode,
  nodes: SchemaNode[],
) {
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const unlistenRef = useRef<UnlistenFn | null>(null);

  useEffect(() => {
    return () => {
      if (unlistenRef.current) {
        unlistenRef.current();
      }
    };
  }, []);

  const executePipeline = async () => {
    if (isRunning) return;

    const usingSchema = generatorMode === "visual";

    if (usingSchema && nodes.length === 0) {
      appendLog("warn", "Add at least one schema node before generating.");
      return;
    }
    if (!usingSchema && !generatorFile?.path) {
      appendLog("warn", "Generator file must be selected.");
      return;
    }
    if (!solutionFile?.path || !outputPath) {
      appendLog("warn", "Solution file and output path must be selected.");
      return;
    }

    setIsRunning(true);
    appendLog("info", "Starting test generation pipeline...");

    try {
      unlistenRef.current = await listen<StatusPayload>(
        "test-status",
        (event) => {
          const { step, message } = event.payload;

          switch (step) {
            case "finished":
              appendLog("success", message);
              break;
            case "run_executable":
              appendLog("info", message);
              break;
            case "prep_executable":
              appendLog("cmd", message);
              break;
            default:
              appendLog("info", message);
          }
        },
      );

      if (usingSchema) {
        await invoke("generate_tests_from_schema", {
          schema: nodes,
          solPath: solutionFile.path,
          outputPath: outputPath,
          testName: "test",
          testCount: config.batches,
          seed: null,
        });
      } else {
        await invoke("generate_tests", {
          genPath: generatorFile!.path,
          solPath: solutionFile.path,
          outputPath: outputPath,
          testName: "test",
          testCount: config.batches,
          indexAsArg: config.indexDelivery === "argv[1]",
        });
      }

      appendLog("success", "All tests generated and saved successfully!");
    } catch (err) {
      appendLog("error", typeof err === "string" ? err : String(err));
    } finally {
      if (unlistenRef.current) {
        unlistenRef.current();
        unlistenRef.current = null;
      }
      setIsRunning(false);
    }
  };

  const previewSchema = async (
    schema: SchemaNode[],
    seed?: number | null,
  ): Promise<string | undefined> => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const result = await invoke<string>("preview_schema", {
        schema,
        seed: seed ?? null,
      });
      return result;
    } catch (error) {
      throw new Error(typeof error === "string" ? error : String(error));
    } finally {
      setIsGenerating(false);
    }
  };
  return { isGenerating, isRunning, executePipeline, previewSchema };
}
