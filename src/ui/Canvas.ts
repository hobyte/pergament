import { Stage } from "konva/lib/Stage";

export class Canvas {
    private parent: HTMLElement
    private stage: Stage

    constructor(parent: HTMLElement) {
        this.parent = parent;
        this.createStage(parent);
        this.watchParentResize();
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
                this.resizeStage()
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
}