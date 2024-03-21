import { App, PluginSettingTab, Setting } from 'obsidian';
import Pergament from '../main';
import { BackgroundPattern } from 'src/settings/Background';

export class SettingsTab extends PluginSettingTab {
	plugin: Pergament;

	constructor(app: App, plugin: Pergament) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const containerEl = this.containerEl;
		containerEl.empty();

		//Background
		const backgroundContainer = containerEl.createEl('div');
		backgroundContainer.createEl('h1').innerText = 'Background';
		backgroundContainer.createEl('div').innerText = 'Restart Obsidian after changing a setting'

		new Setting(backgroundContainer)
			.setName('Pattern')
			.setDesc('Choose a pattern to use for the background.')
			.addDropdown(dropdown => {
				for(const key in BackgroundPattern) {
					if (Number(key) >= 0) {
						dropdown.addOption(key, BackgroundPattern[key]);
					}
				}
				dropdown.setValue(String(this.plugin.settings.background.pattern))
				dropdown.onChange(async (value) =>{
					const key = Number(value)
					let pattern = BackgroundPattern[value as keyof typeof BackgroundPattern];
					this.plugin.settings.background.pattern = pattern;
					this.plugin.saveSettings().then(() => console.log('saved settings'))
				})
			})
		new Setting(backgroundContainer)
			.setName('Size')
			.setDesc('Choose the size of the background.')
			.addText(textArea => {
				textArea.setValue(String(this.plugin.settings.background.size))
				textArea.onChange(value => {
					if (!isNaN(Number(value))) {
						const size = Number(value)
						this.plugin.settings.background.size = size > 0 ? size : 1;
						this.plugin.saveSettings().then(() => console.log('saved settings'))
					} else {
						textArea.setValue(String(this.plugin.settings.background.size))
					}
				})
			})
		new Setting(backgroundContainer)
			.setName('Color')
			.setDesc('Choose the color of the background lines')
			.addColorPicker(picker => {
				picker.setValue(this.plugin.settings.background.color)
				picker.onChange(color => {
					this.plugin.settings.background.color = color
					this.plugin.saveSettings().then(() => console.log('saved settings'))
				})
			})
	}
}
