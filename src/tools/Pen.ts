import { Tool } from "./Tool";
import { Line } from "konva/lib/shapes/Line";
import { Layer } from "konva/lib/Layer";

export class Pen extends Tool {
    private _color: string;
    private _width: number;
    private _tension: number;

    private drawing = false
    private currentLine: Line

    constructor(name: string, color: string, width: number, tension: number, removable: boolean) {
        super(name, removable)
        this.color = color;
        this.width = width;
        this.tension = tension;
    }

    public get color(): string {
        return this._color;
    }

    public set color(value: string) {
        this._color = value;
    }

    public get width(): number {
        return this._width;
    }

    public set width(value: number) {
        this._width = value;
    }

    public get tension(): number {
        return this._tension;
    }

    public set tension(value: number) {
        this._tension = value;
    }

    public start(layer: Layer): void {
        const pos = layer.getRelativePointerPosition();
        //check of pos is null
        if (!pos) {
            console.log('failed to get cursor position')
            return
        }
        
        this.drawing = true;
        this.currentLine = new Line({
            stroke: this.color,
            strokeWidth: this.width,
            tension: this.tension,
            lineCap: 'round',
            lineJoin: 'round',
            points: [pos.x, pos.y, pos.x, pos.y]
        })
        layer.add(this.currentLine);
    }

    public move(layer: Layer): void {
        if (!this.drawing) {
            return;
        }

        const pos = layer.getRelativePointerPosition();
        //check of pos is null
        if (!pos) {
            console.log('failed to get cursor position')
            return
        }
        this.currentLine.points(this.currentLine.points().concat([pos.x, pos.y]))
    }

    public end(layer: Layer): void {
        this.drawing = false;
    }
}