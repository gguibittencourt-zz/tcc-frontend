import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, MeasurementFrameworkService, ReferenceModelService} from '../_services';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MeasurementFramework, ReferenceModel} from "../_models";
import {first} from "rxjs/operators";

@Component({
	templateUrl: './register-measurement-framework.component.html',
	styleUrls: ['register-measurement-framework.component.scss']

})
export class RegisterMeasurementFrameworkComponent implements OnInit {
	measurementFrameworkForm: FormGroup;
	loading = false;
	submitted = false;

	private _idMeasurementFramework: number = null;
	private _referenceModels: ReferenceModel[] = [];

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private measurementFrameworkService: MeasurementFrameworkService,
		private referenceModelService: ReferenceModelService,
		private alertService: AlertService) {
	}

	ngOnInit() {
		this.referenceModelService.list().subscribe((data: ReferenceModel[]) => {
			this.referenceModels = data;
		});

		this.measurementFrameworkForm = this.formBuilder.group({
			idMeasurementFramework: [],
			name: ['', Validators.required],
			idReferenceModel: [, Validators.required],
		});

		this.route.params.subscribe(params => {
			this._idMeasurementFramework = params['idMeasurementFramework'];
			if (this._idMeasurementFramework) {
				this.measurementFrameworkService.get(this._idMeasurementFramework).subscribe((data: MeasurementFramework) => {
					this.measurementFrameworkForm.setValue(data);
				});
			}

		});
	}

	get f() {
		return this.measurementFrameworkForm.controls;
	}

	get idMeasurementFramework(): number {
		return this._idMeasurementFramework;
	}

	get referenceModels(): ReferenceModel[] {
		return this._referenceModels;
	}

	set referenceModels(value: ReferenceModel[]) {
		this._referenceModels = value;
	}

	onSubmit() {
		this.submitted = true;

		if (this.measurementFrameworkForm.invalid) {
			return;
		}

		this.loading = true;

		if (this._idMeasurementFramework) {
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
}
