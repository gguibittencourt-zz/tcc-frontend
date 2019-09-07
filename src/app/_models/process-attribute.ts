import {Guid} from "guid-typescript";
import {ProcessAttributeValue} from "./process-attribute-value";

export class ProcessAttribute {
	idProcessAttribute: string;
	name: string;
	description: string;
	generateQuestions: boolean;
	values: ProcessAttributeValue[];

	constructor() {
		this.idProcessAttribute = Guid.create().toString();
		this.values = [];
		this.generateQuestions = true;
	}
}
