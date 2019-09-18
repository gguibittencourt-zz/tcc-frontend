import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
	CapacityLevel,
	Classification,
	GoalScale,
	KnowledgeArea,
	Level,
	MetricScale,
	ProcessAttribute
} from '../../_models';
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
	@Input('capacityLevels') capacityLevels: CapacityLevel[];
	@Output() onConfirmClassification: EventEmitter<any> = new EventEmitter();
	levelValues: Map<string, MetricScale[]> = new Map();
	private classificationForms: FormGroup[] = [];
	private mapCloseAccordion: Map<number, boolean> = new Map<number, boolean>();

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
		this.classifications[index] = this.classificationForms[index].value;
		this.mapCloseAccordion.set(index, false);
		this.onConfirmClassification.emit(this.classifications);
	}

	addClassification() {
		if (this.allValidForms()) {
			const classification: Classification = new Classification();
			this.classifications.push(classification);
			this.mapCloseAccordion.set(this.classifications.indexOf(classification), false);
		}
	}

	allValidForms(): boolean {
		return this.classificationForms.every(form => form.valid);
	}

	deleteClassification(index: number) {
		this.classificationForms.splice(index, 1);
		this.classifications.splice(index, 1);
		this.mapCloseAccordion.delete(index);
	}

	formChange(index: number) {
		this.mapCloseAccordion.set(index, true);
	}

	//TODO classificação de area de processo por metrica
	updateLevels(event: Level[], classification: Classification, index: number) {
		classification.levels = event;
		this.classificationForms[index].controls['levels'].patchValue(event);
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
				capacityLevels: [[]],
				levels: [this.formBuilder.group({
					idProcessArea: [],
					values: [[], EmptyListValidator.listaVaziaValidator()],
				}), EmptyListValidator.listaVaziaValidator()],
			});
			form.patchValue(this.classifications[index]);
			this.classificationForms[index] = form;
		}
		return form;
	}
}
