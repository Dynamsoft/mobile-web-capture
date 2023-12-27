import { DetectedQuadsResult, NormalizedImagesResult } from "dynamsoft-document-normalizer";
import { CapturedResult, OriginalImageResultItem } from "dynamsoft-core";
export default class CapturedResultReceiver {
    onCapturedResultReceived: (result: CapturedResult) => void;
    onOriginalImageResultReceived: (result: OriginalImageResultItem) => void;
    onDecodedBarcodesReceived: (result: any) => void;
    onRecognizedTextLinesReceived: (result: any) => void;
    onDetectedQuadsReceived: (result: DetectedQuadsResult) => void;
    onNormalizedImagesReceived: (result: NormalizedImagesResult) => void;
    onParsedResultsReceived: (result: any) => void;
}
//# sourceMappingURL=capturedresultreceiver.d.ts.map