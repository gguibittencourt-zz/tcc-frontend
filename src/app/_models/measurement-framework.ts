import {Question} from "./question";
import {GoalBoolean} from "./goal-boolean";
import {GoalScale} from "./goal-scale";
import {Classification} from "./classification";

export class MeasurementFramework {
    idMeasurementFramework: number;
    name: string;
    idReferenceModel: number;
    type: string;
	questions?: Question[];
	goals?: GoalBoolean[] | GoalScale[];
	classifications?: Classification[];
}
