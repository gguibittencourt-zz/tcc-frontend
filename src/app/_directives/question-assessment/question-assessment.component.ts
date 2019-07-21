import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Question, Result} from "../../_models";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
	selector: 'question-assessment',
	templateUrl: 'question-assessment.component.html',
	styleUrls: ['question-assessment.component.scss']
})

export class QuestionAssessmentComponent implements OnInit {
	@Input('questions') questions: Question[];
	@Input('results') results: Result[];
	@Output() onConfirmResult: EventEmitter<any> = new EventEmitter();
	questionAssessmentForms: FormGroup[] = [];

	constructor(private formBuilder: FormBuilder) {
	}

	ngOnInit() {
		this.questionAssessmentForms[0] = this.formBuilder.group({
			idResult: [''],
			idKnowledgeArea: [],
			idProcess: [''],
			idQuestion: [''],
			value: []
		});

		this.results.forEach((value, index) => {
			let result = this.results[index];
			this.questionAssessmentForms[index] = this.formBuilder.group({
				idResult: [result.idResult],
				idKnowledgeArea: [result.idKnowledgeArea],
				idProcess: [result.idProcess],
				idQuestion: [result.idQuestion],
				value: [result.value]
			});
		});
	}

	confirmResult(index: number) {
		let value: Result = this.questionAssessmentForms[index].value;
		if (value.value) {
			this.onConfirmResult.emit(value);
		}
	}
}
