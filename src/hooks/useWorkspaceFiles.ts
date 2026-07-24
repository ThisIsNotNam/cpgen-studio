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

  const setWorkspaceFile = (
    slot: WorkspaceSlot,
    payload: WorkspaceFilePayload | null,
  ) => {
    if (!payload) {
      if (slot === "generator") {
        setGeneratorFile(null);
        setGeneratorPath("");
      } else {
        setSolutionFile(null);
        setSolutionPath("");
      }

      setActiveFileSlot((prev) => (prev === slot ? null : prev));
      return;
    }

    const nextFile = buildWorkspaceFile(payload);

    if (slot === "generator") {
      setGeneratorFile(nextFile);
      setGeneratorPath(nextFile.path);
    } else {
      setSolutionFile(nextFile);
      setSolutionPath(nextFile.path);
    }

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

      if (!payload) {
        return;
      }

      setWorkspaceFile(slot, payload);
    } catch (error) {
      appendLog("error", `File picker failed: ${String(error)}`);
    }
  };

  const browseDirectory = async (setter: (path: string) => void) => {
    try {
      const selectedDir = await invoke<string | null>("pick_directory");

      if (selectedDir) {
        setter(selectedDir);
      }
    } catch (error) {
      appendLog("error", `Directory picker failed: ${String(error)}`);
    }
  };

  const setIsDirty = (isDirty: boolean) => {
    if (activeFileSlot === "generator") {
      setGeneratorFile((prev) => (prev ? { ...prev, isDirty } : prev));
    } else if (activeFileSlot === "solution") {
      setSolutionFile((prev) => (prev ? { ...prev, isDirty } : prev));
    }
  };

  const handleCodeChange = (newValue: string | undefined) => {
    const nextValue = newValue ?? "";

    if (activeFileSlot === "generator") {
      setGeneratorFile((prev) => (prev ? { ...prev, value: nextValue } : prev));
      return;
    }

    if (activeFileSlot === "solution") {
      setSolutionFile((prev) => (prev ? { ...prev, value: nextValue } : prev));
    }
  };

  const saveActiveFile = async () => {
    const currentFile =
      activeFileSlot === "generator"
        ? generatorFile
        : activeFileSlot === "solution"
          ? solutionFile
          : null;

    if (!currentFile) {
      return;
    }

    try {
      await invoke("save_workspace_file", {
        path: currentFile.path,
        content: currentFile.value,
      });

      if (activeFileSlot === "generator") {
        setGeneratorFile((prev) => (prev ? { ...prev, isDirty: false } : prev));
      } else if (activeFileSlot === "solution") {
        setSolutionFile((prev) => (prev ? { ...prev, isDirty: false } : prev));
      }

      appendLog("info", `Saved ${currentFile.name}`);
    } catch (error) {
      appendLog(
        "error",
        `Failed to save ${currentFile.name}: ${String(error)}`,
      );
    }
  };

  return {
    generatorFile,
    solutionFile,
    generatorPath,
    solutionPath,
    outputPath,
    activeFileSlot,
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
