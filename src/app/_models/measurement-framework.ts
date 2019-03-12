import {Question} from "./question";
import {Goal} from "./goal";

export class MeasurementFramework {
    private _idMeasurementFramework: number;
    private _name: string;
    private _idReferenceModel: number;
	private _questions?: Question[];
	private _goals?: Goal[];

	get idMeasurementFramework(): number {
		return this._idMeasurementFramework;
	}

	set idMeasurementFramework(value: number) {
		this._idMeasurementFramework = value;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get idReferenceModel(): number {
		return this._idReferenceModel;
	}

	set idReferenceModel(value: number) {
		this._idReferenceModel = value;
	}

	get questions(): Question[] {
		if (!this._questions) {
			this._questions = [];
		}
		return this._questions;
	}

	set questions(value: Question[]) {
		this._questions = value;
	}

	get goals(): Goal[] {
		if (!this._goals) {
			this._goals = [];
		}
		return this._goals;
	}

	set goals(value: Goal[]) {
		this._goals = value;
	}
}
