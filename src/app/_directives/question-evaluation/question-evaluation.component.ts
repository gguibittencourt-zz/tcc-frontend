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
			let result = this.results[index];
			this.questionEvaluationForms[index] = this.formBuilder.group({
				idResult: [result.idResult],
				idKnowledgeArea: [result.idKnowledgeArea],
				idProcess: [result.idProcess],
				idQuestion: [result.idQuestion],
				value: [result.value]
			});
		});
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
