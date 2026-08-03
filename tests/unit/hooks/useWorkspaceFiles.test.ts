import { invoke } from "@tauri-apps/api/core";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useWorkspaceFiles } from "../../../src/hooks/useWorkspaceFiles";

const mockedInvoke = vi.mocked(invoke);

describe("useWorkspaceFiles", () => {
  beforeEach(() => {
    mockedInvoke.mockReset();
    localStorage.clear();
  });

  describe("setWorkspaceFile(slot, null)", () => {
    it("clears activeFileSlot when nulling the currently active file", async () => {
      const appendLog = vi.fn();
      mockedInvoke
        .mockResolvedValueOnce({
          path: "/tmp/gen.cpp",
          name: "gen.cpp",
          language: "cpp",
          value: "generator code",
        })
        .mockResolvedValueOnce({
          path: "/tmp/sol.cpp",
          name: "sol.cpp",
          language: "cpp",
          value: "solution code",
        });

      const { result } = renderHook(() => useWorkspaceFiles(appendLog));

      await act(async () => {
        await result.current.loadWorkspaceFile("generator", "/tmp/gen.cpp");
        await result.current.loadWorkspaceFile("solution", "/tmp/sol.cpp");
      });

      expect(result.current.activeFileSlot).toBe("solution");

      act(() => {
        result.current.setWorkspaceFile("solution", null);
      });

      expect(result.current.solutionFile).toBeNull();
      expect(result.current.solutionPath).toBe("");
      expect(result.current.activeFileSlot).toBeNull();
      expect(result.current.generatorFile).not.toBeNull();
    });

    it("leaves activeFileSlot untouched when nulling a different, inactive slot", async () => {
      const appendLog = vi.fn();
      mockedInvoke
        .mockResolvedValueOnce({
          path: "/tmp/gen.cpp",
          name: "gen.cpp",
          language: "cpp",
          value: "generator code",
        })
        .mockResolvedValueOnce({
          path: "/tmp/sol.cpp",
          name: "sol.cpp",
          language: "cpp",
          value: "solution code",
        });

      const { result } = renderHook(() => useWorkspaceFiles(appendLog));

      await act(async () => {
        await result.current.loadWorkspaceFile("generator", "/tmp/gen.cpp");
        await result.current.loadWorkspaceFile("solution", "/tmp/sol.cpp");
      });

      expect(result.current.activeFileSlot).toBe("solution");

      act(() => {
        result.current.setWorkspaceFile("generator", null);
      });

      expect(result.current.generatorFile).toBeNull();
      expect(result.current.generatorPath).toBe("");
      expect(result.current.activeFileSlot).toBe("solution");
      expect(result.current.solutionFile).not.toBeNull();
    });
  });

  describe("loadWorkspaceFile", () => {
    it("calls read_workspace_file with the given path and stores the result", async () => {
      const appendLog = vi.fn();
      mockedInvoke.mockResolvedValueOnce({
        path: "/tmp/gen.cpp",
        name: "gen.cpp",
        language: "cpp",
        value: "int main() {}",
      });

      const { result } = renderHook(() => useWorkspaceFiles(appendLog));

      await act(async () => {
        await result.current.loadWorkspaceFile("generator", "/tmp/gen.cpp");
      });

      expect(mockedInvoke).toHaveBeenCalledWith("read_workspace_file", {
        path: "/tmp/gen.cpp",
      });
      expect(result.current.generatorFile).toEqual(
        expect.objectContaining({
          path: "/tmp/gen.cpp",
          name: "gen.cpp",
          value: "int main() {}",
          isDirty: false,
        }),
      );
      expect(result.current.activeFileSlot).toBe("generator");
    });

    it("logs an error and leaves state untouched when invoke rejects", async () => {
      const appendLog = vi.fn();
      mockedInvoke.mockRejectedValueOnce(new Error("file not found"));

      const { result } = renderHook(() => useWorkspaceFiles(appendLog));

      await act(async () => {
        await result.current.loadWorkspaceFile("solution", "/tmp/missing.cpp");
      });

      expect(result.current.solutionFile).toBeNull();
      expect(appendLog).toHaveBeenCalledWith(
        "error",
        expect.stringContaining("/tmp/missing.cpp"),
      );
    });

    it("clears the slot instead of calling invoke when given an empty path", async () => {
      const appendLog = vi.fn();
      const { result } = renderHook(() => useWorkspaceFiles(appendLog));

      await act(async () => {
        await result.current.loadWorkspaceFile("generator", "   ");
      });

      expect(mockedInvoke).not.toHaveBeenCalled();
      expect(result.current.generatorFile).toBeNull();
    });
  });

  describe("saveActiveFile", () => {
    it("returns false and does not call invoke when there is no active file", async () => {
      const appendLog = vi.fn();
      const { result } = renderHook(() => useWorkspaceFiles(appendLog));

      let success: boolean = true;
      await act(async () => {
        success = await result.current.saveActiveFile();
      });

      expect(success).toBe(false);
      expect(mockedInvoke).not.toHaveBeenCalled();
    });

    it("saves the active file, clears its dirty flag, and returns true on success", async () => {
      const appendLog = vi.fn();
      mockedInvoke
        .mockResolvedValueOnce({
          path: "/tmp/gen.cpp",
          name: "gen.cpp",
          language: "cpp",
          value: "int main() {}",
        })
        .mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useWorkspaceFiles(appendLog));

      await act(async () => {
        await result.current.loadWorkspaceFile("generator", "/tmp/gen.cpp");
      });

      act(() => {
        result.current.setIsDirty("/tmp/gen.cpp", true);
      });
      expect(result.current.generatorFile?.isDirty).toBe(true);

      let success: boolean = false;
      await act(async () => {
        success = await result.current.saveActiveFile();
      });

      expect(success).toBe(true);
      expect(mockedInvoke).toHaveBeenCalledWith("save_workspace_file", {
        path: "/tmp/gen.cpp",
        content: "int main() {}",
      });
      expect(result.current.generatorFile?.isDirty).toBe(false);
      expect(appendLog).toHaveBeenCalledWith(
        "info",
        expect.stringContaining("gen.cpp"),
      );
    });

    it("returns false and logs an error when the save invoke rejects", async () => {
      const appendLog = vi.fn();
      mockedInvoke
        .mockResolvedValueOnce({
          path: "/tmp/gen.cpp",
          name: "gen.cpp",
          language: "cpp",
          value: "int main() {}",
        })
        .mockRejectedValueOnce(new Error("disk full"));

      const { result } = renderHook(() => useWorkspaceFiles(appendLog));

      await act(async () => {
        await result.current.loadWorkspaceFile("generator", "/tmp/gen.cpp");
      });

      let success: boolean = true;
      await act(async () => {
        success = await result.current.saveActiveFile();
      });

      expect(success).toBe(false);
      expect(appendLog).toHaveBeenCalledWith(
        "error",
        expect.stringContaining("gen.cpp"),
      );
    });
  });

  describe("handleCodeChange", () => {
    it("updates the value of the matching file by path, and leaves the other slot untouched", async () => {
      const appendLog = vi.fn();
      mockedInvoke
        .mockResolvedValueOnce({
          path: "/tmp/gen.cpp",
          name: "gen.cpp",
          language: "cpp",
          value: "old value",
        })
        .mockResolvedValueOnce({
          path: "/tmp/sol.cpp",
          name: "sol.cpp",
          language: "cpp",
          value: "solution code",
        });

      const { result } = renderHook(() => useWorkspaceFiles(appendLog));

      await act(async () => {
        await result.current.loadWorkspaceFile("generator", "/tmp/gen.cpp");
        await result.current.loadWorkspaceFile("solution", "/tmp/sol.cpp");
      });

      act(() => {
        result.current.handleCodeChange("/tmp/gen.cpp", "new value");
      });

      expect(result.current.generatorFile?.value).toBe("new value");
      expect(result.current.solutionFile?.value).toBe("solution code");
    });

    it("is a no-op when the path does not match either open file", async () => {
      const appendLog = vi.fn();
      mockedInvoke.mockResolvedValueOnce({
        path: "/tmp/gen.cpp",
        name: "gen.cpp",
        language: "cpp",
        value: "unchanged",
      });

      const { result } = renderHook(() => useWorkspaceFiles(appendLog));

      await act(async () => {
        await result.current.loadWorkspaceFile("generator", "/tmp/gen.cpp");
      });

      act(() => {
        result.current.handleCodeChange("/tmp/unrelated.cpp", "ignored");
      });

      expect(result.current.generatorFile?.value).toBe("unchanged");
    });
  });

  describe("schema node state", () => {
    it("initializes schema nodes from the default state and persists updates", () => {
      const appendLog = vi.fn();
      const { result } = renderHook(() => useWorkspaceFiles(appendLog));

      expect(result.current.nodes).toHaveLength(2);
      expect(result.current.nodes[0]).toMatchObject({ kind: "int" });

      act(() => {
        result.current.setNodes([
          {
            id: "custom",
            kind: "loop",
            count: "T",
            children: [
              {
                id: "child",
                kind: "string",
                varName: "s",
                length: "5",
                charset: "lowercase",
              },
            ],
          },
        ]);
      });

      expect(result.current.nodes).toHaveLength(1);
      expect(result.current.nodes[0]).toMatchObject({
        kind: "loop",
        count: "T",
      });
      expect(localStorage.getItem("cpgen_schema_nodes")).toContain("child");
    });
  });
});
