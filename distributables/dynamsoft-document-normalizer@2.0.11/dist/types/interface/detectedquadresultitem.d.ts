import { Quadrilateral, CapturedResultItem } from "dynamsoft-core";
export interface DetectedQuadResultItem extends CapturedResultItem {
    location: Quadrilateral;
    confidenceAsDocumentBoundary: number;
}
//# sourceMappingURL=detectedquadresultitem.d.ts.map