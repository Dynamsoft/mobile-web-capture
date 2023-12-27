import { DSImageData } from "../interface/DSImageData";
import IntermediateResultReceiver from "../class/IntermediateResultReceiver";
export default class IntermediateResultManager {
    intermediateResultReceiverSet: Set<IntermediateResultReceiver>;
    addResultReceiver(receiver: IntermediateResultReceiver): void;
    removeResultReceiver(receiver: IntermediateResultReceiver): void;
    getOriginalImage(imageHashId: string): Promise<DSImageData>;
}
//# sourceMappingURL=IntermediateResultManager.d.ts.map