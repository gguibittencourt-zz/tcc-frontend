import {Component, Input} from '@angular/core';
import {Process, Question, Rating, Result, ScaleValues} from '../../_models';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'question-assessment',
	templateUrl: 'question-assessment.component.html',
	styleUrls: ['question-assessment.component.scss']
})

export class QuestionAssessmentComponent {
	@Input('questions') questions: Question[];
	@Input('process') process: Process;
	@Input('finish') finish: boolean;
	@Input('ratings') ratings: Rating[];
	@Input('resultForms') resultForms: FormGroup[];
	readonly REGEX_LINK = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

	confirmResult(question: Question) {
		const value: Result = this.getFormByIdQuestion(question).value;
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

	getFormByIdQuestion(question: Question) {
		return this.resultForms.find(result => {
			return result.get('idQuestion').value == question.idQuestion && this.process.idProcess == result.get('idProcess').value;
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
			return this.ratings[0].mappedName;
		}
	}

	getLastTooltip(question: Question) {
		if (question.type === 'boolean') {
			return 'Verdadeiro';
		}
		if (question.type === 'scale-nominal') {
			return this.ratings[3].mappedName;
		}
	}
}
