import { MarkdownView, Plugin } from 'obsidian';
import { EditorView, Panel, showPanel } from '@codemirror/view';
import { createRoot } from "react-dom/client";
import { StrictMode, createContext } from 'react';
import { StorageAdapter } from './StorageAdapter';
import { Toolbar } from './ui/Toolbar';
import { DEFAULT_SETTINGS, Settings } from './settings/Settings';
import { Canvas } from './ui/Canvas';

export const settingsContext = createContext(DEFAULT_SETTINGS);

export default class Pergament extends Plugin implements StorageAdapter {
	settings: Settings;
	selectedPen: number = 0;

	async onload() {
		await this.loadSettings()

		const panel: Panel = {
			dom: document.createElement('div'),
			mount: () => {
				const panelRoot = createRoot(panel.dom);
				panelRoot.render(
					<StrictMode>
						<Toolbar
							pens={this.settings.pens}
							setSelectedPen={(id: number) => this.selectedPen = id}
						/>
					</StrictMode>
				)
			},
			top: true
		}

		this.registerEditorExtension(showPanel.of((view: EditorView) => panel));

		this.registerMarkdownCodeBlockProcessor("pergament", (source, el, ctx) => {
			let editable = true;
			const mdView: MarkdownView | null = this.app.workspace.getActiveViewOfType(MarkdownView)

			if (mdView?.getMode() === 'preview') {
				editable = false;
			}
			
			new Canvas(el);
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	save(content: string, id: string): void {
		const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (mdView?.getMode() === 'preview') return;

		// @ts-ignore
		const view = mdView?.editor.cm as EditorView;
		const element = document.getElementById(id);
		if (!element) {
			console.log('cannot find element in document');
		}
		let pos = 0;
		try {
			pos = view.posAtDOM(element as Node);
		} catch (error) {
			console.log(`element not accesible to konva: ${error}`);
		}

		let line = view.state.doc.lineAt(pos);

		//find content of codeblock:
		if (line.text.contains('```pergament')) {
			line = view.state.doc.lineAt(line.to + 1);
			//check if codeblock is empty
			if (view.state.doc.lineAt(line.to).text.contains('```')) {
				let transaction = view.state.update({ changes: { from: line.from, to: line.from, insert: `${content}\n` } })
				view.dispatch(transaction);

			} else {
				let transaction = view.state.update({ changes: { from: line.from, to: line.to, insert: content } })
				view.dispatch(transaction);
			}
		}

	}
}
