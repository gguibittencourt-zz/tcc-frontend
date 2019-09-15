import {Result} from "./result";
import {MeasurementFramework} from "./measurement-framework";
import {ReferenceModel} from "./reference-model";
import {Classification} from "./classification";
import {LevelResult} from "./level-result";
import {Company} from "./company";

export class JsonAssessment {
	measurementFramework: MeasurementFramework;
	targetLevel: Classification;
	results: Result[];
	referenceModel: ReferenceModel;
	levelResults: LevelResult[];
	company: Company;
	assessmentResult: string;
}
