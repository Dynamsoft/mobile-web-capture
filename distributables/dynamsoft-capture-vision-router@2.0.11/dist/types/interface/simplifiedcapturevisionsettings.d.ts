import { EnumCapturedResultItemType, Quadrilateral } from "dynamsoft-core";
export interface SimplifiedCaptureVisionSettings {
    capturedResultItemTypes: EnumCapturedResultItemType;
    roi: Quadrilateral;
    roiMeasuredInPercentage: boolean;
    maxThreadCount: number;
    timeout: number;
    barcodeSettings: any;
    labelSettings: any;
}
//# sourceMappingURL=simplifiedcapturevisionsettings.d.ts.map