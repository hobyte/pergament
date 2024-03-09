export class Pen {
	private _id: string;
	private _removable: boolean
	private _name: string;
	private _color: string;
	private _width: number;
	private _tension: number;

	constructor(name: string, color: string, width: number, tension: number, removable: boolean) {
		this._id = this.generateId();
		this._removable = removable
		this.name = name;
		this.color = color;
		this.width = width;
		this.tension = tension;
	}

	private generateId(): string {
		const dateStr = Date
			.now()
			.toString(36);
		const randomStr = Math
			.random()
			.toString(36)
			.substring(2, 8); // start at index 2 to skip decimal point
		return `${dateStr}-${randomStr}`;
	}

	public get id(): string {
		return this._id;
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