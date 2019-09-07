import {Guid} from "guid-typescript";

export class ProcessAttributeValue {
	idProcessAttributeValue: string;
	name: string;

	constructor() {
		this.idProcessAttributeValue = Guid.create().toString();
	}
}
