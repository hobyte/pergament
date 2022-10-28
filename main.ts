import { Canvas } from 'canvas';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, View, WorkspaceLeaf } from 'obsidian';
import { ExampleView, VIEW_TYPE_EXAMPLE } from 'view';

// Remember to rename these classes and interfaces!

interface PergamentSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: PergamentSettings = {
	mySetting: 'default'
}

export default class Pergament extends Plugin {
	settings: PergamentSettings;

	async onload() {

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-canvas',
			name: 'Open sketching canvas',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						var currentView = this.app.workspace.getActiveViewOfType(MarkdownView);
						if (currentView != null) {
							console.log(currentView.containerEl)
							new Canvas(currentView)
						}
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});
	}

	onunload() {
	}
}