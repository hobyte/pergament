// SPDX-FileCopyrightText: 2024 hobyte
//
// SPDX-License-Identifier: EPL-2.0

export enum BackgroundPattern {
    blank,
    line,
    grid
}

export class Background {
    private _pattern: BackgroundPattern;
    private _size: number;
    private _color: string;

    constructor(pattern: BackgroundPattern, size: number, color: string) {
        this.pattern = pattern
        this.size = size;
        this.color = color;
    }


    public get pattern(): BackgroundPattern {
        return this._pattern;
    }

    public set pattern(pattern: BackgroundPattern) {
        this._pattern = pattern;
    }

    public get size(): number {
        return this._size;
    }

    public set size(size: number) {
        this._size = size;
    }

    public get color(): string {
        return this._color;
    }

    public set color(color: string) {
        this._color = color;
    }
}
