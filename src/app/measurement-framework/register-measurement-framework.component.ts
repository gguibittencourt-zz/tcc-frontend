import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {MeasurementFrameworkService, ReferenceModelService} from '../_services';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
	CapacityLevel,
	Classification,
	MeasurementFramework,
	ProcessAttribute,
	Question,
	Rating,
	ReferenceModel,
	TypeQuestion
} from "../_models";
import {MatDialog, MatSelectChange, MatSnackBar} from "@angular/material";
import {ScaleValuesDialogComponent} from "../_directives/scale-values-dialog";
import {Guid} from "guid-typescript";
import {flatMap, flatten, isEmpty} from 'lodash';
import {SnackBarComponent} from "../_directives/snack-bar";

@Component({
	templateUrl: './register-measurement-framework.component.html',
	styleUrls: ['register-measurement-framework.component.scss'],
})
export class RegisterMeasurementFrameworkComponent implements OnInit {
	measurementFrameworkForm: FormGroup;
	loading = false;
	submitted = false;
	idMeasurementFramework: number = null;
	measurementFramework: MeasurementFramework;
	referenceModels: ReferenceModel[] = [];
	referenceModel: ReferenceModel;
	types: TypeQuestion[] = [];
	type: string;
	enableCapabilityLevels: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private dialog: MatDialog,
		private measurementFrameworkService: MeasurementFrameworkService,
		private referenceModelService: ReferenceModelService,
		private snackBar: MatSnackBar) {
	}

	get f() {
		return this.measurementFrameworkForm.controls;
	}

	ngOnInit(): void {
		this.measurementFramework = new MeasurementFramework();

		this.measurementFrameworkForm = this.formBuilder.group({
			idMeasurementFramework: [],
			name: ['', Validators.required],
			idReferenceModel: [, Validators.required],
			type: ['', Validators.required],
			questions: [[]],
			goals: [[]],
			ratings: [[]],
			capacityLevels: [[]],
			classifications: [[]],
		});

		this.createRatings(this.measurementFramework);
		this.referenceModelService.list().subscribe((data: ReferenceModel[]) => {
			this.referenceModels = data;
		});

		this.types = [
			{idTypeQuestion: 'scale-nominal', name: 'Escala Ordinal'},
			{idTypeQuestion: 'boolean', name: 'Verdadeiro/Falso'},
		];

		this.route.params.subscribe(params => {
			this.idMeasurementFramework = params['idMeasurementFramework'];
			if (this.idMeasurementFramework) {
				this.loading = true;
				this.measurementFrameworkService.get(this.idMeasurementFramework).subscribe((data: MeasurementFramework) => {
					this.measurementFrameworkForm.setValue(data);
					this.measurementFramework = data;
					this.referenceModel = this.getReferenceModel(data.idReferenceModel);
					this.type = this.types.find(value => value.idTypeQuestion == data.type).idTypeQuestion;
					this.loading = false;
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

	changeTypeQuestion(event: MatSelectChange): void {
		this.type = event.value;
	}

	confirmQuestions(questions: Question[]) {
		this.f["questions"].setValue(questions);
		this.measurementFramework.questions = questions;
	}

	confirmCapacityLevels(capacityLevels: CapacityLevel[]) {
		this.f["capacityLevels"].setValue(capacityLevels);
		this.measurementFramework.capacityLevels = capacityLevels;
	}

	confirmClassifications(classifications: Classification[]) {
		this.f["classifications"].setValue(classifications);
		this.measurementFramework.classifications = classifications;
	}

	nextFirstPage() {
		if (this.measurementFrameworkForm.valid && isEmpty(this.measurementFramework.questions)) {
			let questions = this.createQuestionsByExpectedResults(this.referenceModel);
			questions = questions.concat(this.f["questions"].value);
			this.f["questions"].setValue(questions);
			this.measurementFramework.questions = questions;
		}
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
						this.createSnackBar('Atualizado com sucesso', 'success');
						this.router.navigate(['/measurement-framework']);
					},
					error => {
						this.createSnackBar(error, 'error');
						this.loading = false;
					});
		} else {
			this.measurementFrameworkService.register(this.measurementFrameworkForm.value)
				.subscribe(
					data => {
						this.createSnackBar('Cadastrado com sucesso', 'success');
						this.router.navigate(['/measurement-framework']);
					},
					error => {
						this.createSnackBar(error, 'error');
						this.loading = false;
					});
		}
	}

	openDialog(ratings: Rating[]): void {
		const dialogRef = this.dialog.open(ScaleValuesDialogComponent, {
			maxWidth: '60%',
			data: ratings,
			disableClose: true
		});

		dialogRef.afterClosed().subscribe((result: Rating[]) => {
			if (result) {
				this.f['ratings'].setValue(result);
				this.measurementFramework.ratings = result;
			}
		});
	}

	private createRatings(measurementFramework: MeasurementFramework) {
		measurementFramework.ratings = [
			{id: '1', name: 'Não atingido', mappedName: 'Discordo totalmente', minValue: 0, maxValue: 15},
			{id: '2', name: 'Parcialmente atingido', mappedName: 'Discordo parcialmente', minValue: 15, maxValue: 50},
			{id: '3', name: 'Amplamente atingido', mappedName: 'Concordo parcialmente', minValue: 50, maxValue: 85},
			{id: '4', name: 'Completamente atingido', mappedName: 'Concordo totalmente', minValue: 85, maxValue: 100}
		];
		this.f['ratings'].setValue(measurementFramework.ratings);
	}

	private createQuestionsByExpectedResults(referenceModel: ReferenceModel): Question[] {
		return flatten(referenceModel.knowledgeAreas.map(processArea => {
			return flatten(processArea.processes.map(process => {
				return process.expectedResults.map(expectedResult => {
					const question: Question = new Question(Guid.create().toString());
					question.idExpectedResult = expectedResult.idExpectedResult;
					question.name = expectedResult.name + '?';
					question.idProcess = process.idProcess;
					question.type = this.type;
					return question;
				});
			}));
		}));
	}

	getProcessAttributes(): ProcessAttribute[] {
		return flatMap(this.measurementFramework.capacityLevels, (capabilityLevel => {
			return capabilityLevel.processAttributes;
		}));
	}

	nextCapabilityLevels() {
		this.enableCapabilityLevels = true;
		const processAttributes = this.getProcessAttributes();

		let questions: Question[] = this.createQuestionsByProcessAttributes(processAttributes);
		questions = questions.concat(this.f["questions"].value);
		this.f['questions'].setValue(questions);
		this.measurementFramework.questions = questions;
	}

	backCapabilityLevels() {
		this.enableCapabilityLevels = false;
	}

	private createQuestionsByProcessAttributes(processAttributes: ProcessAttribute[]): Question[] {
		return flatten(processAttributes.filter(value => value.generateQuestions).map(processAttribute => {
			const processAttributeValues = processAttribute.values.filter(value => {
				const idsProcessAttributeValues = this.measurementFramework.questions.map(question => question.idProcessAttributeValue);
				return !idsProcessAttributeValues.includes(value.idProcessAttributeValue);
			});
			return flatten(processAttributeValues.map(value => {
				const question: Question = new Question(Guid.create().toString());
				question.idProcessAttributeValue = value.idProcessAttributeValue;
				question.name = value.name;
				question.idProcessAttribute = processAttribute.idProcessAttribute;
				question.type = 'boolean';
				return question;
			}));
		}));
	}

	private createSnackBar(message: string, panelClass: string): void {
		this.snackBar.openFromComponent(SnackBarComponent, {
			data: message,
			panelClass: [panelClass],
			duration: 5000
		});
	}
}
