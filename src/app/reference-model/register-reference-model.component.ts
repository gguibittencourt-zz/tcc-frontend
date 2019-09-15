import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {ReferenceModelService} from '../_services';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {KnowledgeArea, ReferenceModel} from "../_models";
import {MatSnackBar} from "@angular/material";
import {SnackBarComponent} from "../_directives/snack-bar";

@Component({
	templateUrl: './register-reference-model.component.html',
	styleUrls: ['register-reference-model.component.scss']

})
export class RegisterReferenceModelComponent implements OnInit {
	referenceModelForm: FormGroup;
	loading = false;
	submitted = false;
	idReferenceModel: number = null;
	knowledgeAreas: KnowledgeArea[] = [];

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private referenceModelService: ReferenceModelService,
		private snackBar: MatSnackBar) {
	}

	ngOnInit() {
		this.referenceModelForm = this.formBuilder.group({
			idReferenceModel: [],
			name: ['', Validators.required],
			knowledgeAreas: [this.knowledgeAreas]
		});

		this.route.params.subscribe(params => {
			this.idReferenceModel = params['idReferenceModel'];
			if (this.idReferenceModel) {
				this.referenceModelService.get(this.idReferenceModel).subscribe((data: ReferenceModel) => {
					this.referenceModelForm.setValue(data);
					this.knowledgeAreas = data.knowledgeAreas;
				});
			}

		});
	}

	get f() {
		return this.referenceModelForm.controls;
	}

	onSubmit() {
		this.submitted = true;

		if (this.referenceModelForm.invalid) {
			return;
		}

		this.loading = true;

		if (this.idReferenceModel) {
			this.referenceModelService.update(this.referenceModelForm.value)
				.subscribe(
					data => {
						this.createSnackBar('Atualizado com sucesso', 'success');
						this.router.navigate(['/reference-model']);
					},
					error => {
						this.createSnackBar(error, 'error');
						this.loading = false;
					});
		} else {
			this.referenceModelService.register(this.referenceModelForm.value)
				.subscribe(
					data => {
						this.createSnackBar('Cadastro com sucesso', 'success');
						this.router.navigate(['/reference-model']);
					},
					error => {
						this.createSnackBar(error, 'error');
						this.loading = false;
					});
		}
	}

	addKnowledgeArea(knowledgeArea: KnowledgeArea) {
		this.knowledgeAreas.push(knowledgeArea);
	}

	updateKnowledgeArea(index: number, knowledgeArea: KnowledgeArea) {
		this.knowledgeAreas[index] = knowledgeArea;
	}

	deleteKnowledgeArea(index: number) {
		this.knowledgeAreas.splice(index, 1);
	}

	private createSnackBar(message: string, panelClass: string): void {
		this.snackBar.openFromComponent(SnackBarComponent, {
			data: message,
			panelClass: [panelClass],
			duration: 5000
		});
	}
}
