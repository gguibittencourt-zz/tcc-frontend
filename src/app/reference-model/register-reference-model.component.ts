import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, ReferenceModelService} from '../_services';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import {KnowledgeArea, ReferenceModel} from "../_models";

@Component({templateUrl: './register-reference-model.component.html'})
export class RegisterReferenceModelComponent implements OnInit {
	referenceModelForm: FormGroup;
	loading = false;
	submitted = false;
	private _knowledgeAreas: KnowledgeArea[] = [];
	private idReferenceModel: number = null;

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private referenceModelService: ReferenceModelService,
		private alertService: AlertService) {
	}

	ngOnInit() {
		this.referenceModelForm = this.formBuilder.group({
			idReferenceModel: ['', Validators.required],
			name: ['', Validators.required],
			knowledgeAreas: []
		});

		this.route.params.subscribe(params => {
			this.idReferenceModel = params['idReferenceModel'];
			this.referenceModelService.get(this.idReferenceModel).subscribe((data: ReferenceModel) => {
				this.referenceModelForm.setValue(data);
				this._knowledgeAreas = data.knowledgeAreas;
			});
		});
	}

	get knowledgeAreas(): KnowledgeArea[] {
		return this._knowledgeAreas;
	}

	get f() {
		return this.referenceModelForm.controls;
	}

	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.referenceModelForm.invalid) {
			return;
		}

		this.loading = true;

		let action = this.idReferenceModel ? this.referenceModelService.update : this.referenceModelService.register;
		action(this.referenceModelForm.value)
			.pipe(first())
			.subscribe(
				data => {
					this.alertService.success('Update successful', true);
					this.router.navigate(['/home']);
				},
				error => {
					this.alertService.error(error.error);
					this.loading = false;
				});
	}

	addKnowledgeArea(knowledgeArea: KnowledgeArea) {
		this.knowledgeAreas.push(knowledgeArea);
	}

	deleteKnowledgeArea(index: number) {
		this.knowledgeAreas.splice(index, 1);
	}
}
