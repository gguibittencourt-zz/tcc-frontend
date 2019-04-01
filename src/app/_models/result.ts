import {Guid} from "guid-typescript";

export class Result {
    idResult: string;
    idKnowledgeArea: number;
    idProcess: string;
    idQuestion: string;
    value: any;

	constructor(idKnowledgeArea: number, idProcess: string, idQuestion: string) {
		this.idResult = Guid.create().toString();
		this.idKnowledgeArea = idKnowledgeArea;
		this.idProcess = idProcess;
		this.idQuestion = idQuestion;
	}
}
