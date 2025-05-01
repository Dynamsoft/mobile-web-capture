import { DDV } from "dynamsoft-document-viewer";
import { DocumentItem } from "./components/DocumentItem";
import { MWC_ICONS } from "./utils/icons";
import { DocumentView } from "./DocumentView";
import { EnumMWCViews, ExportConfig, UploadedDocument } from "./utils/types";
import { ModalType, ModalVariant, showModal, showToast } from "./components/Modal";
import MWCView, { EmptyContentConfig, ToolbarButtonConfig } from "./components/ViewCreator";
import { createStyle } from "./utils";

export interface LibraryToolbarButtonsConfig {
  newDoc?: ToolbarButtonConfig;
  capture?: ToolbarButtonConfig;
  import?: ToolbarButtonConfig;
  uploads?: ToolbarButtonConfig;

  // Selected Toolbar Options
  delete?: ToolbarButtonConfig;
  print?: ToolbarButtonConfig;
  share?: ToolbarButtonConfig;
  upload?: ToolbarButtonConfig;
  back?: ToolbarButtonConfig;
}

type LibraryToolbarButtons = Record<keyof LibraryToolbarButtonsConfig, HTMLElement>;

export interface LibraryViewConfig {
  container?: HTMLElement;
  onCameraCapture?: () => Promise<void>;
  onGalleryImport?: () => Promise<void>;
  onDocumentClick?: (docId: string) => void;
  onViewUploadsHistory?: () => void;
  onClose: () => void;

  exportConfig?: ExportConfig;
  getUploadedDocuments?: () => UploadedDocument[];
  updateUploadedDocuments?: (files: UploadedDocument[]) => void;

  showLibraryView?: boolean;

  // For Public
  emptyContentConfig?: EmptyContentConfig;
  toolbarButtonsConfig?: LibraryToolbarButtonsConfig;
}

interface LibraryHeaderAction {
  close: HTMLElement;
  cancel: HTMLElement;
  selectAll: HTMLElement;
}

export class LibraryView extends MWCView {
  private headerTitle: HTMLElement = null;
  private headerActionBtn: LibraryHeaderAction = {
    close: null,
    cancel: null,
    selectAll: null,
  };
  private toolbarBtn: LibraryToolbarButtons = {
    newDoc: null,
    capture: null,
    import: null,
    uploads: null,
    delete: null,
    print: null,
    share: null,
    upload: null,
    back: null,
  };

  checkedDocUids: string[] = [];
  docItems: DocumentItem[] = [];

  constructor(protected config: LibraryViewConfig) {
    super(config);
  }

  private bindDocumentManagerEvents() {
    DDV.documentManager.on("documentCreated", (e) => {
      const docItem = new DocumentItem({
        docId: e.docUid,
        onCheckedChange: () => this.handleDocumentChecked(),
        onDocumentClick: (docId) => {
          if (!this.isSelectionMode) {
            this.handleDocumentClick(docId);
          }
        },
        onRename: (docId) => this.handleRename(docId),
      });

      // Add to start of array
      this.docItems.unshift(docItem);

      // Insert at beginning of container
      if (this.MWCViewElements.contentContainer.firstChild) {
        this.MWCViewElements.contentContainer.insertBefore(
          docItem.getDom(),
          this.MWCViewElements.contentContainer.firstChild
        );
      } else {
        this.MWCViewElements.contentContainer.appendChild(docItem.getDom());
      }
    });

    DDV.documentManager.on("documentDeleted", (e) => {
      this.docItems.forEach((item, index) => {
        if (item.getUid() === e.docUid) {
          item.dispose();
          this.docItems.splice(index, 1);
        }
      });
    });
  }

  initialize() {
    createStyle("mwc-library-view-style", LIBRARY_VIEW_STYLE);

    super.initialize();
    this.bindDocumentManagerEvents();
    this.updateEmptyContentHTML();

    this.setVisible(false);
  }

  setVisible(visible?: boolean) {
    super.setVisible(visible);
    this.updateToolbarState();

    if (visible) {
      if (visible) {
        const docs = DDV.documentManager.getAllDocuments();
        const docCount = docs.length;

        this.showContent(!!docCount);

        if (docCount) {
          this.docItems.forEach((item) => {
            item.update();
          });
        }
      }
    }
  }

  protected createHeader(): void {
    super.createHeader();

    this.MWCViewElements.headerContainer.innerHTML = `
      <div class="mwc-view-header-title">Library</div>
      <div class="mwc-view-header-actions">
        <button type="button" class="mwc-library-header-btn selectAll">Select All</button>
        <button type="button" class="mwc-library-header-btn cancel">Cancel</button>
        <button type="button" class="mwc-library-header-btn close">
          ${MWC_ICONS.close}
        </button>
      </div>
    `;

    this.headerTitle = this.MWCViewElements.headerContainer.querySelector(".mwc-view-header-title");

    this.headerActionBtn.close = this.MWCViewElements.headerContainer.querySelector(".close");
    this.headerActionBtn.close.addEventListener("click", () => this.handleClose());

    this.headerActionBtn.cancel = this.MWCViewElements.headerContainer.querySelector(".cancel");
    this.headerActionBtn.cancel.addEventListener("click", () => this.handleSelectAllOrCancel(true));

    this.headerActionBtn.selectAll = this.MWCViewElements.headerContainer.querySelector(".selectAll");
    this.headerActionBtn.selectAll.addEventListener("click", () => this.handleSelectAllOrCancel(false));

    this.updateHeaderActionBtnStyle();
  }

  private updateHeaderActionBtnStyle() {
    if (this.isSelectionMode) {
      this.headerTitle.textContent = "Select Items";

      this.headerActionBtn.close.style.display = "none";

      const allSelected = this.docItems.every((item) => item.checked);
      this.headerActionBtn.selectAll.style.display = allSelected ? "none" : "flex";
      this.headerActionBtn.cancel.style.display = allSelected ? "flex" : "none";
    } else {
      this.headerTitle.textContent = "Library";

      this.headerActionBtn.close.style.display = "block";
      this.headerActionBtn.selectAll.style.display = "none";
      this.headerActionBtn.cancel.style.display = "none";
    }
  }

  protected updateEmptyContentHTML() {
    const DEFAULT_EMPTY_LIBRARY_VIEW = `
    <div class="mwc-default-empty-library">
      ${MWC_ICONS.emptyLibrary}
      <div class="title">
        Create your first document!
      </div>
      <div class="desc">
        <div>
          Option 1: Click "<b>New</b>" to create a blank document
        </div>
        <div>
          Option 2: Click "<b>Capture</b>" or "<b>Import</b>" to use images
        </div>
      </div>
    </div>
    `;
    super.setEmptyContent(this.config.emptyContentConfig || DEFAULT_EMPTY_LIBRARY_VIEW);
  }

  private handleClose() {
    try {
      this.config.onClose();
    } catch (error) {
      console.error("Failed to close library view:", error);
    }
  }

  dispose() {
    // Dispose all document items
    this.docItems.forEach((item) => item.dispose());
    this.docItems = [];

    // Clear document manager
    DDV.documentManager.deleteAllDocuments();
  }

  protected toggleSelectionMode(enabled: boolean) {
    if (this.isSelectionMode === enabled) return;

    super.toggleSelectionMode(enabled);

    // Update Header Styles
    this.updateHeaderActionBtnStyle();

    // Set select mode for each item to allow clicking the container to select
    this.docItems.forEach((item) => item.setSelectMode(this.isSelectionMode));
  }

  private handleSelectAllOrCancel(cancel?: boolean) {
    if (cancel) {
      this.docItems.forEach((item) => item.toggleCheck(false));
      this.checkedDocUids = [];

      this.toggleSelectionMode(false);
      return;
    }

    // Select All
    this.docItems.forEach((item) => {
      item.toggleCheck(true);
    });

    this.updateHeaderActionBtnStyle();
  }

  private handleDocumentChecked() {
    this.checkedDocUids = this.docItems.filter((item) => item.checked).map((item) => item.getUid());

    const hasChecked = this.checkedDocUids.length > 0;

    // Only update mode if it's changing
    this.toggleSelectionMode(hasChecked);
    this.updateHeaderActionBtnStyle();

    // Update toolbar settings
    const hasEmptyDocs = this.checkedDocUids.some((uid) => {
      const doc = DDV.documentManager.getDocument(uid);
      return !doc?.pages?.length;
    });
    const isSingleDocument = this.checkedDocUids.length === 1;

    this.toolbarBtn.print?.classList.toggle("disabled", !isSingleDocument || hasEmptyDocs);
    this.toolbarBtn.upload?.classList.toggle("disabled", hasEmptyDocs);
    this.toolbarBtn.share?.classList.toggle("disabled", hasEmptyDocs);
  }

  private handleDocumentClick(docId: string) {
    this.config.onDocumentClick?.(docId);
  }

  private handleRename(docId: string) {
    const doc = DDV.documentManager.getDocument(docId);
    if (!doc) return;

    showModal({
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
    }).then(async (result: string) => {
      if (result) {
        doc.rename(result);
        const docItem = this.docItems.find((item) => item.getUid() === docId);
        docItem?.update();
        await showToast(this.config.container, "Renamed", ModalVariant.SUCCESS);
      }
    });
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

    const normalButtons = [
      {
        id: "mwc-lbrary-newDoc",
        icon: toolbarButtonsConfig?.newDoc?.icon || MWC_ICONS.newDoc,
        label: toolbarButtonsConfig?.newDoc?.label || "New",
        className: toolbarButtonsConfig?.newDoc?.className || "",
        isHidden: toolbarButtonsConfig?.newDoc?.isHidden,
        onClick: () => this.handleNewDocument(),
      },
      {
        id: "mwc-lbrary-capture",
        icon: toolbarButtonsConfig?.capture?.icon || MWC_ICONS.cameraCapture,
        label: toolbarButtonsConfig?.capture?.label || "Capture",
        className: toolbarButtonsConfig?.capture?.className || "",
        isHidden: toolbarButtonsConfig?.capture?.isHidden,
        onClick: () => this.handleCameraCapture(),
      },
      {
        id: "mwc-lbrary-import",
        icon: toolbarButtonsConfig?.import?.icon || MWC_ICONS.galleryImport,
        label: toolbarButtonsConfig?.import?.label || "Import",
        className: toolbarButtonsConfig?.import?.className || "",
        isHidden: toolbarButtonsConfig?.import?.isHidden,
        onClick: () => this.handleGalleryImport(),
      },
      {
        id: "mwc-lbrary-uploads",
        icon: toolbarButtonsConfig?.uploads?.icon || MWC_ICONS.uploadedFiles,
        label: toolbarButtonsConfig?.uploads?.label || "Uploads",
        className: toolbarButtonsConfig?.uploads?.className || "",
        isHidden: toolbarButtonsConfig?.uploads?.isHidden || !hasExportConfig, // Hide upload btn if there's no config to export
        onClick: () => this.handleViewUploadsHistory(),
      },
    ];

    normalButtons.forEach((btn) => {
      const btnElement = this.createToolbarButton(btn);
      this.toolbarBtn[`${btn.id.split("-").pop() as keyof LibraryToolbarButtons}`] = btnElement;
      this.MWCViewElements.toolbarContainer.appendChild(btnElement);
    });

    // Add selection mode buttons
    const selectionButtons = [
      {
        id: "mwc-library-select-delete",
        icon: toolbarButtonsConfig?.delete?.icon || MWC_ICONS.delete,
        label: toolbarButtonsConfig?.delete?.label || "Delete",
        className: `selected ${toolbarButtonsConfig?.delete?.className || ""}`,
        isHidden: toolbarButtonsConfig?.delete?.isHidden,
        onClick: () => this.handleDelete(),
      },
      {
        id: "mwc-library-select-print",
        icon: toolbarButtonsConfig?.print?.icon || MWC_ICONS.print,
        label: toolbarButtonsConfig?.print?.label || "Print",
        className: `selected ${toolbarButtonsConfig?.print?.className || ""}`,
        isHidden: toolbarButtonsConfig?.print?.isHidden,
        onClick: () => this.handlePrint(),
      },
      {
        id: "mwc-library-select-share",
        icon: toolbarButtonsConfig?.share?.icon || (canSharePDF ? MWC_ICONS.sharePDF : MWC_ICONS.downloadPDF),
        label: toolbarButtonsConfig?.share?.label || (canSharePDF ? "Share" : "Download"),
        className: `selected ${toolbarButtonsConfig?.share?.className || ""}`,
        isHidden: toolbarButtonsConfig?.share?.isHidden,
        onClick: () => handleShareOrDownload(),
      },
      {
        id: "mwc-library-select-upload",
        icon: toolbarButtonsConfig?.upload?.icon || MWC_ICONS.uploadPDF,
        label: toolbarButtonsConfig?.upload?.label || "Upload",
        className: `selected ${toolbarButtonsConfig?.upload?.className || ""}`,
        isHidden: toolbarButtonsConfig?.upload?.isHidden || !hasExportConfig, // Hide upload btn if there's no config to export
        onClick: () => this.handleUploadDocuments(),
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
      this.toolbarBtn[`${btn.id.split("-").pop() as keyof LibraryToolbarButtons}`] = btnElement;
      this.MWCViewElements.selectedToolbarContainer.appendChild(btnElement);
    });
  }

  private async handleNewDocument() {
    const result = (await showModal({
      container: this.config.container,
      type: ModalType.INPUT,
      title: "New Document",
      placeholder: "Enter document name",
      confirmText: "Create",
    })) as string;

    if (result) {
      const doc = await this.createAndLoadDocument(result || `Doc-${Date.now()}`);
      if (doc) {
        this.setVisible(true);
        await showToast(this.config.container, "Created", ModalVariant.SUCCESS);
      }
    }
  }

  async createAndLoadDocument(
    name: string,
    sources?: Array<{
      convertMode: string;
      fileData: Blob;
      renderOptions?: {
        renderAnnotations?: string;
      };
    }>
  ) {
    try {
      // Create new document
      const doc = DDV.documentManager.createDocument({
        name: name || `Doc-${Date.now()}`,
      });

      // Load all sources
      if (sources) {
        await doc.loadSource(sources);
      }

      return doc;
    } catch (ex: any) {
      let errMsg = ex.message || ex;
      alert(`Failed to create and load document: ${errMsg}`);
      console.error("Failed to create and load document: ", errMsg);
    }
  }

  private async handleCameraCapture() {
    await this.config.onCameraCapture();
  }

  private async handleGalleryImport() {
    await this.config.onGalleryImport();
  }

  private async handleViewUploadsHistory() {
    this.config?.onViewUploadsHistory();
  }

  private async handleDelete() {
    const confirmed = await showModal({
      container: this.config.container,
      type: ModalType.CONFIRM,
      variant: ModalVariant.WARNING,
      title: "Delete Documents",
      message: `Are you sure you want to delete ${this.checkedDocUids.length} document(s)?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      showCloseBtn: true,
    });

    if (confirmed) {
      DDV.documentManager.deleteDocuments([...this.checkedDocUids]);
      this.setVisible(true);
      this.toggleSelectionMode(false);

      await showToast(this.config.container, "Deleted", ModalVariant.SUCCESS);
    }
  }

  private async handlePrint() {
    if (this.checkedDocUids.length > 1 || this.toolbarBtn.print?.classList.contains("disabled")) {
      console.warn("Please select 1 document to print");
      return;
    }

    const docUid = this.checkedDocUids[0];
    const doc = DDV.documentManager.getDocument(docUid);

    if (doc?.pages?.length) {
      doc.print();
    }
  }

  private async handleShare() {
    const files = [];

    for (let i = 0; i < this.checkedDocUids.length; i++) {
      const doc = DDV.documentManager.getDocument(this.checkedDocUids[i]);
      if (doc.pages.length) {
        const pdfBlob = await doc.saveToPdf({
          mimeType: "application/octet-stream",
          saveAnnotation: "annotation",
          quality: 100,
        });
        files.push(new File([pdfBlob], `${doc.name}.pdf`, { type: "application/pdf" }));
      }
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

  private async handleDownload() {
    this.checkedDocUids.forEach(async (uid) => {
      const doc = DDV.documentManager.getDocument(uid);
      if (doc?.pages?.length) {
        await DocumentView.handleDownloadDoc(doc, this.config.container);
      }
    });
  }

  private async handleUploadDocuments() {
    if (!this.config?.exportConfig?.uploadToServer) {
      await showToast(this.config.container, "No upload function configured", ModalVariant.WARNING);
      return;
    }

    try {
      const uploadPromises = this.checkedDocUids.map(async (uid) => {
        const doc = DDV.documentManager.getDocument(uid);
        if (doc?.pages?.length) {
          const pdfBlob = await doc.saveToPdf({
            mimeType: "application/pdf",
            saveAnnotation: "annotation",
            quality: 100,
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
              EnumMWCViews.Library,
              pdfBlob
            );

            if (shouldClose) {
              this.config?.onClose();
              return;
            }
          }

          return result;
        } else {
          await showToast(this.config.container, "Document contains no pages!", ModalVariant.WARNING);
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results?.filter(
        (r) => (r as UploadedDocument)?.status === "success"
      ) as UploadedDocument[];

      if (successfulUploads.length) {
        // Clear selection
        this.handleSelectAllOrCancel(true);

        const confirmed = await showModal({
          container: this.config.container,
          type: ModalType.CONFIRM,
          variant: ModalVariant.SUCCESS,
          title: "Upload Successful",
          confirmText: "View in Uploads",
          cancelText: "Continue",
        });

        if (confirmed) {
          this.handleViewUploadsHistory();
        }
      }
    } catch (ex: any) {
      let errMsg = ex?.message || ex;
      console.error("Uploads failed:", errMsg);

      const confirmed = await showModal({
        container: this.config.container,
        type: ModalType.CONFIRM,
        variant: ModalVariant.ERROR,
        title: "Uploads Failed",
        confirmText: "View Uploaded Files",
        cancelText: "Continue",
      });

      if (confirmed) {
        this.handleViewUploadsHistory();
      }
    }
  }

  private async handleSelectedBack() {
    this.handleSelectAllOrCancel(true);
  }
}

const LIBRARY_VIEW_STYLE = `
  .mwc-view-header-actions {
    position: absolute;
    right: 1rem;
    font-family: Verdana;
    color: black;
  }

  .mwc-view-header-actions .mwc-library-header-btn {
    border: none;
    background: transparent;
    display: flex;
    align-content: center;
    cursor: pointer;
  }

  .mwc-view-header-actions .mwc-library-header-btn.selectAll,
  .mwc-view-header-actions .mwc-library-header-btn.cancel{
    background: none;
    border: none;
    color: #FE8E14;
    font-size: 14px;
    cursor: pointer;
    padding: 4px 8px;
    align-content: end;
  }

  .mwc-default-empty-library {
    display: flex;
    flex-direction: column;
    justify-content:center;
    align-items: center;
    gap: 1rem;
  }

  .mwc-default-empty-library svg {
    width: 200px;
    height: auto;
  }

  .mwc-default-empty-library .title {
    margin-top: 2rem;
    font-size: 24px;
    color: black;
  }

  .mwc-default-empty-library .desc {
    font-size: 16px;
    color: black;
  }
`;
