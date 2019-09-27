import {Guid} from "guid-typescript";
import {Rating} from "./rating";

export class ProcessAttributeValue {
	idProcessAttributeValue: string;
	name: string;
	ratingAssessmentByIdProcess: Map<string, Rating>;
	generateQuestions: boolean;


	constructor() {
		this.idProcessAttributeValue = Guid.create().toString();
		this.generateQuestions = true;
	}
}
