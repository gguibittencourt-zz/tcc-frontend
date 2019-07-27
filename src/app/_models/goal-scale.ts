import {Guid} from "guid-typescript";
import {MetricScale} from "./metric-scale";

export class GoalScale {

	idGoal: string;
	idReference: string;
	metrics: MetricScale;

	constructor() {
		this.idGoal = Guid.create().toString();
	}
}
