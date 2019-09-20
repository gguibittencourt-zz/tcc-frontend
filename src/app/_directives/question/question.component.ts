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
	}

	get isPossibleConfirm(): boolean {
		return this._isPossibleConfirm;
	}

	get allValidForms(): boolean {
		return this.questionForms.every(form => form.valid);
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
		const question: Question = this.getQuestion(idQuestion);
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

	deleteQuestion(index: number): void {
		this.data.questions.splice(index, 1);
		this.questionForms.splice(index, 1);
	}

	formChange(index: number) {
		this.mapCloseAccordion.set(index, true);
	}

	changeQuestionRequired(event: any, i: number): void {
		this.questionForms[i].get('required').setValue(event.checked);
	}

	getQuestionRequired(i: number) {
		return this.questionForms[i].get('required').value;
	}

	comparer(o1: any, o2: any): boolean {
		return o1 && o2 ? o1.value === o2.value : false;
	}

	private createForm(idQuestion: string = '', idTreeNode: string = ''): FormGroup {
		const formGroup = this.formBuilder.group({
			idQuestion: [idQuestion, Validators.required],
			idProcess: [idTreeNode, Validators.required],
			idExpectedResult: ['', Validators.required],
			idProcessAttribute: [this.data.isProcessAttribute ? idTreeNode : ''],
			idProcessAttributeValue: [''],
			name: ['', Validators.required],
			tip: ['', Validators.maxLength(255)],
			type: [this.data.type, Validators.required],
			required: [true],
			defaultValue: [''],
			dependsOnAnyQuestion: [false],
			hasDataSource: [false],
			idDependentQuestion: [''],
			dependentValue: [''],
			updateValue: [''],
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
				this.newDependentValue('Verdadeiro', 5),
				this.newDependentValue('Falso', 1)
			];
		} else if (type === 'scale-nominal') {
			return [
				this.newDependentValue('Não implementado', 1),
				this.newDependentValue('Parcialmente implementado', 2),
				this.newDependentValue('Não avaliado', 3),
				this.newDependentValue('Largamente implementado', 4),
				this.newDependentValue('Totalmente implementado', 5),
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
