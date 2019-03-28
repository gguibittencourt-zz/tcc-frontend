import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, EvaluationService, MeasurementFrameworkService, ReferenceModelService} from '../_services';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Evaluation, KnowledgeArea, MeasurementFramework, Question, ReferenceModel, Result} from "../_models";
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
		private alertService: AlertService) {
	}

	ngOnInit(): void {
		this.evaluation = new Evaluation();
		this.measurementFrameworkService.list().subscribe((data: MeasurementFramework[]) => {
			this.measurementFrameworks = data;
		});

		this.evaluationForm = this.formBuilder.group({
			idEvaluation: [],
			status: [''],
			idUser: [],
			idMeasurementFramework: [, Validators.required],
			date: [],
		});

		this.route.params.subscribe(params => {
			this.idEvaluation = params['idEvaluation'];
			if (this.idEvaluation) {
				this.evaluationService.get(this.idEvaluation).subscribe((data: Evaluation) => {
					this.evaluationForm.setValue(data);
					this.evaluation = data;
				});
			}
		});
	}

	changeMeasurementFramework(event: MatSelectChange): void {
		this.measurementFramework = this.getMeasurementFramework(event.value);
		this.getReferenceModel(this.measurementFramework.idReferenceModel);
	}

	getMeasurementFramework(idMeasurementFramework: number): MeasurementFramework {
		return this.measurementFrameworks.find(value => value.idMeasurementFramework === idMeasurementFramework);
	}

	getReferenceModel(idReferenceModel: number) {
		this.referenceModelService.get(idReferenceModel).subscribe(value => {
			this.referenceModel = value as ReferenceModel
		});
	}

	getQuestionsByKnowledgeArea(knowledgeArea: KnowledgeArea) {
		let questions: Question[] = knowledgeArea.processes.map(process => {
			return this.measurementFramework.questions.filter(question => question.idProcess == process.idProcess);
		}).reduce((a, b) => a.concat(b), []);
		if (questions.length) {
			let results: Result[] = questions.map(question => new Result(knowledgeArea.idKnowledgeArea, question.idProcess, question.idQuestion));
			this.results.push(...results);
		}
		return questions;
	}

	getResultByIdQuestion(idQuestion: string) {
		return this.results.find(value => value.idQuestion === idQuestion);
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
