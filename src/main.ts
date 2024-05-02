// SPDX-FileCopyrightText: 2024 hobyte
//
// SPDX-License-Identifier: EPL-2.0

import { Editor, MarkdownView, Plugin } from 'obsidian';
import { EditorView, showPanel } from '@codemirror/view';
import { StorageAdapter } from './StorageAdapter';
import { DEFAULT_SETTINGS, Settings } from './settings/Settings';
import { Canvas } from './ui/Canvas';
import { Toolbar } from './ui/Toolbar';
import { SettingsTab } from './ui/SettingsTab'
import * as _ from 'lodash';

export default class Pergament extends Plugin implements StorageAdapter {
	public settings: Settings;
	private toolbar: Toolbar;

	public async onload() {
		await this.loadSettings()
		this.addSettingTab(new SettingsTab(this.app, this))

		this.toolbar = new Toolbar(this.settings)
		const panel =  {
			dom: document.createElement('div'),
			//toolbar: new Toolbar(this.settings),
			mount: () => {
				//const toolbar = new Toolbar(this.settings)
				this.toolbar.mount(panel.dom)
			},
			top: true
		}
		const createPanel = (view: EditorView) => panel;
		this.registerEditorExtension(showPanel.of(createPanel));

		this.registerMarkdownCodeBlockProcessor("pergament", (source, el, ctx) => {
			let editable = true;
			const mdView: MarkdownView | null = this.app.workspace.getActiveViewOfType(MarkdownView)

			if (mdView?.getMode() === 'preview') {
				editable = false;
			}
			
			new Canvas(el, this.settings, this, this.toolbar, source, editable);
		});

		this.addCommand({
			id: "pergament-create-Canvas",
			name: 'create a new Pergament canvas',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection('```pergament\n\n```');
			}
		})
	}

	public save(content: string, id: string): void {
		const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (mdView?.getMode() === 'preview') return;

		// @ts-expect-error, not typed
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

	async loadSettings() {
		const settingsData = await this.loadData();

		this.settings = _.merge(DEFAULT_SETTINGS, settingsData)

		if (settingsData == null) {
			this.saveSettings();
		}
	}

	async saveSettings() {
		const settings = {...this.settings };
		delete settings.tools.move
		delete settings.tools.stretch
		await this.saveData(settings);
	}
}
