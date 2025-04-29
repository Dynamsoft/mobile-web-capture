import * as dynamsoftCore from 'dynamsoft-core';
export { dynamsoftCore as Core };
import * as dynamsoftLicense from 'dynamsoft-license';
export { dynamsoftLicense as License };
import * as dynamsoftCaptureVisionRouter from 'dynamsoft-capture-vision-router';
export { dynamsoftCaptureVisionRouter as CVR };
import * as dynamsoftCameraEnhancer from 'dynamsoft-camera-enhancer';
export { dynamsoftCameraEnhancer as DCE };
import * as dynamsoftDocumentNormalizer from 'dynamsoft-document-normalizer';
export { dynamsoftDocumentNormalizer as DDN };
import * as dynamsoftUtility from 'dynamsoft-utility';
export { dynamsoftUtility as Utility };
import * as dynamsoft_document_viewer from 'dynamsoft-document-viewer';
import { BrowseViewer, IDocument } from 'dynamsoft-document-viewer';
export { dynamsoft_document_viewer as DDV };
export { PlayCallbackInfo, Point, Rect, VideoDeviceInfo } from 'dynamsoft-document-viewer';
import { DocumentScannerConfig, DocumentScannerViewConfig, DocumentResultViewConfig, DocumentCorrectionViewConfig } from 'dynamsoft-document-scanner';
import * as dynamsoftDocumentScanner from 'dynamsoft-document-scanner';
export { dynamsoftDocumentScanner as DDS };

interface DocumentItemConfig {
    docId: string;
    onDocumentClick?: (docId: string) => void;
    onCheckedChange?: (docId: string, checked: boolean) => void;
    onRename?: (docId: string) => void;
}
declare class DocumentItem {
    private config;
    private dom;
    private checkbox;
    private renameBtn;
    checked: boolean;
    isSelectMode: boolean;
    constructor(config: DocumentItemConfig);
    private createUI;
    private updateThumbnail;
    private bindEvents;
    setSelectMode(show: boolean): void;
    toggleCheck(check?: boolean): void;
    getDom(): HTMLElement;
    getUid(): string;
    update(): void;
    dispose(): void;
}

declare enum EnumMWCViews {
    Library = "library",
    Page = "page",
    Document = "document",
    Transfer = "transfer",
    History = "history",
    Scanner = "Scanner"
}
type EnumMWCStartingViews = EnumMWCViews.Library | EnumMWCViews.Document | EnumMWCViews.Scanner;
declare enum EnumAllViews {
    Library = "library",
    Page = "page",
    Document = "document",
    Transfer = "transfer",
    History = "history",
    Scanner = "scanner",
    Correction = "correction",
    ScanResult = "scan-result"
}
type UploadStatus = "success" | "failed";
type UploadedDocument = {
    fileName: string;
    downloadUrl: string;
    status: UploadStatus;
    uploadTime?: string;
};
interface ExportConfig {
    uploadToServer?: (fileName: string, blob: Blob) => Promise<void | UploadedDocument>;
    downloadFromServer?: (doc: UploadedDocument) => Promise<void>;
    deleteFromServer?: (doc: UploadedDocument) => Promise<void>;
    onUploadSuccess?: (fileName: string, fileType: string, view: EnumMWCViews, blob: Blob) => Promise<boolean>;
}

interface ViewConfig {
    container?: HTMLElement;
}
type EmptyContentConfig = string | HTMLElement | HTMLTemplateElement | {
    templatePath: string;
};
type ToolbarButtonConfig = Pick<ToolbarButton, "icon" | "label" | "className" | "isHidden">;
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
declare abstract class MWCView {
    protected config: ViewConfig;
    protected MWCViewElements: MWCViewElementsInterface;
    protected isSelectionMode: boolean;
    constructor(config: ViewConfig);
    initialize(): void;
    protected createMWCView(): void;
    protected createHeader(enable?: boolean): void;
    protected createContent(): void;
    protected createEmptyContent(): void;
    protected abstract updateEmptyContentHTML(): void;
    protected setEmptyContent(content: EmptyContentConfig): Promise<void>;
    protected createToolbars(): void;
    protected createToolbarButton(config?: ToolbarButton): HTMLElement;
    setVisible(visible: boolean, config?: any): void;
    protected showContent(show: boolean): void;
    protected toggleSelectionMode(show: boolean): void;
    protected updateToolbarState(): void;
}

interface LibraryToolbarButtonsConfig {
    newDoc?: ToolbarButtonConfig;
    capture?: ToolbarButtonConfig;
    import?: ToolbarButtonConfig;
    uploads?: ToolbarButtonConfig;
    delete?: ToolbarButtonConfig;
    print?: ToolbarButtonConfig;
    share?: ToolbarButtonConfig;
    upload?: ToolbarButtonConfig;
    back?: ToolbarButtonConfig;
}
interface LibraryViewConfig {
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
    emptyContentConfig?: EmptyContentConfig;
    toolbarButtonsConfig?: LibraryToolbarButtonsConfig;
}
declare class LibraryView extends MWCView {
    protected config: LibraryViewConfig;
    private headerTitle;
    private headerActionBtn;
    private toolbarBtn;
    checkedDocUids: string[];
    docItems: DocumentItem[];
    constructor(config: LibraryViewConfig);
    private bindDocumentManagerEvents;
    initialize(): void;
    setVisible(visible?: boolean): void;
    protected createHeader(): void;
    private updateHeaderActionBtnStyle;
    protected updateEmptyContentHTML(): void;
    private handleClose;
    dispose(): void;
    protected toggleSelectionMode(enabled: boolean): void;
    private handleSelectAllOrCancel;
    private handleDocumentChecked;
    private handleDocumentClick;
    private handleRename;
    protected createToolbars(): void;
    private handleNewDocument;
    createAndLoadDocument(name: string, sources?: Array<{
        convertMode: string;
        fileData: Blob;
        renderOptions?: {
            renderAnnotations?: string;
        };
    }>): Promise<dynamsoft_document_viewer.IDocument>;
    private handleCameraCapture;
    private handleGalleryImport;
    private handleViewUploadsHistory;
    private handleDelete;
    private handlePrint;
    private handleShare;
    private handleDownload;
    private handleUploadDocuments;
    private handleSelectedBack;
}

interface DDVAnnotationToolbarLabelConfig {
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
interface PageViewToolbarButtonsConfig {
    back?: ToolbarButtonConfig;
    delete?: ToolbarButtonConfig;
    addPage?: ToolbarButtonConfig;
    upload?: ToolbarButtonConfig;
    share?: ToolbarButtonConfig;
    edit?: ToolbarButtonConfig;
    crop?: ToolbarButtonConfig;
    rotate?: ToolbarButtonConfig;
    filter?: ToolbarButtonConfig;
    annotate?: ToolbarButtonConfig;
    done?: ToolbarButtonConfig;
}
interface PageViewConfig {
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
    toolbarButtonsConfig?: PageViewToolbarButtonsConfig;
    annotationToolbarLabelConfig?: DDVAnnotationToolbarLabelConfig;
}
declare class PageView extends MWCView {
    protected config: PageViewConfig;
    private editViewer;
    private toolbarBtn;
    private editToolbarContainer;
    private ddvAnnotationsToolbarLabel;
    private isCroppingMode;
    private isAnnotatingMode;
    private isFilterMode;
    constructor(config: PageViewConfig);
    initialize(): void;
    private bindPageViewEvents;
    private bindAnnotationEvents;
    private bindToolModeEvents;
    protected createHeader(): void;
    protected updateEmptyContentHTML(): void;
    protected createToolbars(): void;
    setVisible(visible: boolean): void;
    openPage(docId: string, pageIndex: number): void;
    private handleBack;
    private handleDeletePage;
    private handleAddPage;
    private handleShare;
    private handleDownload;
    private handleUpload;
    private handleEditMode;
    private updateEditViewTopbar;
    private toggleDDVHeaderButtons;
    private disableOtherEditButtons;
    private enableAllEditButtons;
    private handleCrop;
    private handleRotate;
    private handleFilter;
    private handleAnnotate;
    private handleDoneBtn;
    dispose(): void;
}

declare enum TransferMode {
    Copy = "copy",
    Move = "move"
}
interface TransferToolbarButtonsConfig {
    cancel?: ToolbarButtonConfig;
    action?: ToolbarButtonConfig;
}
type TransferToolbarButtons = Record<keyof TransferToolbarButtonsConfig, HTMLElement>;
interface TransferViewConfig {
    container?: HTMLElement;
    onConfirmTransfer?: (mode: TransferMode) => void;
    onCancelTransfer?: () => void;
    toolbarButtonsConfig?: TransferToolbarButtons;
}
declare class TransferView extends MWCView {
    protected config: TransferViewConfig;
    private transferMode;
    private checkedDocUids;
    private docItems;
    private toolbarBtn;
    private headerTitle;
    constructor(config: TransferViewConfig);
    initialize(): void;
    protected createHeader(): void;
    protected createContent(): void;
    protected updateEmptyContentHTML(): void;
    protected createToolbars(): void;
    private updateHeaderAndAction;
    setVisible(visible: boolean, config?: {
        mode: TransferMode;
        docId: string;
        selectedIdx: number[];
    }): void;
    private loadDocuments;
    private handleDocumentChecked;
    private updateToolbarStyle;
    private handleCancelButton;
    private handleActionClick;
    dispose(): void;
}

interface DocumentToolbarButtonsConfig {
    backToLibrary?: ToolbarButtonConfig;
    capture?: ToolbarButtonConfig;
    import?: ToolbarButtonConfig;
    shareDocument?: ToolbarButtonConfig;
    uploadDocument?: ToolbarButtonConfig;
    manage?: ToolbarButtonConfig;
    copyTo?: ToolbarButtonConfig;
    moveTo?: ToolbarButtonConfig;
    deleteImage?: ToolbarButtonConfig;
    shareImage?: ToolbarButtonConfig;
    uploadImage?: ToolbarButtonConfig;
    back?: ToolbarButtonConfig;
}
interface DocumentViewConfig {
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
    emptyContentConfig?: EmptyContentConfig;
    toolbarButtonsConfig?: DocumentToolbarButtonsConfig;
}
declare class DocumentView extends MWCView {
    protected config: DocumentViewConfig;
    private documentTitle;
    private headerRenameTitleBtn;
    private toolbarBtn;
    private headerTitle;
    private headerActionBtn;
    browseViewer: BrowseViewer;
    private isDragged;
    constructor(config: DocumentViewConfig);
    private bindBrowseViewerEvents;
    initialize(): void;
    setVisible(visible: boolean): void;
    private createBrowseViewer;
    protected createHeader(): void;
    private updateHeaderActionBtnStyle;
    protected updateHeaderTitle(): void;
    private handleRename;
    dispose(): void;
    private handleClose;
    protected updateEmptyContentHTML(): void;
    protected createToolbars(): void;
    private handleShareDoc;
    static handleDownloadDoc(doc: IDocument, container: HTMLElement): Promise<void>;
    protected handleUploadDocument(): Promise<void>;
    protected handleManagePages(): void;
    protected handleSelectAll(): void;
    protected toggleSelectionMode(enabled: boolean): void;
    private handlePageChecked;
    protected updateToolbarBtnStates(): void;
    private handleTransferPage;
    private handleDeleteImage;
    private handleShareImage;
    private handleDownloadImage;
    private handleUploadImage;
    handleSelectedBack(): void;
}

type HistoryCallerView = EnumMWCViews.Document | EnumMWCViews.Library | EnumMWCViews.Page;
interface HistoryToolbarButtonsConfig {
    back?: ToolbarButtonConfig;
}
interface HistoryViewConfig {
    container?: HTMLElement;
    exportConfig?: ExportConfig;
    getUploadedDocuments?: () => UploadedDocument[];
    updateUploadedDocuments?: (files: UploadedDocument[]) => void;
    onBack?: (caller: HistoryCallerView) => void;
    emptyContentConfig?: EmptyContentConfig;
    toolbarButtonsConfig?: HistoryToolbarButtonsConfig;
}

interface MWCScanner {
    initialize(): Promise<any>;
    launch(): Promise<any>;
    dispose(): void;
}
interface MobileWebCaptureConfig {
    license?: string;
    container?: HTMLElement | string;
    ddvResourcePath?: string;
    exportConfig?: ExportConfig;
    showLibraryView?: boolean;
    onClose?: () => void;
    libraryViewConfig?: Pick<LibraryViewConfig, "container" | "toolbarButtonsConfig">;
    documentViewConfig?: Pick<DocumentViewConfig, "container" | "toolbarButtonsConfig">;
    pageViewConfig?: Pick<PageViewConfig, "container" | "toolbarButtonsConfig">;
    transferViewConfig?: Pick<TransferViewConfig, "container" | "toolbarButtonsConfig">;
    historyViewConfig?: Pick<HistoryViewConfig, "container" | "toolbarButtonsConfig">;
    scanner?: MWCScanner;
    documentScannerConfig?: Omit<DocumentScannerConfig, "container" | "license"> & {
        scannerViewConfig?: Omit<DocumentScannerViewConfig, "container" | "templateFilePath" | "utilizedTemplateNames" | "_showCorrectionView">;
        resultViewConfig?: Omit<DocumentResultViewConfig, "container">;
        correctionViewConfig?: Omit<DocumentCorrectionViewConfig, "container" | "templateFilePath" | "utilizedTemplateNames" | "_showCorrectionView">;
    };
}
declare class MobileWebCapture {
    private config;
    private scanner;
    private mwcViews;
    private currentView;
    private uploadedFiles;
    private isInitialized;
    private isUsingDefaultContainer;
    private hasLaunched;
    private loadingScreen;
    private showMWCLoadingOverlay;
    private hideMWCLoadingOverlay;
    constructor(config: MobileWebCaptureConfig);
    initialize(): Promise<void>;
    launch(file?: File | string, view?: EnumMWCStartingViews): Promise<void>;
    private createDocumentFromFile;
    private createDocumentFromName;
    private handleDefaultLaunch;
    private setupMWCViews;
    private getDDSViewsToCreate;
    private createMWCViewContainers;
    private createDefaultMWCContainer;
    private checkForTemporaryLicense;
    private loadDDVcss;
    private removeDDVcss;
    private initializeDDV;
    private initializeMWCViews;
    private switchView;
    private processScanResult;
    private handleCameraCapture;
    private handleGalleryImport;
    private handleDocumentClick;
    private handlePageClick;
    private handleTransferPage;
    private handleTransferPageConfirm;
    private handleTransferPageCancel;
    private handleHistoryBack;
    private getUploadedDocuments;
    private updateUploadedDocuments;
    dispose(): Promise<void>;
}

declare const MWC: {
    MobileWebCapture: typeof MobileWebCapture;
    LibraryView: typeof LibraryView;
    DocumentView: typeof DocumentView;
    PageView: typeof PageView;
    TransferView: typeof TransferView;
};

export { DocumentView, EnumAllViews, EnumMWCViews, LibraryView, MWC, MobileWebCapture, PageView, TransferView };
export type { DocumentViewConfig, ExportConfig, LibraryViewConfig, MobileWebCaptureConfig, PageViewConfig, TransferViewConfig, UploadStatus, UploadedDocument };
