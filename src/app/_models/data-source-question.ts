import {UpdateValue} from "./update-value";
import {DataSource} from "./data-source";

export class DataSourceQuestion {
	dataSource: DataSource;
	path: string;
	typeReturn: string;
	valueReturn: string;
	updateValues: UpdateValue[] = [];
}
