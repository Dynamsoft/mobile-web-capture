import { BrowseViewer, DDV, IDocument, ToolbarConfig } from "dynamsoft-document-viewer";
import { MWC_ICONS } from "./utils/icons";
import { EnumMWCViews, ExportConfig, UploadedDocument } from "./utils/types";
import { ModalType, ModalVariant, showModal, showToast } from "./components/Modal";
import MWCView, { EmptyContentConfig, ToolbarButtonConfig } from "./components/ViewCreator";
import { createStyle, isMobile } from "./utils";
import { TransferMode } from "./TransferView";

export interface DocumentToolbarButtonsConfig {
  backToLibrary?: ToolbarButtonConfig;
  capture?: ToolbarButtonConfig;
  import?: ToolbarButtonConfig;
  shareDocument?: ToolbarButtonConfig;
  uploadDocument?: ToolbarButtonConfig;
  manage?: ToolbarButtonConfig;

  // Selected Toolbar Options
  copyTo?: ToolbarButtonConfig;
  moveTo?: ToolbarButtonConfig;
  selectAll?: ToolbarButtonConfig;
  deleteImage?: ToolbarButtonConfig;
  shareImage?: ToolbarButtonConfig;
  uploadImage?: ToolbarButtonConfig;
  back?: ToolbarButtonConfig;
}

type DocumentToolbarButtons = Record<keyof DocumentToolbarButtonsConfig, HTMLElement>;

export interface DocumentViewConfig {
  container?: HTMLElement;

  groupUid?: string;
  onBackToLibrary?: () => void;
  onCameraCapture?: () => Promise<void>;
  onGalleryImport?: () => Promise<void>;
  onViewUploadsHistory?: () => void;
  onPageClick?: (docId: string, pageIndex: number) => void;
  onTransferPages?: (mode: TransferMode, docId: string, selectedIdx: number[]) => void;
  onClose: () => void;

  exportConfig?: ExportConfig;
  getUploadedDocuments?: () => UploadedDocument[];
  updateUploadedDocuments?: (files: UploadedDocument[]) => void;

  showLibraryView?: boolean;

  // For Public
  emptyContentConfig?: EmptyContentConfig;
  toolbarButtonsConfig?: DocumentToolbarButtonsConfig;
}

export class DocumentView extends MWCView {
  private documentTitle: HTMLElement = null;
  private headerRenameTitleBtn: HTMLElement = null;

  private toolbarBtn: DocumentToolbarButtons = {
    backToLibrary: null,
    capture: null,
    import: null,
    shareDocument: null,
    uploadDocument: null,
    manage: null,

    // Selected Toolbar Options
    copyTo: null,
    moveTo: null,
    selectAll: null,
    deleteImage: null,
    shareImage: null,
    uploadImage: null,
    back: null,
  };

  private headerActionBtn: {
    close: HTMLElement;
  } = {
    close: null,
  };

  browseViewer: BrowseViewer = null;
  private isDragged: boolean = false;

  constructor(protected config: DocumentViewConfig) {
    super(config);
  }

  private bindBrowseViewerEvents() {
    // Handle selected pages changes for toolbar updates
    this.browseViewer.on("selectedPagesChanged", (e) => {
      if (!this.isSelectionMode) return;

      const doc = this.browseViewer?.currentDocument;
      if (!doc) return;

      this.handlePageChecked();
    });

    // Handle click events for page navigation
    this.browseViewer.on("click", (e) => {
      if (!this.isSelectionMode) {
        if (!isMobile() && this.isDragged) {
          this.isDragged = false;
          return;
        }

        if (e.index > -1) {
          const currentDoc = this.browseViewer.currentDocument;

          if (this.config.onPageClick) {
            this.config.onPageClick(currentDoc.uid, e.index);
          }
        }
      }
    });

    this.browseViewer.on("pagesDragged", () => {
      this.isDragged = true;
    });
  }

  initialize() {
    createStyle("mwc-document-view-style", DOCUMENT_VIEW_STYLE);

    super.initialize();
    this.createBrowseViewer();
    this.bindBrowseViewerEvents();
    this.updateEmptyContentHTML();

    this.setVisible(false);
  }

  setVisible(visible: boolean) {
    super.setVisible(visible);
    const doc = this.browseViewer.currentDocument;

    if (visible) {
      const hasDoc = doc && doc.pages.length > 0;
      this.updateHeaderTitle();
      this.showContent(hasDoc);

      this.updateToolbarBtnStates();
    }
  }

  private createBrowseViewer() {
    this.browseViewer = new DDV.BrowseViewer({
      container: this.MWCViewElements.contentContainer,
      uiConfig: {
        type: DDV.Elements.Layout,
        style: { border: "none" },
        children: [DDV.Elements.MainView],
      },
      groupUid: this.config?.groupUid, // TODO
      viewerConfig: {
        canvasStyle: { background: "white" },
        checkboxStyle: {
          borderRadius: "1px",
          left: "6px",
          top: "6px",
          width: "24px",
          height: "24px",
          visibility: "hidden",
        },
        currentPageStyle: { border: "2px solid #FE8E14" },
        pageStyle: { background: "#F5F5F5" },
      },
    });

    this.browseViewer.setRowAndColumn(2, 2);
  }

  protected createHeader(): void {
    super.createHeader();

    this.MWCViewElements.headerContainer.innerHTML = `
    <div class="mwc-document-view-header">
      <div class="mwc-document-view-header-container">
        <div class="mwc-document-view-header-doc-name">Document Name</div>
        <button type="button" class="mwc-document-view-header-btn rename">
          ${MWC_ICONS.edit}
        </button>
      </div>
      <button type="button" class="mwc-document-view-header-btn close">
        ${MWC_ICONS.close}
      </button>
    </div>
    `;

    this.documentTitle = this.MWCViewElements.headerContainer.querySelector(".mwc-document-view-header-doc-name");
    this.headerRenameTitleBtn = this.MWCViewElements.headerContainer.querySelector(
      ".mwc-document-view-header-btn.rename"
    );
    this.headerRenameTitleBtn?.addEventListener("click", () => this.handleRename());

    this.headerActionBtn.close = this.MWCViewElements.headerContainer.querySelector(".close");
    this.headerActionBtn.close.addEventListener("click", () => this.handleClose());
  }

  protected updateHeaderTitle() {
    const doc = this.browseViewer?.currentDocument;
    this.documentTitle.textContent = doc?.name || "Document Name";
  }

  private async handleRename() {
    const doc = this.browseViewer.currentDocument;
    if (!doc) return;

    const newName = (await showModal({
      container: this.config.container,
      type: ModalType.INPUT,
      title: "Rename Document",
      placeholder: "Enter document name",
      initialValue: doc.name,
      confirmText: "Rename",
      validation: (value) => {
        if (value.length < 1) {
          return "Name can't be empty";
        }
        return null;
      },
    })) as string;

    if (newName) {
      doc.rename(newName);
      this.updateHeaderTitle();
      await showToast(this.config.container, "Renamed");
    }
  }

  dispose() {
    // Dispose browse viewer
    this.browseViewer?.destroy();
    this.browseViewer = null;

    // Clear document manager
    DDV.documentManager.deleteAllDocuments();

    // Hide container
    if (this.config.container) {
      this.config.container.style.display = "none";
    }
  }

  private handleClose() {
    try {
      this.config?.onClose();
    } catch (error) {
      console.error("Failed to close library view:", error);
    }
  }

  protected updateEmptyContentHTML() {
    const DEFAULT_EMPTY_DOCUMENT_VIEW = `
    <div class="mwc-default-empty-document">
      ${MWC_ICONS.emptyLibrary}
      <div class="title">Add your first page!</div>
      <div class="desc">
        <div>Option 1: Click "<b>Capture</b>" for live images</div>
        <div>Option 2: Click "<b>Import</b>" for existing images</div>
      </div>
    </div>`;

    super.setEmptyContent(this.config.emptyContentConfig || DEFAULT_EMPTY_DOCUMENT_VIEW);
  }

  protected createToolbars(): void {
    super.createToolbars();

    const { toolbarButtonsConfig, exportConfig, showLibraryView } = this.config;
    const hasExportConfig = !!exportConfig?.uploadToServer;

    // Test if it's possible to share PDF through navigator
    const testPdfFile = new File([""], "test.pdf", { type: "application/pdf" });
    const canSharePDF = "share" in navigator && navigator.canShare({ files: [testPdfFile] });
    const handleShareOrDownloadDocument = () => {
      if (canSharePDF) {
        this.handleShareDoc();
      } else {
        DocumentView.handleDownloadDoc(this.browseViewer.currentDocument, this.config.container);
      }
    };
    const handleShareOrDownloadImage = () => {
      if (canSharePDF) {
        this.handleShareImage();
      } else {
        this.handleDownloadImage();
      }
    };

    const normalButtons = [
      {
        id: "mwc-document-backToLibrary",
        icon: toolbarButtonsConfig?.backToLibrary?.icon ?? MWC_ICONS.back,
        label: toolbarButtonsConfig?.backToLibrary?.label || "Back",
        isHidden: toolbarButtonsConfig?.backToLibrary?.isHidden || !this.config.showLibraryView || false,
        className: `${toolbarButtonsConfig?.backToLibrary?.className || ""}`,
        onClick: () => this.config.onBackToLibrary?.(),
      },
      {
        id: "mwc-document-capture",
        icon: toolbarButtonsConfig?.capture?.icon || MWC_ICONS.cameraCapture,
        label: toolbarButtonsConfig?.capture?.label || "Capture",
        isHidden: toolbarButtonsConfig?.capture?.isHidden || false,
        className: `${toolbarButtonsConfig?.capture?.className || ""}`,
        onClick: () => this.config.onCameraCapture?.(),
      },
      {
        id: "mwc-document-import",
        icon: toolbarButtonsConfig?.import?.icon || MWC_ICONS.galleryImport,
        label: toolbarButtonsConfig?.import?.label || "Import",
        isHidden: toolbarButtonsConfig?.import?.isHidden || false,
        className: `${toolbarButtonsConfig?.import?.className || ""}`,
        onClick: () => this.config.onGalleryImport?.(),
      },
      {
        id: "mwc-document-shareDocument",
        icon: toolbarButtonsConfig?.shareDocument?.icon || (canSharePDF ? MWC_ICONS.sharePDF : MWC_ICONS.downloadPDF),
        label: toolbarButtonsConfig?.shareDocument?.label || (canSharePDF ? "Share" : "Download"),
        className: `${toolbarButtonsConfig?.shareDocument?.className || ""}`,
        isHidden: toolbarButtonsConfig?.shareDocument?.isHidden || false,
        onClick: () => handleShareOrDownloadDocument(),
      },
      {
        id: "mwc-document-uploadDocument",
        icon: toolbarButtonsConfig?.uploadDocument?.icon || MWC_ICONS.uploadPDF,
        label: toolbarButtonsConfig?.uploadDocument?.label || "Upload",
        className: `${toolbarButtonsConfig?.uploadDocument?.className || ""}`,
        isHidden: toolbarButtonsConfig?.uploadDocument?.isHidden || !hasExportConfig, // Hide upload btn if there's no config to export
        onClick: () => this.handleUploadDocument(),
      },
      {
        id: "mwc-document-manage",
        icon: toolbarButtonsConfig?.manage?.icon || MWC_ICONS.fileOperations,
        label: toolbarButtonsConfig?.manage?.label || "Manage",
        isHidden: toolbarButtonsConfig?.manage?.isHidden || false,
        className: `${toolbarButtonsConfig?.manage?.className || ""}`,
        onClick: () => this.handleManagePages(),
      },
    ];

    normalButtons.forEach((btn) => {
      const btnElement = this.createToolbarButton(btn);
      this.toolbarBtn[`${btn.id.split("-").pop() as keyof DocumentToolbarButtons}`] = btnElement;
      this.MWCViewElements.toolbarContainer.appendChild(btnElement);
    });

    const selectionButtons = [
      {
        id: "mwc-document-select-copyTo",
        icon: toolbarButtonsConfig?.copyTo?.icon || MWC_ICONS.copyTo,
        label: toolbarButtonsConfig?.copyTo?.label || "Copy To",
        className: `selected ${toolbarButtonsConfig?.copyTo?.className || ""}`,
        isHidden: toolbarButtonsConfig?.copyTo?.isHidden || !showLibraryView,
        onClick: () => this.handleTransferPage(TransferMode.Copy),
      },
      {
        id: "mwc-document-select-moveTo",
        icon: toolbarButtonsConfig?.moveTo?.icon || MWC_ICONS.moveTo,
        label: toolbarButtonsConfig?.moveTo?.label || "Move To",
        className: `selected ${toolbarButtonsConfig?.moveTo?.className || ""}`,
        isHidden: toolbarButtonsConfig?.moveTo?.isHidden || !showLibraryView,
        onClick: () => this.handleTransferPage(TransferMode.Move),
      },
      {
        id: "mwc-document-select-selectAll",
        icon: toolbarButtonsConfig?.selectAll?.icon || MWC_ICONS.selectAll,
        label: toolbarButtonsConfig?.selectAll?.label || "Select All",
        isHidden: toolbarButtonsConfig?.selectAll?.isHidden,
        className: `selected ${toolbarButtonsConfig?.selectAll?.className || ""}`,
        onClick: () => this.handleSelectAll(),
      },
      {
        id: "mwc-library-select-deleteImage",
        icon: toolbarButtonsConfig?.deleteImage?.icon || MWC_ICONS.delete,
        label: toolbarButtonsConfig?.deleteImage?.label || "Delete",
        className: `selected ${toolbarButtonsConfig?.deleteImage?.className || ""}`,
        isHidden: toolbarButtonsConfig?.deleteImage?.isHidden,
        onClick: () => this.handleDeleteImage(),
      },
      {
        id: "mwc-document-select-shareImage",
        icon: toolbarButtonsConfig?.shareImage?.icon || (canSharePDF ? MWC_ICONS.sharePNG : MWC_ICONS.downloadPNG),
        label: toolbarButtonsConfig?.shareImage?.label || (canSharePDF ? "Share" : "Download"),
        isHidden: toolbarButtonsConfig?.shareImage?.isHidden,
        className: `selected ${toolbarButtonsConfig?.shareImage?.className || ""}`,
        onClick: () => handleShareOrDownloadImage(),
      },
      {
        id: "mwc-document-uploadImage",
        icon: toolbarButtonsConfig?.uploadImage?.icon || MWC_ICONS.uploadPNG,
        label: toolbarButtonsConfig?.uploadImage?.label || "Upload",
        className: `selected ${toolbarButtonsConfig?.uploadImage?.className || ""}`,
        isHidden: toolbarButtonsConfig?.uploadImage?.isHidden || !hasExportConfig, // Hide upload btn if there's no config to export
        onClick: () => this.handleUploadImage(),
      },

      {
        id: "mwc-library-select-back",
        icon: toolbarButtonsConfig?.back?.icon || MWC_ICONS.back,
        label: toolbarButtonsConfig?.back?.label || "Back",
        className: `selected ${toolbarButtonsConfig?.back?.className || ""}`,
        isHidden: toolbarButtonsConfig?.back?.isHidden,
        onClick: () => this.handleSelectedBack(),
      },
    ];

    selectionButtons.forEach((btn) => {
      const btnElement = this.createToolbarButton(btn);
      this.toolbarBtn[`${btn.id.split("-").pop() as keyof DocumentToolbarButtons}`] = btnElement;
      this.MWCViewElements.selectedToolbarContainer.appendChild(btnElement);
    });
  }

  private async handleShareDoc() {
    const files = [];

    const doc = this.browseViewer.currentDocument;
    if (doc.pages.length) {
      const pdfBlob = await doc.saveToPdf({
        mimeType: "application/octet-stream",
        saveAnnotation: "annotation",
      });
      files.push(new File([pdfBlob], `${doc.name}.pdf`, { type: "application/pdf" }));
    }

    if (navigator.canShare && navigator.canShare({ files })) {
      try {
        await navigator.share({
          files,
          title: "PDF Files",
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          await showToast(this.config.container, "Failed to share files", ModalVariant.ERROR);
        }
      }
    } else {
      await showToast(this.config.container, "Your system doesn't support sharing PDF files", ModalVariant.WARNING);
    }
  }

  static async handleDownloadDoc(doc: IDocument, container: HTMLElement) {
    if (doc?.pages?.length) {
      doc
        .saveToPdf({
          mimeType: "application/octet-stream",
          saveAnnotation: "annotation",
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${doc.name}.pdf`;
          a.click();
          a.remove();
        });
    } else {
      console.warn("Failed to download. Document contains no pages");

      await showToast(container, "Document contains no pages!", ModalVariant.WARNING);
    }
  }

  protected async handleUploadDocument() {
    if (!this.config?.exportConfig?.uploadToServer) {
      console.warn("No upload function configured");
      return;
    }

    try {
      const doc = this.browseViewer.currentDocument;
      if (doc?.pages?.length) {
        const pdfBlob = await doc.saveToPdf({
          mimeType: "application/pdf",
          saveAnnotation: "annotation",
        });

        const fileName = `${doc.name}.pdf`;
        const result = await this.config?.exportConfig?.uploadToServer(fileName, pdfBlob);

        if ((result as UploadedDocument)?.status === "success") {
          const newList = this.config.getUploadedDocuments();
          newList.push(result as UploadedDocument);
          this.config.updateUploadedDocuments(newList);

          const shouldClose = await this.config.exportConfig?.onUploadSuccess?.(
            fileName,
            "pdf",
            EnumMWCViews.Page,
            pdfBlob
          );

          if (shouldClose) {
            this.config?.onClose();
            return;
          }

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
      } else {
        console.warn(`Upload failed: ${doc.name} contains no pages`);

        await showToast(this.config.container, "Document contains no pages!", ModalVariant.WARNING);
      }
    } catch (ex: any) {
      let errMsg = ex?.message || ex;
      console.error("Upload failed:", errMsg);
      await showToast(this.config.container, "Upload Failed!", ModalVariant.ERROR);
    }
  }

  protected handleManagePages() {
    this.toggleSelectionMode(true);
  }

  protected handleSelectAll() {
    const allPagesSelected =
      this.browseViewer.getSelectedPageIndices().length === this.browseViewer.currentDocument.pages.length;

    if (allPagesSelected) {
      this.browseViewer.selectPages([]);
    } else {
      this.browseViewer.selectAllPages();
    }

    this.updateToolbarBtnStates();
  }

  protected toggleSelectionMode(enabled: boolean) {
    if (this.isSelectionMode === enabled) return;

    super.toggleSelectionMode(enabled);

    this.browseViewer.multiselectMode = enabled;

    if (enabled) {
      // If entering selection mode, select current page
      const currentPageIndex = this.browseViewer.getCurrentPageIndex();
      if (currentPageIndex >= 0) {
        this.browseViewer.selectPages([currentPageIndex]);
      }
    } else {
      // Clear any existing selections
      this.browseViewer.selectPages([]);
    }

    this.browseViewer.updateStyle("checkboxStyle", {
      visibility: enabled ? "visible" : "hidden",
      border: "1px solid #707070",
    });
  }

  private handlePageChecked() {
    this.updateToolbarBtnStates();
  }

  protected updateToolbarBtnStates() {
    const doc = this.browseViewer.currentDocument;
    const emptyDoc = !doc?.pages?.length;
    const hasSelection = this.browseViewer.getSelectedPageIndices().length > 0;
    const allPagesSelected =
      this.browseViewer.getSelectedPageIndices().length === this.browseViewer.currentDocument.pages.length;

    this.toolbarBtn.selectAll.querySelector(".label").textContent = allPagesSelected ? "Cancel" : "Select All";

    this.toolbarBtn.manage.classList.toggle("disabled", emptyDoc);
    this.toolbarBtn.shareDocument.classList.toggle("disabled", emptyDoc);
    this.toolbarBtn.uploadDocument.classList.toggle("disabled", emptyDoc);

    this.toolbarBtn.copyTo.classList.toggle("disabled", !hasSelection);
    this.toolbarBtn.moveTo.classList.toggle("disabled", !hasSelection);
    this.toolbarBtn.shareImage.classList.toggle("disabled", !hasSelection);
    this.toolbarBtn.deleteImage.classList.toggle("disabled", !hasSelection);
    this.toolbarBtn.uploadImage.classList.toggle("disabled", !hasSelection);
  }

  private handleTransferPage(mode: TransferMode) {
    if (mode === TransferMode.Copy && this.toolbarBtn.copyTo.classList.contains("disabled")) {
      return;
    } else if (mode === TransferMode.Move && this.toolbarBtn.moveTo.classList.contains("disabled")) {
      return;
    }
    const currentDoc = this.browseViewer.currentDocument;
    const selectedIndex = this.browseViewer.getSelectedPageIndices();

    this.config.onTransferPages(mode, currentDoc.uid, selectedIndex);
  }

  private async handleDeleteImage() {
    if (this.toolbarBtn.deleteImage.classList.contains("disabled")) {
      return;
    }

    const selectedIndex = this.browseViewer.getSelectedPageIndices();
    if (selectedIndex.length > 0) {
      const confirmed = await showModal({
        container: this.config.container,
        type: ModalType.CONFIRM,
        variant: ModalVariant.WARNING,
        title: "Delete Pages",
        message: `Are you sure you want to delete ${selectedIndex.length} ${
          selectedIndex.length <= 1 ? "page" : "pages"
        }?`,
        confirmText: "Delete",
        cancelText: "Cancel",
        showCloseBtn: true,
      });

      if (confirmed) {
        this.browseViewer.currentDocument.deletePages(selectedIndex);
        this.showContent(this.browseViewer.currentDocument.pages.length !== 0);
        this.updateToolbarBtnStates();

        await showToast(this.config.container, "Deleted", ModalVariant.SUCCESS);
      }
    }
  }

  private async handleShareImage() {
    try {
      const doc = this.browseViewer.currentDocument;
      const selectedPages = this.browseViewer.getSelectedPageIndices();

      const blobs = await Promise.all(selectedPages.map((page) => doc.saveToPng(page, { saveAnnotation: true })));

      const files = blobs.map(
        (blob, index) => new File([blob], `${doc.name}-${selectedPages[index]}-${Date.now()}.png`, { type: blob.type })
      );

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

  private async handleDownloadImage() {
    const doc = this.browseViewer.currentDocument;
    const selectedPages = this.browseViewer.getSelectedPageIndices();

    try {
      selectedPages.forEach(async (page, i) => {
        const blob = await doc.saveToPng(page, {
          saveAnnotation: true,
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${doc.name}-${selectedPages[i]}-${Date.now()}.png`;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });

      await showToast(this.config.container, "Downloaded", ModalVariant.SUCCESS);
    } catch (ex: any) {
      const errMsg = ex?.message || ex;
      console.warn("Download failed:", errMsg);
      await showToast(this.config.container, "Failed to download page", ModalVariant.ERROR);
    }
  }

  private async handleUploadImage() {
    if (!this.config?.exportConfig?.uploadToServer) {
      console.warn("No upload function configured");
      return;
    }

    try {
      const doc = this.browseViewer.currentDocument;
      const selectedPages = this.browseViewer.getSelectedPageIndices();

      const uploadPromises = selectedPages.map(async (page, i) => {
        const pngData = await doc.saveToPng(page, {
          saveAnnotation: true,
        });

        const fileName = `${doc.name}-${selectedPages[i]}-${Date.now()}.png`;
        const blob = new Blob([pngData], { type: "image/png" });

        const result = await this.config?.exportConfig?.uploadToServer(fileName, blob);

        if ((result as UploadedDocument)?.status === "success") {
          const newList = this.config.getUploadedDocuments();
          newList.push(result as UploadedDocument);
          this.config.updateUploadedDocuments(newList);

          const shouldClose = await this.config.exportConfig?.onUploadSuccess?.(
            fileName,
            "png",
            EnumMWCViews.Document,
            blob
          );

          if (shouldClose) {
            this.config?.onClose();
            return;
          }
        }

        return result;
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results?.filter(
        (r) => (r as UploadedDocument)?.status === "success"
      ) as UploadedDocument[];

      if (successfulUploads.length) {
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
      let errMsg = ex?.message || ex;
      console.error("Upload failed:", errMsg);
      await showToast(this.config.container, "Upload Failed!", ModalVariant.ERROR);
    }
  }

  handleSelectedBack() {
    this.toggleSelectionMode(false);
  }
}

const DOCUMENT_VIEW_STYLE = `
  .mwc-document-view-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    width: 100%;
        color: black;
  }

  .mwc-document-view-header-btn {
    border: none;
    background: transparent;
    display: flex;
    align-content: center;
    cursor: pointer;
  }

  .mwc-document-view-header-btn.rename{
    width: 30px;
    height: 30px;
  }

  .mwc-document-view-header-container {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    max-width: calc(100% - 4rem);
  }

  .mwc-document-view-header-container .mwc-document-view-header-doc-name {
    font-family: Verdana;
    font-size: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;
  }

  .mwc-default-empty-document {
    display: flex;
    flex-direction: column;
    justify-content:center;
    align-items: center;
    gap: 1rem;
  }

  .mwc-default-empty-document svg {
    width: 200px;
    height: auto;
  }

  .mwc-default-empty-document .title {
    margin-top: 2rem;
    font-size: 24px;
        color: black;
  }

  .mwc-default-empty-document .desc {
    font-size: 16px;
    color: black;
  }
`;
