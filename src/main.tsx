import { MarkdownView, Plugin } from 'obsidian';
import { EditorView, Panel, showPanel, getPanel } from '@codemirror/view';
import { StorageAdapter } from './StorageAdapter';
import { DEFAULT_SETTINGS, Settings } from './settings/Settings';
import { Canvas } from './ui/Canvas';
import { Toolbar } from './ui/Toolbar';

export default class Pergament extends Plugin implements StorageAdapter {
	private settings: Settings;
	private toolbar: Toolbar;

	public async onload() {
		await this.loadSettings()

		/*define panel here so it can be accesed by codemirror. Mounting the panel does not
		work when the createPanel function is on class level.*/
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

			//get panel from editor
			//@ts-ignore
			const editorView = mdView?.editor.cm;
			if (editorView) {
				const editorPanel = getPanel(editorView, createPanel);
				new Canvas(el, this.settings, this, this.toolbar, source, editable);
				console.log(editorPanel)
			}

		});
	}

	private async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	private async saveSettings() {
		await this.saveData(this.settings);
	}

	private createPanel(view: EditorView): Panel {
		const panel =  {
			dom: document.createElement('div'),
			toolbar: new Toolbar(this.settings),
			mount: () => {
				const toolbar = new Toolbar(this.settings)
				toolbar.mount(panel.dom)
			},
			top: true
		}
		return panel
	}

	public save(content: string, id: string): void {
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
