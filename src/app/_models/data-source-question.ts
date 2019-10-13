import {UpdateValue} from "./update-value";

export class DataSourceQuestion {
	idDataSource: number;
	path: string;
	typeReturn: string;
	valueReturn: string;
	updateValues: UpdateValue[] = [];
}
