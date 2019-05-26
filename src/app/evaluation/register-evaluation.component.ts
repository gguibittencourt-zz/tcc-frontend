import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {
	AlertService, AuthenticationService,
	EvaluationService,
	MeasurementFrameworkService,
	ReferenceModelService,
	UserService
} from '../_services';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Evaluation, KnowledgeArea, MeasurementFramework, Question, ReferenceModel, Result, User} from "../_models";
import {first} from "rxjs/operators";
import {MatSelectChange} from "@angular/material";

@Component({
	templateUrl: './register-evaluation.component.html',
	styleUrls: ['register-evaluation.component.scss']

})
export class RegisterEvaluationComponent implements OnInit {
	private _evaluationForm: FormGroup;
	private _loading = false;
	private _submitted = false;
	private _idEvaluation: number = null;
	private _evaluation: Evaluation;
	private _referenceModel: ReferenceModel;
	private _measurementFrameworks: MeasurementFramework[] = [];
	private _measurementFramework: MeasurementFramework;
	private _results: Result[] = [];

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private evaluationService: EvaluationService,
		private measurementFrameworkService: MeasurementFrameworkService,
		private referenceModelService: ReferenceModelService,
		private alertService: AlertService,
		private authenticationService: AuthenticationService) {
	}

	ngOnInit(): void {
		this.evaluation = new Evaluation();
		this.measurementFrameworkService.list().subscribe((data: MeasurementFramework[]) => {
			this.measurementFrameworks = data;
		});

		this.evaluationForm = this.formBuilder.group({
			idEvaluation: [],
			status: [''],
			idUser: [this.getUser.idUser],
			idMeasurementFramework: [, Validators.required],
			date: [],
			results: []
		});

		this.route.params.subscribe(params => {
			this.idEvaluation = params['idEvaluation'];
			if (this.idEvaluation) {
				this.evaluationService.get(this.idEvaluation).subscribe((data: Evaluation) => {
					this.evaluationForm.patchValue(data);
					this.evaluation = data;
					this.results = this.evaluation.results;
					this.changeMeasurementFramework(this.evaluation.idMeasurementFramework);
				});
			}
		});
	}

	get getUser(): User {
		let user = null;
		this.authenticationService.isUserIn.subscribe(currentUser => user = currentUser);
		return user;
	}

	changeMeasurementFramework(idMeasurementFramework: number): void {
		this.measurementFramework = this.getMeasurementFramework(idMeasurementFramework);
		this.getReferenceModel(this.measurementFramework.idReferenceModel);
	}

	getMeasurementFramework(idMeasurementFramework: number): MeasurementFramework {
		return this.measurementFrameworks.find(value => value.idMeasurementFramework === idMeasurementFramework);
	}

	getReferenceModel(idReferenceModel: number) {
		this.referenceModelService.get(idReferenceModel).subscribe(value => {
			this.referenceModel = value as ReferenceModel;
			this.referenceModel.knowledgeAreas.forEach(knowledgeArea => {
				this.createResults(knowledgeArea);
			});
		});
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
		this.evaluationForm.get("results").setValue(this.results);
	}

	onSubmit(): void {
		this.submitted = true;

		if (this.evaluationForm.invalid) {
			return;
		}

		this.loading = true;

		if (this.idEvaluation) {
			this.evaluationService.update(this.evaluationForm.value)
				.pipe(first())
				.subscribe(
					data => {
						this.alertService.success('Update successful', true);
						this.router.navigate(['/evaluation']);
					},
					error => {
						this.alertService.error(error.error);
						this.loading = false;
					});
		} else {
			this.evaluationService.register(this.evaluationForm.value)
				.pipe(first())
				.subscribe(
					data => {
						this.alertService.success('Register successful', true);
						this.router.navigate(['/evaluation']);
					},
					error => {
						this.alertService.error(error.error);
						this.loading = false;
					});
		}
	}

	finish(): void {

	}

	get f() {
		return this._evaluationForm.controls;
	}

	get evaluationForm(): FormGroup {
		return this._evaluationForm;
	}

	set evaluationForm(value: FormGroup) {
		this._evaluationForm = value;
	}

	get loading(): boolean {
		return this._loading;
	}

	set loading(value: boolean) {
		this._loading = value;
	}

	get submitted(): boolean {
		return this._submitted;
	}

	set submitted(value: boolean) {
		this._submitted = value;
	}

	get idEvaluation(): number {
		return this._idEvaluation;
	}

	set idEvaluation(value: number) {
		this._idEvaluation = value;
	}

	get measurementFrameworks(): MeasurementFramework[] {
		return this._measurementFrameworks;
	}

	set measurementFrameworks(value: MeasurementFramework[]) {
		this._measurementFrameworks = value;
	}

	get measurementFramework(): MeasurementFramework {
		return this._measurementFramework;
	}

	set measurementFramework(value: MeasurementFramework) {
		this._measurementFramework = value;
	}

	get evaluation(): Evaluation {
		return this._evaluation;
	}

	set evaluation(value: Evaluation) {
		this._evaluation = value;
	}

	get referenceModel(): ReferenceModel {
		return this._referenceModel;
	}

	set referenceModel(value: ReferenceModel) {
		this._referenceModel = value;
	}

	get results(): Result[] {
		return this._results;
	}

	set results(value: Result[]) {
		this._results = value;
	}
}
