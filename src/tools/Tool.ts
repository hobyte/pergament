// SPDX-FileCopyrightText: 2024 hobyte
//
// SPDX-License-Identifier: EPL-2.0

import { Layer } from "konva/lib/Layer";

export abstract class Tool {
	protected _removable: boolean
	protected _name: string;

	constructor(name: string, removable: boolean) {
		this._removable = removable
		this._name = name;
	}

	public get removable(): boolean {
		return this._removable;
	}

	public get name(): string {
		return this._name;
	}

	public set name(value: string) {
		this._name = value;
	}

	public abstract start(layer: Layer): void;
	public abstract move(layer: Layer): void;
	public abstract end(layer: Layer): void;
}