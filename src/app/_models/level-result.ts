import {Classification} from "./classification";
import {ProcessResult} from "./process-result";

export class LevelResult {
	processes: ProcessResult[];
	classification: Classification;
	ratingByProcessAttribute: any[];
	result: string;
}
