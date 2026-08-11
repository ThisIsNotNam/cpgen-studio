import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
} from "react-resizable-panels";
import EditorPanel from "./EditorPanel";
import EditorToolbar from "./EditorToolbar";
import FilesPanel from "./FilesPanel";

export default function EditorCanvas() {
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: "cpgen_editor_layout",
  });

  return (
    <div className="flex flex-col w-full h-full min-h-0 bg-(--bg-primary)">
      <EditorToolbar />

      <Group
        className="flex-1 min-h-0 bg-(--bg-primary)"
        defaultLayout={defaultLayout}
        onLayoutChanged={onLayoutChanged}
      >
        <Panel
          defaultSize="340px"
          minSize="280px"
          maxSize="640px"
          groupResizeBehavior="preserve-pixel-size"
        >
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
