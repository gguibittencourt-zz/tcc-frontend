import {Guid} from "guid-typescript";

export class GoalBoolean {

	idGoal: string;
	idReference: string;
	percentage: number;

	constructor() {
		this.idGoal = Guid.create().toString();
	}
}
