import { useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useWorkspaceContext } from "../context/WorkspaceContext";

const EDITOR_OPTIONS = {
  fontSize: 13,
  fontFamily:
    '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  minimap: { enabled: false },
  scrollbar: {
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
  },
  lineNumbersMinChars: 3,
  automaticLayout: true,
  padding: { top: 10, bottom: 10 },
};

type TrackedModel = import("monaco-editor").editor.ITextModel & {
  _savedVersionId?: number;
};

export default function EditorPanel() {
  const {
    generatorFile,
    solutionFile,
    activeFileSlot,
    setActiveFileSlot,
    handleCodeChange,
    saveActiveFile,
    setIsDirty,
  } = useWorkspaceContext();

  const currentFile =
    activeFileSlot === "generator"
      ? generatorFile
      : activeFileSlot === "solution"
        ? solutionFile
        : null;

  const currentFileRef = useRef(currentFile);
  currentFileRef.current = currentFile;

  const handleCodeChangeRef = useRef(handleCodeChange);
  handleCodeChangeRef.current = handleCodeChange;

  const saveRef = useRef(saveActiveFile);
  saveRef.current = saveActiveFile;

  const setIsDirtyRef = useRef(setIsDirty);
  setIsDirtyRef.current = setIsDirty;

  const handleEditorMount: OnMount = (editorInstance, monaco) => {
    const model = editorInstance.getModel() as TrackedModel | null;
    if (!model) return;

    if (model._savedVersionId === undefined) {
      model._savedVersionId = model.getAlternativeVersionId();
    }

    // Sync dirty indicator state on mount
    const initialDirty =
      model.getAlternativeVersionId() !== model._savedVersionId;
    setIsDirtyRef.current(initialDirty);

    // Listen for model changes (typing, Ctrl+Z, Ctrl+Y)
    const subscription = model.onDidChangeContent(() => {
      const isDirty = model.getAlternativeVersionId() !== model._savedVersionId;
      setIsDirtyRef.current(isDirty);
      handleCodeChangeRef.current(model.getValue());
    });

    editorInstance.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      async () => {
        await saveRef.current();
        model._savedVersionId = model.getAlternativeVersionId();
        setIsDirtyRef.current(false);
      },
    );

    editorInstance.onDidDispose(() => {
      subscription.dispose();
    });
  };

  return (
    <section className="panel panel-editor">
      <div className="editor-tabs">
        <button
          type="button"
          className={`editor-tab ${activeFileSlot === "generator" ? "active" : ""}`}
          onClick={() => setActiveFileSlot("generator")}
          disabled={!generatorFile}
        >
          {generatorFile?.name ?? "Generator"}
          {generatorFile?.isDirty && (
            <span className="tab-dirty-dot" style={{ marginLeft: "6px" }}>
              ●
            </span>
          )}
        </button>

        <button
          type="button"
          className={`editor-tab ${activeFileSlot === "solution" ? "active" : ""}`}
          onClick={() => setActiveFileSlot("solution")}
          disabled={!solutionFile}
        >
          {solutionFile?.name ?? "Solution"}
          {solutionFile?.isDirty && (
            <span className="tab-dirty-dot" style={{ marginLeft: "6px" }}>
              ●
            </span>
          )}
        </button>

        <span className="editor-tabs-spacer" />
        {currentFile && (
          <span className="panel-header-subtle">
            {currentFile.isDirty ? "Unsaved" : "Saved"} • {currentFile.language}
          </span>
        )}
      </div>

      <div className="panel-body editor-panel-body">
        <div className="editor-wrapper">
          {currentFile ? (
            <Editor
              key={currentFile.path}
              height="100%"
              theme="vs-dark"
              path={currentFile.path}
              language={currentFile.language}
              defaultValue={currentFile.value} // Uncontrolled: preserves Monaco undo stack
              onMount={handleEditorMount}
              options={EDITOR_OPTIONS}
            />
          ) : (
            <div className="editor-empty-state">
              Choose a generator or solution file to start editing.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
