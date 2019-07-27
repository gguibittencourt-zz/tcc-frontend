import {Guid} from "guid-typescript";

export class MetricScale {

	idMetricScale: string;
	name: string;
	values?: MetricScale[];
	valueMetrics?: MetricScale[];

	constructor() {
		this.idMetricScale = Guid.create().toString();
		this.name = '';
		this.values = [];
		this.valueMetrics = [];
	}
}
