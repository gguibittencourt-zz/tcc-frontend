import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Guid} from "guid-typescript";
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectChange} from "@angular/material";
import {MatDialogData, Question, DependentValue} from "../../_models";

@Component({
	selector: 'question',
	templateUrl: 'question.component.html',
	styleUrls: ['question.component.scss']
})

export class QuestionComponent {
	private _questionForms: FormGroup[] = [];
	private _mapCloseAccordion: Map<number, boolean> = new Map<number, boolean>();
	private _dependentValueByQuestion: any[] = [];

	constructor(private _dialogRef: MatDialogRef<QuestionComponent>,
				@Inject(MAT_DIALOG_DATA) public data: MatDialogData,
				private formBuilder: FormBuilder) {

		this.questionForms[0] = this.formBuilder.group({
			idQuestion: [Guid.create().toString()],
			idProcess: ['', Validators.required],
			idExpectedResult: ['', Validators.required],
			name: ['', Validators.required],
			tip: ['', Validators.required],
			type: ['', Validators.required],
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
		this.mapCloseAccordion.set(0, false);

		this.data.questions.forEach((value, index) => {
			let form = this.formBuilder.group({
				idQuestion: ['', Validators.required],
				idProcess: ['', Validators.required],
				idExpectedResult: ['', Validators.required],
				name: ['', Validators.required],
				tip: ['', Validators.required],
				type: ['', Validators.required],
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

			form.patchValue(this.data.questions[index]);
			this.questionForms[index] = form;
			this.mapCloseAccordion.set(index, false);
			this.createDependentValues(value.idDependentQuestion);
		});
	}

	onNoClick(): void {
		this.dialogRef.close(false);
	}

	confirmQuestion(index: number) {
		if (this.questionForms[index].invalid) {
			return;
		}
		this.mapCloseAccordion.set(index, false);
		this.data.questions[index] = this.questionForms[index].value;
	}

	addQuestion() {
		let question: Question = new Question();
		this.data.questions.push(question);
		this.questionForms[this.data.questions.indexOf(question)] = this.formBuilder.group({
			idQuestion: [Guid.create().toString()],
			idProcess: [this.data.node.idTreeNode],
			idExpectedResult: ['', Validators.required],
			name: ['', Validators.required],
			tip: ['', Validators.required],
			type: ['', Validators.required],
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

	doChangeValue(event: MatSelectChange) {
		this.createDependentValues(event.value);
	}

	createDependentValues(idQuestion: string) {
		let question: Question = this.getQuestion(idQuestion);
		if (question) {
			if (question.type === "boolean") {
				this.dependentValueByQuestion = [
					this.newDependentValue("true", "Yes", true),
					this.newDependentValue("false", "No", false)
				];
			} else if (question.type === "scale") {
				this.dependentValueByQuestion = [
					this.newDependentValue("1", "1", 1),
					this.newDependentValue("2", "2", 2),
					this.newDependentValue("3", "3", 3),
					this.newDependentValue("4", "4", 4),
					this.newDependentValue("5", "5", 5),
				];
			} else if (question.type === "numeric") {
				this.dependentValueByQuestion = [
					this.newDependentValue("greaterThanEqual", "Greater Than Equal", 0),
					this.newDependentValue("lessThanEqual", "Less Than Equal", 0),
				];
			} else {

			}
		}
	}

	hasInputValue(index: number) {
		let value = this.questionForms[index].controls["dependentValue"].value;
		return value != null && (value.id === "lessThanEqual" || value.id === "greaterThanEqual");
	}

	private newDependentValue(id: string, title: string, value: any): DependentValue {
		return new DependentValue(id, title, value);
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
	}

	formChange(index: number) {
		this.mapCloseAccordion.set(index, true);
	}

	cancelQuestion(index: number) {
		this.mapCloseAccordion.set(index, false);
	}

	get questionForms(): FormGroup[] {
		return this._questionForms;
	}

	get mapCloseAccordion(): Map<number, boolean> {
		return this._mapCloseAccordion;
	}

	get dialogRef(): MatDialogRef<QuestionComponent> {
		return this._dialogRef;
	}

	get dependentValueByQuestion(): any[] {
		return this._dependentValueByQuestion;
	}

	set dependentValueByQuestion(value: any[]) {
		this._dependentValueByQuestion = value;
	}
}
