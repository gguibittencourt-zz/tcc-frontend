import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {
	AlertService,
	AssessmentService,
	AuthenticationService,
	MeasurementFrameworkService,
	ReferenceModelService
} from '../_services';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
	Assessment,
	Classification,
	ExpectedResult,
	JsonAssessment,
	KnowledgeArea,
	MeasurementFramework,
	Process,
	ProcessAttribute,
	Question,
	ReferenceModel,
	Result,
	ScaleValues,
	User
} from "../_models";
import {flatMap} from "lodash";

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
	classification: Classification;
	processes: Process[];
	processAttributes: ProcessAttribute[];
	results: Result[] = [];

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private assessmentService: AssessmentService,
		private measurementFrameworkService: MeasurementFrameworkService,
		private referenceModelService: ReferenceModelService,
		private alertService: AlertService,
		private authenticationService: AuthenticationService) {
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
				measurementFramework: [, Validators.required],
				referenceModel: [],
				results: [],
				targetLevel: [, Validators.required]
			})
		});

		this.route.params.subscribe(params => {
			this.idAssessment = params['idAssessment'];
			if (this.idAssessment) {
				this.assessmentService.get(this.idAssessment).subscribe((data: Assessment) => {
					this.assessmentForm.patchValue(data);
					this.assessment = data;
					this.measurementFramework = this.assessment.jsonAssessment.measurementFramework;
					this.referenceModel = this.assessment.jsonAssessment.referenceModel;
					this.changeTargetLevel(this.assessment.jsonAssessment.targetLevel);
					this.results = this.assessment.jsonAssessment.results;
				});
			}
		});
	}

	get getUser(): User {
		let user = null;
		this.authenticationService.isUserIn.subscribe(currentUser => user = currentUser);
		return user;
	}

	get scaleValues(): ScaleValues[] {
		return this.measurementFramework ? this.measurementFramework.scaleValues : [];
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
		this.processes = this.getProcesses();
		this.processAttributes = this.getProcessAttributes();
	}

	hasQuestions(process: Process): boolean {
		return this.measurementFramework.questions.some(question => process.idProcess === question.idProcess);
	}

	getQuestionsByProcess(process: Process): Question[] {
		return this.measurementFramework.questions.filter(question => question.idProcess == process.idProcess);
	}

	getQuestionsByProcessAttribute() {
		const idsProcessAttributes = this.processAttributes.map(value => value.idProcessAttribute);
		return this.measurementFramework.questions.filter(question => {
			return idsProcessAttributes.includes(question.idProcessAttribute);
		});
	}

	confirmResult(result: Result) {
		this.results.find(value => value.idResult === result.idResult).value = result.value;
	}

	finishForm(): void {
		const jsonAssessment: JsonAssessment = this.assessmentForm.get("jsonAssessment").value;
		jsonAssessment.results = this.results;
		this.assessmentForm.get("jsonAssessment").setValue(jsonAssessment);
	}

	onSubmit(finish?: boolean): void {
		this.submitted = true;

		if (this.assessmentForm.invalid) {
			return;
		}

		this.loading = true;
		this.finishForm();

		if (finish) {
			this.assessmentService.finish(this.assessmentForm.value)
				.subscribe(data => {
					this.alertService.success('Finalizado com sucesso', true);
					this.router.navigate(['/assessment']);
				}, error => {
					this.alertService.error(error.error);
					this.loading = false;
				});
			return;
		}

		if (this.idAssessment) {
			this.assessmentService.update(this.assessmentForm.value)
				.subscribe(
					data => {
						this.alertService.success('Atualizado com sucesso', true);
						this.router.navigate(['/assessment']);
					},
					error => {
						this.alertService.error(error.error);
						this.loading = false;
					});
		} else {
			this.assessmentService.register(this.assessmentForm.value)
				.subscribe(
					data => {
						this.alertService.success('Registrado com sucesso', true);
						this.router.navigate(['/assessment']);
					},
					error => {
						this.alertService.error(error.error);
						this.loading = false;
					});
		}
	}

	finish(): void {
		this.onSubmit(true);
	}

	checkForms(): void {
		this.submitted = true;
	}

	getExpectedResults(): ExpectedResult[] {
		return flatMap(this.processes, (value => value.expectedResults));
	}

	private createResults(knowledgeArea: KnowledgeArea) {
		knowledgeArea.processes.forEach(process => {
			const questions = this.getQuestionsByProcess(process);
			if (questions.length) {
				const results: Result[] = questions.filter(value => !this.existResult(knowledgeArea.idKnowledgeArea, value.idProcess, value.idQuestion, value.idExpectedResult, value.idProcessAttribute, value.idProcessAttributeValue))
					.map(question => new Result(
						knowledgeArea.idKnowledgeArea,
						question.idProcess,
						question.idQuestion,
						question.idExpectedResult,
						question.idProcessAttribute,
						question.idProcessAttributeValue));
				this.results.push(...results);
			}
		});
	}

	private existResult(idKnowledgeArea: string, idProcess: string, idQuestion: string, idExpectedResult: string,
						idProcessAttribute: string, idProcessAttributeValue: string): boolean {
		return this.results.some(value => {
			return value.idQuestion == idQuestion
				&& (value.idProcess && value.idKnowledgeArea == idKnowledgeArea && value.idProcess == idProcess && idExpectedResult == value.idExpectedResult)
					|| (value.idProcessAttribute && value.idProcessAttribute == idProcessAttribute && value.idProcessAttributeValue == idProcessAttributeValue);
		});
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
		return flatMap(this.classification.levels, (level => {
			const knowledgeAreas = this.referenceModel.knowledgeAreas.filter(knowledgeArea => knowledgeArea.idKnowledgeArea === level.idProcessArea);
			return flatMap(knowledgeAreas, knowledgeArea => knowledgeArea.processes.filter(process => level.values.includes(process.idProcess)));
		}));
	}

	private getProcessAttributes(): ProcessAttribute[] {
		const processAttributes = flatMap(this.classification.processAttributes, (value => {
			return this.measurementFramework.processAttributes.filter(processAttribute => value === processAttribute.idProcessAttribute && processAttribute.generateQuestions);
		}));
		this.createResultsProcessAttributes(processAttributes);
		return processAttributes;
	}

	private createResultsProcessAttributes(processAttributes: ProcessAttribute[]) {
		processAttributes.forEach(processAttribute => {
			const questions = this.measurementFramework.questions.filter(question => {
				return processAttribute.idProcessAttribute == question.idProcessAttribute;
			});
			if (questions.length) {
				const results: Result[] = questions.filter(value => {
					return !this.existResult('', value.idProcess, value.idQuestion, value.idExpectedResult, value.idProcessAttribute, value.idProcessAttributeValue)
				}).map(question => new Result(
					'',
					question.idProcess,
					question.idQuestion,
					question.idExpectedResult,
					question.idProcessAttribute,
					question.idProcessAttributeValue));
				this.results.push(...results);
			}
		})
	}
}
