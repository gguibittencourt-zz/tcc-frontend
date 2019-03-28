import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Question, Result} from "../../_models";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
	selector: 'question-evaluation',
	templateUrl: 'question-evaluation.component.html',
	styleUrls: ['question-evaluation.component.scss']
})

export class QuestionEvaluationComponent implements OnInit {
	@Input('questions') private _questions: Question[];
	@Input('results') private _results: Result[];
	@Output() onConfirmQuestion: EventEmitter<any> = new EventEmitter();
	private _questionEvaluationForms: FormGroup[] = [];

	constructor(private formBuilder: FormBuilder) {
	}

	ngOnInit() {
		this.questionEvaluationForms[0] = this.formBuilder.group({
			idResult: [''],
			idKnowledgeArea: [],
			idProcess: [''],
			idQuestion: [''],
			value: []
		});

		this.results.forEach((value, index) => {
			let form = this.formBuilder.group({
				idResult: [''],
				idKnowledgeArea: [],
				idProcess: [''],
				idQuestion: [''],
				value: []
			});

			form.patchValue(this.results[index]);
			this.questionEvaluationForms[index] = form;
		});
	}

	formatLabel(value: number | null) {
		if (!value) {
			return "0";
		}
		if (value == 1) {
			return "\n 1: Strongly Disagree";
		}
		if (value == 2) {
			return "\n 2: Disagree";
		}
		if (value == 3) {
			return "\n 3: No Opinion";
		}
		if (value == 4) {
			return "\n 4: Agree";
		}
		return "\n 5: Strongly Agree";
	}

	get questions(): Question[] {
		return this._questions;
	}

	set questions(value: Question[]) {
		this._questions = value;
	}

	get questionEvaluationForms(): FormGroup[] {
		return this._questionEvaluationForms;
	}

	set questionEvaluationForms(value: FormGroup[]) {
		this._questionEvaluationForms = value;
	}

	get results(): Result[] {
		return this._results;
	}

	set results(value: Result[]) {
		this._results = value;
	}
}
