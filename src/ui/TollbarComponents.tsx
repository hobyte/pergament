import { Settings } from "src/settings/Settings"
import { Toolbar } from "./Toolbar"
import { Pen } from "src/tools/Pen"
import { useId } from "react"
import { Tool } from "src/tools/Tool"

export function ToolbarView({ settings, toolbar }: { settings: Settings, toolbar: Toolbar }) {
    return (
        <div className="pergament-toolbar-container">
            <PenSelector
                pens={settings.pens}
                toolbar={toolbar}
            />
            <div className="vertical-divider"></div>
            <ToolSelector
                tools={settings.tools}
                toolbar={toolbar}
            />
        </div>
    )
}

export function PenSelector({ pens, toolbar }: { pens: Pen[], toolbar: Toolbar }) {
    return (
        <div>
            {pens.map(pen => {
                return <button key={useId()} onClick={() => toolbar.selectedTool = pen} className="pergament-toolbar-selectors">{pen.name}</button>
            })}
        </div>
    )
}

export function ToolSelector({ tools, toolbar }: { tools: Record<string, Tool>, toolbar: Toolbar }) {
    return (
        <div>
            {Object.entries(tools).map(([key, tool]) => {
                return <button key={useId()} onClick={() => toolbar.selectedTool = tool} className="pergament-toolbar-selectors">{tool.name}</button>
            })}
        </div>
    )
}