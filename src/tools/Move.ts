import { Layer } from "konva/lib/Layer";
import { Tool } from "./Tool";
import { createActor, createMachine } from "xstate";
import { timeStamp } from "console";

export class Move extends Tool {
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
                    start: {
                            target: 'moveSelection',
                            actions: () => this.startMove()
                        },
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
                            actions: () => this.endMove()
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
    }

    public start(layer: Layer): void {
        this.stateActor.send({type: 'start'})
    }

    public move(layer: Layer): void {
        this.stateActor.send({type: 'move'})
    }

    public end(layer: Layer): void {
        this.stateActor.send({type: 'end'})
    }

    private startSelection() {
        console.log('start selection')
    }

    private moveSelection() {
        console.log('move selection')
    }

    private endSelection() {
        console.log('end selection')
    }

    private startMove() {
        console.log('start move')
    }

    private moveMove() {
        console.log('move move')
    }

    private endMove() {
        console.log('end move')
    }

    private reset() {
        console.log('reset')
    }

    private resetTool() {
        console.log('reset tool')
    }
}