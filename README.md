<!--
SPDX-FileCopyrightText: 2024 hobyte

SPDX-License-Identifier: EPL-2.0
-->

# PERGAMENT

Pergament is a handwriting and drawing Plugin for Obsidian

## Introduction

Previously, there was no real way to have Handwritten notes in your Obsidian Vault. Using your Apple Pen or Stylus to write something down? Not possible with Obsidian. This Plugin frees you from those chains. Write whatever you want in every Note. Enjoy the freedom of paper like note taking pared with the features of Obsidian. Quickly add some notes and embed them into your previous thoughts. Format them with different styles and colours or change the style to whatever you want.

## Features

- embedd drawings in Notes
- Draw
- Erase
- Move
- Custom Pens

## Future Plans

- [ ] Support for Mobile devices
- [ ] Convert Handwritten Notes to Markdown

## Installation

As this Plugin is currently not available in the Obsidian Plugin list, it needs to be installed manually:

### Manual

1. locate your Vault in the filesystem
2. Go to the plugin folder: `.obsidian/plugins`
3. clone the git repository: `git clone https://github.com/hobyte/pergament`
4. Enter the plugin folder and build the plugin: `npm run build`
5. Enable community Plugins and Obsidian in the Obsidian plugin settings

### BRAT

BRAT is a Obsidian Plugin that helps installing Plugins directly from GitHub.

1. Install BRAT from the Community Plugins in Obsidian
2. Enable BRAT in your settings
3. Open the command palette and run the command **BRAT: Add a beta plugin for testing**
4. Enter the Obsidian Plugin URL: https://github.com/hobyte/pergament
5. If you unchecked **Enable after installing the plugin**, go to the Obsidian Plugin settings and enable Pergament

## Development

Pergament is developed on [GitLab](https://gitlab.com/Hobyte/pergament). It is mirrored to Github to release it to the Obsidian Community Plugin List.

### Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the plugin: `npm run build`
4. Add a file system link to the location of the cloned repository
5. Enable community Plugins and Obsidian in the Obsidian plugin settings

### Build

Build the plugin with live rebuilds: `npm run dev`  
Release build: `npm run build`

### Tests

currently, there are no tests, so the **test** job is empty. If you want to run linters, run `npm run lint`.

### License

[reuse](https://reuse.software/) is used to add a license to all files. If you add more files, you can add a license header with this command:
```bash
reuse annotate --license="EPL-2.0" --copyright="<your name>" <files>
```
**Note** you need to install the *reuse* cli tool to run this command

## Contributions

Contributions are welcome!  
If you think something is wrong or doesn't work as expected, open a issue on [GitLab](https://gitlab.com/Hobyte/pergament/-/issues/new). Please use the provided templates to report bugs and feature requests.  
If you have a question or want to give feedback, feel free to also open a issue on [GitLab](https://gitlab.com/Hobyte/pergament/-/issues/new).
