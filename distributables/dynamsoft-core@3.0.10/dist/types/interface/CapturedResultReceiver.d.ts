import { CapturedResult } from "./CapturedResult";
import { OriginalImageResultItem } from "./OriginalImageResultItem";
export interface CapturedResultReceiver {
    onCapturedResultReceived?: (result: CapturedResult) => void;
    onOriginalImageResultReceived?: (result: OriginalImageResultItem) => void;
    onDecodedBarcodesReceived?: (result: any) => void;
    onRecognizedTextLinesReceived?: (result: any) => void;
    onDetectedQuadsReceived?: (result: any) => void;
    onNormalizedImagesReceived?: (result: any) => void;
    onParsedResultsReceived?: (result: any) => void;
}
//# sourceMappingURL=CapturedResultReceiver.d.ts.map