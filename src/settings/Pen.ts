export class Pen {
	private _removable: boolean
	private _name: string;
	private _color: string;
	private _width: number;
	private _tension: number;

	constructor(name: string, color: string, width: number, tension: number, removable: boolean) {
		this._removable = removable
		this.name = name;
		this.color = color;
		this.width = width;
		this.tension = tension;
	}

	public get removable(): boolean {
		return this.removable;
	}

	public get name(): string {
		return this._name;
	}

	public set name(value: string) {
		this._name = value;
	}

	public get color(): string {
		return this._color;
	}
	
	public set color(value: string) {
		this._color = value;
	}

	public get width(): number {
		return this._width;
	}

	public set width(value: number) {
		this._width = value;
	}

	public get tension(): number {
		return this._tension;
	}

	public set tension(value: number) {
		this._tension = value;
	}
}