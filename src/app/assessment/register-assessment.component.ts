import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {
	AssessmentService,
	AuthenticationService,
	CompanyService,
	MeasurementFrameworkService,
	ReferenceModelService
} from '../_services';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
	Assessment,
	Classification,
	Company,
	JsonAssessment,
	KnowledgeArea,
	LevelResult,
	MeasurementFramework,
	Process,
	ProcessAttribute,
	ProcessAttributeResult,
	ProcessResult,
	ProcessResultDialogData,
	Question,
	Rating,
	ReferenceModel,
	Result,
	User
} from "../_models";
import {flatMap, groupBy, indexOf, uniqBy} from "lodash";
import {Guid} from "guid-typescript";
import {MatDialog, MatHorizontalStepper, MatSnackBar} from "@angular/material";
import {SnackBarComponent} from "../_directives/snack-bar";
import {CompanyDialogComponent} from "../_directives/company-dialog";
import {ProcessResultDialogComponent} from "../_directives/process-result-dialog";

@Component({
	templateUrl: './register-assessment.component.html',
	styleUrls: ['register-assessment.component.scss']

})
export class RegisterAssessmentComponent implements OnInit {
	assessmentForm: FormGroup;
	loading = false;
	submitted = false;
	idAssessment: number = null;
	assessment: Assessment;
	referenceModel: ReferenceModel;
	measurementFrameworks: MeasurementFramework[] = [];
	measurementFramework: MeasurementFramework;
	classifications: Classification[];
	classification: Classification;
	processes: Process[];
	processAttributes: ProcessAttribute[];
	isFinish: boolean = false;
	openResult: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private assessmentService: AssessmentService,
		private measurementFrameworkService: MeasurementFrameworkService,
		private referenceModelService: ReferenceModelService,
		private authenticationService: AuthenticationService,
		private companyService: CompanyService,
		private snackBar: MatSnackBar,
		private dialog: MatDialog) {
	}

	ngOnInit(): void {
		this.assessment = new Assessment();
		this.measurementFrameworkService.list().subscribe((data: MeasurementFramework[]) => {
			this.measurementFrameworks = data;
		});

		this.assessmentForm = this.formBuilder.group({
			idAssessment: [],
			status: [''],
			idUser: [this.getUser.idUser],
			date: [],
			jsonAssessment: this.formBuilder.group({
				company: [],
				measurementFramework: [, Validators.required],
				referenceModel: [],
				results: [],
				targetLevel: [, Validators.required],
				levelResults: [],
				assessmentResult: ['']
			})
		});

		this.companyService.get(this.getUser.idCompany).subscribe((company: Company) => {
			if (company && !company.name) {
				this.openDialog(company);
				return;
			}
			this.assessmentForm.get('jsonAssessment').get('company').setValue(company);
		});

		this.route.params.subscribe(params => {
			this.idAssessment = params['idAssessment'];
			if (this.idAssessment) {
				this.loading = true;
				this.assessmentService.get(this.idAssessment).subscribe((data: Assessment) => {
					this.assessment = data;
					const resultsForms = this.getResultFormsByResults(data.jsonAssessment.results, data.jsonAssessment.measurementFramework.questions);
					this.assessmentForm.patchValue(data);
					this.getResultForms.setValue(resultsForms);
					this.measurementFramework = this.assessment.jsonAssessment.measurementFramework;
					this.referenceModel = this.assessment.jsonAssessment.referenceModel;
					this.changeTargetLevel(this.assessment.jsonAssessment.targetLevel);
					if (this.assessment.status === 'finalized') {
						this.openResult = true;
					}
					this.loading = false;
				});
			}
		});
	}

	get getUser(): User {
		let user = null;
		this.authenticationService.isUserIn.subscribe(currentUser => user = currentUser);
		return user;
	}

	get ratings(): Rating[] {
		return this.measurementFramework ? this.measurementFramework.ratings : [];
	}

	get getResultForms(): AbstractControl {
		return this.assessmentForm.get('jsonAssessment').get('results');
	}

	get getCompany(): Company {
		return this.assessmentForm.get('jsonAssessment').get('company').value;
	}

	get getAssessmentResult(): string {
		return this.assessmentForm.get('jsonAssessment').get('assessmentResult').value;
	}

	get getDate() {
		return this.formatDate(this.assessmentForm.get('date').value);
	}

	get f() {
		return this.assessmentForm.controls;
	}

	changeMeasurementFramework(measurementFramework: MeasurementFramework): void {
		this.measurementFramework = measurementFramework;
		this.getReferenceModel(this.measurementFramework.idReferenceModel);
	}

	changeTargetLevel(classification: Classification): void {
		this.classification = classification;
		const index = this.measurementFramework.classifications.map(value => value.idClassification).indexOf(classification.idClassification);
		this.classifications = this.measurementFramework.classifications.filter(value => this.measurementFramework.classifications.indexOf(value) <= index);
		this.processes = this.getProcesses();
		this.processAttributes = this.getProcessAttributes();
	}

	hasQuestions(process: Process): boolean {
		return this.measurementFramework.questions.some(question => process.idProcess === question.idProcess);
	}

	getQuestions(process: Process): Question[] {
		const questions = this.measurementFramework.questions.filter(question => question.idProcess == process.idProcess);
		if (!this.processAttributes) {
			return questions;
		}
		const questionsByProcessAttribute = this.getQuestionsByProcessAttribute();
		return questions.concat(questionsByProcessAttribute);
	}

	finishForm(): void {
		const jsonAssessment = this.assessmentForm.get("jsonAssessment").value;
		const assessment: Assessment = this.assessmentForm.value;
		jsonAssessment.results = jsonAssessment.results.map((result: FormGroup) => result.value);
		assessment.jsonAssessment = jsonAssessment;
	}

	onSubmit(finish?: boolean, stepper?: MatHorizontalStepper): void {
		if (this.assessmentForm.invalid) {
			return;
		}
		this.submitted = true;
		this.loading = true;

		this.finishForm();

		if (finish) {
			this.openResult = true;

			this.assessmentService.finish(this.assessmentForm.value)
				.subscribe((data: Assessment) => {
					this.assessment = data;
					this.assessmentForm.get('date').setValue(data.date);
					this.assessmentForm.get('jsonAssessment').get('assessmentResult').setValue(data.jsonAssessment.assessmentResult);
					this.createSnackBar('Finalizada com sucesso', 'success');
					stepper.next();
					this.loading = false;
				}, error => {
					this.createSnackBar(error, 'error');
					this.loading = false;
				});
			return;
		}

		if (this.idAssessment) {
			this.assessmentService.update(this.assessmentForm.value).subscribe(
				data => {
					this.createSnackBar('Atualizada com sucesso', 'success');
					this.router.navigate(['/assessment']);
				},
				error => {
					this.createSnackBar(error, 'error');
					this.loading = false;
				});
			return;
		}
		this.assessmentService.register(this.assessmentForm.value).subscribe(
			data => {
				this.createSnackBar('Registrada com sucesso', 'success');
				this.router.navigate(['/assessment']);
			},
			error => {
				this.createSnackBar(error, 'error');
				this.loading = false;
			});
	}

	finish(stepper: MatHorizontalStepper): void {
		this.isFinish = true;
		if (this.anyResultInvalid()) {
			this.createSnackBar('Algumas questões obrigatórias não foram preenchidas', 'error');
			return;
		}
		this.onSubmit(true, stepper);
	}

	checkForms(): void {
		this.submitted = true;
	}

	isLastProcess(indexProcess: number) {
		return (indexProcess + 1) === this.processes.length;
	}

	getRatingsByProcessAttribute(levelResult: LevelResult): any[] {
		const processAttributeResults: ProcessAttributeResult[] = flatMap(levelResult.processes, (processResult => {
			return flatMap(processResult.capacityResults, (capacityResult => {
				return capacityResult.processAttributeResults;
			}));
		}));
		const dictionary = groupBy(processAttributeResults, (processAttributeResult: ProcessAttributeResult) => {
			return processAttributeResult.processAttribute.idProcessAttribute;
		});

		const ratingByProcessAttribute = [];
		for (let key in dictionary) {
			if (dictionary.hasOwnProperty(key)) {
				ratingByProcessAttribute.push({
					processAttribute: dictionary[key][0].processAttribute,
					ratings: dictionary[key].map((processAttributeResult: ProcessAttributeResult) => processAttributeResult.rating)
				});
			}
		}
		levelResult.ratingByProcessAttribute = ratingByProcessAttribute;
		return ratingByProcessAttribute;
	}

	getLevelResultProcesses(processes: ProcessResult[]) {
		return processes.map(processResult => {
			return processResult.process;
		})
	}

	openResultDialog(levelResult: LevelResult, processResult: ProcessResult) {
		const processResultDialogData = new ProcessResultDialogData();
		const processes: ProcessResult[] = flatMap(this.assessment.jsonAssessment.levelResults.filter(value => {
			return indexOf(this.assessment.jsonAssessment.levelResults, value) <=
				indexOf(this.assessment.jsonAssessment.levelResults, levelResult);
		}), (levelResult => {
			return levelResult.processes.filter(value => value.process.idProcess == processResult.process.idProcess);
		}));
		processResultDialogData.process = processResult.process;
		processResultDialogData.processResults = processes;
		this.dialog.open(ProcessResultDialogComponent, {
			data: processResultDialogData,
			width: '95%',
			disableClose: true
		});
	}

	private createResults(knowledgeArea: KnowledgeArea) {
		knowledgeArea.processes.forEach(process => {
			const questions = this.getQuestions(process);
			if (questions.length) {
				this.createResultForms(questions, knowledgeArea.idKnowledgeArea, process.idProcess);
			}
		});
	}

	private createResultsProcessAttributes(processAttributes: ProcessAttribute[]) {
		this.processes.forEach(process => {
			processAttributes.forEach(processAttribute => {
				const questions = this.measurementFramework.questions.filter(question => {
					return processAttribute.idProcessAttribute == question.idProcessAttribute;
				});
				if (questions.length) {
					this.createResultForms(questions, '', process.idProcess);
				}
			})
		});
	}

	private createResultForms(questions: Question[], idProcessArea: string, idProcess: string) {
		const forms: FormGroup[] = questions.map(question => this.createFormGroup(idProcessArea, idProcess, question));
		const valueForm: FormGroup[] = this.getResultForms.value;
		if (!valueForm) {
			this.getResultForms.setValue(forms);
		} else {
			valueForm.push(...forms);
			this.getResultForms.setValue(valueForm);
		}
	}

	private createFormGroup(idProcessArea: string, idProcess: string, question: Question): FormGroup {
		const formGroup: FormGroup = this.formBuilder.group({
			idResult: [Guid.create().toString()],
			idKnowledgeArea: [idProcessArea],
			idProcess: [idProcess],
			idExpectedResult: [question.idExpectedResult],
			idQuestion: [question.idQuestion],
			idProcessAttribute: [question.idProcessAttribute],
			idProcessAttributeValue: [question.idProcessAttributeValue],
			value: ['']
		});
		if (question.required) {
			formGroup.get('value').setValidators(Validators.required);
		}
		if (question.defaultValue && !formGroup.get('value').value) {
			formGroup.get('value').setValue(String(question.defaultValue));
		}
		return formGroup;
	}

	private getReferenceModel(idReferenceModel: number): void {
		this.referenceModelService.get(idReferenceModel).subscribe((value: ReferenceModel) => {
			this.referenceModel = value;
			const jsonAssessment: JsonAssessment = this.assessmentForm.get("jsonAssessment").value;
			jsonAssessment.referenceModel = this.referenceModel;
			this.assessmentForm.get("jsonAssessment").setValue(jsonAssessment);
			this.referenceModel.knowledgeAreas.forEach(knowledgeArea => {
				this.createResults(knowledgeArea);
			});
		});
	}

	private getProcesses(): Process[] {
		const processes = flatMap(this.classifications, (classification => {
			return flatMap(classification.levels, (level => {
				const knowledgeAreas = this.referenceModel.knowledgeAreas.filter(knowledgeArea => knowledgeArea.idKnowledgeArea === level.idProcessArea);
				return flatMap(knowledgeAreas, knowledgeArea => knowledgeArea.processes.filter(process => level.values.includes(process.idProcess)));
			}));
		}));

		return uniqBy(processes, (process => process.idProcess));
	}

	private getProcessAttributes(): ProcessAttribute[] {
		let processAttributes = flatMap(this.classifications, (classification => {
			const capacityLevels = this.measurementFramework.capacityLevels.filter(value => classification.capacityLevels.includes(value.idCapacityLevel));
			return flatMap(capacityLevels, (capacityLevel => {
				return capacityLevel.processAttributes.filter(processAttribute => processAttribute.generateQuestions);
			}));
		}));

		processAttributes = uniqBy(processAttributes, (processAttribute) => {
			return processAttribute.idProcessAttribute
		});

		this.createResultsProcessAttributes(processAttributes);
		return processAttributes;
	}

	private anyResultInvalid() {
		return this.getResultForms.value.some((form: FormGroup) => !form.valid);
	}

	private createSnackBar(message: string, panelClass: string): void {
		this.snackBar.openFromComponent(SnackBarComponent, {
			data: message,
			panelClass: [panelClass],
			duration: 5000
		});
	}

	private getResultFormsByResults(results: Result[], questions: Question[]): FormGroup[] {
		return results.map(result => {
			const question = questions.find(question => question.idQuestion === result.idQuestion);
			const formGroup: FormGroup = this.formBuilder.group({
				idResult: [result.idResult],
				idKnowledgeArea: [result.idKnowledgeArea],
				idProcess: [result.idProcess],
				idExpectedResult: [result.idExpectedResult],
				idQuestion: [result.idQuestion],
				idProcessAttribute: [result.idProcessAttribute],
				idProcessAttributeValue: [result.idProcessAttributeValue],
				value: [result.value]
			});
			if (question.required) {
				formGroup.get('value').setValidators(Validators.required);
			}
			if (question.defaultValue && !formGroup.get('value').value) {
				formGroup.get('value').setValue(String(question.defaultValue));
			}
			return formGroup;
		});
	}

	private openDialog(company: Company): void {
		const dialogRef = this.dialog.open(CompanyDialogComponent, {
			data: company,
			disableClose: true
		});
		dialogRef.afterClosed().subscribe((result: any) => {
			if (result) {
				this.assessmentForm.get('jsonAssessment').get('company').setValue(result);
			}
		});
	}

	private getQuestionsByProcessAttribute(): Question[] {
		const idsProcessAttributes = this.processAttributes.map(value => value.idProcessAttribute);
		return this.measurementFramework.questions.filter(question => {
			return idsProcessAttributes.includes(question.idProcessAttribute);
		});
	}

	private formatDate(date: any): Date {
		return new Date(date.date.year, date.date.month, date.date.day, date.time.hour, date.time.minute, date.time.second);
	}
}
