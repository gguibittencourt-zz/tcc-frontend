import {Result} from "./result";

export class Evaluation {
	private _idEvaluation: number;
	private _status: string;
	private _date: Date;
	private _idUser: number;
	private _idMeasurementFramework: number;
	private _results: Result[];

	get idEvaluation(): number {
		return this._idEvaluation;
	}

	set idEvaluation(value: number) {
		this._idEvaluation = value;
	}

	get status(): string {
		return this._status;
	}

	set status(value: string) {
		this._status = value;
	}

	get date(): Date {
		return this._date;
	}

	set date(value: Date) {
		this._date = value;
	}

	get idUser(): number {
		return this._idUser;
	}

	set idUser(value: number) {
		this._idUser = value;
	}

	get idMeasurementFramework(): number {
		return this._idMeasurementFramework;
	}

	set idMeasurementFramework(value: number) {
		this._idMeasurementFramework = value;
	}

	get results(): Result[] {
		return this._results;
	}

	set results(value: Result[]) {
		this._results = value;
	}
}
