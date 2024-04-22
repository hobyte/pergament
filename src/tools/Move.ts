// SPDX-FileCopyrightText: 2024 hobyte
//
// SPDX-License-Identifier: EPL-2.0

import { Layer } from "konva/lib/Layer";
import { Tool } from "./Tool";
import { createActor, createMachine } from "xstate";
import { Shape } from "konva/lib/Shape";
import { Line } from "konva/lib/shapes/Line";
import { Rect } from "konva/lib/shapes/Rect";
import * as _ from "lodash";

var classifyPoint = require("robust-point-in-polygon")

export class Move extends Tool {
    private selectionBorder: Shape;
    private selectedElements: Shape[] = []
    private drawingLayer: Layer
    private oldPointerPosition: { x: number; y: number; }

    private stateMachine = createMachine({
        initial: 'start',
        states: {
            start: {
                on: {
                    start: {
                        target: 'select',
                        actions: () => this.startSelection()
                    }
                }
            },
            select: {
                on: {
                    move: {
                        target: 'select',
                        actions: () => this.moveSelection()
                    },
                    end: {
                        target: 'markedSelection',
                        actions: () => this.endSelection()
                    },
                    reset: {
                        target: 'start',
                        actions: () => this.resetStates()
                    },
                }
            },
            markedSelection: {
                on: {
                    start: [
                        {
                            target: 'moveSelection',
                            guard: () => this.isInsideSelection(),
                            actions: () => this.startMove()
                        },
                        {
                            target: 'start',
                            actions: () => this.resetStates()
                        }
                    ],
                    reset: {
                        target: 'start',
                        actions: () => this.resetStates()
                    },
                }
            },
            moveSelection: {
                on: {
                    move: {
                        target: 'moveSelection',
                        actions: () => this.moveMove()
                    },
                    end: {
                        target: 'markedSelection',
                    },
                    reset: {
                        target: 'start',
                        actions: () => this.resetStates()
                    },
                }
            },
        }
    })
    private stateActor = createActor(this.stateMachine)

    constructor(name: string, removable: boolean) {
        super(name, removable);

        this.stateActor.start()
    }

    public start(layer: Layer): void {
        this.drawingLayer = layer;
        this.stateActor.send({ type: 'start' })
    }

    public move(layer: Layer): void {
        this.drawingLayer = layer;
        this.stateActor.send({ type: 'move' })
    }

    public end(layer: Layer): void {
        this.drawingLayer = layer;
        this.stateActor.send({ type: 'end' })
    }

    public reset(): void {
        this.stateActor.send({ type: 'reset' })
    }

    private isInsideSelection() {
        const boundingBox = (this.selectionBorder as Rect).getClientRect()
        const pos = this.drawingLayer.getRelativePointerPosition();
        if (!pos) {
            console.error('positon  not found')
            return false
        }
        //pointer outside of selection box
        if (
            pos.x < boundingBox.x ||
            pos.x > boundingBox.x + boundingBox.width ||
            pos.y < boundingBox.y ||
            pos.y > boundingBox.y + boundingBox.height
        ) {
            return false
        }
        return true
    }

    private startSelection() {
        const pos = this.drawingLayer.getRelativePointerPosition();
        if (!pos) {
            console.error('positon  not found')
            return
        }
        this.selectionBorder = new Line({
            name: 'selectionBorder',
            closed: true,
            strokeWidth: 3,
            stroke: '#A835DB',
            points: [pos.x, pos.y]
        })
        this.drawingLayer.add(this.selectionBorder)
    }

    private moveSelection() {
        const pos = this.drawingLayer.getRelativePointerPosition();
        if (!pos) {
            console.error('positon  not found')
            return
        }
        const selectionLine = this.selectionBorder as Line
        selectionLine.points(selectionLine.points().concat([pos.x, pos.y]))
    }

    private endSelection() {
        const selectionLine = this.selectionBorder as Line
        const selectionPolygon = _.chunk(selectionLine.points(), 2)
        selectionLine.destroy()

        this.drawingLayer
            .find((element: Shape) => element instanceof Line)
            .forEach((line: Line) => {
                _.chunk(line.points(), 2)
                    .some((point: Array<number>) => {
                        if (classifyPoint(selectionPolygon, point) <= 0) {
                            console.log('line in selection')
                            this.selectedElements.push(line)

                            line.shadowEnabled(true)
                            line.shadowColor('#FFFFFF')
                            line.shadowBlur(10)
                            line.shadowOpacity(0.5)

                            //end loop
                            return true
                        }
                    })
            })

        let box = {
            x: Infinity,
            y: Infinity,
            width: 0,
            height: 0
        }

        this.selectedElements
            .map((element: Shape) => element.getClientRect())
            .forEach((rect: {
                width: number;
                height: number;
                x: number;
                y: number;
            }) => {
                if (rect.x < box.x) {
                    box.x = rect.x
                }
                if (rect.y < box.y) {
                    box.y = rect.y
                }
                if (rect.x + rect.width > box.width) {
                    box.width = rect.x + rect.width - box.x
                }
                if (rect.y + rect.height > box.height) {
                    box.height = rect.y + rect.height - box.y
                }
            })

        this.selectionBorder = new Rect({
            name: 'selectionBorder',
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
            strokeWidth: 3,
            stroke: '#A835DB',
        })
        this.drawingLayer.add(this.selectionBorder)
    }

    private startMove() {
        const pos = this.drawingLayer.getRelativePointerPosition();
        if (!pos) {
            console.error('positon  not found')
            return
        }
        this.oldPointerPosition = pos
    }

    private moveMove() {
        const selectionRect = this.selectionBorder as Rect;
        const pos = this.drawingLayer.getRelativePointerPosition();
        if (!pos) {
            console.error('positon  not found')
            return
        }

        const deltaX = pos.x - this.oldPointerPosition.x
        const deltaY = pos.y - this.oldPointerPosition.y
        this.oldPointerPosition = pos

        selectionRect.position({ x: selectionRect.position().x + deltaX, y: selectionRect.position().y + deltaY})
        this.selectedElements.forEach((line: Line) => {
            line.points(line.points().map((point: number, index: number) => {
                if (index % 2 === 0) {
                    return point + deltaX
                } else {
                    return point + deltaY
                }
            }))
        })
    }

    private resetStates() {
        this.selectionBorder.destroy()

        this.selectedElements.forEach(element => {
            element.shadowEnabled(false)
        })
        this.selectedElements = []
    }
}