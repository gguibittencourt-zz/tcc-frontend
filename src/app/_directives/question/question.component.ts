import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Guid} from "guid-typescript";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {MatDialogData, Question} from "../../_models";

@Component({
	selector: 'question',
	templateUrl: 'question.component.html',
	styleUrls: ['question.component.scss']
})

export class QuestionComponent {
	private _questionForms: FormGroup[] = [];
	private _mapCloseAccordion: Map<number, boolean> = new Map<number, boolean>();

	constructor(private _dialogRef: MatDialogRef<QuestionComponent>,
				@Inject(MAT_DIALOG_DATA) public data: MatDialogData,
				private formBuilder: FormBuilder) {

		this.questionForms[0] = this.formBuilder.group({
			idQuestion: [Guid.create().toString()],
			idProcess: ['', Validators.required],
			idExpectedResult: ['', Validators.required],
			name: ['', Validators.required],
			tip: ['', Validators.required],
		});
		this.mapCloseAccordion.set(0, false);

		this.data.questions.forEach((value, index) => {
			let form = this.formBuilder.group({
				idQuestion: ['', Validators.required],
				idProcess: ['', Validators.required],
				idExpectedResult: ['', Validators.required],
				name: ['', Validators.required],
				tip: ['', Validators.required],
			});

			form.patchValue(this.data.questions[index]);
			this.questionForms[index] = form;
			this.mapCloseAccordion.set(index, false);
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
		});
	}

	deleteQuestion(index: number) {
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
}
