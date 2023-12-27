import { BinaryImageUnit, ColourImageUnit, ContoursUnit, EnhancedGrayscaleImageUnit, GrayscaleImageUnit, IntermediateResult, IntermediateResultExtraInfo, LineSegmentsUnit, PredetectedRegionsUnit, ScaledDownColourImageUnit, TextRemovedBinaryImageUnit, TextZonesUnit, TextureDetectionResultUnit, TextureRemovedBinaryImageUnit, TextureRemovedGrayscaleImageUnit, TransformedGrayscaleImageUnit } from "../interface";
export default class IntermediateResultReceiver {
    onTaskResultsReceived?: (result: IntermediateResult, info: IntermediateResultExtraInfo) => void;
    onPredetectedRegionsReceived?: (result: PredetectedRegionsUnit, info: IntermediateResultExtraInfo) => void;
    onLocalizedBarcodesReceived?: (result: any, info: IntermediateResultExtraInfo) => void;
    onDecodedBarcodesReceived: (result: any, info: IntermediateResultExtraInfo) => void;
    onLocalizedTextLinesReceived: (result: any, info: IntermediateResultExtraInfo) => void;
    onRecognizedTextLinesReceived: (result: any, info: IntermediateResultExtraInfo) => void;
    onDetectedQuadsReceived?: (result: any, info: IntermediateResultExtraInfo) => void;
    onNormalizedImagesReceived?: (result: any, info: IntermediateResultExtraInfo) => void;
    onColourImageUnitReceived?: (result: ColourImageUnit, info: IntermediateResultExtraInfo) => void;
    onScaledDownColourImageUnitReceived?: (result: ScaledDownColourImageUnit, info: IntermediateResultExtraInfo) => void;
    onGrayscaleImageUnitReceived?: (result: GrayscaleImageUnit, info: IntermediateResultExtraInfo) => void;
    onTransformedGrayscaleImageUnitReceived?: (result: TransformedGrayscaleImageUnit, info: IntermediateResultExtraInfo) => void;
    onEnhancedGrayscaleImageUnitReceived?: (result: EnhancedGrayscaleImageUnit, info: IntermediateResultExtraInfo) => void;
    onBinaryImageUnitReceived?: (result: BinaryImageUnit, info: IntermediateResultExtraInfo) => void;
    onTextureDetectionResultUnitReceived?: (result: TextureDetectionResultUnit, info: IntermediateResultExtraInfo) => void;
    onTextureRemovedGrayscaleImageUnitReceived?: (result: TextureRemovedGrayscaleImageUnit, info: IntermediateResultExtraInfo) => void;
    onTextureRemovedBinaryImageUnitReceived?: (result: TextureRemovedBinaryImageUnit, info: IntermediateResultExtraInfo) => void;
    onContoursUnitReceived?: (result: ContoursUnit, info: IntermediateResultExtraInfo) => void;
    onLineSegmentsUnitReceived?: (result: LineSegmentsUnit, info: IntermediateResultExtraInfo) => void;
    onTextZonesUnitReceived?: (result: TextZonesUnit, info: IntermediateResultExtraInfo) => void;
    onTextRemovedBinaryImageUnitReceived?: (result: TextRemovedBinaryImageUnit, info: IntermediateResultExtraInfo) => void;
    onLongLinesUnitReceived?: (result: any, info: IntermediateResultExtraInfo) => void;
    onCornersUnitReceived?: (result: any, info: IntermediateResultExtraInfo) => void;
    onCandidateQuadEdgesUnitReceived?: (result: any, info: IntermediateResultExtraInfo) => void;
    onCandidateBarcodeZonesUnitReceived?: (result: any, info: IntermediateResultExtraInfo) => void;
    onScaledUpBarcodeImageUnitReceived?: (result: any, info: IntermediateResultExtraInfo) => void;
    onDeformationResistedBarcodeImageUnitReceived?: (result: any, info: IntermediateResultExtraInfo) => void;
    onComplementedBarcodeImageUnitReceived?: (result: any, info: IntermediateResultExtraInfo) => void;
}
//# sourceMappingURL=IntermediateResultReceiver.d.ts.map