import {Question} from "./question";

export class MeasurementFramework {
    idMeasurementFramework: number;
    name: string;
    idReferenceModel: number;
    questions?: Question[];
}
