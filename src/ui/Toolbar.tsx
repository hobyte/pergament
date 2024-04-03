import { Tool } from "../tools/Tool";
import { createRoot } from 'react-dom/client';
import { StrictMode, useId } from "react";
import { Settings } from "src/settings/Settings";
import { Pen } from "src/tools/Pen";

export class Toolbar {
  private _selectedTool: Tool;
  private settings: Settings

  constructor(settings: Settings) {
    this.settings = settings;
    this.selectedTool = this.settings.pens[0]
  }

  public get selectedTool(): Tool {
    return this._selectedTool;
  }

  public mount(parent: HTMLElement) {
    const root = createRoot(parent);
    root.render(
      <StrictMode>
        <this.ToolbarView
          settings={this.settings}
          toolbar={this}
        />
      </StrictMode>
    )
  }

  private set selectedTool(tool: Tool) {
    this._selectedTool = tool;
  }

  private ToolbarView({ settings, toolbar }: { settings: Settings, toolbar: Toolbar }) {
    return (
      <div>
        <this.PenSelector
          pens={settings.pens}
          toolbar={toolbar}
        />
        <this.ToolSelector
          tools={settings.tools}
          toolbar={toolbar}
        />
      </div>
    )
  }

  private PenSelector({ pens, toolbar }: { pens: Pen[], toolbar: Toolbar }) {
    return (
      <div>
        {pens.map(pen => {
          return <button key={useId()} onClick={() => toolbar.selectedTool = pen}>{pen.name}</button>
        })}
      </div>
    )
  }

  private ToolSelector({ tools, toolbar }: { tools: Record<string, Tool>, toolbar: Toolbar }) {
    return (
      <div>
        {Object.entries(tools).map(([key, tool]) => {
          return <button key={useId()} onClick={() => toolbar.selectedTool = tool}>{tool.name}</button>
        })}
      </div>
    )
  }
}
