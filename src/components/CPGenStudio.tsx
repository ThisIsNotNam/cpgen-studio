import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Group, Panel, Separator } from "react-resizable-panels";
import EditorCanvas from "./EditorCanvas";
import ConsoleLogs from "./ConsoleLogs";

export default function CPGenStudio() {
  useEffect(() => {
    invoke("show_window");
  }, []);

  return (
    <div className="app-frame">
      <div className="workspace-shell">
        <Group orientation="vertical" className="workspace-panels">
          <Panel className="editor-surface">
            <EditorCanvas />
          </Panel>

          <Separator
            className="terminal-resizer"
            aria-label="Resize terminal"
          />

          <Panel
            defaultSize="220px"
            minSize="140px"
            maxSize="480px"
            className="terminal-shell"
          >
            <ConsoleLogs />
          </Panel>
        </Group>
      </div>
    </div>
  );
}
