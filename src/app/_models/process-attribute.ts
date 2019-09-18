import {Guid} from "guid-typescript";
import {ProcessAttributeValue} from "./process-attribute-value";
import {Rating} from "./rating";

export class ProcessAttribute {
	idProcessAttribute: string;
	name: string;
	prefix: string;
	description: string;
	generateQuestions: boolean;
	values: ProcessAttributeValue[];
	ratings: string[];

	constructor() {
		this.idProcessAttribute = Guid.create().toString();
		this.values = [];
		this.ratings = [];
		this.generateQuestions = true;
	}
}
