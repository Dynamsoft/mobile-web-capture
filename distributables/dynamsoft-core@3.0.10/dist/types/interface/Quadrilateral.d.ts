import { DSRect } from "./DSRect";
import { Point } from "./Point";
export interface Quadrilateral {
    points: [Point, Point, Point, Point];
    contains?: (point: Point) => boolean;
    getBoundingRect?: () => DSRect;
    getArea?: () => number;
    toString?: () => string;
}
//# sourceMappingURL=Quadrilateral.d.ts.map