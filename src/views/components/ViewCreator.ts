import { createStyle, isSVGString } from "../utils";

interface ViewConfig {
  container?: HTMLElement;
  // className?: string;
  // style?: Partial<CSSStyleDeclaration>;
}

export type EmptyContentConfig =
  | string
  | HTMLElement
  | HTMLTemplateElement
  | {
      templatePath: string; // Path to HTML template file
    };

export type ToolbarButtonConfig = Pick<ToolbarButton, "icon" | "label" | "className" | "isHidden">;

interface ToolbarButton {
  id: string;
  icon: string;
  label: string;
  onClick?: () => void;
  className?: string;
  isDisabled?: boolean;
  isHidden?: boolean;
}

interface MWCViewElementsInterface {
  headerContainer: HTMLElement;
  contentContainer: HTMLElement;
  emptyContentContainer: HTMLElement;
  toolbarContainer: HTMLElement;
  selectedToolbarContainer: HTMLElement;
}

export default abstract class MWCView {
  protected MWCViewElements: MWCViewElementsInterface = {
    headerContainer: null,
    contentContainer: null,
    emptyContentContainer: null,
    toolbarContainer: null,
    selectedToolbarContainer: null,
  };

  protected isSelectionMode: boolean = false;

  constructor(protected config: ViewConfig) {}

  initialize(): void {
    if (!this.config.container) {
      throw new Error("Create a container element");
    }

    this.createMWCView();
  }

  protected createMWCView() {
    // Reset container
    this.config.container.textContent = "";

    createStyle("mwc-views-style", DEFAULT_MWC_VIEW_STYLE);

    this.createHeader();
    this.createContent();
    this.createEmptyContent();
    this.createToolbars();
  }

  protected createHeader(enable: boolean = true): void {
    if (!enable) return;

    this.MWCViewElements.headerContainer = document.createElement("div");
    this.MWCViewElements.headerContainer.className = "mwc-view-header";
    this.config.container.appendChild(this.MWCViewElements.headerContainer);
  }

  protected createContent(): void {
    this.MWCViewElements.contentContainer = document.createElement("div");
    this.MWCViewElements.contentContainer.className = "mwc-view-content";
    this.config.container.appendChild(this.MWCViewElements.contentContainer);
  }

  protected createEmptyContent(): void {
    this.MWCViewElements.emptyContentContainer = document.createElement("div");
    this.MWCViewElements.emptyContentContainer.className = "mwc-view-content-empty";
    this.config.container.appendChild(this.MWCViewElements.emptyContentContainer);
  }

  protected abstract updateEmptyContentHTML(): void;

  protected async setEmptyContent(content: EmptyContentConfig): Promise<void> {
    const container = this.MWCViewElements.emptyContentContainer;
    container.textContent = ""; // Clear existing content

    try {
      if (typeof content === "object" && "templatePath" in content) {
        // Load template from file
        const response = await fetch(content.templatePath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const templateContent = await response.text();

        container.innerHTML = templateContent;

        // Remove the outer template tags if they exist
        const templateElement = container.querySelector("template");
        if (templateElement) {
          container.innerHTML = templateElement.innerHTML;
        }

        // Ensure proper styling
        container.style.display = "flex";
        container.style.height = "100%";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
      } else if (content instanceof HTMLTemplateElement) {
        // For template elements, clone the content
        const clone = document.importNode(content.content, true);
        container.appendChild(clone);
      } else if (content instanceof HTMLElement) {
        // Regular HTML elements
        container.appendChild(content);
      } else if (typeof content === "string") {
        // HTMLElement template
        if ((content as string).trim().startsWith("<template")) {
          const template = document.createElement("template");
          template.innerHTML = content;
          const clone = document.importNode(template.content, true);
          container.appendChild(clone);
        } else {
          // Regular HTML string or plain label
          container.innerHTML = content;
        }
      }
    } catch (error) {
      console.error("Error setting empty content:", error);
      // Fallback to a simple message if loading fails
      container.innerHTML = "<div>No content available</div>";
    }
  }

  protected createToolbars(): void {
    // Create main toolbar
    this.MWCViewElements.toolbarContainer = document.createElement("div");
    this.MWCViewElements.toolbarContainer.className = "mwc-view-controls-container";
    this.config.container.appendChild(this.MWCViewElements.toolbarContainer);

    // Create selection toolbar
    this.MWCViewElements.selectedToolbarContainer = document.createElement("div");
    this.MWCViewElements.selectedToolbarContainer.className = "mwc-view-controls-container";
    this.MWCViewElements.selectedToolbarContainer.style.display = "none";
    this.config.container.appendChild(this.MWCViewElements.selectedToolbarContainer);
  }

  protected createToolbarButton(config?: ToolbarButton): HTMLElement {
    const button = document.createElement("div");
    button.className = `mwc-view-controls-btn ${config?.className || ""}`;

    if (!config) {
      // Empty buttons
      button.classList.add("disabled");
      button.innerHTML = `<div></div>`;
      return button;
    }

    const iconContainer = document.createElement("div");
    iconContainer.className = "icon";

    if (isSVGString(config.icon)) {
      // If SVG string, set innerHTML
      iconContainer.innerHTML = config.icon;
    } else {
      // If URL/path, create img element
      const iconImg = document.createElement("img");
      iconImg.src = config.icon;
      iconImg.alt = config.label;
      iconImg.width = 24;
      iconImg.height = 24;
      iconContainer.appendChild(iconImg);
    }

    // Create label container
    const textContainer = document.createElement("div");
    textContainer.className = "label";
    textContainer.textContent = config.label;

    // Add disabled state if specified
    if (config.isDisabled === true) {
      button.classList.add("disabled");
    }

    if (config.isHidden === true) {
      button.classList.add("hide");
    }

    // Append containers to button
    button.appendChild(iconContainer);
    button.appendChild(textContainer);

    if (config.onClick) {
      button.addEventListener("click", config.onClick);
    }

    return button;
  }

  public setVisible(visible: boolean, config?: any): void {
    this.config.container.style.display = visible ? "flex" : "none";
  }

  protected showContent(show: boolean): void {
    this.MWCViewElements.contentContainer.style.display = show ? "flex" : "none";
    this.MWCViewElements.emptyContentContainer.style.display = show ? "none" : "flex";
  }

  protected toggleSelectionMode(show: boolean): void {
    this.isSelectionMode = show;
    this.updateToolbarState();
  }

  protected updateToolbarState(): void {
    this.MWCViewElements.toolbarContainer.style.display = this.isSelectionMode ? "none" : "flex";
    this.MWCViewElements.selectedToolbarContainer.style.display = this.isSelectionMode ? "flex" : "none";
  }
}

const DEFAULT_MWC_VIEW_STYLE = `
  .mwc-view-container {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 100%;
    background-color: white;
    font-family: Verdana;
    color: black;
  }

  .mwc-view-container .mwc-view-header {
    display: flex;
    font-family: Verdana;
    height: 3rem;
    font-size: 24px;
    align-items: center;
    justify-content: center;
    background-color: #F5F5F5;
    flex: 0 1 3rem;
    padding: 0.5rem;
    user-select: none;
        color: black;
  }

  .mwc-view-container .mwc-view-header .mwc-view-header-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
        color: black;
  }

  .mwc-library-header-btn:hover {
    text-decoration: underline;
  }

  .mwc-view-container .mwc-view-content {
    flex: 1 1 auto;
    overflow-y: auto;
    display: none;
    flex-direction: column;
    justify-content: start;
    padding: 1rem;
    gap: 1rem;
    padding-bottom: 2rem;
  }

  .mwc-view-container .mwc-view-content-empty {
    flex: 1 1 auto;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    user-select: none;
    font-family: Verdana;
  }

  .mwc-view-container .mwc-view-content-empty {
    flex: 1 1 auto;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    user-select: none;
    font-family: Verdana;
  }

  .mwc-view-container .mwc-view-controls-container {
    display: flex;
    height: 6rem;
    background-color: #323234;
    align-items: center;
    font-size: 12px;
    font-family: Verdana;
    color: white;
    width: 100%;
    flex: 0 1 65px;
  }

  .mwc-view-container .mwc-view-controls-container .mwc-view-controls-btn {
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    width: 100%;
    gap: 0.5rem;
    text-align: center;
    user-select: none;
  }

  .mwc-view-container .mwc-view-controls-container .mwc-view-controls-btn >div:first-child {
    padding-top: 1rem;
  }

  .mwc-view-container .mwc-view-controls-container .mwc-view-controls-btn >div:last-child {
    padding-bottom: 1rem;
  }

  .mwc-view-container .mwc-view-controls-container .mwc-view-controls-btn.selected{
    background-color: #E36605;
  }

  .mwc-view-container .mwc-view-controls-container .mwc-view-controls-btn.disabled {
    pointer-events: none;
  }

  .mwc-view-container .mwc-view-controls-container .mwc-view-controls-btn.disabled >div {
    opacity: 0.4;
  }

  .mwc-view-container .mwc-view-controls-container .mwc-view-controls-btn.hide {
    display: none;
  }

  .mwc-view-container .mwc-view-controls-container .mwc-view-controls-btn .icon img,
  .mwc-view-container .mwc-view-controls-container .mwc-view-controls-btn .icon svg {
    width: 24px;
    height: 24px;
  }
`;
