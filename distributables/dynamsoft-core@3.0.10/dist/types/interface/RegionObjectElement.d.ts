import { EnumRegionObjectElementType } from "../enum/EnumRegionObjectElementType";
import { Quadrilateral } from "./Quadrilateral";
export interface RegionObjectElement {
    location: Quadrilateral;
    referencedElement: RegionObjectElement;
    type: EnumRegionObjectElementType;
}
//# sourceMappingURL=RegionObjectElement.d.ts.map