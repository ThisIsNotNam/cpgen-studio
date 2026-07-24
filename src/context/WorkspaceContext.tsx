import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useWorkspaceFiles } from "../hooks/useWorkspaceFiles";
import { useConsoleLogsContext } from "./ConsoleLogsContext";
import type {
  WorkspaceFile,
  WorkspaceFilePayload,
  WorkspaceSlot,
} from "../types";

interface WorkspaceFilesContextValue {
  generatorFile: WorkspaceFile | null;
  solutionFile: WorkspaceFile | null;
  generatorPath: string;
  solutionPath: string;
  outputPath: string;
  activeFileSlot: WorkspaceSlot | null;
  activeFile: WorkspaceFile | null;
  setGeneratorPath: (path: string) => void;
  setSolutionPath: (path: string) => void;
  setOutputPath: (path: string) => void;
  setActiveFileSlot: (slot: WorkspaceSlot | null) => void;
  setWorkspaceFile: (
    slot: WorkspaceSlot,
    payload: WorkspaceFilePayload | null,
  ) => void;
  loadWorkspaceFile: (slot: WorkspaceSlot, path: string) => Promise<void>;
  browseWorkspaceFile: (slot: WorkspaceSlot) => Promise<void>;
  browseDirectory: (setter: (path: string) => void) => Promise<void>;
  handleCodeChange: (newValue: string | undefined) => void;
  saveActiveFile: () => Promise<void>;
  setIsDirty: (isDirty: boolean) => void;
}

const WorkspaceFilesContext = createContext<WorkspaceFilesContextValue | null>(
  null,
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { appendLog } = useConsoleLogsContext();
  const value = useWorkspaceFiles(appendLog);

  return (
    <WorkspaceFilesContext.Provider value={value}>
      {children}
    </WorkspaceFilesContext.Provider>
  );
}

export function useWorkspaceContext() {
  const ctx = useContext(WorkspaceFilesContext);
  if (!ctx) {
    throw new Error(
      "useWorkspaceContext must be used within a WorkspaceFilesProvider",
    );
  }
  return ctx;
}
