import {DependentValue} from "./dependent-value";

export class Question {
	private _idQuestion: string;
	private _idExpectedResult: string;
	private _idProcess: string;
	private _name: string;
	private _tip: string;
	private _type: string;
	private _dependsOnAnyQuestion: boolean;
	private _idDependentQuestion: string;
	private _dependentValue: DependentValue;
	private _hasDataSource: boolean;
	private _config: any;

	get idQuestion(): string {
		return this._idQuestion;
	}

	set idQuestion(value: string) {
		this._idQuestion = value;
	}

	get idExpectedResult(): string {
		return this._idExpectedResult;
	}

	set idExpectedResult(value: string) {
		this._idExpectedResult = value;
	}

	get idProcess(): string {
		return this._idProcess;
	}

	set idProcess(value: string) {
		this._idProcess = value;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get tip(): string {
		return this._tip;
	}

	set tip(value: string) {
		this._tip = value;
	}

	get type(): string {
		return this._type;
	}

	set type(value: string) {
		this._type = value;
	}

	get dependsOnAnyQuestion(): boolean {
		return this._dependsOnAnyQuestion;
	}

	set dependsOnAnyQuestion(value: boolean) {
		this._dependsOnAnyQuestion = value;
	}


	get idDependentQuestion(): string {
		return this._idDependentQuestion;
	}

	set idDependentQuestion(value: string) {
		this._idDependentQuestion = value;

	}

	get hasDataSource(): boolean {
		return this._hasDataSource;
	}

	set hasDataSource(value: boolean) {
		this._hasDataSource = value;
	}

	get config(): any {
		return this._config;
	}

	set config(value: any) {
		this._config = value;
	}


	get dependentValue(): DependentValue {
		return this._dependentValue;
	}

	set dependentValue(value: DependentValue) {
		this._dependentValue = value;
	}
}
