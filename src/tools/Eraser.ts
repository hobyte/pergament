import { Layer } from "konva/lib/Layer";
import { Tool } from "./Tool";
import { Shape } from "konva/lib/Shape";
import { Line } from "konva/lib/shapes/Line";
import * as _ from "lodash";
import { Circle } from "konva/lib/shapes/Circle";

export class Eraser extends Tool {
    private isErasing: boolean
    private radius: number
    private eraserCircle: Circle

    constructor(name: string, radius: number, removable: boolean) {
        super(name, removable);

        this.radius = radius;
    }

    public start(layer: Layer): void {
        const pos = layer.getRelativePointerPosition();
        if (!pos) return;

        this.isErasing = true;
        this.erase(layer);
        this.eraserCircle = new Circle({
            name: 'eraser-tool',
            strokeWidth: 3,
            stroke: '#A835DB',
            x: pos.x,
            y: pos.y,
            radius: this.radius
        })
        layer.add(this.eraserCircle);
    }

    public move(layer: Layer): void {
        const pos = layer.getRelativePointerPosition();
        if (!pos) return;

        if (this.isErasing) {
            this.erase(layer)
            this.eraserCircle.position({x: pos.x, y: pos.y});
        }
    }

    public end(layer: Layer): void {
        this.isErasing = false;
        this.eraserCircle.remove();
    }

    private erase(layer: Layer): void {
        const pos = layer.getRelativePointerPosition();
        if (!pos) return;

        const box = {
            x: pos.x - this.radius,
            y: pos.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        }

        layer
            .find((item: Shape) => {
                const dimension = item.getClientRect();
                return !(
                    box.x > dimension.x + dimension.width ||
                    box.x + box.width < dimension.x ||
                    box.y > dimension.y + dimension.height ||
                    box.y + box.height < dimension.y
                )
            })
            .filter((item: Shape) => {
                return item instanceof Line;
            })
            .filter((line: Line) => {
                return _.chunk(line.points(), 2)
                    .map((point: Array<number>) => {return {x: point[0], y: point[1]}})
                    .map((point: {x: number; y: number}) => {
                        //check if point of line is in radius
                        const distance = Math.sqrt(Math.pow(point.x - pos.x, 2) + Math.pow(point.y - pos.y, 2))
                        if (distance < this.radius) {
                            return true
                        }
                        return false
                    })
                    .includes(true);
            })
            .forEach(line => line.destroy());
    }
}