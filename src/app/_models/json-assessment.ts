import {Result} from "./result";
import {MeasurementFramework} from "./measurement-framework";
import {ReferenceModel} from "./reference-model";

export class JsonAssessment {
	measurementFramework: MeasurementFramework;
	results: Result[];
	referenceModel: ReferenceModel;
}
