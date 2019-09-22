import {Guid} from "guid-typescript";
import {Rating} from "./rating";

export class ProcessAttributeValue {
	idProcessAttributeValue: string;
	name: string;
	ratingAssessment: Rating;

	constructor() {
		this.idProcessAttributeValue = Guid.create().toString();
	}
}
