import { DDV, DisplayModeEnum, EditViewer, UiConfig } from "dynamsoft-document-viewer";
import { mobileEditViewerUiConfig, mobileTopBarChildrenConfig } from "./utils/uiConfig";
import { isMobile } from "./utils";
import { MWC_ICONS } from "./utils/icons";
import { EnumMWCViews, ExportConfig, UploadedDocument } from "./utils/types";
import { ModalType, ModalVariant, showModal, showToast } from "./components/Modal";
import MWCView, { ToolbarButtonConfig } from "./components/ViewCreator";
import { createStyle } from "./utils";

export interface DDVAnnotationToolbarLabelConfig {
  Undo: string;
  Redo: string;
  SelectAnnotation: string;
  EraseAnnotation: string;
  RectAnnotation: string;
  EllipseAnnotation: string;
  PolygonAnnotation: string;
  PolylineAnnotation: string;
  LineAnnotation: string;
  InkAnnotation: string;
  TextBoxAnnotation: string;
  TextTypewriterAnnotation: string;
  StampIconAnnotation: string;
  StampImageAnnotation: string;
  BringForward: string;
  BringToFront: string;
  SendBackward: string;
  SendToBack: string;
}

export interface PageViewToolbarButtonsConfig {
  back?: ToolbarButtonConfig;
  delete?: ToolbarButtonConfig;
  addPage?: ToolbarButtonConfig;
  upload?: ToolbarButtonConfig;
  share?: ToolbarButtonConfig;
  edit?: ToolbarButtonConfig;

  // Edit mode toolbar
  crop?: ToolbarButtonConfig;
  rotate?: ToolbarButtonConfig;
  filter?: ToolbarButtonConfig;
  annotate?: ToolbarButtonConfig;
  done?: ToolbarButtonConfig;
}

type PageViewToolbarButtons = Record<keyof PageViewToolbarButtonsConfig, HTMLElement>;

export interface PageViewConfig {
  container?: HTMLElement;
  onDocumentClick?: () => void;
  onCameraCapture?: () => Promise<void>;
  onGalleryImport?: () => Promise<void>;
  exportConfig: ExportConfig;
  onViewUploadsHistory?: () => void;
  getUploadedDocuments?: () => UploadedDocument[];
  updateUploadedDocuments?: (files: UploadedDocument[]) => void;
  showLibraryView?: boolean;
  onClose?: () => void;

  // For Public
  toolbarButtonsConfig?: PageViewToolbarButtonsConfig;
  annotationToolbarLabelConfig?: DDVAnnotationToolbarLabelConfig;
}

export class PageView extends MWCView {
  private editViewer: EditViewer = null;
  private toolbarBtn: PageViewToolbarButtons = {
    back: null,
    delete: null,
    addPage: null,
    upload: null,
    share: null,
    edit: null,
    crop: null,
    rotate: null,
    filter: null,
    annotate: null,
    done: null,
  };
  private editToolbarContainer = {};
  private ddvAnnotationsToolbarLabel = {
    Undo: "Undo",
    Redo: "Redo",
    SelectAnnotation: "Select",
    EraseAnnotation: "Eraser",
    RectAnnotation: "Rect",
    EllipseAnnotation: "Ellipse",
    PolygonAnnotation: "Polygon",
    PolylineAnnotation: "Polyline",
    LineAnnotation: "Line",
    InkAnnotation: "Ink",
    TextBoxAnnotation: "Textbox",
    TextTypewriterAnnotation: "Text",
    StampIconAnnotation: "Stamp",
    StampImageAnnotation: "Image",
    BringForward: "Up",
    BringToFront: "Top",
    SendBackward: "Down",
    SendToBack: "Bottom",
  };

  private isCroppingMode: boolean = false;
  private isAnnotatingMode: boolean = false;
  private isFilterMode: boolean = false;

  constructor(protected config: PageViewConfig) {
    super(config);
  }

  initialize() {
    createStyle("mwc-page-view-style", DEFAULT_PAGE_VIEW_STYLE);

    super.initialize();

    DDV.Elements.setDisplayTextConfig({
      ...this.ddvAnnotationsToolbarLabel,
      ...this.config.annotationToolbarLabelConfig,
    });

    this.editViewer = new DDV.EditViewer({
      container: this.MWCViewElements.contentContainer,
      uiConfig: mobileEditViewerUiConfig as UiConfig,
      viewerConfig: {
        scrollToLatest: true,
      },
    });
    this.editViewer.displayMode = DisplayModeEnum.SINGLE;
    this.MWCViewElements.contentContainer.style.padding = "0px";

    this.bindPageViewEvents();

    this.setVisible(false);
  }

  private bindPageViewEvents(): void {
    this.editViewer.on("showDocumentPageByDelete", async () => {
      const count = this.editViewer.currentDocument.pages.length;
      if (!count) {
        this.handleBack();
      }
      await showToast(this.config.container, "Deleted", ModalVariant.SUCCESS);
    });

    this.bindAnnotationEvents();
    this.bindToolModeEvents();
  }

  private bindAnnotationEvents(): void {
    let isFirstBind = false;
    const annotationSetButton = document.querySelector(".mwc-annotation-set");
    if (!isMobile() && annotationSetButton) {
      annotationSetButton.addEventListener("click", () => {
        const annotationModeBar = document.querySelector(".ddv-annotation-mode-box");
        if (!isFirstBind) {
          isFirstBind = true;
          let isFocused = false;

          annotationModeBar.addEventListener("mousedown", (e) => {
            let modeButton = e.target;
            if (e.target instanceof HTMLSpanElement) {
              modeButton = e.target.parentElement;
            }

            if ((modeButton as HTMLElement).classList.contains("ddv-button-focused")) {
              isFocused = true;
            }
          });

          annotationModeBar.addEventListener("click", () => {
            if (isFocused) {
              this.editViewer.toolMode = "pan";
              isFocused = false;
            }
          });
        }
      });
    }
  }

  private bindToolModeEvents(): void {
    this.editViewer.on("toolModeChanged", (e) => {
      if (e.oldToolMode === "crop") {
        this.toolbarBtn.crop.classList.remove("selected");
        this.enableAllEditButtons();
        this.toggleDDVHeaderButtons(true);
        this.isCroppingMode = false;
      }
    });
  }

  protected createHeader(): void {
    super.createHeader(false);
  }

  protected updateEmptyContentHTML(): void {
    const DEFAULT_EMPTY_PAGE_VIEW = `
      <div class="mwc-default-empty-page">
        ${MWC_ICONS.emptyLibrary}
        <div class="title">No page to display!</div>
      </div>
    `;
    this.MWCViewElements.emptyContentContainer.innerHTML = DEFAULT_EMPTY_PAGE_VIEW;
  }

  protected createToolbars(): void {
    super.createToolbars();

    const { toolbarButtonsConfig, exportConfig } = this.config;

    // Test if it's possible to share PDF through navigator
    const testPdfFile = new File([""], "test.pdf", { type: "application/pdf" });
    const canSharePDF = "share" in navigator && navigator.canShare({ files: [testPdfFile] });
    const handleShareOrDownload = () => {
      if (canSharePDF) {
        this.handleShare();
      } else {
        this.handleDownload();
      }
    };

    // Check for export config to show/hide upload
    const hasExportConfig = !!exportConfig?.uploadToServer;

    const buttons = [
      {
        id: "mwc-page-back",
        icon: toolbarButtonsConfig?.back?.icon || MWC_ICONS.back,
        label: toolbarButtonsConfig?.back?.label || "Back",
        isHidden: toolbarButtonsConfig?.back?.isHidden,
        className: `${toolbarButtonsConfig?.back?.className || ""}`,
        onClick: () => this.handleBack(),
      },
      {
        id: "mwc-page-delete",
        icon: toolbarButtonsConfig?.delete?.icon || MWC_ICONS.delete,
        label: toolbarButtonsConfig?.delete?.label || "Delete",
        isHidden: toolbarButtonsConfig?.delete?.isHidden,
        className: `${toolbarButtonsConfig?.delete?.className || ""}`,
        onClick: () => this.handleDeletePage(),
      },
      {
        id: "mwc-page-addPage",
        icon: toolbarButtonsConfig?.addPage?.icon || MWC_ICONS.captureAnother,
        label: toolbarButtonsConfig?.addPage?.label || "Add Page",
        isHidden: toolbarButtonsConfig?.addPage?.isHidden,
        className: `${toolbarButtonsConfig?.addPage?.className || ""}`,
        onClick: () => this.handleAddPage(),
      },
      {
        id: "mwc-page-share",
        icon: toolbarButtonsConfig?.share?.icon || (canSharePDF ? MWC_ICONS.sharePNG : MWC_ICONS.downloadPNG),
        label: toolbarButtonsConfig?.share?.label || (canSharePDF ? "Share" : "Download"),
        isHidden: toolbarButtonsConfig?.share?.isHidden,
        className: `${toolbarButtonsConfig?.share?.className || ""}`,
        onClick: () => handleShareOrDownload(),
      },
      {
        id: "mwc-page-upload",
        icon: toolbarButtonsConfig?.upload?.icon || MWC_ICONS.uploadPNG,
        label: toolbarButtonsConfig?.upload?.label || "Upload",
        isHidden: toolbarButtonsConfig?.upload?.isHidden || !hasExportConfig, // Hide upload btn if there's no config to export
        className: `${toolbarButtonsConfig?.upload?.className || ""}`,
        onClick: () => this.handleUpload(),
      },
      {
        id: "mwc-page-edit",
        icon: toolbarButtonsConfig?.edit?.icon || MWC_ICONS.edit,
        label: toolbarButtonsConfig?.edit?.label || "Edit",
        isHidden: toolbarButtonsConfig?.edit?.isHidden,
        className: `${toolbarButtonsConfig?.edit?.className || ""}`,
        onClick: () => this.handleEditMode(),
      },
    ];

    buttons.forEach((btn) => {
      const btnElement = this.createToolbarButton(btn);
      this.toolbarBtn[btn.id.split("-").pop() as keyof PageViewToolbarButtons] = btnElement;
      this.MWCViewElements.toolbarContainer.appendChild(btnElement);
    });

    // Edit mode buttons
    const editButtons = [
      {
        id: "mwc-page-crop",
        icon: toolbarButtonsConfig?.crop?.icon || MWC_ICONS.crop,
        label: toolbarButtonsConfig?.crop?.label || "Crop",
        isHidden: toolbarButtonsConfig?.crop?.isHidden,
        className: `${toolbarButtonsConfig?.crop?.className || ""}`,

        onClick: () => this.handleCrop(),
      },
      {
        id: "mwc-page-rotate",
        icon: toolbarButtonsConfig?.rotate?.icon || MWC_ICONS.rotate,
        label: toolbarButtonsConfig?.rotate?.label || "Rotate",
        isHidden: toolbarButtonsConfig?.rotate?.isHidden,
        className: `${toolbarButtonsConfig?.rotate?.className || ""}`,

        onClick: () => this.handleRotate(),
      },
      {
        id: "mwc-page-filter",
        icon: toolbarButtonsConfig?.filter?.icon || MWC_ICONS.filter,
        label: toolbarButtonsConfig?.filter?.label || "Filter",
        isHidden: toolbarButtonsConfig?.filter?.isHidden,
        className: `${toolbarButtonsConfig?.filter?.className || ""}`,

        onClick: () => this.handleFilter(),
      },
      {
        id: "mwc-page-annotate",
        icon: toolbarButtonsConfig?.annotate?.icon || MWC_ICONS.annotate,
        label: toolbarButtonsConfig?.annotate?.label || "Annotate",
        isHidden: toolbarButtonsConfig?.annotate?.isHidden,
        className: `${toolbarButtonsConfig?.annotate?.className || ""}`,

        onClick: () => this.handleAnnotate(),
      },
      {
        id: "mwc-page-done",
        icon: toolbarButtonsConfig?.done?.icon || MWC_ICONS.done,
        label: toolbarButtonsConfig?.done?.label || "Done",
        isHidden: toolbarButtonsConfig?.done?.isHidden,
        className: `done ${toolbarButtonsConfig?.done?.className || ""}`,
        onClick: () => this.handleDoneBtn(),
      },
    ];

    editButtons.forEach((btn) => {
      const btnElement = this.createToolbarButton(btn);
      this.toolbarBtn[btn.id.split("-").pop() as keyof PageViewToolbarButtons] = btnElement;
      this.MWCViewElements.selectedToolbarContainer.appendChild(btnElement);
    });
  }

  setVisible(visible: boolean): void {
    super.setVisible(visible);
    if (visible) {
      this.showContent(true);
      this.editViewer?.show();
    } else {
      this.editViewer?.hide();
    }
  }

  openPage(docId: string, pageIndex: number): void {
    this.editViewer.openDocument(docId);
    this.editViewer.goToPage(pageIndex);
    this.editViewer.show();
  }

  private handleBack(): void {
    this.config.onDocumentClick?.();
  }

  private async handleDeletePage(): Promise<void> {
    const confirmed = await showModal({
      container: this.config.container,
      type: ModalType.CONFIRM,
      variant: ModalVariant.WARNING,
      title: "Delete Page",
      message: "Are you sure you want to delete this page?",
      confirmText: "Delete",
      cancelText: "Cancel",
      showCloseBtn: true,
    });

    if (confirmed) {
      (this.config.container.querySelector(".ddv-delete-current") as HTMLElement).click();
    }
  }

  private handleAddPage(): void {
    const addPageBtn = this.toolbarBtn.addPage;

    // Check if menu already exists
    let menu = addPageBtn.querySelector(".mwc-add-page-menu");

    if (!menu) {
      createStyle("mwc-add-page-dropdown-style", ADD_PAGE_DROPDOWN_STYLE);

      menu = document.createElement("div");
      menu.className = "mwc-add-page-menu";
      menu.innerHTML = `
        <button class="mwc-add-page-option capture">
          ${MWC_ICONS.cameraCapture}
          <span>Capture</span>
        </button>
        <button class="mwc-add-page-option import">
          ${MWC_ICONS.galleryImport}
          <span>Import</span>
        </button>
      `;

      // Add click handlers
      const captureBtn = menu.querySelector(".capture");
      captureBtn.addEventListener("click", async (e: any) => {
        if (menu.classList.contains("show")) {
          menu.classList.remove("show");
        }
        await this.config.onCameraCapture?.();
        e.stopPropagation();
      });

      const importBtn = menu.querySelector(".import");
      importBtn.addEventListener("click", async (e: any) => {
        if (menu.classList.contains("show")) {
          menu.classList.remove("show");
        }

        await this.config.onGalleryImport?.();
        e.stopPropagation();
      });

      // Add click outside handler
      document.addEventListener("click", (e) => {
        if (!addPageBtn.contains(e.target as Node) && menu.classList.contains("show")) {
          menu.classList.remove("show");
        }
      });

      // Add menu to button
      addPageBtn.querySelector(".icon").prepend(menu);
      menu.classList.toggle("show");
    } else {
      // Toggle menu visibility
      menu.classList.toggle("show");
    }
  }

  private async handleShare() {
    try {
      const doc = this.editViewer.currentDocument;
      const currentPage = this.editViewer.getCurrentPageIndex();
      const blob = await doc.saveToPng(currentPage, {
        saveAnnotation: true,
      });
      const files = [new File([blob], `${doc.name}-${Date.now()}.png`, { type: blob.type })];

      if (navigator.canShare && navigator.canShare({ files })) {
        try {
          await navigator.share({
            files,
            title: "Image Files",
          });
        } catch (error) {
          if (error.name !== "AbortError") {
            await showToast(this.config.container, "Failed to share files", ModalVariant.ERROR);
          }
        }
      } else {
        await showToast(this.config.container, "Failed to share", ModalVariant.WARNING);
      }
    } catch (error) {
      await showToast(this.config.container, "Error processing files", ModalVariant.ERROR);
    }
  }

  private async handleDownload(): Promise<void> {
    try {
      const doc = this.editViewer.currentDocument;
      const currentPage = this.editViewer.getCurrentPageIndex();
      const blob = await doc.saveToPng(currentPage, {
        saveAnnotation: true,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.name}.png`;
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      await showToast(this.config.container, "Downloaded", ModalVariant.SUCCESS);
    } catch (ex: any) {
      const errMsg = ex?.message || ex;
      console.warn("Download failed:", errMsg);
      await showToast(this.config.container, "Failed to download page", ModalVariant.ERROR);
    }
  }

  private async handleUpload(): Promise<void> {
    if (!this.config?.exportConfig?.uploadToServer) {
      await showToast(this.config.container, "No upload function configured", ModalVariant.WARNING);
      return;
    }

    try {
      const doc = this.editViewer.currentDocument;
      const currentPage = this.editViewer.getCurrentPageIndex();
      const blob = await doc.saveToPng(currentPage, {
        saveAnnotation: true,
      });

      const fileName = `${doc.name}-${currentPage}.png`;
      const result = await this.config?.exportConfig?.uploadToServer(fileName, blob);

      if ((result as UploadedDocument)?.status === "success") {
        const shouldClose = await this.config.exportConfig?.onUploadSuccess?.(fileName, "png", EnumMWCViews.Page, blob);

        if (shouldClose) {
          this.config?.onClose();
          return;
        }

        const newList = this.config.getUploadedDocuments();
        newList.push(result as UploadedDocument);
        this.config.updateUploadedDocuments(newList);

        const confirmed = await showModal({
          container: this.config.container,
          type: ModalType.CONFIRM,
          variant: ModalVariant.SUCCESS,
          title: "Upload Successful",
          confirmText: "View in Uploads",
          cancelText: "Continue",
        });

        if (confirmed) {
          this.config.onViewUploadsHistory?.();
        }
      }
    } catch (ex: any) {
      const errMsg = ex?.message || ex;
      console.error("Upload failed:", errMsg);
      await showToast(this.config.container, "Failed to upload page", ModalVariant.ERROR);
    }
  }

  private async handleEditMode(): Promise<void> {
    try {
      const status = this.updateEditViewTopbar("edit");
      if (!status) throw new Error("Failed to update edit viewer");

      this.toggleSelectionMode(true);
    } catch (ex) {
      await showToast(this.config.container, "Failed to enter edit mode", ModalVariant.ERROR);
      console.error(ex);
    }
  }

  private updateEditViewTopbar(mode: "base" | "edit"): boolean {
    const uiConfig = this.editViewer.getUiConfig();
    uiConfig.children[0] = mobileTopBarChildrenConfig[mode] as any;
    return this.editViewer.updateUiConfig(uiConfig);
  }

  private toggleDDVHeaderButtons(enable: boolean): void {
    const headerContainer = this.config.container.querySelector(".ddv-edit-viewer-header-mobile");
    const action = enable ? "remove" : "add";
    headerContainer.childNodes.forEach((btn) => (btn as HTMLElement).classList[action]("ddv-disable-button"));
  }

  private disableOtherEditButtons(activeButton: HTMLElement): void {
    this.config.container.querySelectorAll(".mwc-view-controls-container")[1].childNodes.forEach((btn) => {
      if (btn !== activeButton && btn !== this.toolbarBtn.done) {
        (btn as HTMLElement).classList.add("ddv-disable-button");
      }
    });
  }

  private enableAllEditButtons(): void {
    this.config.container.querySelectorAll(".mwc-view-controls-container")[1].childNodes.forEach((btn) => {
      (btn as HTMLElement).classList.remove("ddv-disable-button");
    });
  }

  private handleCrop(): void {
    (this.config.container.querySelector(".ddv-button.ddv-crop") as HTMLElement).click();

    this.disableOtherEditButtons(this.toolbarBtn.crop);
    this.toolbarBtn.crop.classList.add("selected");
    this.toggleDDVHeaderButtons(false);
  }

  private handleRotate(): void {
    this.editViewer.rotate(-90);
  }

  private handleFilter(): void {
    (this.config.container.querySelector(".ddv-button.ddv-filter") as HTMLElement).click();

    if (this.isFilterMode) {
      this.isFilterMode = false;
      this.toolbarBtn.filter.classList.remove("selected");
      this.enableAllEditButtons();
    } else {
      this.isFilterMode = true;
      this.isAnnotatingMode = false;
      this.disableOtherEditButtons(this.toolbarBtn.filter);

      this.toolbarBtn.filter.classList.add("selected");
      this.toolbarBtn.annotate.classList.remove("selected");
    }
  }

  private handleAnnotate(): void {
    (this.config.container.querySelector(".mwc-annotation-set") as HTMLElement).click();

    if (this.isAnnotatingMode) {
      this.isAnnotatingMode = false;
      this.toolbarBtn.annotate.classList.remove("selected");
      this.enableAllEditButtons();
      this.editViewer.toolMode = "pan";
    } else {
      this.isAnnotatingMode = true;
      this.isFilterMode = false;
      this.disableOtherEditButtons(this.toolbarBtn.annotate);
      this.toolbarBtn.annotate.classList.add("selected");
      this.toolbarBtn.filter.classList.remove("selected");
    }
  }

  private async handleDoneBtn(): Promise<void> {
    try {
      const confirmed = await showModal({
        container: this.config.container,
        type: ModalType.CONFIRM,
        variant: ModalVariant.WARNING,
        title: "Exit Edit Mode",
        message: "You might have unsaved changes. Do you want to save before exiting?",
        confirmText: "Save & Exit",
        cancelText: "Discard",
        showCloseBtn: true,
      });

      if (confirmed === null) return;

      if (confirmed) {
        this.editViewer.saveOperations();
      } else {
        while (this.editViewer.undo()) {}
        this.editViewer.saveOperations();
      }

      // Reset all modes
      this.isAnnotatingMode = false;
      this.isFilterMode = false;
      this.toolbarBtn.annotate.classList.remove("selected");
      this.toolbarBtn.filter.classList.remove("selected");

      // Reset toolMode
      if (this.editViewer.toolMode !== "pan") {
        this.editViewer.toolMode = "pan";
      }

      const status = this.updateEditViewTopbar("base");
      if (!status) {
        throw new Error("Failed to update edit viewer");
      }

      this.toggleSelectionMode(false);
      this.enableAllEditButtons();
    } catch (ex) {
      await showToast(this.config.container, "Failed to exit edit mode", ModalVariant.ERROR);
      console.error(ex);
    }
  }

  dispose() {
    this.editViewer?.destroy();
    this.editViewer = null;

    if (this.config.container) {
      this.config.container.style.display = "none";
    }
  }
}

const DEFAULT_PAGE_VIEW_STYLE = `
.done .label {
  color: #fe8e14
}

.ddv-edit-viewer-footer-mobile{
  height: 0;
}

.ddv-annotation-mode-box,
.ddv-crop-box,
.ddv-filter-list {
  top: unset !important;
  bottom: 0;
}

.ddv-disable-button {
  opacity: 0.3;
  pointer-events: none;
}

.mwc-annotation-mode-bar {
  overflow-y: hidden;
  height: 70px;

  scrollbar-width: thin;
  scrollbar-color: rgb(193,193,193) rgb(241,241,241); 
}
.mwc-annotation-mode-bar > .ddv-button {
  height: 50px;
  width: 50px;
}

.mwc-annotation-mode-bar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  border-radius: 0px;
}

.mwc-annotation-mode-bar::-webkit-scrollbar-thumb { 
  border-radius: 0px;
  background-color: rgb(193,193,193);
}  

.mwc-annotation-mode-bar::-webkit-scrollbar-track {
  border-radius: 0px;
  background-color: rgb(241,241,241);
}

.ddv-undo-page, .ddv-redo-page {
  flex-direction: column;
}
`;

const ADD_PAGE_DROPDOWN_STYLE = `
  .mwc-view-controls-btn {
    position: relative; /* Add this to make the absolute positioning work relative to button */
  }

  .mwc-add-page-menu {
    position: absolute;
    bottom: 6rem;
    transform: translate(-50%);
    left: 50%;
    right: 50%;
    width: max-content;
    background-color: #323234;
    border-radius: 0.5rem;
    overflow: visible;
    display: none;
    margin-bottom: 0.5px; /* Add some spacing between menu and button */
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2); /* Add shadow for better visibility */
  }

  .mwc-add-page-menu::after {
    content: '';
    position: absolute;
    bottom: -8px; /* Triangle */
    left: 50%;
    right: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #323234; /* Same color as menu background */
  }

  
  .mwc-add-page-menu.show {
    display: block;
  }
  
  .mwc-add-page-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    color: white;
    background: none;
    border: none;
    cursor: pointer;
    font-family: Verdana;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
  }

  .mwc-add-page-option svg {
    width: 24px;
    height: 24px;
  }

  .mwc-add-page-option span {
    cursor: pointer;
  }
  
  .mwc-add-page-option:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .mwc-add-page-option:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;
