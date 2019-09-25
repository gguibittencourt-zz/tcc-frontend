import {Guid} from "guid-typescript";
import {Rating} from "./rating";

export class ProcessAttributeValue {
	idProcessAttributeValue: string;
	name: string;
	ratingAssessmentByIdProcess: Map<string, Rating>;

	constructor() {
		this.idProcessAttributeValue = Guid.create().toString();
	}
}
