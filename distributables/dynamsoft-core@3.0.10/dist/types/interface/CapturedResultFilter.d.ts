import { OriginalImageResultItem } from "./OriginalImageResultItem";
export interface CapturedResultFilter {
    onOriginalImageResultReceived?: (result: OriginalImageResultItem) => void;
    onDetectedQuadsReceived?: (result: any) => void;
    onNormalizedImagesReceived?: (result: any) => void;
}
//# sourceMappingURL=CapturedResultFilter.d.ts.map