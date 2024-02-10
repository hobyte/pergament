import { Pen } from "./Pen"

export enum Pattern {
    blank,
    line,
    grid,
}

export interface PergamentSettings {
	pens: Pen[]
    backgroundPattern: Pattern
    backgroundSize: number,
    backgroundColor: string
}

export const DEFAULT_SETTINGS: PergamentSettings = {
	pens: [
		{id: 0, name: 'title', color: '#3739c8', width: 10, tension: 0.5},
		{id: 1, name: 'text', color: '#f61009', width: 3, tension: 0.5},
		{id: 2, name: 'code', color: '#1be43e', width: 3, tension: 1}
	],
    backgroundPattern: Pattern.grid,
    backgroundSize: 1,
    backgroundColor: '#808080'
}