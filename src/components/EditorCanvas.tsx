import { Group, Panel, Separator } from "react-resizable-panels";
import EditorToolbar from "./EditorToolbar";
import FilesPanel from "./FilesPanel";
import EditorPanel from "./EditorPanel";

export default function EditorCanvas() {
  return (
    <div className="editor-area">
      <EditorToolbar />

      <Group className="content-panels">
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
