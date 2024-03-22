import { Pen } from "src/tools/Pen"
import { Background, BackgroundPattern } from "./Background"

export interface Settings {
    defaultCanvasHeight: number
	pens: Pen[]
    background: Background
}

export const DEFAULT_SETTINGS: Settings = {
    defaultCanvasHeight: 400,
	pens: [
        new Pen('title', '#3739c8', 10, 0.5, false),
        new Pen('text', '#f61009', 3, 0.5, false),
        new Pen('code', '#1be43e', 3, 1, false),
	],
    background: new Background(BackgroundPattern.grid, 20, '#808080')
}