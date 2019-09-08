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
		this.results.forEach(result => {
			const formGroup = this.formBuilder.group({
				idResult: [result.idResult],
				idKnowledgeArea: [result.idKnowledgeArea],
				idProcess: [result.idProcess],
				idExpectedResult: [result.idExpectedResult],
				idQuestion: [result.idQuestion],
				idProcessAttribute: [result.idProcessAttribute],
				idProcessAttributeValue: [result.idProcessAttributeValue],
				value: [result.value]
			});
			this.questionAssessmentForms.push(formGroup);
		});

		this.questionsByExpectedResult = groupBy(this.questions, 'idExpectedResult');
		this.idsExpectedResults = Object.keys(this.questionsByExpectedResult);
		this.questionsByIdProcessAttribute = groupBy(this.questionsProcessAttributes, 'idProcessAttribute');
	}

	confirmResult(idQuestion: string, isProcessAttribute: boolean = false) {
		const value: Result = this.getFormByIdQuestion(idQuestion).value;
		let questions: Question[] = [];
		if (isProcessAttribute) {
			questions = this.questionsProcessAttributes.filter(question => {
				return question.dependsOnAnyQuestion && question.idDependentQuestion == value.idQuestion && value.value == String(question.dependentValue.value);
			});
		} else {
			questions = this.questions.filter(question => {
				return question.dependsOnAnyQuestion && question.idDependentQuestion == value.idQuestion && value.value == String(question.dependentValue.value);
			});
		}

		if (questions) {
			this.results.forEach(result => {
				const question = questions.find(question => result.idQuestion == question.idQuestion);
				if (question) {
					result.value = String(question.updateValue.value);
					const form = this.getFormByIdQuestion(result.idQuestion);
					form.get('value').setValue(String(question.updateValue.value));
					this.onConfirmResult.emit(result);
					this.confirmResult(question.idQuestion, isProcessAttribute);
				}
			});

		}

		if (value.value) {
			this.onConfirmResult.emit(value);
		}
	}

	getExpectedResultName(idExpectedResult: string, index: number): string {
		const expectedResult = this.expectedResults.find(value => value.idExpectedResult === idExpectedResult);
		return expectedResult ? this.prefix + ' ' + index + '. ' + expectedResult.name : '';
	}

	getFormByIdQuestion(idQuestion: string) {
		return this.questionAssessmentForms.find(form => form.get('idQuestion').value == idQuestion);
	}
}
