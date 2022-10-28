import { App, MarkdownView, Modal, Setting } from "obsidian";
import { type } from "os";

export class Canvas{

  static editorContainer: HTMLElement
  static overlay: HTMLDivElement
  static canvas: HTMLElement

  constructor(currentView: MarkdownView) {
    Canvas.editorContainer = currentView.containerEl;
    Canvas.editorContainer.appendChild(this.createOverlay());
    console.log(Canvas.editorContainer.children);
  }

  private createOverlay(){
    console.log('Pergament: Create Overlay');

    var container = Canvas.editorContainer;
    var overlay = Canvas.overlay;
    overlay = container.createEl("div", {cls: "overlay"});

    var menuBar = overlay.createEl("div", {cls: "menu_bar"})

    var canvas = overlay.createEl("canvas", {cls: "drawing_canvas"})

    var closeButton = menuBar.createEl("button", {text: "close", cls: "close_canvas"});
    closeButton.addEventListener("click", this.closeOverlay);

    Canvas.overlay = overlay
    Canvas.canvas = canvas
    return overlay;
  }

  private createPencils(menuBar: HTMLDivElement) {

  }

  private closeOverlay(){
    console.log("Pergament: Close Overlay");
    console.log(typeof Canvas.overlay)
    Canvas.editorContainer.removeChild(Canvas.overlay);
  }
}