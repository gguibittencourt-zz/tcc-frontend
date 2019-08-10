import {DependentValue} from "./dependent-value";

export class Question {
	idQuestion: string;
	idExpectedResult: string;
	idProcess: string;
	name: string;
	tip: string;
	type: string;
	required: boolean;
	defaultValue: any;
	dependsOnAnyQuestion: boolean;
	idDependentQuestion: string;
	dependentValue: DependentValue;
	hasDataSource: boolean;
	config: any;
}
