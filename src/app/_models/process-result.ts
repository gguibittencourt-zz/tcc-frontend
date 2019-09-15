import {Process} from "./process";
import {Result} from "./result";

export class ProcessResult {
	process: Process;
	resultsWithError: Result[];
	result: string;
}
