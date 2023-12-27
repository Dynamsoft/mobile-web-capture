import { CapturedResultItem } from "./CapturedResultItem";
import { ImageTag } from "./ImageTag";
export interface CapturedResult {
    readonly originalImageHashId: string;
    originalImageTag: ImageTag;
    readonly items: Array<CapturedResultItem>;
}
//# sourceMappingURL=CapturedResult.d.ts.map