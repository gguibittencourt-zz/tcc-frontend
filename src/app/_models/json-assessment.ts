import {Result} from "./result";
import {MeasurementFramework} from "./measurement-framework";
import {ReferenceModel} from "./reference-model";
import {Classification} from "./classification";

export class JsonAssessment {
	measurementFramework: MeasurementFramework;
	targetLevel: Classification;
	results: Result[];
	referenceModel: ReferenceModel;
}
