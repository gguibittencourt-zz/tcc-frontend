import {Guid} from "guid-typescript";
import {ProcessAttribute} from "./process-attribute";

export class CapacityLevel {
	idCapacityLevel: string;
	name: string;
	processAttributes: ProcessAttribute[];

	constructor() {
		this.idCapacityLevel = Guid.create().toString();
		this.processAttributes = [];
	}
}
