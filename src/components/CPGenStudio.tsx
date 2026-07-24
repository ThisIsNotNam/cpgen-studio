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
    <div className="w-full h-full min-h-0">
      <div className="w-full h-full min-h-0 flex flex-col overflow-hidden">
        <Group orientation="vertical" className="flex-1 min-h-0">
          <Panel className="h-full">
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
            className="h-full border-t border-[var(--border)]"
          >
            <ConsoleLogs />
          </Panel>
        </Group>
      </div>
    </div>
  );
}
