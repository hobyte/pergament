import { App, PluginSettingTab, Setting } from 'obsidian';
import Pergament from '../main';

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
			.setDesc('It\'s a secret');
	}
}
