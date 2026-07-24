import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { inferLanguage } from "../utils/language";
import type {
  LogLevel,
  WorkspaceFile,
  WorkspaceFilePayload,
  WorkspaceSlot,
} from "../types";

const buildWorkspaceFile = (payload: WorkspaceFilePayload): WorkspaceFile => ({
  path: payload.path,
  name: payload.name,
  language: payload.language || inferLanguage(payload.name),
  value: payload.value,
  isDirty: false,
});

export function useWorkspaceFiles(
  appendLog: (level: LogLevel, message: string) => void,
) {
  const [generatorFile, setGeneratorFile] = useState<WorkspaceFile | null>(
    null,
  );
  const [solutionFile, setSolutionFile] = useState<WorkspaceFile | null>(null);
  const [generatorPath, setGeneratorPath] = useState("");
  const [solutionPath, setSolutionPath] = useState("");
  const [outputPath, setOutputPath] = useState("");
  const [activeFileSlot, setActiveFileSlot] = useState<WorkspaceSlot | null>(
    null,
  );

  const activeFile =
    activeFileSlot === "generator"
      ? generatorFile
      : activeFileSlot === "solution"
        ? solutionFile
        : null;

  // Small helpers so the generator/solution branches below aren't repeated
  // for every operation (set, load, save, edit, ...).
  const setFile = (slot: WorkspaceSlot, file: WorkspaceFile | null) =>
    slot === "generator" ? setGeneratorFile(file) : setSolutionFile(file);

  const setPath = (slot: WorkspaceSlot, path: string) =>
    slot === "generator" ? setGeneratorPath(path) : setSolutionPath(path);

  const updateActiveFile = (update: (file: WorkspaceFile) => WorkspaceFile) => {
    if (activeFileSlot === "generator") {
      setGeneratorFile((prev) => (prev ? update(prev) : prev));
    } else if (activeFileSlot === "solution") {
      setSolutionFile((prev) => (prev ? update(prev) : prev));
    }
  };

  const setWorkspaceFile = (
    slot: WorkspaceSlot,
    payload: WorkspaceFilePayload | null,
  ) => {
    if (!payload) {
      setFile(slot, null);
      setPath(slot, "");
      setActiveFileSlot((prev) => (prev === slot ? null : prev));
      return;
    }

    const nextFile = buildWorkspaceFile(payload);
    setFile(slot, nextFile);
    setPath(slot, nextFile.path);
    setActiveFileSlot(slot);
  };

  const loadWorkspaceFile = async (slot: WorkspaceSlot, path: string) => {
    const trimmedPath = path.trim();

    if (!trimmedPath) {
      setWorkspaceFile(slot, null);
      return;
    }

    try {
      const payload = await invoke<WorkspaceFilePayload>(
        "read_workspace_file",
        { path: trimmedPath },
      );
      setWorkspaceFile(slot, payload);
    } catch (error) {
      appendLog("error", `Could not open ${trimmedPath}: ${String(error)}`);
    }
  };

  const browseWorkspacePath = async (slot: WorkspaceSlot) => {
    try {
      const payload = await invoke<WorkspaceFilePayload | null>(
        "pick_workspace_file",
      );
      if (payload) setWorkspaceFile(slot, payload);
    } catch (error) {
      appendLog("error", `File picker failed: ${String(error)}`);
    }
  };

  const browseDirectory = async (setter: (path: string) => void) => {
    try {
      const selectedDir = await invoke<string | null>("pick_directory");
      if (selectedDir) setter(selectedDir);
    } catch (error) {
      appendLog("error", `Directory picker failed: ${String(error)}`);
    }
  };

  const setIsDirty = (isDirty: boolean) =>
    updateActiveFile((file) => ({ ...file, isDirty }));

  const handleCodeChange = (newValue: string | undefined) =>
    updateActiveFile((file) => ({ ...file, value: newValue ?? "" }));

  const saveActiveFile = async () => {
    if (!activeFile) return;

    try {
      await invoke("save_workspace_file", {
        path: activeFile.path,
        content: activeFile.value,
      });
      updateActiveFile((file) => ({ ...file, isDirty: false }));
      appendLog("info", `Saved ${activeFile.name}`);
    } catch (error) {
      appendLog("error", `Failed to save ${activeFile.name}: ${String(error)}`);
    }
  };

  return {
    generatorFile,
    solutionFile,
    generatorPath,
    solutionPath,
    outputPath,
    activeFileSlot,
    activeFile,
    setGeneratorPath,
    setSolutionPath,
    setOutputPath,
    setActiveFileSlot,
    setWorkspaceFile,
    loadWorkspaceFile,
    browseWorkspaceFile: browseWorkspacePath,
    browseDirectory,
    handleCodeChange,
    saveActiveFile,
    setIsDirty,
  };
}
