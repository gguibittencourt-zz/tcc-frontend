import {DataSourceQuestion} from "./data-source-question";

export class Question {
	idQuestion: string;
	idExpectedResult: string;
	idProcess: string;
	idProcessAttributeValue: string;
	idProcessAttribute: string;
	name: string;
	tip: string;
	type: string;
	required: boolean;
	defaultValue: any;
	dependsOnAnyQuestion: boolean;
	idDependentQuestion: string;
	dependentValue: any;
	updateValue: any;
	dataSourceQuestion: DataSourceQuestion;

	constructor(idQuestion: string) {
		this.idQuestion = idQuestion;
		this.required = true;
	}
}
