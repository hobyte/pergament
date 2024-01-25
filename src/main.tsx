import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { EditorView } from '@codemirror/view';
import { createRoot } from "react-dom/client";
import { StrictMode } from 'react';
import { PergamentCanvas } from './PergamentCanvas';
import { StorageAdapter } from './StorageAdapter';

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin implements StorageAdapter {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		console.log("loaded settings");
		const id = "newid";

		this.registerMarkdownCodeBlockProcessor("pergament", (source, el, ctx) => {
			let editable = true;
			const mdView: MarkdownView | null = this.app.workspace.getActiveViewOfType(MarkdownView)

			if (mdView?.getMode() === 'preview') {
				editable = false;
			}

			const root = createRoot(el);
			root.render(
				<StrictMode>
					<PergamentCanvas
						editable={editable}
						source={source}
						storageAdapter={this}
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


class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
