export class Evaluation {
	private _idEvaluation: number;
	private _status: string;
	private _date: Date;
	private _idUser: number;
	private _idMeasurementFramework: number;

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
}
