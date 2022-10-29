import { Canvas } from "canvas";
import { MarkdownView } from "obsidian";

export class Overlay{

  currentView: MarkdownView
  editorContainer: HTMLElement
  overlay: HTMLDivElement

  constructor(currentView: MarkdownView) {
    this.currentView = currentView
    this.editorContainer = currentView.containerEl;
    this.createOverlay();
  }

  private createOverlay(){
    console.log('Pergament: Create Overlay');

    this.overlay = this.editorContainer.createEl("div", {cls: "overlay"});
    var menuBar = this.overlay.createEl("div", {cls: "menu_bar"})

    new Canvas(this.overlay)

    var closeButton = menuBar.createEl("button", {text: "close", cls: "close_canvas"});
    closeButton.addEventListener("click", function() {this.closeOverlay();}.bind(this)); 
  }

  private addText() {
    const editor = this.currentView.editor;
    editor.replaceRange("Text aus Klasse Overlay", editor.getCursor())
  }

  private closeOverlay(){
    console.log("Pergament: Close Overlay");
    console.log(typeof this.overlay)
    this.editorContainer.removeChild(this.overlay);
  }
}