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
	JsonAssessment,
	KnowledgeArea,
	MeasurementFramework,
	ReferenceModel,
	Result,
	User
} from "../_models";

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

	get f() {
		return this.assessmentForm.controls;
	}

	changeMeasurementFramework(measurementFramework: MeasurementFramework): void {
		this.measurementFramework = measurementFramework;
		this.getReferenceModel(this.measurementFramework.idReferenceModel);
	}

	hasQuestions(knowledgeArea: KnowledgeArea): boolean {
		return knowledgeArea.processes.some(process => this.measurementFramework.questions.some(question => process.idProcess === question.idProcess));
	}

	getQuestionsByKnowledgeArea(knowledgeArea: KnowledgeArea) {
		return knowledgeArea.processes.map(process => {
			return this.measurementFramework.questions.filter(question => question.idProcess == process.idProcess);
		}).reduce((a, b) => a.concat(b), []);
	}

	getResultByIdQuestion(idQuestion: string) {
		return this.results.find(value => value.idQuestion === idQuestion);
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

	private createResults(knowledgeArea: KnowledgeArea) {
		let questions = this.getQuestionsByKnowledgeArea(knowledgeArea);
		if (questions.length) {
			let results: Result[] = questions.filter(value => !this.existResult(knowledgeArea.idKnowledgeArea, value.idProcess, value.idQuestion))
				.map(question => new Result(knowledgeArea.idKnowledgeArea, question.idProcess, question.idQuestion));
			this.results.push(...results);
		}
	}

	private existResult(idKnowledgeArea: number, idProcess: string, idQuestion: string): boolean {
		return this.results.some(value => value.idKnowledgeArea == idKnowledgeArea && value.idProcess == idProcess && value.idQuestion == idQuestion);
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

	checkForms(): void {
		this.submitted = true;
	}
}
