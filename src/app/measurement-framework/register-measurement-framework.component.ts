import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, MeasurementFrameworkService, ReferenceModelService} from '../_services';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Goal, MeasurementFramework, Question, ReferenceModel} from "../_models";
import {first} from "rxjs/operators";
import {MatSelectChange} from "@angular/material";

@Component({
	templateUrl: './register-measurement-framework.component.html',
	styleUrls: ['register-measurement-framework.component.scss']

})
export class RegisterMeasurementFrameworkComponent implements OnInit {
	measurementFrameworkForm: FormGroup;
	loading = false;
	submitted = false;
	idMeasurementFramework: number = null;
	measurementFramework: MeasurementFramework;
	referenceModels: ReferenceModel[] = [];
	referenceModel: ReferenceModel;

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private measurementFrameworkService: MeasurementFrameworkService,
		private referenceModelService: ReferenceModelService,
		private alertService: AlertService) {
	}

	get f() {
		return this.measurementFrameworkForm.controls;
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
			questions: [[]],
			goals: [[]],
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

	confirmGoals(goals: Goal[]) {
		this.f["goals"].setValue(goals);
		this.measurementFramework.goals = goals;
	}

	onSubmit(): void {
		this.submitted = true;

		if (this.measurementFrameworkForm.invalid) {
			return;
		}

		this.loading = true;

		if (this.idMeasurementFramework) {
			this.measurementFrameworkService.update(this.measurementFrameworkForm.value)
				.subscribe(
					data => {
						this.alertService.success('Atualizado com sucesso', true);
						this.router.navigate(['/measurement-framework']);
					},
					error => {
						this.alertService.error(error.error);
						this.loading = false;
					});
		} else {
			this.measurementFrameworkService.register(this.measurementFrameworkForm.value)
				.subscribe(
					data => {
						this.alertService.success('Cadastrado com sucesso', true);
						this.router.navigate(['/measurement-framework']);
					},
					error => {
						this.alertService.error(error.error);
						this.loading = false;
					});
		}
	}
}
