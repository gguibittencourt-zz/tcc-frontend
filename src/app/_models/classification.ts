import {Level} from "./level";
import {Guid} from "guid-typescript";

export class Classification {
	idClassification: string;
	name: string;
	capacityLevels: string[];
	levels: Level[];

	constructor() {
		this.idClassification = Guid.create().toString();
		this.levels = [];
		this.capacityLevels = [];
	}
}
