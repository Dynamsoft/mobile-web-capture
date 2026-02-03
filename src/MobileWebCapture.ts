import { DDV } from "dynamsoft-document-viewer";
import { LibraryView, LibraryViewConfig } from "./views/LibraryView";
import {
  DocumentScannerConfig,
  EnumResultStatus,
  DocumentScanner,
  DocumentScannerViewConfig,
  DocumentResultViewConfig,
  DocumentCorrectionViewConfig,
} from "dynamsoft-document-scanner";
import { PageView, PageViewConfig } from "./views/PageView";
import { DocumentView, DocumentViewConfig } from "./views/DocumentView";
import { TransferMode, TransferView, TransferViewConfig } from "./views/TransferView";
import { createStyle, getElement, getFileNameWithoutExtension, isEmptyObject } from "./views/utils";
import { EnumAllViews, EnumMWCStartingViews, EnumMWCViews, ExportConfig, UploadedDocument } from "./views/utils/types";
import { DEFAULT_LOADING_SCREEN_STYLE, showLoadingScreen } from "./views/components/LoadingScreen";
import { ModalVariant, showToast } from "./views/components/Modal";
import { HistoryCallerView, HistoryView, HistoryViewConfig } from "./views/HistoryView";

const DEFAULT_DDV_CSS_ID = "mwc-ddv-css";
const DEFAULT_DDV_CSS_FILE = "ddv.css";
const DEFAULT_DDV_ENGINE_RESOURCE_PATH_FOLDER = "engine";
const DEFAULT_DDV_RESOURCE_PATH = "https://cdn.jsdelivr.net/npm/dynamsoft-document-viewer@3.2.0/dist";
const DEFAULT_CONTAINER_HEIGHT = "100dvh";

export interface MWCScanner {
  initialize(): Promise<any>;
  launch(): Promise<any>;
  dispose(): void;
}

type MWCViewMapping = {
  [EnumMWCViews.Library]: {
    instance?: LibraryView;
    config: LibraryViewConfig;
  };
  [EnumMWCViews.Document]: {
    instance?: DocumentView;
    config: DocumentViewConfig;
  };
  [EnumMWCViews.Page]: {
    instance?: PageView;
    config: PageViewConfig;
  };
  [EnumMWCViews.Transfer]: {
    instance?: TransferView;
    config: TransferViewConfig;
  };
  [EnumMWCViews.History]: {
    instance?: HistoryView;
    config: HistoryViewConfig;
  };
  // TODO
  [EnumMWCViews.Scanner]: {
    instance?: any;
    config: any;
  };
};

type MWCView<T extends EnumMWCViews> = MWCViewMapping[T];

export interface MobileWebCaptureConfig {
  license?: string;
  container?: HTMLElement | string;
  ddvResourcePath?: string;

  exportConfig?: ExportConfig;
  showLibraryView?: boolean;
  onClose?: () => void;

  // View Configs
  libraryViewConfig?: Pick<LibraryViewConfig, "container" | "toolbarButtonsConfig">;
  documentViewConfig?: Pick<DocumentViewConfig, "container" | "toolbarButtonsConfig">;
  pageViewConfig?: Pick<PageViewConfig, "container" | "toolbarButtonsConfig">;
  transferViewConfig?: Pick<TransferViewConfig, "container" | "toolbarButtonsConfig">;
  historyViewConfig?: Pick<HistoryViewConfig, "container" | "toolbarButtonsConfig">;

  // General Scanner
  scanner?: MWCScanner;

  // DDS Config (still keep this for backward compatibility)
  documentScannerConfig?: Omit<DocumentScannerConfig, "container" | "license"> & {
    scannerViewConfig?: Omit<
      DocumentScannerViewConfig,
      "container" | "templateFilePath" | "utilizedTemplateNames" | "_showCorrectionView"
    >;
    resultViewConfig?: Omit<DocumentResultViewConfig, "container">;
    correctionViewConfig?: Omit<
      DocumentCorrectionViewConfig,
      "container" | "templateFilePath" | "utilizedTemplateNames" | "_showCorrectionView"
    >;
  };
}

class MobileWebCapture {
  // private documentScanner: DocumentScanner;
  private scanner: MWCScanner;

  private mwcViews: { [K in EnumMWCViews]: MWCView<K> };
  private currentView: EnumMWCViews = null;

  private uploadedFiles: UploadedDocument[] = [];

  private isInitialized = false;
  private isUsingDefaultContainer = false;
  private hasLaunched = false;

  private loadingScreen: ReturnType<typeof showLoadingScreen> | null = null;
  private showMWCLoadingOverlay(message?: string) {
    const container = getElement(this.config.container);
    this.loadingScreen = showLoadingScreen(container, { message });
  }

  private hideMWCLoadingOverlay() {
    if (this.loadingScreen) {
      this.loadingScreen.hide();
      this.loadingScreen = null;
    }
  }

  constructor(private config: MobileWebCaptureConfig) {}

  // TODO - any
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Setup MWC + DDS views
      this.setupMWCViews();

      // Show loading screen
      createStyle("mwc-loading-screen-style", DEFAULT_LOADING_SCREEN_STYLE);
      this.showMWCLoadingOverlay("Initializing");

      // Initialize DDS (Initialize DDS first to avoid DDV trial banner from showing)
      if (this.scanner) {
        await this.scanner.initialize();
      }

      // Initialize DDV resources
      await this.loadDDVcss();
      DDV.Core.license = this.config.license;
      DDV.Core.engineResourcePath = `${
        this.config?.ddvResourcePath || DEFAULT_DDV_RESOURCE_PATH
      }/${DEFAULT_DDV_ENGINE_RESOURCE_PATH_FOLDER}`;

      await this.initializeDDV();

      // Initialize MWC Views
      this.initializeMWCViews();
      this.isInitialized = true;
    } catch (ex) {
      this.isInitialized = false;
      const errMsg = ex?.message || ex;
      console.error(errMsg);
      throw new Error(errMsg);
    } finally {
      this.hideMWCLoadingOverlay();
    }
  }

  async launch(file?: File | string, view?: EnumMWCStartingViews) {
    try {
      if (this.hasLaunched) {
        throw new Error("Failed to launch this MobileWebCapture instance as it is already running");
      }

      this.hasLaunched = true;

      if (!this.isInitialized) {
        await this.initialize();
      }

      // Case 1: Launch with file (either File object or string filename)
      if (file) {
        if (file instanceof File) {
          // Handle File object
          if (view === EnumMWCViews.Library && this.config.showLibraryView) {
            await this.createDocumentFromFile(file, EnumMWCViews.Library);
          } else {
            await this.createDocumentFromFile(file, EnumMWCViews.Document);
          }
        } else if (typeof file === "string") {
          // Handle string filename
          if (view === EnumMWCViews.Library && this.config.showLibraryView) {
            await this.createDocumentFromName(file, EnumMWCViews.Library);
          } else {
            await this.createDocumentFromName(file, EnumMWCViews.Document);
          }
        }
        return;
      }

      // Case 2: Launch without file
      if (!file) {
        // Handle explicit view requests
        if (view === EnumMWCViews.Library) {
          // Always honor explicit library view request, even if showLibraryView is false
          await this.handleDefaultLaunch(EnumMWCViews.Library);
        } else if (view === EnumMWCViews.Document) {
          // Create empty document when document view is explicitly requested
          await this.createDocumentFromName(`Doc-${Date.now()}`, EnumMWCViews.Document);
        } else {
          // Default behavior based on showLibraryView
          if (this.config.showLibraryView) {
            await this.handleDefaultLaunch(EnumMWCViews.Library);
          } else {
            await this.createDocumentFromName(`Doc-${Date.now()}`, EnumMWCViews.Document);
          }
        }
      }
    } catch (ex: any) {
      const errMsg = ex?.message || ex;
      this.dispose();
      throw new Error(`Launch MWC Failed: ${errMsg}`);
    }
  }

  private async createDocumentFromFile(file: File, view?: EnumMWCStartingViews) {
    const docName = getFileNameWithoutExtension(file?.name);
    const sources = [
      {
        convertMode: "cm/auto",
        fileData: new Blob([file], {
          type: file.type,
        }),
        renderOptions: {
          renderAnnotations: "loadAnnotations",
        },
      },
    ];

    if (this.config.showLibraryView) {
      const doc = await (this.mwcViews.library.instance as LibraryView).createAndLoadDocument(docName, sources);

      if (view === EnumMWCViews.Document) {
        this.handleDocumentClick(doc.uid);
      } else {
        this.switchView(view || EnumMWCViews.Library);
      }
    } else {
      const doc = DDV.documentManager.createDocument({
        name: docName,
      });
      await doc.loadSource(sources);
      this.handleDocumentClick(doc.uid);
    }
  }

  private async createDocumentFromName(name: string, view?: EnumMWCStartingViews) {
    const docName = getFileNameWithoutExtension(name);

    if (this.config.showLibraryView) {
      const doc = await (this.mwcViews.library.instance as LibraryView).createAndLoadDocument(docName);

      if (view === EnumMWCViews.Document) {
        this.handleDocumentClick(doc.uid);
      } else {
        this.switchView(view || EnumMWCViews.Library);
      }
    } else {
      const doc = DDV.documentManager.createDocument({
        name: docName,
      });
      this.handleDocumentClick(doc.uid);
    }
  }

  private async handleDefaultLaunch(view?: EnumMWCStartingViews) {
    if (!this.config.showLibraryView) {
      try {
        // Create new document in DDV with default name
        const doc = DDV.documentManager.createDocument({
          name: `Doc-${Date.now()}`,
        });

        // Get instance and open document
        const documentView = this.mwcViews[EnumMWCViews.Document].instance as DocumentView;
        documentView.browseViewer.openDocument(doc.uid);

        // Switch to document view
        this.switchView(EnumMWCViews.Document);

        // Show toast to inform user they can start adding pages
        await showToast(
          this.mwcViews[EnumMWCViews.Document].config.container,
          "Document Created",
          ModalVariant.SUCCESS
        );
      } catch (error) {
        throw new Error(`Failed to create empty document: ${error.message}`);
      }
      return;
    }

    this.switchView(view || EnumMWCViews.Library);
  }

  private setupMWCViews() {
    const {
      license,
      exportConfig,

      showLibraryView,
    } = this.config;

    this.config.license = this.checkForTemporaryLicense(license);

    // If users provide container through DDS, create the containers for them
    if (!this.config.container) {
      this.config.container = this.createDefaultMWCContainer();
    } else {
      this.config.container = getElement(this.config.container);
      this.config.container.style.position =
        this.config.container?.style?.position !== "absolute" && this.config.container?.style?.position !== "fixed"
          ? "relative"
          : this.config.container?.style?.position;
    }

    const viewContainers = this.createMWCViewContainers(this.config.container);

    // Update MWC containers in config for each views
    this.config.libraryViewConfig = {
      ...this.config.libraryViewConfig,
      container: viewContainers[EnumAllViews.Library],
    };
    this.config.documentViewConfig = {
      ...this.config.documentViewConfig,
      container: viewContainers[EnumAllViews.Document],
    };
    this.config.pageViewConfig = {
      ...this.config.pageViewConfig,
      container: viewContainers[EnumAllViews.Page],
    };
    this.config.transferViewConfig = {
      ...this.config.transferViewConfig,
      container: viewContainers[EnumAllViews.Transfer],
    };
    this.config.historyViewConfig = {
      ...this.config.historyViewConfig,
      container: viewContainers[EnumAllViews.History],
    };

    // Update DDS containers in config
    if (!this.config.scanner) {
      this.config.documentScannerConfig = {
        ...this.config.documentScannerConfig,
        scannerViewConfig: {
          ...this.config.documentScannerConfig?.scannerViewConfig,
          container: viewContainers[EnumAllViews.Scanner],
        },
        ...(this.config.documentScannerConfig?.showResultView !== false && {
          resultViewConfig: {
            ...this.config.documentScannerConfig?.resultViewConfig,
            container: viewContainers[EnumAllViews.ScanResult],
          },
        }),
        ...(this.config.documentScannerConfig?.showCorrectionView !== false && {
          correctionViewConfig: {
            ...this.config.documentScannerConfig?.correctionViewConfig,
            container: viewContainers[EnumAllViews.Correction],
          },
        }),
        correctionViewConfig: {
          ...this.config.documentScannerConfig?.scannerViewConfig,
          container: viewContainers[EnumAllViews.Correction],
        },
      };

      // Create DDS instance
      this.scanner = new DocumentScanner({
        license: this.config.license,
        ...this.config.documentScannerConfig,
        scannerViewConfig: this.config.documentScannerConfig?.scannerViewConfig,
        // Only add result and correction configs if their views are enabled
        resultViewConfig:
          this.config.documentScannerConfig?.showResultView === false
            ? undefined
            : this.config.documentScannerConfig?.resultViewConfig,
        correctionViewConfig:
          this.config.documentScannerConfig?.showCorrectionView === false
            ? undefined
            : this.config.documentScannerConfig?.correctionViewConfig,
        showResultView: this.config.documentScannerConfig?.showResultView ?? true,
        showCorrectionView: this.config.documentScannerConfig?.showCorrectionView ?? true,
      });
    } else {
      this.scanner = this.config.scanner || null;
    }

    // Set up views object to keep track of the visibility of each views
    this.mwcViews = {
      [EnumMWCViews.Library]: {
        config: {
          ...this.config.libraryViewConfig,
          container: this.config.libraryViewConfig.container,
          onCameraCapture: () => this.handleCameraCapture(EnumMWCViews.Library),
          onGalleryImport: () => this.handleGalleryImport(EnumMWCViews.Library),
          onDocumentClick: (docId) => this.handleDocumentClick(docId),
          onViewUploadsHistory: () => this.switchView(EnumMWCViews.History, { caller: EnumMWCViews.Library }),
          onClose: () => this.dispose(),

          exportConfig,
          getUploadedDocuments: () => this.getUploadedDocuments(),
          updateUploadedDocuments: (newFiles) => this.updateUploadedDocuments(newFiles),
        },
      },
      [EnumMWCViews.Document]: {
        config: {
          ...this.config.documentViewConfig,
          container: this.config.documentViewConfig.container,
          onBackToLibrary: () => this.switchView(EnumMWCViews.Library),
          onCameraCapture: () => this.handleCameraCapture(EnumMWCViews.Document),
          onGalleryImport: () => this.handleGalleryImport(EnumMWCViews.Document),
          onPageClick: (docId, pageIndex) => this.handlePageClick(docId, pageIndex),
          onViewUploadsHistory: () => this.switchView(EnumMWCViews.History, { caller: EnumMWCViews.Document }),
          onClose: () => this.dispose(),

          exportConfig,
          getUploadedDocuments: () => this.getUploadedDocuments(),
          updateUploadedDocuments: (newFiles) => this.updateUploadedDocuments(newFiles),

          onTransferPages: (mode, docId, selectedIdx) => this.handleTransferPage(mode, docId, selectedIdx),
          showLibraryView,
        },
      },
      [EnumMWCViews.Page]: {
        config: {
          ...this.config.pageViewConfig,
          container: this.config.pageViewConfig.container,
          onDocumentClick: () => this.switchView(EnumMWCViews.Document),
          onCameraCapture: () => this.handleCameraCapture(EnumMWCViews.Page),
          onGalleryImport: () => this.handleGalleryImport(EnumMWCViews.Page),
          onViewUploadsHistory: () => this.switchView(EnumMWCViews.History, { caller: EnumMWCViews.Page }),
          onClose: () => this.dispose(),

          exportConfig,
          getUploadedDocuments: () => this.getUploadedDocuments(),
          updateUploadedDocuments: (newFiles) => this.updateUploadedDocuments(newFiles),

          showLibraryView,
        },
      },
      [EnumMWCViews.Transfer]: {
        config: {
          ...this.config.transferViewConfig,
          container: this.config.transferViewConfig.container,
          onConfirmTransfer: (mode) => this.handleTransferPageConfirm(mode),
          onCancelTransfer: () => this.handleTransferPageCancel(),
        },
      },
      [EnumMWCViews.History]: {
        config: {
          ...this.config.historyViewConfig,
          container: this.config.historyViewConfig.container,

          exportConfig,
          getUploadedDocuments: () => this.getUploadedDocuments(),
          updateUploadedDocuments: (newFiles) => this.updateUploadedDocuments(newFiles),

          onBack: (caller) => this.handleHistoryBack(caller),
        },
      },
      [EnumMWCViews.Scanner]: {
        config: {},
      },
    };
  }

  private getDDSViewsToCreate() {
    const showResultView = this.config.documentScannerConfig?.showResultView ?? true;
    const showCorrectionView = this.config.documentScannerConfig?.showCorrectionView ?? true;

    const ddsViews = [EnumAllViews.Scanner]; // Scanner view is always included

    if (showResultView) {
      ddsViews.push(EnumAllViews.ScanResult);
    }

    if (showCorrectionView) {
      ddsViews.push(EnumAllViews.Correction);
    }

    return ddsViews;
  }

  private createMWCViewContainers(mainContainer: HTMLElement): Record<string, HTMLElement> {
    const ddsViews = this.getDDSViewsToCreate();
    const mwcViews = Object.values(EnumMWCViews);

    const createContainer = (view: string, style: Partial<CSSStyleDeclaration>) => {
      const viewContainer = document.createElement("div");
      viewContainer.className = `mwc-view-container mwc-${view}-view-container`;

      Object.assign(viewContainer.style, style);
      return viewContainer;
    };

    const ddsViewContainers = ddsViews.reduce((containers, view) => {
      const container = createContainer(view, {
        position: "absolute",
        height: "100%",
        width: "100%",
        top: "0",
        left: "0",
        zIndex: "1000",
        display: "none",
      });

      mainContainer.append(container);
      containers[view] = container;
      return containers;
    }, {} as Record<string, HTMLElement>);

    const mwcViewContainers = mwcViews.reduce((containers, view) => {
      const container = createContainer(view, {
        position: "relative",
        height: "100%",
        width: "100%",
        display: "none",
      });

      mainContainer.append(container);
      containers[view] = container;
      return containers;
    }, {} as Record<string, HTMLElement>);

    return {
      ...ddsViewContainers,
      ...mwcViewContainers,
    };
  }

  private createDefaultMWCContainer(): HTMLElement {
    const container = document.createElement("div");
    container.className = "mwc-main-container";
    Object.assign(container.style, {
      height: DEFAULT_CONTAINER_HEIGHT,
      width: "100%",
      position: "absolute",
      left: 0,
      top: 0,
      display: "none",
    });
    document.body.append(container);

    this.isUsingDefaultContainer = true;
    return container;
  }

  private checkForTemporaryLicense(license?: string) {
    return !license?.length ||
      license?.startsWith("A") ||
      license?.startsWith("L") ||
      license?.startsWith("P") ||
      license?.startsWith("Y")
      ? "DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9"
      : license;
  }

  private loadDDVcss(): Promise<void> {
    if (document.getElementById(DEFAULT_DDV_CSS_ID)) return;
    const resourcePath = this.config?.ddvResourcePath || DEFAULT_DDV_RESOURCE_PATH;

    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `${resourcePath}/${DEFAULT_DDV_CSS_FILE}`;
      link.id = DEFAULT_DDV_CSS_ID;

      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load CSS from ${resourcePath}`));

      document.head.appendChild(link);
    });
  }

  private removeDDVcss(): void {
    const link = document.getElementById(DEFAULT_DDV_CSS_ID);
    if (link) {
      link.remove();
    }
  }

  private async initializeDDV(): Promise<void> {
    await DDV.Core.loadWasm();
    await DDV.Core.init();
    DDV.setProcessingHandler("imageFilter", new DDV.ImageFilter());
  }

  private initializeMWCViews() {
    const { Library, Document, Page, Transfer, History } = EnumMWCViews;
    this.mwcViews[Library].instance = new LibraryView(this.mwcViews[Library].config);
    this.mwcViews[Document].instance = new DocumentView(this.mwcViews[Document].config);
    this.mwcViews[Page].instance = new PageView(this.mwcViews[Page].config);
    this.mwcViews[Transfer].instance = new TransferView(this.mwcViews[Transfer].config);
    this.mwcViews[History].instance = new HistoryView(this.mwcViews[History].config);

    this.mwcViews[Library].instance.initialize();
    this.mwcViews[Document].instance.initialize();
    this.mwcViews[Page].instance.initialize();
    this.mwcViews[Transfer].instance.initialize();
    this.mwcViews[History].instance.initialize();
  }

  private switchView(targetView: EnumMWCViews, config?: any) {
    // Show main container if exists
    if ((this.config.container as HTMLElement)?.style.display === "none")
      (this.config.container as HTMLElement).style.display = "block";
    if (targetView === this.currentView) {
      (this.mwcViews[targetView].instance?.setVisible as (a: boolean, b?: any) => void)?.(true, config);
      return;
    }

    if (this.currentView) {
      const currentState = this.mwcViews[this.currentView]; // Hide current view

      // TODO - any
      (currentState.instance?.setVisible as (a: boolean, b?: any) => void)?.(false, config);
    }

    const targetState = this.mwcViews[targetView]; // Show target view

    // TODO - any
    (targetState.instance?.setVisible as (a: boolean, b?: any) => void)?.(true, config);

    this.currentView = targetView;
  }

  private async processScanResult(result: any) {
    const blobs: Blob[] = [];
    const promises: Promise<void>[] = [];

    try {
      // Array -> use result._imageData.toBlob()
      if (Array.isArray(result)) {
        const blobPromises = result.map(async (item) => {
          const imageData = item?._imageData;

          if (imageData?.toBlob && item?.status?.code === EnumResultStatus.RS_SUCCESS) {
            const blob = await imageData.toBlob("image/png");
            blobs.push(blob);
          }
        });

        await Promise.all(blobPromises);
      }
      // Direct result
      else if (
        (result?.correctedImageResult || result?.imageData) &&
        result?.status?.code === EnumResultStatus.RS_SUCCESS
      ) {
        const imageData = result?.correctedImageResult || result?._imageData;
        if (imageData?.toBlob) {
          const blob = await imageData.toBlob("image/png");
          blobs.push(blob);
        }
      }
      // Result is the values of object, but not directly DocumentScanResult
      else if (result && typeof result === "object" && !isEmptyObject(result)) {
        const objectPromises = Object.values(result).map(async (item: any) => {
          const imageData = item?._imageData;
          if (imageData?.toBlob && item?.status?.code === EnumResultStatus.RS_SUCCESS) {
            const blob = await imageData.toBlob("image/png");
            blobs.push(blob);
          }
        });

        await Promise.all(objectPromises);
      }
    } catch (ex: any) {
      let errMsg = `Error processing scan result: ${ex?.message || ex}`;
      console.error(errMsg);
      throw new Error(errMsg);
    }

    return blobs;
  }

  private async handleCameraCapture(sourceView: EnumMWCViews) {
    this.mwcViews[this.currentView].instance?.setVisible?.(false);

    try {
      const result = await this.scanner.launch();
      const blobs = await this.processScanResult(result);

      if (blobs.length === 0) {
        // No images returned
        return;
      }

      if (sourceView === EnumMWCViews.Library) {
        const sources = blobs.map((blob) => ({
          convertMode: "cm/auto",
          fileData: blob,
        }));
        const doc = await (this.mwcViews.library.instance as LibraryView).createAndLoadDocument(
          `Doc-${Date.now()}`,
          sources
        );

        this.handleDocumentClick(doc.uid);
      } else if (sourceView === EnumMWCViews.Document || sourceView === EnumMWCViews.Page) {
        // Add to current document when capturing from Document view
        const documentView = this.mwcViews[EnumMWCViews.Document].instance as DocumentView;
        const currentDoc = documentView.browseViewer.currentDocument;

        const sources = blobs.map((blob) => ({
          convertMode: "cm/auto",
          fileData: blob,
        }));

        if (currentDoc) {
          await currentDoc.loadSource(sources);
        }
      }

      // Return to library view after successful capture
    } catch (error) {
      console.error("Camera capture failed:", error);
      throw new Error(error);
    } finally {
      this.mwcViews[this.currentView].instance?.setVisible?.(true);
    }
  }

  private async handleGalleryImport(sourceView: EnumMWCViews) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/bmp,image/tiff,application/pdf";
    input.multiple = true;

    input.onchange = async () => {
      const files = Array.from(input.files || []);
      const len = files.length;
      const sourceArray = [];

      for (let i = 0; i < len; i++) {
        sourceArray.push({
          convertMode: "cm/auto",
          fileData: new Blob([files[i]], {
            type: files[i].type,
          }),
          renderOptions: {
            renderAnnotations: "loadAnnotations",
          },
        });
      }

      if (sourceArray.length > 0) {
        if (sourceView === EnumMWCViews.Library) {
          const docName = getFileNameWithoutExtension(files[0]?.name);

          const doc = await (this.mwcViews.library.instance as LibraryView).createAndLoadDocument(docName, sourceArray);

          this.handleDocumentClick(doc.uid);
        } else if (sourceView === EnumMWCViews.Document || sourceView === EnumMWCViews.Page) {
          // Add to current document when capturing from Document view
          const documentView = this.mwcViews[EnumMWCViews.Document].instance as DocumentView;
          const currentDoc = documentView.browseViewer.currentDocument;

          if (currentDoc) {
            await currentDoc.loadSource(sourceArray);

            // Stay on document view with updated content
            this.switchView(sourceView);
          }
        }
      }
    };

    input.click();
  }

  private handleDocumentClick(docId: string) {
    // Get instance and open document
    const documentView = this.mwcViews[EnumMWCViews.Document].instance as DocumentView;
    documentView.browseViewer.openDocument(docId);

    // Switch to document view
    this.switchView(EnumMWCViews.Document);
  }

  private handlePageClick(docId: string, pageIndex: number) {
    const pageView = this.mwcViews[EnumMWCViews.Page].instance as PageView;

    pageView.openPage(docId, pageIndex);

    this.switchView(EnumMWCViews.Page);
  }

  private handleTransferPage(mode: TransferMode, docId: string, selectedIdx: number[]) {
    this.switchView(EnumMWCViews.Transfer, {
      mode,
      docId,
      selectedIdx,
    });
  }

  private async handleTransferPageConfirm(mode: TransferMode) {
    (this.mwcViews.document.instance as DocumentView).handleSelectedBack();
    await showToast(
      this.mwcViews.document.config.container,
      mode === "copy" ? "Pasted" : mode === "move" ? "Moved" : ""
    );
  }

  private handleTransferPageCancel() {
    this.switchView(EnumMWCViews.Document);
  }

  private handleHistoryBack(caller?: HistoryCallerView) {
    this.switchView(caller);
  }

  private getUploadedDocuments() {
    return this.uploadedFiles;
  }

  private updateUploadedDocuments = (newFiles: UploadedDocument[]) => {
    this.uploadedFiles = newFiles;
  };

  dispose() {
    // Clean up views
    Object.values(this.mwcViews).forEach((view) => {
      if (view.instance?.dispose) {
        view.instance.dispose();
      }
    });

    this.scanner.dispose();

    // Clear document manager
    DDV.documentManager.deleteAllDocuments();

    if (this.config.container instanceof HTMLElement) {
      this.config.container.textContent = "";
    }

    if (this.isUsingDefaultContainer) {
      getElement(this.config.container).remove();
    }

    this.removeDDVcss();

    this.currentView = null;
    this.uploadedFiles = [];
    this.mwcViews = null;
    this.scanner = null;
    this.isInitialized = false;

    if (this.config?.onClose) {
      this.config?.onClose();
    }

    this.hasLaunched = false;

    return Promise.resolve();
  }
}

export default MobileWebCapture;
