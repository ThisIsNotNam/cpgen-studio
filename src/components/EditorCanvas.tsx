import { Group, Panel, Separator } from "react-resizable-panels";
import EditorToolbar from "./EditorToolbar";
import FilesPanel from "./FilesPanel";
import EditorPanel from "./EditorPanel";

export default function EditorCanvas() {
  return (
    <div className="flex flex-col w-full h-full min-h-0 bg-[var(--bg-primary)]">
      <EditorToolbar />

      <Group className="flex-1 min-h-0 bg-[var(--bg-primary)]">
        <Panel defaultSize="340px" minSize="280px" maxSize="640px">
          <FilesPanel />
        </Panel>

        <Separator
          className="splitter splitter-vertical"
          aria-label="Resize file list"
        />

        <Panel>
          <EditorPanel />
        </Panel>
      </Group>
    </div>
  );
}
