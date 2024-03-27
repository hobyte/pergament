import { Layer } from "konva/lib/Layer";
import { Tool } from "./Tool";
import { Line } from "konva/lib/shapes/Line";
import { Shape } from "konva/lib/Shape";

export class Stretch extends Tool {
    private movingLine: Line
    private moving: boolean
    private firstPos: { x: number, y: number }
    private oldPos: { x: number, y: number }
    private toolName = 'stretch-tool'

    constructor(name: string, removable: boolean) {
        super(name, removable);
    }

    public start(layer: Layer): void {
        const pos = layer.getRelativePointerPosition();
        this.movingLine = new Line({
            name: this.toolName,
            width: 3,
            stroke: '#A835DB'
        })

        if (pos) {
            this.moving = true;
            this.firstPos = pos;
            this.oldPos = pos;

            layer.add(this.movingLine);
            this.movingLine.points([0, pos.y, layer.width(), pos.y]);
        }
    }

    public move(layer: Layer): void {
        if (this.moving) {
            const pos = layer.getRelativePointerPosition();
            if (pos) {
                this.movingLine.points([0, pos.y, layer.width(), pos.y])

                //move vanvas content below line
                const deltaY = pos.y - this.oldPos.y;
                this.oldPos = pos;

                layer
                    .find((node: Shape) => {
                        const dimension = node.getClientRect();
                        return dimension.y + dimension.height >= pos.y
                    })
                    .filter((node: Shape) => node.name() != this.toolName)
                    .forEach((node: Shape) => node.move({x: 0, y: deltaY}));
            }
        }
    }

    public end(layer: Layer): void {
        this.moving = false;
        this.movingLine.remove();
    }
}