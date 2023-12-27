import { NormalizedImageResultItem } from "dynamsoft-document-normalizer";
import { CapturedResult, DSImageData, Point } from "dynamsoft-core";
export declare function isDSImageData(value: any): boolean;
export declare function getWasmDependentModules(settings: any, templateName?: string): Array<string>;
export declare function checkIsLink(str: string): boolean;
type point = Point;
export declare function isPointInQuadrilateral(points: [point, point, point, point], point: point): boolean;
export declare function handleResultForDraw(results: CapturedResult): any;
export declare function getNorImageData(dsImageData: DSImageData): ImageData;
export declare function handleNormalizedImageResultItem(item: NormalizedImageResultItem, retImageData: ImageData): void;
export {};
//# sourceMappingURL=index.d.ts.map