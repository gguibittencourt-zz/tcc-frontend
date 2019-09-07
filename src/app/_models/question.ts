﻿import {DependentValue} from "./dependent-value";

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
	dependentValue: DependentValue;
	hasDataSource: boolean;
	config: any;

	constructor(idQuestion: string) {
		this.idQuestion = idQuestion;
	}
}
