import { useState } from "react";
import { useWorkspaceContext } from "../context/WorkspaceContext";
import PathPicker from "./PathPicker";
import ParametersForm from "./ParametersForm";
import VisualSchemaBuilder from "./schema/VisualSchemaBuilder";

export default function FilesPanel() {
  const [activeTab, setActiveTab] = useState<"files" | "visual">("files");

  const {
    generatorPath,
    solutionPath,
    outputPath,
    setGeneratorPath,
    setSolutionPath,
    setOutputPath,
    loadWorkspaceFile,
    browseWorkspaceFile,
    browseDirectory,
    setWorkspaceFile,
  } = useWorkspaceContext();

  return (
    <aside className="flex flex-col h-full bg-[var(--bg-secondary)] border-r border-[var(--border)] text-[var(--text-primary)] text-xs select-none">
      {/* Header Tabs */}
      <div className="flex h-[38px] bg-[var(--bg-secondary)] border-b border-[var(--border)] px-2 gap-1 items-stretch">
        <button
          type="button"
          className={`flex-1 flex items-center justify-center font-semibold transition-colors border-b-2 text-xs cursor-pointer ${
            activeTab === "files"
              ? "text-[var(--text-primary)] border-[var(--accent)] bg-[var(--bg-primary)]"
              : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
          }`}
          onClick={() => setActiveTab("files")}
        >
          Code Files
        </button>
        <button
          type="button"
          className={`flex-1 flex items-center justify-center font-semibold transition-colors border-b-2 text-xs cursor-pointer ${
            activeTab === "visual"
              ? "text-[var(--text-primary)] border-[var(--accent)] bg-[var(--bg-primary)]"
              : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
          }`}
          onClick={() => setActiveTab("visual")}
        >
          Visual Builder
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeTab === "files" ? (
          <>
            <PathPicker
              label="Generator file"
              path={generatorPath}
              placeholder="C:\path\to\generator.py"
              onChange={setGeneratorPath}
              onSubmit={(path) => loadWorkspaceFile("generator", path)}
              onBrowse={() => browseWorkspaceFile("generator")}
              onClear={() => setWorkspaceFile("generator", null)}
            />

            <PathPicker
              label="Solution file"
              path={solutionPath}
              placeholder="C:\path\to\solution.cpp"
              onChange={setSolutionPath}
              onSubmit={(path) => loadWorkspaceFile("solution", path)}
              onBrowse={() => browseWorkspaceFile("solution")}
              onClear={() => setWorkspaceFile("solution", null)}
            />

            <PathPicker
              label="Output path"
              path={outputPath}
              placeholder="C:\path\to\output"
              onChange={setOutputPath}
              onSubmit={(_) => {}}
              onBrowse={() => browseDirectory(setOutputPath)}
              onClear={() => setOutputPath("")}
            />

            <ParametersForm />
          </>
        ) : (
          <>
            <PathPicker
              label="Solution file"
              path={solutionPath}
              placeholder="C:\path\to\solution.cpp"
              onChange={setSolutionPath}
              onSubmit={(path) => loadWorkspaceFile("solution", path)}
              onBrowse={() => browseWorkspaceFile("solution")}
              onClear={() => setWorkspaceFile("solution", null)}
            />

            <PathPicker
              label="Output path"
              path={outputPath}
              placeholder="C:\path\to\output"
              onChange={setOutputPath}
              onSubmit={(_) => {}}
              onBrowse={() => browseDirectory(setOutputPath)}
              onClear={() => setOutputPath("")}
            />

            <div className="h-px bg-[var(--border)] my-3" />

            <VisualSchemaBuilder />

            <ParametersForm />
          </>
        )}
      </div>
    </aside>
  );
}
