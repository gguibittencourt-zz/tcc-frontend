import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, MeasurementFrameworkService, ReferenceModelService} from '../_services';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MeasurementFramework, Question, ReferenceModel} from "../_models";
import {first} from "rxjs/operators";
import {MatSelectChange} from "@angular/material";

@Component({
	templateUrl: './register-measurement-framework.component.html',
	styleUrls: ['register-measurement-framework.component.scss']

})
export class RegisterMeasurementFrameworkComponent implements OnInit {
	private _measurementFrameworkForm: FormGroup;
	private _loading = false;
	private _submitted = false;
	private _idMeasurementFramework: number = null;
	private _measurementFramework: MeasurementFramework;
	private _referenceModels: ReferenceModel[] = [];
	private _referenceModel: ReferenceModel;

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private measurementFrameworkService: MeasurementFrameworkService,
		private referenceModelService: ReferenceModelService,
		private alertService: AlertService) {
	}

	ngOnInit(): void {
		this.measurementFramework = new MeasurementFramework();
		this.referenceModelService.list().subscribe((data: ReferenceModel[]) => {
			this.referenceModels = data;
		});

		this.measurementFrameworkForm = this.formBuilder.group({
			idMeasurementFramework: [],
			name: ['', Validators.required],
			idReferenceModel: [, Validators.required],
			questions: [[]]
		});

		this.route.params.subscribe(params => {
			this.idMeasurementFramework = params['idMeasurementFramework'];
			if (this.idMeasurementFramework) {
				this.measurementFrameworkService.get(this.idMeasurementFramework).subscribe((data: MeasurementFramework) => {
					this.measurementFrameworkForm.setValue(data);
					this.measurementFramework = data;
					this.referenceModel = this.getReferenceModel(data.idReferenceModel);
				});
			}
		});
	}

	changeReferenceModel(event: MatSelectChange): void {
		this.referenceModel = this.getReferenceModel(event.value);
	}

	getReferenceModel(idReferenceModel: number): ReferenceModel {
		return this.referenceModels.find(value => value.idReferenceModel === idReferenceModel);
	}

	confirmQuestions(questions: Question[]) {
		this.f["questions"].setValue(questions);
		this.measurementFramework.questions = questions;
	}

	onSubmit(): void {
		this.submitted = true;

		if (this.measurementFrameworkForm.invalid) {
			return;
		}

		this.loading = true;

		if (this.idMeasurementFramework) {
			this.measurementFrameworkService.update(this.measurementFrameworkForm.value)
				.pipe(first())
				.subscribe(
					data => {
						this.alertService.success('Update successful', true);
						this.router.navigate(['/measurement-framework']);
					},
					error => {
						this.alertService.error(error.error);
						this.loading = false;
					});
		} else {
			this.measurementFrameworkService.register(this.measurementFrameworkForm.value)
				.pipe(first())
				.subscribe(
					data => {
						this.alertService.success('Register successful', true);
						this.router.navigate(['/measurement-framework']);
					},
					error => {
						this.alertService.error(error.error);
						this.loading = false;
					});
		}
	}

	get f() {
		return this._measurementFrameworkForm.controls;
	}

	get measurementFrameworkForm(): FormGroup {
		return this._measurementFrameworkForm;
	}

	set measurementFrameworkForm(value: FormGroup) {
		this._measurementFrameworkForm = value;
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

	get idMeasurementFramework(): number {
		return this._idMeasurementFramework;
	}

	set idMeasurementFramework(value: number) {
		this._idMeasurementFramework = value;
	}

	get referenceModels(): ReferenceModel[] {
		return this._referenceModels;
	}

	set referenceModels(value: ReferenceModel[]) {
		this._referenceModels = value;
	}

	get referenceModel(): ReferenceModel {
		return this._referenceModel;
	}

	set referenceModel(value: ReferenceModel) {
		this._referenceModel = value;
	}

	get measurementFramework(): MeasurementFramework {
		return this._measurementFramework;
	}

	set measurementFramework(value: MeasurementFramework) {
		this._measurementFramework = value;
	}
}
