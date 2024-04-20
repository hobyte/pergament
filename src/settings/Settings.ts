// SPDX-FileCopyrightText: 2024 hobyte
//
// SPDX-License-Identifier: EPL-2.0

import { Pen } from "src/tools/Pen"
import { Background, BackgroundPattern } from "./Background"
import { Tool } from "src/tools/Tool"
import { Stretch } from "src/tools/Stretch"
import { Eraser } from "src/tools/Eraser"

export interface Settings {
    minimalCanvasHeight: number
    bottomPadding: number
    saveInterval: number
    pens: Pen[]
    tools: {
        stretch: Stretch,
        eraser: Eraser
    }
    background: Background
}

export const DEFAULT_SETTINGS: Settings = {
    minimalCanvasHeight: 400,
    bottomPadding: 50,
    saveInterval: 15,
    pens: [
        new Pen('title', '#3739c8', 10, 0.5, false),
        new Pen('text', '#f61009', 3, 0.5, false),
        new Pen('code', '#1be43e', 3, 1, false),
    ],
    tools: {
        stretch: new Stretch('stretch', false),
        eraser: new Eraser('eraser', 10, false)
    },
    background: new Background(BackgroundPattern.grid, 20, '#808080')
}

interface IconMapping {
    [key: string]: any
}

export const ICONMAPPING: IconMapping = {
    stretch: 'unfold-vertical',
    eraser: 'eraser'
}