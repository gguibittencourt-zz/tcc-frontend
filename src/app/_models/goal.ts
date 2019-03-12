import {Guid} from "guid-typescript";

export class Goal {

	idGoal: string;
	idReference: string;
	percentage: number;

	constructor() {
		this.idGoal = Guid.create().toString();
	}
}
