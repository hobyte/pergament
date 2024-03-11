import { Layer } from "konva/lib/Layer";
import { KonvaEventListener } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { Line } from "konva/lib/shapes/Line";
import { StorageAdapter } from "src/StorageAdapter";
import { BackgroundPattern } from "src/settings/Background";
import { Settings } from "src/settings/Settings";

export class Canvas {
    private id: string
    private editable: boolean
    private storage: StorageAdapter
    private settings: Settings
    private parent: HTMLElement
    private stage: Stage
    private backgroundLayer: Layer
    private drawingLayer: Layer

    constructor(parent: HTMLElement, settings: Settings, storage: StorageAdapter, source: string, editable: boolean) {
        this.editable = editable;
        this.storage = storage;
        this.settings = settings;
        this.parent = parent;

        this.id = (Math.random() + 1).toString(36).substring(7);
        this.createStage(parent);
        this.watchParentResize();

        //draw background
        this.backgroundLayer = new Layer({ name: 'background' });
        this.stage.add(this.backgroundLayer);
        this.drawBackground();

        //event listeners and layer for tools
        this.drawingLayer = new Layer({ name: 'draw' });
        this.stage.add(this.drawingLayer)
        this.stage.on('mousedown touchstart', event => this.startTool(event));
        this.stage.on('mousemove touchmove', event => this.moveTool(event));
        this.stage.on('mouseup touchend', event => this.endTool(event));

        //load saved lines
        this.loadFromString(source)
    }

    private createStage(parent: HTMLElement): void {
        const container = document.createElement('div');
        container.classList.add('pergament-canvas')
        container.id = this.id;
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
        if (!parentWitdh) {
            return
        }
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
        if (this.editable) {
            this.settings.pens[0].start(this.drawingLayer);
        }
    }

    private moveTool(event) {
        if (this.editable) {
            this.settings.pens[0].move(this.drawingLayer);
        }
    }

    private endTool(event) {
        if (this.editable) {
            this.settings.pens[0].end(this.drawingLayer);
            //save canvas content to File
            this.saveToFile();
        }
    }

    private saveToFile() {
        const lines = this.drawingLayer
            .getChildren()
            .map((line) => {
                let attr = line.attrs;
                attr.name = line.name();
                return attr;
            })
        this.storage.save(JSON.stringify(lines), this.id);
    }

    private loadFromString(source: string) {
        if (source.length <= 0) {
            //no lines to add
            return
        }
        const lineAttrs = JSON.parse(source);
        lineAttrs.forEach(attr => {
            this.drawingLayer.add(new Line(attr))
        });
    }
}