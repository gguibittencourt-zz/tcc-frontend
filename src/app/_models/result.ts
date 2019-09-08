import {Guid} from "guid-typescript";

export class Result {
    idResult: string;
    idKnowledgeArea: string;
    idProcess: string;
    idExpectedResult: string;
	idProcessAttribute: string;
	idProcessAttributeValue: string;
    idQuestion: string;
    value: any;

	constructor(idKnowledgeArea: string, idProcess: string, idQuestion: string, idExpectedResult: string, idProcessAttribute: string, idProcessAttributeValue: string) {
		this.idResult = Guid.create().toString();
		this.idKnowledgeArea = idKnowledgeArea;
		this.idProcess = idProcess;
		this.idQuestion = idQuestion;
		this.idExpectedResult = idExpectedResult;
		this.idProcessAttribute = idProcessAttribute;
		this.idProcessAttributeValue = idProcessAttributeValue;
	}
}
