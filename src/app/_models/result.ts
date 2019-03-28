import {Guid} from "guid-typescript";

export class Result {
    private _idResult: string;
    private _idKnowledgeArea: number;
    private _idProcess: string;
    private _idQuestion: string;
    private _value: any;

	constructor(idKnowledgeArea: number, idProcess: string, idQuestion: string) {
		this._idResult = Guid.create().toString();
		this._idKnowledgeArea = idKnowledgeArea;
		this._idProcess = idProcess;
		this._idQuestion = idQuestion;
	}

	get idResult(): string {
		return this._idResult;
	}

	set idResult(value: string) {
		this._idResult = value;
	}

	get idKnowledgeArea(): number {
		return this._idKnowledgeArea;
	}

	set idKnowledgeArea(value: number) {
		this._idKnowledgeArea = value;
	}

	get idProcess(): string {
		return this._idProcess;
	}

	set idProcess(value: string) {
		this._idProcess = value;
	}

	get idQuestion(): string {
		return this._idQuestion;
	}

	set idQuestion(value: string) {
		this._idQuestion = value;
	}

	get value(): any {
		return this._value;
	}

	set value(value: any) {
		this._value = value;
	}
}
