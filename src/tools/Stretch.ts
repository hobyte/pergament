import { Layer } from "konva/lib/Layer";
import { Tool } from "./Tool";
import { Line } from "konva/lib/shapes/Line";

export class Stretch extends Tool{
    private movingLine: Line
    private moving: boolean
    private toolName = 'stretch-tool'

    constructor(name: string, removable: boolean){
        super(name, removable);
    }
    
    public start(layer: Layer): void {
        const pos = layer.getRelativePointerPosition();
        this.movingLine = new Line({
            name: this.toolName,
            width: 3,
            stroke: '#A835DB'
        })
        
        if(pos){
            this.moving = true;

            layer.add(this.movingLine);
            this.movingLine.points([0, pos.y, layer.width(), pos.y])
        }
    }
    
    public move(layer: Layer): void {
        if(this.moving){
            const pos = layer.getRelativePointerPosition();
            if(pos){
                this.movingLine.points([0, pos.y, layer.width(), pos.y])
            }
        }
    }
    
    public end(layer: Layer): void {
        this.moving = false;
        this.movingLine.remove();
    }
}