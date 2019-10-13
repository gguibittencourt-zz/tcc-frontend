import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Guid} from 'guid-typescript';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSelectChange} from '@angular/material';
import {DataSource, DependentValue, MatQuestionDialogData, Question, UpdateValue, User} from '../../_models';
import {AuthenticationService, DataSourceService} from "../../_services";
import {DataSourceDialogComponent} from "../data-source-dialog";

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
	dataSources: DataSource[];
	updateValues: Map<number, UpdateValue[]> = new Map<number, UpdateValue[]>();
	private _isPossibleConfirm: boolean = true;

	constructor(private dialogRef: MatDialogRef<QuestionComponent>,
				private  dialog: MatDialog,
				@Inject(MAT_DIALOG_DATA) public data: MatQuestionDialogData,
				private formBuilder: FormBuilder,
				private authenticationService: AuthenticationService,
				private dataSourceService: DataSourceService) {
		this.fillDefaultValues(data.type);

		this.data.questions.forEach((value, index) => {
			const form = this.createForm();
			const question = this.data.questions[index];
			this.updateValues.set(index, question.dataSourceQuestion ? question.dataSourceQuestion.updateValues : [new UpdateValue()]);
			form.patchValue(question);
			this.questionForms[index] = form;
			this.mapCloseAccordion.set(index, false);
			this.createDependentValues(value.idDependentQuestion);
			this.fillDefaultValues(value.type);
		});

		this.dataSourceService.list(this.getUser.idCompany).subscribe(value => {
			this.dataSources = value as DataSource[];
		});
	}

	get getUser(): User {
		let user = null;
		this.authenticationService.isUserIn.subscribe(currentUser => user = currentUser);
		return user;
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
		const value: Question = this.questionForms[index].value;
		value.dataSourceQuestion.updateValues = this.updateValues.get(0);
		this.data.questions[index] = value;
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

	getTypeReturn(i: number) {
		return this.questionForms[i].controls['dataSourceQuestion'].get('typeReturn').value;
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

	changeHasDataSource(event: any, i: number): void {
		this.questionForms[i].get('hasDataSource').setValue(event.checked);
	}

	hasDataSource(i: number) {
		return this.questionForms[i].get('hasDataSource').value;
	}

	getQuestionRequired(i: number) {
		return this.questionForms[i].get('required').value;
	}

	comparer(o1: any, o2: any): boolean {
		return o1 && o2 ? String(o1) == String(o2) || (o1.value && o2.value && o1.value == o2.value) : false;
	}

	changeType(event: any) {
		this.fillDefaultValues(event);
	}

	addUpdateValue(indexQuestion: number) {
		const updateValue = new UpdateValue();
		this.updateValues.get(indexQuestion).push(updateValue);
	}

	isLastUpdateValue(indexQuestion: number, indexUpdateValue: number) {
		return (indexUpdateValue + 1) === this.updateValues.get(indexQuestion).length;
	}

	deleteUpdateValue(indexQuestion: number, indexUpdateValue: number) {
		this.updateValues.get(indexQuestion).splice(indexUpdateValue, 1);
	}

	openDialogDataSource(index: number): void {
		const dialogRef = this.dialog.open(DataSourceDialogComponent, {
			height: '90%',
			width: '80%',
			disableClose: true
		});

		dialogRef.afterClosed().subscribe((result: DataSource) => {
			if (result) {
				this.dataSources.push(result);
				this.questionForms[index].get('dataSourceQuestion').get('idDataSource').setValue(result.idDataSource);
			}
		});
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
			idDependentQuestion: [''],
			dependentValue: [''],
			updateValue: [''],
			hasDataSource: [false],
			dataSourceQuestion: this.formBuilder.group({
				idDataSource: [],
				path: [''],
				typeReturn: [],
				valueReturn: [],
				updateValue: this.formBuilder.array([{
					config: [''],
					valueConfig: [''],
					valueResult: ['']
				}])
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
				this.newDependentValue('Verdadeiro', 4),
				this.newDependentValue('Falso', 1)
			];
		} else if (type === 'scale-nominal') {
			return this.data.ratings.map(rating => {
				return this.newDependentValue(rating.mappedName, rating.id);
			});
		}
	}

	private newDependentValue(title: string, value: any): DependentValue {
		return new DependentValue(title, value);
	}

	private fillDefaultValues(type: string) {
		this.defaultValues = this.createValues(type);
	}
}
