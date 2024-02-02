import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { EditorView, Panel, showPanel } from '@codemirror/view';
import { createRoot } from "react-dom/client";
import { StrictMode } from 'react';
import { PergamentCanvas } from './PergamentCanvas';
import { StorageAdapter } from './StorageAdapter';
import { Toolbar } from './Toolbar';
import { Pen } from './Pen';

interface PergamentSettings {
	pens: Pen[]
}

const DEFAULT_SETTINGS: PergamentSettings = {
	pens: [
		{id: 0, name: 'title', color: '#3739c8', width: 10, tension: 0.5},
		{id: 1, name: 'text', color: '#f61009', width: 3, tension: 0.5},
		{id: 2, name: 'code', color: '#1be43e', width: 3, tension: 1}
	]
}

export default class Pergament extends Plugin implements StorageAdapter {
	settings: PergamentSettings;
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

		const loadPanel = (view: EditorView) => {
			return panel
		}

		this.registerEditorExtension(showPanel.of(loadPanel));

		this.registerMarkdownCodeBlockProcessor("pergament", (source, el, ctx) => {
			let editable = true;
			const mdView: MarkdownView | null = this.app.workspace.getActiveViewOfType(MarkdownView)

			if (mdView?.getMode() === 'preview') {
				editable = false;
			}

			const canvasRoot = createRoot(el);
			canvasRoot.render(
				<StrictMode>
					<PergamentCanvas
						editable={editable}
						source={source}
						storageAdapter={this}
						pens={this.settings.pens}
						getSelectedPen={() => {return this.selectedPen}}
					/>
				</StrictMode>
			)
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


class SettingsTab extends PluginSettingTab {
	plugin: Pergament;

	constructor(app: App, plugin: Pergament) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
	}
}
