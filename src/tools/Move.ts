import { Layer } from "konva/lib/Layer";
import { Tool } from "./Tool";
import { createActor, createMachine } from "xstate";
import { Shape } from "konva/lib/Shape";
import { Line } from "konva/lib/shapes/Line";
import { Rect } from "konva/lib/shapes/Rect";
import { Vector2d } from "konva/lib/types";

export class Move extends Tool {
    private selectionBorder: Shape;
    private drawingLayer: Layer
    private pointerOffset: Vector2d

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
                    resetTool: {
                        target: 'start',
                        actions: () => this.resetTool()
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
                            target:'start',
                            actions: () => this.reset()
                        }
                    ],
                    reset: {
                        target: 'start',
                        actions: () => this.reset()
                    },
                    resetTool: {
                        target: 'start',
                        actions: () => this.resetTool()
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
                    resetTool: {
                        target: 'start',
                        actions: () => this.resetTool()
                    },
                }
            },
        }
    })
    private stateActor = createActor(this.stateMachine)

    constructor(name: string, removable: boolean) {
        super(name, removable);

        this.stateActor.start()
        this.stateActor.subscribe(snapshot => console.log(snapshot.value))
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
        const boundingBox = selectionLine.getClientRect()
        selectionLine.remove()
        this.selectionBorder = new Rect({
            name: 'selectionBorder',
            x: boundingBox.x,
            y: boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height,
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
        const selectionRect = this.selectionBorder as Rect
        const rectPos = selectionRect.position()
        this.pointerOffset = { x: pos.x - rectPos.x, y: pos.y - rectPos.y }
    }

    private moveMove() {
        const selectionRect = this.selectionBorder as Rect;
        const pos = this.drawingLayer.getRelativePointerPosition();
        if (!pos) {
            console.error('positon  not found')
            return
        }
        selectionRect.position({ x: pos.x - this.pointerOffset.x, y: pos.y - this.pointerOffset.y })
    }

    private reset() {
        this.selectionBorder.destroy()
    }

    private resetTool() {
        console.log('reset tool')
    }
}