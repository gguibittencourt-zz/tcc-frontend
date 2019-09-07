import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Guid} from 'guid-typescript';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectChange} from '@angular/material';
import {DependentValue, MatQuestionDialogData, Question} from '../../_models';

@Component({
	selector: 'question',
	templateUrl: 'question.component.html',
	styleUrls: ['question.component.scss']
})

export class QuestionComponent {
	questionForms: FormGroup[] = [];
	mapCloseAccordion: Map<number, boolean> = new Map<number, boolean>();
	dependentValueByQuestion: any[] = [];
	defaultValues: any[] = [];
	private _questionRequired: boolean = true;
	private _isPossibleConfirm: boolean = true;

	constructor(private dialogRef: MatDialogRef<QuestionComponent>,
				@Inject(MAT_DIALOG_DATA) public data: MatQuestionDialogData,
				private formBuilder: FormBuilder) {
		this.fillDefaultValues(data.type);

		this.data.questions.forEach((value, index) => {
			const form = this.createForm();
			form.patchValue(this.data.questions[index]);
			this.questionForms[index] = form;
			this.mapCloseAccordion.set(index, false);
			this.createDependentValues(value.idDependentQuestion);
			this.fillDefaultValues(value.type);
		});
		this.disableResultsSelected();
	}

	get isPossibleConfirm(): boolean {
		return this._isPossibleConfirm;
	}

	get questionRequired(): boolean {
		return this._questionRequired;
	}

	get allValidForms(): boolean {
		return this.questionForms.every(form => form.valid);
	}

	get allResultsSelected(): boolean {
		if (this.data.node.processAttributeValues) {
			return this.data.node.processAttributeValues.every(value => value.disable);
		}
		return this.data.node.expectedResults.every(value => value.disable);
	}

	onNoClick(): void {
		this.dialogRef.close(false);
	}

	confirmQuestion(index: number) {
		if (this.questionForms[index].invalid) {
			return;
		}

		this._isPossibleConfirm = true;
		this.mapCloseAccordion.set(index, false);
		this.data.questions[index] = this.questionForms[index].value;
	}

	disableResultsSelected(): void {
		this.data.questions.forEach(question => {
			if (question.idExpectedResult) {
				const selected = this.data.node.expectedResults.find(expectedResult => expectedResult.idExpectedResult === question.idExpectedResult);
				selected.disable = true;
			} else {
				const selected = this.data.node.processAttributeValues.find(expectedResult => expectedResult.idProcessAttributeValue === question.idProcessAttributeValue);
				selected.disable = true;
			}

		});
	}

	addQuestion() {
		this._isPossibleConfirm = false;
		const idQuestion = Guid.create().toString();
		let question: Question = new Question(idQuestion);
		this.data.questions.push(question);
		const index: number = this.data.questions.indexOf(question);
		this.mapCloseAccordion.set(index, false);
		this.questionForms[index] = this.createForm(idQuestion, this.data.node.idTreeNode);
	}

	doChangeValue(event: MatSelectChange) {
		this.createDependentValues(event.value);
	}

	createDependentValues(idQuestion: string) {
		let question: Question = this.getQuestion(idQuestion);
		if (question) {
			this.dependentValueByQuestion = this.createValues(question.type);
		}
	}

	getQuestion(idQuestion: string): Question {
		return this.data.questions.find(value => value.idQuestion === idQuestion);
	}

	dependsOnAnyQuestion(index: number): boolean {
		return this.questionForms[index].controls['dependsOnAnyQuestion'].value;
	}

	getQuestions(index: number): Question[] {
		return this.data.questions.filter(value => this.data.questions.indexOf(value) < index);
	}

	deleteQuestion(index: number): void {
		const questionDeleted = this.data.questions[index];
		const expectedResult = this.data.node.expectedResults.find(expectedResult => expectedResult.idExpectedResult === questionDeleted.idExpectedResult);
		if (expectedResult) {
			expectedResult.disable = false;
		}
		this.data.questions.splice(index, 1);
		this.questionForms.splice(index, 1);
	}

	formChange(index: number) {
		this.mapCloseAccordion.set(index, true);
	}

	changeQuestionRequired(event: any): void {
		this._questionRequired = event.checked;
	}

	expectedResultSelected(indexQuestion: number, event: any): void {
		const oldIdExpectedResult = this.questionForms[indexQuestion].controls['idExpectedResult'].value;
		const expectedResult = this.data.node.expectedResults.find(expectedResult => expectedResult.idExpectedResult === event);
		expectedResult.disable = true;

		const oldExpectedResult = this.data.node.expectedResults.find(expectedResult => expectedResult.idExpectedResult === oldIdExpectedResult);
		if (oldExpectedResult) {
			oldExpectedResult.disable = false;
		}
	}

	processAttributeValueSelected(indexQuestion: number, event: any): void {
		const oldIdExpectedResult = this.questionForms[indexQuestion].controls['idProcessAttributeValue'].value;
		const processAttributeValue = this.data.node.processAttributeValues
			.find(processAttributeValue => processAttributeValue.idProcessAttributeValue === event);
		processAttributeValue.disable = true;

		const oldExpectedResult = this.data.node.processAttributeValues
			.find(processAttributeValue => processAttributeValue.idProcessAttributeValue === oldIdExpectedResult);
		if (oldExpectedResult) {
			oldExpectedResult.disable = false;
		}
	}

	private createForm(idQuestion: string = '', idTreeNode: string = ''): FormGroup {
		const formGroup = this.formBuilder.group({
			idQuestion: [idQuestion, Validators.required],
			idProcess: [idTreeNode, Validators.required],
			idExpectedResult: ['', Validators.required],
			idProcessAttribute: [idTreeNode],
			idProcessAttributeValue: [''],
			name: ['', Validators.required],
			tip: ['', Validators.maxLength(255)],
			type: [this.data.type, Validators.required],
			required: [true],
			defaultValue: [''],
			dependsOnAnyQuestion: [false],
			hasDataSource: [false],
			idDependentQuestion: [''],
			dependentValue: this.formBuilder.group({
				id: [],
				title: [],
				value: []
			}),
			config: this.formBuilder.group({
				minCharacters: [],
				maxCharacters: [],
				maxValue: [],
				minValue: []
			})
		});
		if (this.data.node.processAttributeValues) {
			formGroup.get('idExpectedResult').setValidators(null);
			formGroup.get('idProcess').setValidators(null);
			formGroup.get('idProcessAttribute').setValidators(Validators.required);
			formGroup.get('idProcessAttributeValue').setValidators(Validators.required);
		}
		return formGroup;
	}

	private createValues(type: string) {
		if (type === 'boolean') {
			return [
				this.newDependentValue('Verdadeiro', true),
				this.newDependentValue('Falso', false)
			];
		} else if (type === 'scale-nominal') {
			return [
				this.newDependentValue('Não ainda', 1),
				this.newDependentValue('Não implementado', 2),
				this.newDependentValue('Parcialmente implementado', 3),
				this.newDependentValue('Largamente implementado', 4),
				this.newDependentValue('Totalmente implementado', 5),
			];
		} else if (type === 'scale-numeric') {
			return [
				this.newDependentValue('1', 1),
				this.newDependentValue('2', 2),
				this.newDependentValue('3', 3),
				this.newDependentValue('4', 4),
				this.newDependentValue('5', 5),
			];
		}
	}

	private newDependentValue(title: string, value: any): DependentValue {
		return new DependentValue(title, value);
	}

	private fillDefaultValues(type: string) {
		this.defaultValues = this.createValues(type);
	}
}
