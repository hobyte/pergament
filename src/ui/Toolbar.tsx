// SPDX-FileCopyrightText: 2024 hobyte
//
// SPDX-License-Identifier: EPL-2.0

import { Tool } from "../tools/Tool";
import { createRoot } from 'react-dom/client';
import { StrictMode, useId } from "react";
import { Settings } from "src/settings/Settings";
import { ToolbarView } from "./TollbarComponents";

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

  public set selectedTool(value: Tool) {
    this._selectedTool = value;
  }

  public mount(parent: HTMLElement) {
    const root = createRoot(parent);
    root.render(
      <StrictMode>
        <ToolbarView
          settings={this.settings}
          toolbar={this}
        />
      </StrictMode>
    )
  }
}
