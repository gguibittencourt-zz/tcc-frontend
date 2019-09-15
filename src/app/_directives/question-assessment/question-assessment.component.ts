import {Component, Input, OnInit} from '@angular/core';
import {ExpectedResult, ProcessAttribute, Question, Result, ScaleValues} from '../../_models';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'question-assessment',
	templateUrl: 'question-assessment.component.html',
	styleUrls: ['question-assessment.component.scss']
})

export class QuestionAssessmentComponent {
	@Input('questions') questions: Question[];
	@Input('prefix') prefix: string;
	@Input('finish') finish: boolean;
	@Input('scaleValues') scaleValues: ScaleValues[];
	@Input('resultForms') resultForms: FormGroup[];
	readonly REGEX_LINK = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

	confirmResult(question: Question, isProcessAttribute: boolean = false) {
		const value: Result = this.getFormByIdQuestion(question, isProcessAttribute).value;
		const questions: Question[] = this.questions.filter(question => {
				return question.dependsOnAnyQuestion && question.idDependentQuestion == value.idQuestion && value.value == String(question.dependentValue.value);
			});

		this.resultForms.forEach((resultForm: FormGroup) => {
			const result = resultForm.value;
			const question = questions.find(question => result.idQuestion == question.idQuestion);
			if (question) {
				resultForm.get('value').setValue(String(question.updateValue.value));
			}
		});
	}

	getFormByIdQuestion(question: Question, isProcessAttribute: boolean = false) {
		return this.resultForms.find(result => {
			if (isProcessAttribute) {
				return result.get('idQuestion').value == question.idQuestion &&
					result.get('idProcessAttribute').value == question.idProcessAttribute;
			}
			return result.get('idQuestion').value == question.idQuestion;
		});
	}

	isLink(tip: string) {
		return this.REGEX_LINK.test(tip);
	}

	openLink(tip: string) {
		window.open(tip, '_blank');
	}

	getFirstTooltip(question: Question) {
		if (question.type === 'boolean') {
			return 'Falso';
		}
		if (question.type === 'scale-nominal') {
			return this.scaleValues[0].value;
		}
		if (question.type === 'scale-numeric') {
			return '1';
		}
	}

	getLastTooltip(question: Question) {
		if (question.type === 'boolean') {
			return 'Verdadeiro';
		}
		if (question.type === 'scale-nominal') {
			return this.scaleValues[4].value;
		}
		if (question.type === 'scale-numeric') {
			return '5';
		}
	}
}
