import { ICONMAPPING, Settings } from "src/settings/Settings"
import { Toolbar } from "./Toolbar"
import { Pen } from "src/tools/Pen"
import { useEffect, useId, useRef } from "react"
import { Tool } from "src/tools/Tool"
import { setIcon } from "obsidian"

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
                return <button key={useId()} onClick={() => toolbar.selectedTool = pen} className="pergament-toolbar-selectors"><PenIcon pen={pen} /></button>
            })}
        </div>
    )
}

export function PenIcon({ pen }: { pen: Pen }) {
    return (
        <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg">
            <circle r={pen.width} cx="10" cy="10" fill={pen.color} />
        </svg>
    )
}

export function ToolSelector({ tools, toolbar }: { tools: Record<string, Tool>, toolbar: Toolbar }) {
    return (
        <div>
            {Object.entries(tools).map(([key, tool]) => {
                return <ToolSelect
                    key={useId()}
                    tool={tool}
                    toolbar={toolbar}
                />
            })}
        </div>
    )
}

export function ToolSelect({ tool, toolbar }: { tool: Tool, toolbar: Toolbar }) {
    const toolRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (toolRef.current instanceof HTMLElement) {
            setIcon(toolRef.current, ICONMAPPING[tool.name])
        }
    })

    return (
        <button
            ref={toolRef}
            onClick={() => toolbar.selectedTool = tool}
            className="pergament-toolbar-selectors"
        >
        </button>
    )
}
