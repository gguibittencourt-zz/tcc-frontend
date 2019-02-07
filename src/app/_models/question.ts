﻿export class Question {
	private _idQuestion: string;
	private _name: string;
	private _tip: string;

	get idQuestion(): string {
		return this._idQuestion;
	}

	set idQuestion(value: string) {
		this._idQuestion = value;
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
}
