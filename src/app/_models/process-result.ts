import {Process} from "./process";
import {Result} from "./result";
import {CapacityResult} from "./capacity-result";

export class ProcessResult {
	process: Process;
	resultsWithError: Result[];
	capacityResults: CapacityResult[];
}
