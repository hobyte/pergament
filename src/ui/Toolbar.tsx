import { Tool } from "../tools/Tool";
import { createRoot } from 'react-dom/client';
import { StrictMode, useId } from "react";
import { Settings } from "src/settings/Settings";

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

  private ToolbarView({settings, toolbar}: {settings: Settings, toolbar: Toolbar}) {
    return (
      <div>
        {settings.pens.map((pen) => {
          return <button key={useId()} onClick={() => toolbar.selectedTool = pen}>{pen.name}</button>
        })}
      </div>
    )
  }
}
