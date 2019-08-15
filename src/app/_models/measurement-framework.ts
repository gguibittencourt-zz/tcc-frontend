import {Question} from "./question";
import {GoalBoolean} from "./goal-boolean";
import {GoalScale} from "./goal-scale";
import {Classification} from "./classification";
import {ScaleValues} from "./scale-values";

export class MeasurementFramework {
    idMeasurementFramework: number;
    name: string;
    idReferenceModel: number;
    type: string;
    scaleValues: ScaleValues[];
	questions?: Question[];
	goals?: GoalBoolean[] | GoalScale[];
	classifications?: Classification[];
}
