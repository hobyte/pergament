// SPDX-FileCopyrightText: 2024 hobyte
//
// SPDX-License-Identifier: EPL-2.0

import { Layer } from "konva/lib/Layer";
import { Tool } from "./Tool";
import { Line } from "konva/lib/shapes/Line";
import { Shape } from "konva/lib/Shape";
import { Group } from "konva/lib/Group";

export class Stretch extends Tool {
    private movingLine: Line
    private moveItems: Shape[]
    private moving: boolean
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
            this.oldPos = pos;

            layer.add(this.movingLine);
            this.movingLine.points([0, pos.y, layer.width(), pos.y]);

            //add layer elemens below cursor to moveItems
            this.moveItems = []
            layer
                .find((node: Shape) => {
                    const dimension = node.getClientRect();
                    return dimension.y + dimension.height >= pos.y
                })
                .filter(node => node.getType() == 'Shape')
                .filter((node: Shape) => node.name() != this.toolName)
                .forEach((node: Shape) => this.moveItems.push(node));
        }
    }

    public move(layer: Layer): void {
        if (this.moving) {
            const pos = layer.getRelativePointerPosition();
            if (pos) {
                const deltaY = pos.y - this.oldPos.y;
                this.oldPos = pos;

                this.movingLine.move({x: 0, y: deltaY})
                this.moveItems.forEach((item: Shape) => item.move({x: 0, y: deltaY}))
            }
        }
    }

    public end(layer: Layer): void {
        this.moving = false;
        this.movingLine.remove()
    }
}