import { ImageSourceStateListener } from "../interface/imagesourcestatelistener";
import { SimplifiedCaptureVisionSettings } from "../interface/simplifiedcapturevisionsettings";
import { DSImageData, ImageSourceAdapter, CapturedResult, CapturedResultReceiver, EnumCapturedResultItemType, IntermediateResultManager, CapturedResultFilter, IntermediateResultUnit } from "dynamsoft-core";
export default class CaptureVisionRouter {
    private static _jsVersion;
    private static _jsEditVersion;
    private static _version;
    static moduleVersion: {
        CORE: string;
        CVR: string;
        DIP: string;
        LICENSE: string;
        UTILITY: string;
        DBR?: string;
        DDN?: string;
        DLR?: string;
        DCP?: string;
    };
    private static _pLoad;
    /** @ignore */
    static _workerName: string;
    private static _engineResourcePath?;
    static get engineResourcePath(): string;
    /**
     * The SDK will try to automatically explore the engine location.
     * If the auto-explored engine location is not accurate, manually specify the engine location.
     * ```js
     * Dynamsoft.CVR.CaptureVisionRouter.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-router@2.2.0/dist/";
     * await Dynamsoft.CVR.CaptureVisionRouter.loadWasm();
     * ```
     * Built-in Templates include
     * 1. "default": DBR + DLR + DDN-Normalize
     * 2. "read-barcodes"
     * 3. "recognize-textLines"
     * 4. "detect-document-boundaries"
     * 5. "detect-and-normalize-document"
     * 6. "normalize-document"
    */
    static set engineResourcePath(value: string);
    /**
     * modify from https://gist.github.com/2107/5529665
     * @ignore
     */
    static browserInfo: any;
    /**
     * Detect environment and get a report.
     */
    static detectEnvironment(): Promise<any>;
    protected static _license: string;
    static get license(): string;
    static set license(license: string);
    /** @ignore */
    private static _licenseServer?;
    static get licenseServer(): string[] | string;
    /**
     * Specify the license server URL.
    */
    static set licenseServer(value: string[] | string);
    static _deviceFriendlyName: string;
    /** @ignore */
    static get deviceFriendlyName(): string;
    /** @ignore */
    static set deviceFriendlyName(value: string);
    static DeviceUUID: string;
    /** @ignore */
    static _onLog: (message: any) => void;
    /** @ignore */
    static _bWasmDebug: boolean;
    /** @ignore */
    static _cvrWorker: Worker;
    private static _nextTaskID;
    private static _taskCallbackMap;
    /** @ignore */
    _instanceID: number;
    videoModeTemplate: string;
    /** @ignore */
    private intervalTime;
    /** @ignore */
    private _intervalGetVideoFrame;
    private _loopReadVideoTimeoutId;
    private _bPauseScan;
    private _intervalDetectVideoPause;
    settings: any;
    protected captureInParallel: boolean;
    private canvas;
    private _bNeedOutputOriginalImage;
    dsImage: DSImageData;
    private irrRegistryState;
    private _resultReceiverSet;
    private _isaStateListenerSet;
    private _resultFilterSet;
    private _intermediateResultManager;
    private _templateName;
    static bSupportDce4Module: number;
    private _bOpenVerify;
    private _bOpenVerifyForNor;
    private _bOpenDeDuplication;
    private _bOpenDeDuplicationForNor;
    private _bKeepResultsHighlighted;
    private _maxCvsSideLength;
    /** @ignore */
    set maxCvsSideLength(value: number);
    get maxCvsSideLength(): number;
    private _isa;
    private set isa(value);
    private get isa();
    static getVersion(): string;
    static getModuleVersion(): Promise<any>;
    /**
     * Returns whether the instance has been disposed.
     */
    protected bDestroyed: boolean;
    get disposed(): boolean;
    private _checkIsDisposed;
    /**
     * Determine if the decoding module has been loaded successfully.
     * @category Initialize and Destroy
     */
    static isWasmLoaded(): boolean;
    /**
     * Fire when resources start loading.
     * @see [[onResourcesLoadProgress]]
     * @see [[onResourcesLoaded]]
     * @param resourcesPath The path of resources
     */
    static onResourcesLoadStarted: (resourcesPath?: string) => void;
    /**
     * Fire when resources progress.
     * @see [[onResourcesLoadStarted]]
     * @see [[onResourcesLoaded]]
     * @param resourcesPath The path of resources
     * @param progress The download progress of resources
     */
    static onResourcesLoadProgress: (resourcesPath?: string, progress?: {
        loaded: number;
        total: number;
    }) => void;
    /**
     * Fire when resources loaded.
     * @see [[onResourcesLoadStarted]]
     * @see [[onResourcesLoadProgress]]
     * @param resourcesPath The path of resources
     */
    static onResourcesLoaded: (resourcesPath?: string) => void;
    /**
     * Manually load and compile the decoding module. Used for preloading to avoid taking too long for lazy loading.
     * @category Initialize and Destroy
     */
    static loadWasm(): Promise<void>;
    private static _promisePreloadModule;
    static preloadModule(modules: string | Array<string>): Promise<void>;
    static isModuleLoaded(moduleName: string): Promise<boolean>;
    /**
     * @param type "warn" or "error"
     * @param content
     * @returns
     */
    private static showDialog;
    /**
     * Creates an instance of CaptureVisionRouter.
     * @remarks When creating the instance, CaptureVisionRouter will get all the licensed components from Dynamsoft.Core and instantiate them.
     */
    static createInstance(): Promise<CaptureVisionRouter>;
    private static createInstanceInWorker;
    /**
     * NOTE: for the time being
     * If DCE JS instance is passed in as the image source, DCV will
     * know that it has a UI to draw on
     */
    setInput(imageSource: ImageSourceAdapter): void;
    getInput(): ImageSourceAdapter;
    addImageSourceStateListener(listener: ImageSourceStateListener): void;
    removeImageSourceStateListener(listener: ImageSourceStateListener): boolean;
    addResultReceiver(receiver: CapturedResultReceiver): void;
    removeResultReceiver(receiver: CapturedResultReceiver): void;
    private _setCrrRegistry;
    addResultFilter(filter: CapturedResultFilter): Promise<void>;
    removeResultFilter(filter: CapturedResultFilter): void;
    private _handleFilterSwitch;
    /**
     * _promiseStartScan.status == "pending"; // camera is openning.
     * _promiseStartScan.status == "fulfilled"; // camera is opened.
     * _promiseStartScan == null; // camera is closed.
     * @ignore
     */
    private _promiseStartScan;
    startCapturing(templateName?: string): Promise<void>;
    stopCapturing(options?: {
        keepResultsHighlighted: boolean;
    }): void;
    private _clearVerifyList;
    getIntermediateResult(): Promise<{
        intermediateResultUnits: Array<IntermediateResultUnit>;
        info: any;
    }>;
    /** @ignore */
    private _loopReadVideo;
    private _reRunCurrnetFunc;
    /**
     * Process an image or a file to extract information.
     */
    capture(imageOrFile: DSImageData | string | Blob | HTMLImageElement | HTMLCanvasElement, templateName?: string, bScanner?: boolean): Promise<CapturedResult>;
    private _captureDsimage;
    private _captureUrl;
    private _captureBlob;
    private _captureImage;
    private _captureCanvas;
    private _captureInWorker;
    /**
     * settings can either be a JSON string or a url to a JSON file
     */
    initSettings(settings: string | object): Promise<any>;
    outputSettings(templateName?: string): Promise<any>;
    /**
     * Returns a SimplifiedCaptureVisionSettings object constructed based on the current internal template.
     * @param templateName Specifies a template to return a SimplifiedCaptureVisionSettings for it
     * @remarks If the underlying CaptureSettings is too complicated, we cannot construct a Simplified CaptureSettings in which case it returns null.
     */
    getSimplifiedSettings(templateName: string): Promise<SimplifiedCaptureVisionSettings | null>;
    /**
     * Updates a few key settings with new values.
     * Simplified Capture Settings are meant for fast configuration of the process. Due to its simplicity, it is not very flexible nor powerful. The limitations are
     * 1. There is only one target ROI (the input image?)
     * 2. For the ROI, one SDK only process once
     * 3. Processes don't rely on each other
     * @param templateName specifies a template which will be updated with the passed settings
     * @param settings Specify the settings used to update the template
     */
    updateSettings(templateName: string, settings: SimplifiedCaptureVisionSettings | string): Promise<any>;
    private _updateDlrSettings;
    /**
     * Resets all settings to default values.
     * @remarks For certain editions like the JS edition, the default may not be exactly the same as with C++.
     */
    resetSettings(): Promise<any>;
    /**
     * @Ignore in version 2.2.0
     * Returns an object that takes care of the save and retrieval of intermediate results.
     */
    getIntermediateResultManager(): IntermediateResultManager;
    enableResultCrossVerification(resultItemTypes: EnumCapturedResultItemType, enabled: boolean): Promise<void>;
    enableResultDeduplication(resultItemTypes: EnumCapturedResultItemType, enabled: boolean): Promise<void>;
    setDuplicateForgetTime(resultItemTypes: EnumCapturedResultItemType, time: number): Promise<void>;
    getDuplicateForgetTime(type: EnumCapturedResultItemType): Promise<number>;
    static consumeForDce(count: number): Promise<void>;
    setThresholdValue(threshold: number, leftLimit: number, rightLimit: number): Promise<void>;
    /**
     * Disposes the instance itself and all the component instances.
     */
    dispose(): Promise<void>;
}
//# sourceMappingURL=capturevisionrouter.d.ts.map