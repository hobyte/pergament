import { Layer } from "konva/lib/Layer";
import { KonvaEventListener } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { Line } from "konva/lib/shapes/Line";
import { BackgroundPattern } from "src/settings/Background";
import { Settings } from "src/settings/Settings";

export class Canvas {
    private settings: Settings
    private parent: HTMLElement
    private stage: Stage
    private backgroundLayer: Layer
    private drawingLayer: Layer

    private drawing = false
    private currentLine: Line

    constructor(parent: HTMLElement, settings: Settings) {
        this.settings = settings;
        this.parent = parent;
        this.createStage(parent);
        this.watchParentResize();

        //draw background
        this.backgroundLayer = new Layer({ name: 'background' });
        this.stage.add(this.backgroundLayer);
        this.drawBackground();

        //event listeners and layer for tools
        this.drawingLayer = new Layer({name: 'draw'});
        this.stage.add(this.drawingLayer)
        this.stage.on('mousedown touchstart', event => this.startTool(event));
        this.stage.on('mousemove touchmove', event => this.moveTool(event));
        this.stage.on('mouseup touchend', event => this.endTool(event));
    }

    private createStage(parent: HTMLElement): void {
        const container = document.createElement('div');
        container.classList.add('pergament-canvas')
        parent.appendChild(container);
        this.stage = new Stage({
            container: container,
            width: 400,
            height: 400
        })
    }

    private watchParentResize(): void {
        const observer = new ResizeObserver(entries => {
            entries.forEach(entry => {
                this.resizeStage();
                this.drawBackground();
            });
        });

        observer.observe(this.parent);
    }

    private resizeStage(): void {
        const parentWitdh = this.parent.getBoundingClientRect().width;
        if (parentWitdh <= 400) {
            this.stage.size({
                width: parentWitdh,
                height: 400
            })
        } else {
            this.stage.size({
                width: parentWitdh,
                height: 400
            })
        }
    }

    private drawBackground(): void {
        const stageWidth = this.stage.width();
        const stageHeight = this.stage.height();

        this.backgroundLayer.destroyChildren();

        switch (this.settings.background.pattern) {
            case BackgroundPattern.grid:
                //draw vertical lines
                for (let x = 0; x < stageWidth; x += this.settings.background.size) {
                    this.backgroundLayer.add(new Line({
                        stroke: this.settings.background.color,
                        points: [x, 0, x, stageHeight],
                        name: 'vertical'
                    }))
                }
            //no break to run next case and draw lines of grid
            case BackgroundPattern.line:
                //draw horizontal lines
                for (let y = 0; y < stageHeight; y += this.settings.background.size) {
                    this.backgroundLayer.add(new Line({
                        stroke: this.settings.background.color,
                        points: [0, y, stageWidth, y],
                        name: 'horizontal'
                    }))
                }
                break;
        }
    }

    private startTool(event) {
        const pos = this.stage.getPointerPosition();
        //check of pos is null
        if (!pos) {
            console.log('failed to get cursor position')
            return
        }
        
        this.drawing = true;
        this.currentLine = new Line({
            stroke: '#F74F23',
            strokeWidth: 5,
            lineCap: 'round',
            lineJoin: 'round',
            points: [pos.x, pos.y, pos.x, pos.y]
        })
        this.drawingLayer.add(this.currentLine);
    }

    private moveTool(event) {
        if (!this.drawing) {
            return;
        }

        const pos = this.stage.getPointerPosition();
        //check of pos is null
        if (!pos) {
            console.log('failed to get cursor position')
            return
        }
        this.currentLine.points(this.currentLine.points().concat([pos.x, pos.y]))
    }

    private endTool(event) {
        this.drawing = false;
    }
}