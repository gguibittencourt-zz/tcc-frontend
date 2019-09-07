import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExpectedResult, ProcessAttribute, Question, Result, ScaleValues} from '../../_models';
import {FormBuilder, FormGroup} from '@angular/forms';
import {groupBy} from 'lodash'

@Component({
	selector: 'question-assessment',
	templateUrl: 'question-assessment.component.html',
	styleUrls: ['question-assessment.component.scss']
})

export class QuestionAssessmentComponent implements OnInit {
	@Input('questions') questions: Question[];
	@Input('questionsProcessAttributes') questionsProcessAttributes: Question[];
	@Input('results') results: Result[];
	@Input('prefix') prefix: string;
	@Input('scaleValues') scaleValues: ScaleValues[];
	@Input('expectedResults') expectedResults: ExpectedResult[];
	@Input('processAttributes') processAttributes: ProcessAttribute[];
	@Output() onConfirmResult: EventEmitter<any> = new EventEmitter();
	questionAssessmentForms: FormGroup[] = [];
	questionsByExpectedResult: any;
	idsExpectedResults: string[];
	questionsByIdProcessAttribute: any;

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
			const result = this.results[index];
			this.questionAssessmentForms[index] = this.formBuilder.group({
				idResult: [result.idResult],
				idKnowledgeArea: [result.idKnowledgeArea],
				idProcess: [result.idProcess],
				idQuestion: [result.idQuestion],
				value: [result.value]
			});
		});

		this.questionsByExpectedResult = groupBy(this.questions, 'idExpectedResult');
		this.idsExpectedResults = Object.keys(this.questionsByExpectedResult);
		this.questionsByIdProcessAttribute = groupBy(this.questionsProcessAttributes, 'idProcessAttribute');
	}

	confirmResult(index: number) {
		const value: Result = this.questionAssessmentForms[index].value;
		if (value.value) {
			this.onConfirmResult.emit(value);
		}
	}

	getExpectedResultName(idExpectedResult: string, index: number): string {
		const expectedResult = this.expectedResults.find(value => value.idExpectedResult === idExpectedResult);
		return expectedResult ? this.prefix + ' ' + index + '. ' +expectedResult.name  : '';
	}
}
