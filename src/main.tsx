import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { EditorView } from '@codemirror/view';
import { createRoot } from "react-dom/client";
import { StrictMode } from 'react';
import { PergamentCanvas } from './pergamentCanvas';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		console.log("loaded settings");
		const id = "newid";

		this.registerMarkdownCodeBlockProcessor("pergament", (source, el, ctx) => {
			console.log("render code block");
			const mdView: MarkdownView | null = this.app.workspace.getActiveViewOfType(MarkdownView)

			if (mdView?.getMode() === 'preview') {
				console.log("preview mode, just render text");
				el.innerHTML = source;
				return;
			}

			console.log("other mode, trying to change content");

			const root = createRoot(el);
			root.render(
				<StrictMode>
					<PergamentCanvas />
				</StrictMode>
			)
		});

		//accessing the editor content only works in a function sepereate from rendering the markdown codeblock
		this.addCommand({
			id: "save",
			name: "save content to md file",
			callback: () => {
				console.log("save mode");
				const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);

				if (mdView.getMode() === 'preview') return;

				const view = mdView.editor.cm as EditorView;
				const mark = document.getElementById(id);

				const pos = view.posAtDOM(mark as Node);
				var line = view.state.doc.lineAt(pos);
				if (line.text.contains('```pergament')) {
					line = view.state.doc.lineAt(line.to + 1);
				}
				//line contains the position of the codeblock content
				console.log(pos, line);

				//save new content to codeblock
				const now = new Date();
				const text = line.text;

				let transaction = view.state.update({ changes: { from: line.from, to: line.to, insert: now.toLocaleString() } })
				view.dispatch(transaction);
				console.log("updated codeblock");
			},
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
