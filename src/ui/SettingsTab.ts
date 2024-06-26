// SPDX-FileCopyrightText: 2024 hobyte
//
// SPDX-License-Identifier: EPL-2.0

import { App, PluginSettingTab, Setting } from 'obsidian';
import Pergament from '../main';
import { BackgroundPattern } from 'src/settings/Background';
import { Pen } from 'src/tools/Pen';

export class SettingsTab extends PluginSettingTab {
	plugin: Pergament;

	constructor(app: App, plugin: Pergament) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const containerEl = this.containerEl;
		containerEl.empty();

		containerEl.createEl('div', { text: 'Restart Obsidian to apply changes', cls: 'settings-hint' })

		//General
		const generalContainer = containerEl.createEl('div')
		generalContainer.createEl('h1', { text: 'General' })

		new Setting(generalContainer)
			.setName('Canvas Height')
			.setDesc('Choose the minimal height of the canvas.')
			.addText(textArea => {
				textArea.setValue(String(this.plugin.settings.minimalCanvasHeight))
				textArea.onChange(value => {
					if (!isNaN(Number(value))) {
						const size = Number(value)
						this.plugin.settings.minimalCanvasHeight = size > 0 ? size : 1;
						this.plugin.saveSettings().then(() => console.log('saved settings'))
					} else {
						textArea.setValue(String(this.plugin.settings.minimalCanvasHeight))
					}
				})
			})
		new Setting(generalContainer)
			.setName('Save Interval')
			.setDesc('Choose the Interval in second at witch the Canvas will saved.')
			.addText(textArea => {
				textArea.setValue(String(this.plugin.settings.saveInterval))
				textArea.onChange(value => {
					if (!isNaN(Number(value))) {
						const size = Number(value)
						this.plugin.settings.saveInterval = size > 0 ? size : 1;
						this.plugin.saveSettings().then(() => console.log('saved settings'))
					} else {
						textArea.setValue(String(this.plugin.settings.saveInterval))
					}
				})
			})

		//Background
		const backgroundContainer = containerEl.createEl('div');
		backgroundContainer.createEl('h1').innerText = 'Background';

		new Setting(backgroundContainer)
			.setName('Pattern')
			.setDesc('Choose a pattern to use for the background.')
			.addDropdown(dropdown => {
				for (const key in BackgroundPattern) {
					if (Number(key) >= 0) {
						dropdown.addOption(BackgroundPattern[key], BackgroundPattern[key]);
					}
				}
				dropdown.setValue(BackgroundPattern[this.plugin.settings.background.pattern])
				dropdown.onChange(async (value) => {
					let pattern = BackgroundPattern[value as keyof typeof BackgroundPattern]
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

		//Pens
		const penContainer = containerEl.createEl('div')
		penContainer.createEl('h1').innerText = 'Pens';

		this.plugin.settings.pens.forEach(pen => {
			const penDetails = penContainer.createEl('details')
			penDetails.createEl('summary', { text: pen.name, cls: 'settings-header' })

			new Setting(penDetails)
				.setName('Name')
				.setDesc('Choose the name of the pen')
				.addText(textArea => {
					textArea.setValue(pen.name);
					textArea.onChange(value => {
						if (value !== '') {
							pen.name = value;
							this.plugin.saveSettings().then(() => console.log('saved settings'))
						}
					})
				})
			new Setting(penDetails)
				.setName('Color')
				.setDesc(`Choose the color of ${pen.name}`)
				.addColorPicker(picker => {
					picker.setValue(pen.color)
					picker.onChange(color => {
						pen.color = color
						this.plugin.saveSettings().then(() => console.log('saved settings'))
					})
				})
			new Setting(penDetails)
				.setName('Size')
				.setDesc(`Choose the thickness of ${pen.name}.`)
				.addText(textArea => {
					textArea.setValue(String(pen.width))
					textArea.onChange(value => {
						if (!isNaN(Number(value))) {
							const width = Number(value)
							pen.width = width > 0 ? width : 1;
							this.plugin.saveSettings().then(() => console.log('saved settings'))
						} else {
							textArea.setValue(String(this.plugin.settings.background.size))
						}
					})
				})
			new Setting(penDetails)
				.setName('Tension')
				.setDesc(`Choose the Tension of ${pen.name}. Higher values will result in a more curvy line.`)
				.addText(textArea => {
					textArea.setValue(String(pen.width))
					textArea.onChange(value => {
						if (!isNaN(Number(value))) {
							const tension = Number(value)
							pen.tension = tension >= 0 ? tension : 1;
							this.plugin.saveSettings().then(() => console.log('saved settings'))
						} else {
							textArea.setValue(String(this.plugin.settings.background.size))
						}
					})
				})

			if (pen.removable) {
				penDetails.createEl('button', {
					text: 'Delete',
					cls: 'mod-warning'
				}).onclick = () => {
					this.plugin.settings.pens.remove(pen);
					this.plugin.saveSettings().then(() => console.log('saved settings'));
					this.display();
				}
			}
		})
		//add new pen
		penContainer.createEl('button', {
			text: 'Add Pen',
			cls: 'add-button'
		}).onclick = () => {
			const pen = new Pen(
				'new Pen',
				'#6869E3',
				3,
				3,
				true
			)
			this.plugin.settings.pens.push(pen)
			this.plugin.saveSettings().then(() => console.log('saved settings'))
			this.display();
		}

		//Tools
		const toolsContainer = containerEl.createEl('div')
		toolsContainer.createEl('h1', { text: 'Tools' })

		//eraser
		const eraserContainer = toolsContainer.createEl('div')
		const eraserName = this.plugin.settings.tools.eraser.name
		eraserContainer.createEl('h3', { text: eraserName.charAt(0).toUpperCase() + eraserName.slice(1) })

		new Setting(eraserContainer)
			.setName('Radius')
			.setDesc('Choose the size of the eraser')
			.addText(textArea => {
				textArea.setValue(String(this.plugin.settings.tools.eraser.radius))
				textArea.onChange(value => {
					if (!isNaN(Number(value))) {
						const radius = Number(value)
						this.plugin.settings.tools.eraser.radius = radius >= 0 ? radius : 1;
						this.plugin.saveSettings().then(() => console.log('saved settings'))
					} else {
						textArea.setValue(String(this.plugin.settings.tools.eraser.radius))
					}
				})
			})
	}
}
