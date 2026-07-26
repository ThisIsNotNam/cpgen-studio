import { useRef, useEffect } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useWorkspaceContext } from "../context/WorkspaceContext";
import { type editor } from "monaco-editor";

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

const TAB_CLASS =
  "flex items-center min-w-0 max-w-[200px] px-3.5 border-0 border-b-2 text-[13px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
const TAB_INACTIVE_CLASS =
  "border-transparent text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-tertiary)";
const TAB_ACTIVE_CLASS =
  "border-(--accent) text-(--text-primary) bg-(--bg-primary)";

type TrackedModel = editor.ITextModel & {
  _savedVersionId?: number;
};

export default function EditorPanel() {
  const {
    generatorFile,
    solutionFile,
    activeFile,
    activeFileSlot,
    setActiveFileSlot,
    handleCodeChange,
    saveActiveFile,
    setIsDirty,
  } = useWorkspaceContext();

  const handleCodeChangeRef = useRef(handleCodeChange);
  handleCodeChangeRef.current = handleCodeChange;

  const saveRef = useRef(saveActiveFile);
  saveRef.current = saveActiveFile;

  const setIsDirtyRef = useRef(setIsDirty);
  setIsDirtyRef.current = setIsDirty;

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const prevIsDirtyRef = useRef<boolean | null>(null);

  const handleEditorMount: OnMount = (editorInstance, monaco) => {
    editorRef.current = editorInstance;

    const model = editorInstance.getModel() as TrackedModel | null;
    if (!model) return;

    if (model._savedVersionId === undefined) {
      model._savedVersionId = model.getAlternativeVersionId();
    }

    const initialDirty =
      model.getAlternativeVersionId() !== model._savedVersionId;
    prevIsDirtyRef.current = initialDirty;
    setIsDirtyRef.current(initialDirty);

    const subscription = model.onDidChangeContent(() => {
      const isDirty = model.getAlternativeVersionId() !== model._savedVersionId;

      if (isDirty !== prevIsDirtyRef.current) {
        prevIsDirtyRef.current = isDirty;
        setIsDirtyRef.current(isDirty);
      }

      handleCodeChangeRef.current(model.getValue());
    });

    editorInstance.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      async () => {
        const success = await saveRef.current();
        if (success) {
          model._savedVersionId = model.getAlternativeVersionId();
          prevIsDirtyRef.current = false;
          setIsDirtyRef.current(false);
        }
      },
    );

    editorInstance.onDidDispose(() => {
      subscription.dispose();
      editorRef.current = null;
    });
  };

  useEffect(() => {
    if (!editorRef.current || !activeFile) return;

    const model = editorRef.current.getModel() as TrackedModel | null;
    if (!model) return;

    if (model.getValue() !== activeFile.value) {
      model.setValue(activeFile.value);
      model._savedVersionId = model.getAlternativeVersionId();
      prevIsDirtyRef.current = false;
      setIsDirtyRef.current(false);
    }
  }, [activeFile?.path, activeFile?.value]);

  return (
    <section className="h-full min-w-0 min-h-0 flex flex-col overflow-hidden bg-(--bg-primary)">
      <div className="h-9.5 shrink-0 flex items-stretch gap-0.5 bg-(--bg-secondary) border-b border-(--border) px-2">
        <button
          type="button"
          className={`${TAB_CLASS} ${activeFileSlot === "generator" ? TAB_ACTIVE_CLASS : TAB_INACTIVE_CLASS}`}
          onClick={() => setActiveFileSlot("generator")}
          disabled={!generatorFile}
        >
          {generatorFile?.name ?? "Generator"}
          {generatorFile?.isDirty && <span className="ml-1.5">●</span>}
        </button>

        <button
          type="button"
          className={`${TAB_CLASS} ${activeFileSlot === "solution" ? TAB_ACTIVE_CLASS : TAB_INACTIVE_CLASS}`}
          onClick={() => setActiveFileSlot("solution")}
          disabled={!solutionFile}
        >
          {solutionFile?.name ?? "Solution"}
          {solutionFile?.isDirty && <span className="ml-1.5">●</span>}
        </button>

        <span className="flex-1" />
        {activeFile && (
          <span className="self-center text-(--text-muted) uppercase text-[12px]">
            {activeFile.isDirty ? "Unsaved" : "Saved"} • {activeFile.language}
          </span>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-auto flex flex-col">
        <div className="flex-1 min-h-0">
          {activeFile ? (
            <Editor
              key={activeFile.path}
              height="100%"
              theme="vs-dark"
              path={activeFile.path}
              language={activeFile.language}
              defaultValue={activeFile.value}
              keepCurrentModel
              onMount={handleEditorMount}
              options={EDITOR_OPTIONS}
            />
          ) : (
            <div className="h-full min-h-0 flex items-center justify-center p-6 text-(--text-muted) text-sm text-center bg-(--bg-primary)">
              Choose a generator or solution file to start editing.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
