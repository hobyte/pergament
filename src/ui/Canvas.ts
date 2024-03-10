import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import { Line } from "konva/lib/shapes/Line";
import { BackgroundPattern } from "src/settings/Background";
import { Settings } from "src/settings/Settings";

export class Canvas {
    private settings: Settings
    private parent: HTMLElement
    private stage: Stage
    private backgroundLayer: Layer

    constructor(parent: HTMLElement, settings: Settings) {
        this.settings = settings;
        this.parent = parent;
        this.createStage(parent);
        this.watchParentResize();

        //draw background
        this.backgroundLayer = new Layer({name: 'background'});
        this.stage.add(this.backgroundLayer);
        this.drawBackground();
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
                        points: [0,y, stageWidth, y],
                        name: 'horizontal'
                    }))
                }
                break;
        }
    }
}