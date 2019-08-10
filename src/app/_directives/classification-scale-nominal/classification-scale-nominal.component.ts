import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Classification, GoalScale, KnowledgeArea} from '../../_models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isNil} from "lodash";
import {Guid} from "guid-typescript";
import {EmptyListValidator} from "../../_helpers";

@Component({
	selector: 'classification-scale-nominal',
	templateUrl: 'classification-scale-nominal.component.html',
	styleUrls: ['classification-scale-nominal.component.scss']
})

export class ClassificationScaleNominalComponent implements OnInit {
	@Input('knowledgeAreas') knowledgeAreas: KnowledgeArea[];
	@Input('classifications') classifications: Classification[];
	@Input('goals') goals: GoalScale[];
	@Output() onConfirmClassification: EventEmitter<any> = new EventEmitter();
	private classificationForms: FormGroup[] = [];
	private mapCloseAccordion: Map<number, boolean> = new Map<number, boolean>();
	private _isPossibleConfirm: boolean = false;

	constructor(private formBuilder: FormBuilder) {
	}

	ngOnInit() {
		if (isNil(this.goals)) {
			this.goals = [];
		}
		if (isNil(this.classifications)) {
			this.classifications = [];
		}
	}

	confirmClassification(index: number) {
		if (this.classificationForms[index].invalid) {
			return;
		}

		this._isPossibleConfirm = true;
		this.mapCloseAccordion.set(index, false);
		this.onConfirmClassification.emit(this.classifications);
	}

	addClassification() {
		if (this.allValidForms()) {
			this._isPossibleConfirm = false;
			const classification: Classification = new Classification();
			this.classifications.push(classification);
		}
	}

	allValidForms(): boolean {
		return this.classificationForms.every(form => form.valid);
	}

	deleteClassification(index: number) {
		this.classificationForms.splice(index, 1);
	}

	formChange(index: number) {
		this.mapCloseAccordion.set(index, true);
	}

	cancelClassification(index: number) {
		this.mapCloseAccordion.set(index, false);
	}

	getClassificationForm(index: number) {
		let form = this.classificationForms[index];
		if (form == null) {
			form = this.formBuilder.group({
				idClassification: [Guid.create().toString()],
				name: ['', Validators.required],
				levels: [this.formBuilder.group({
					idProcessArea: [],
					values: [[], EmptyListValidator.listaVaziaValidator()],
				})],
			});
			form.patchValue(this.classifications[index]);
			this.classificationForms[index] = form;
		}
		return form;
	}
}
