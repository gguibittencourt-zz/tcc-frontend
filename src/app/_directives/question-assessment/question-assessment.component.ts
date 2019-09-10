import {Component, Input, OnInit} from '@angular/core';
import {ExpectedResult, ProcessAttribute, Question, Result, ScaleValues} from '../../_models';
import {FormGroup} from '@angular/forms';
import {groupBy} from 'lodash';

@Component({
	selector: 'question-assessment',
	templateUrl: 'question-assessment.component.html',
	styleUrls: ['question-assessment.component.scss']
})

export class QuestionAssessmentComponent implements OnInit {
	@Input('questions') questions: Question[];
	@Input('questionsProcessAttributes') questionsProcessAttributes: Question[];
	@Input('prefix') prefix: string;
	@Input('finish') finish: boolean;
	@Input('scaleValues') scaleValues: ScaleValues[];
	@Input('expectedResults') expectedResults: ExpectedResult[];
	@Input('processAttributes') processAttributes: ProcessAttribute[];
	@Input('resultForms') resultForms: FormGroup[];
	questionsByExpectedResult: any;
	idsExpectedResults: string[];
	questionsByIdProcessAttribute: any;

	ngOnInit() {
		this.questionsByExpectedResult = groupBy(this.questions, 'idExpectedResult');
		this.idsExpectedResults = Object.keys(this.questionsByExpectedResult);
		this.questionsByIdProcessAttribute = groupBy(this.questionsProcessAttributes, 'idProcessAttribute');
	}

	confirmResult(question: Question, isProcessAttribute: boolean = false) {
		const value: Result = this.getFormByIdQuestion(question).value;
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
			this.resultForms.forEach((resultForm: FormGroup) => {
				const result = resultForm.value;
				const question = questions.find(question => result.idQuestion == question.idQuestion);
				if (question) {
					resultForm.get('value').setValue(String(question.updateValue.value));
				}
			});
		}
	}

	getExpectedResultName(idExpectedResult: string, index: number): string {
		const expectedResult = this.expectedResults.find(value => value.idExpectedResult === idExpectedResult);
		return expectedResult ? this.prefix + ' ' + index + '. ' + expectedResult.name : '';
	}

	getFormByIdQuestion(question: Question) {
		return this.resultForms.find(result => {
			return result.get('idQuestion').value == question.idQuestion;
		});
	}
}
