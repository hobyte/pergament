import { Tool } from "./tool";

export class Canvas{

    htmlCanvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    started: boolean

    constructor(overlay: HTMLDivElement) {
        this.htmlCanvas = overlay.createEl("canvas", {cls: "drawing_canvas"})
        this.htmlCanvas.width = this.htmlCanvas.offsetWidth;
        this.htmlCanvas.height = this.htmlCanvas.offsetHeight;

        console.log(this.htmlCanvas.width + ' | '+ this.htmlCanvas.offsetWidth)
        this.context = this.htmlCanvas.getContext('2d');

        // Attach the mousedown, mousemove and mouseup event listeners
        this.htmlCanvas.addEventListener('mousedown', function(ev: PointerEvent) {this.down(ev);}.bind(this), false);
        this.htmlCanvas.addEventListener('mousemove', function(ev: PointerEvent) {this.move(ev);}.bind(this), false);
        this.htmlCanvas.addEventListener('mouseup',	 function(ev: PointerEvent) {this.up(ev);}.bind(this), false);
    }

    setTool(tool: Tool) {
        //this.tool = tool
    }

    
    // The general-purpose event handler. This function just determines
    // the mouse position relative to the <canvas> element
    down(ev: PointerEvent){
        console.log("Pergament: tool down")
        console.log(ev.offsetX)
        console.log(ev.offsetY)
        this.context.beginPath();
        this.context.moveTo(ev.offsetX, ev.offsetY)
        this.started = true;
    }
    
    move(ev: PointerEvent){
        console.log("Pergament: tool move");
        if (this.started) {
            this.context.lineTo(ev.offsetX, ev.offsetY);
            this.context.stroke();
        }
    }
    
    up(ev: PointerEvent){
        console.log("Pergament: tool up")
        this.move(ev)
        this.started = false;
    }

    getSVG() {
        
    }
}