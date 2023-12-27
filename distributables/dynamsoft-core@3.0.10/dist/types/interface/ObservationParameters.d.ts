import { EnumIntermediateResultUnitType } from "../enum";
export interface ObservationParameters {
    setObservedResultUnitTypes: (types: number) => void;
    getObservedResultUnitTypes: () => number;
    isResultUnitTypeObserved: (type: EnumIntermediateResultUnitType) => boolean;
    addObservedTask: (taskName: string) => void;
    removeObservedTask: (taskName: string) => void;
    isTaskObserved: (ctaskName: string) => boolean;
}
//# sourceMappingURL=ObservationParameters.d.ts.map