import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Guid} from "guid-typescript";
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectChange} from "@angular/material";
import {DependentValue, MatQuestionDialogData, Question} from "../../_models";

@Component({
	selector: 'question',
	templateUrl: 'question.component.html',
	styleUrls: ['question.component.scss']
})

export class QuestionComponent {
	questionForms: FormGroup[] = [];
	mapCloseAccordion: Map<number, boolean> = new Map<number, boolean>();
	dependentValueByQuestion: any[] = [];
	private _isPossibleConfirm: boolean = true;

	constructor(private dialogRef: MatDialogRef<QuestionComponent>,
				@Inject(MAT_DIALOG_DATA) public data: MatQuestionDialogData,
				private formBuilder: FormBuilder) {

		this.data.questions.forEach((value, index) => {
			let form = this.createForm();
			form.patchValue(this.data.questions[index]);
			this.questionForms[index] = form;
			this.mapCloseAccordion.set(index, false);
			this.createDependentValues(value.idDependentQuestion);
		});
	}

	get isPossibleConfirm(): boolean {
		return this._isPossibleConfirm;
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
		if (this.allValidForms()) {
			this._isPossibleConfirm = false;
			let question: Question = new Question();
			this.data.questions.push(question);
			const index: number = this.data.questions.indexOf(question);
			this.mapCloseAccordion.set(index, false);
			this.questionForms[index] = this.createForm(Guid.create().toString(), this.data.node.idTreeNode);
		}
	}

	doChangeValue(event: MatSelectChange) {
		this.createDependentValues(event.value);
	}

	createDependentValues(idQuestion: string) {
		let question: Question = this.getQuestion(idQuestion);
		if (question) {
			if (question.type === "boolean") {
				this.dependentValueByQuestion = [
					this.newDependentValue("true", "Verdadeiro", true),
					this.newDependentValue("false", "Falso", false)
				];
			} else if (question.type === "scale") {
				this.dependentValueByQuestion = [
					this.newDependentValue("1", "Não ainda", 1),
					this.newDependentValue("2", "Não implementado", 2),
					this.newDependentValue("3", "Parcialmente implementado", 3),
					this.newDependentValue("4", "Largamente implementado", 4),
					this.newDependentValue("5", "Totalmente implementado", 5),
				];
			} else if (question.type === "numeric") {
				this.dependentValueByQuestion = [
					this.newDependentValue("greaterThanEqual", "Maior e igual", 0),
					this.newDependentValue("lessThanEqual", "Menor e igual", 0),
				];
			} else {
				this.dependentValueByQuestion = [
					this.newDependentValue("contains", "Contém", ""),
					this.newDependentValue("equal", "Igual", ""),
				];
			}
		} else {
			this.dependentValueByQuestion = [];
		}
	}

	hasInputValueNumeric(index: number) {
		let value = this.questionForms[index].controls["dependentValue"].value;
		return value != null && (value.id === "lessThanEqual" || value.id === "greaterThanEqual");
	}

	hasInputValueText(index: number) {
		let value = this.questionForms[index].controls["dependentValue"].value;
		return value != null && (value.id === "equal" || value.id === "contains");
	}

	getMinLength(index: number) {
		let value = this.questionForms[index].controls["config"].value;
		return value.minCharacters;
	}

	getMaxLength(index: number) {
		let value = this.questionForms[index].controls["config"].value;
		return value.maxCharacters;
	}

	getQuestion(idQuestion: string): Question {
		return this.data.questions.find(value => value.idQuestion === idQuestion);
	}

	dependsOnAnyQuestion(index: number): boolean {
		return this.questionForms[index].controls["dependsOnAnyQuestion"].value;
	}

	getQuestions(index: number): Question[] {
		return this.data.questions.filter(value => this.data.questions.indexOf(value) < index);
	}

	isType(index: number, type: string): boolean {
		return this.questionForms[index].controls["type"].value === type;
	}

	deleteQuestion(index: number): void {
		this.data.questions.splice(index, 1);
		this.questionForms.splice(index, 1);
	}

	formChange(index: number) {
		this.mapCloseAccordion.set(index, true);
	}

	cancelQuestion(index: number) {
		this.mapCloseAccordion.set(index, false);
	}

	allValidForms(): boolean {
		return this.questionForms.every(form => form.valid);
	}

	private createForm(idQuestion: string = '', idProcess: string = ''): FormGroup {
		return this.formBuilder.group({
			idQuestion: [idQuestion, Validators.required],
			idProcess: [idProcess, Validators.required],
			idExpectedResult: ['', Validators.required],
			name: ['', Validators.required],
			tip: ['', Validators.maxLength(255)],
			type: [this.data.type, Validators.required],
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
	}

	private newDependentValue(id: string, title: string, value: any): DependentValue {
		return new DependentValue(id, title, value);
	}
}
