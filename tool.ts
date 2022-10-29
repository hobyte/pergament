export abstract class Tool {

    canvas: HTMLCanvasElement

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
    }

    abstract down(ev: any): void

    abstract move(ev: any): void

    abstract up(ev: any): void
}