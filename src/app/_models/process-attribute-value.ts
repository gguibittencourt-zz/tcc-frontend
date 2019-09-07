import {Guid} from "guid-typescript";

export class ProcessAttributeValue {
	idProcessAttributeValue: string;
	name: string;
	disable?: boolean;

	constructor() {
		this.idProcessAttributeValue = Guid.create().toString();
	}
}
