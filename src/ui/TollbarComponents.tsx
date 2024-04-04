import { ICONMAPPING, Settings } from "src/settings/Settings"
import { Toolbar } from "./Toolbar"
import { Pen } from "src/tools/Pen"
import { useEffect, useId, useRef, useState } from "react"
import { Tool } from "src/tools/Tool"
import { setIcon } from "obsidian"

export function ToolbarView({ settings, toolbar }: { settings: Settings, toolbar: Toolbar }) {
    const [update, setUpdate] = useState('null')

    return (
        <div className="pergament-toolbar-container">
            <PenSelector
                pens={settings.pens}
                toolbar={toolbar}
                setUpdate={setUpdate}
            />
            <div className="vertical-divider"></div>
            <ToolSelector
                tools={settings.tools}
                toolbar={toolbar}
                setUpdate={setUpdate}
            />
        </div>
    )
}

export function PenSelector(
    { pens, toolbar, setUpdate }:
        { pens: Pen[], toolbar: Toolbar, setUpdate: React.Dispatch<React.SetStateAction<string>> }
) {
    return (
        <div>
            {pens.map(pen => {
                return <button
                    key={useId()}
                    onClick={() => {
                        toolbar.selectedTool = pen;
                        setUpdate(pen.name)
                    }}
                    className={`pergament-toolbar-selectors ${pen == toolbar.selectedTool ? 'selected' : ''}`}
                >
                    <PenIcon pen={pen} />
                </button>
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

export function ToolSelector(
    { tools, toolbar, setUpdate }:
        { tools: Record<string, Tool>, toolbar: Toolbar, setUpdate: React.Dispatch<React.SetStateAction<string>> }
) {
    return (
        <div>
            {Object.entries(tools).map(([key, tool]) => {
                return <ToolSelect
                    key={useId()}
                    tool={tool}
                    toolbar={toolbar}
                    setUpdate={setUpdate}
                />
            })}
        </div>
    )
}

export function ToolSelect(
    { tool, toolbar, setUpdate }:
        { tool: Tool, toolbar: Toolbar, setUpdate: React.Dispatch<React.SetStateAction<string>> }
) {
    const toolRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (toolRef.current instanceof HTMLElement) {
            setIcon(toolRef.current, ICONMAPPING[tool.name])
        }
    })

    return (
        <button
            ref={toolRef}
            onClick={() => {
                toolbar.selectedTool = tool;
                setUpdate(tool.name)
            }}
            className={`pergament-toolbar-selectors ${tool == toolbar.selectedTool ? 'selected' : ''}`}
        >
        </button>
    )
}
