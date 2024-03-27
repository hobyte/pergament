import { Pen } from "src/tools/Pen"
import { Background, BackgroundPattern } from "./Background"
import { Tool } from "src/tools/Tool"
import { Stretch } from "src/tools/Stretch"

export interface Settings {
    defaultCanvasHeight: number
    saveInterval: number
	pens: Pen[]
    tools: Tool[]
    background: Background
}

export const DEFAULT_SETTINGS: Settings = {
    defaultCanvasHeight: 400,
    saveInterval: 15,
	pens: [
        new Pen('title', '#3739c8', 10, 0.5, false),
        new Pen('text', '#f61009', 3, 0.5, false),
        new Pen('code', '#1be43e', 3, 1, false),
	],
    tools: [
        new Stretch('stretch', false)
    ],
    background: new Background(BackgroundPattern.grid, 20, '#808080')
}