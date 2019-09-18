import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CapacityLevel, ProcessAttribute, Rating} from '../../_models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isEmpty} from "lodash";
import {Guid} from "guid-typescript";
import {ProcessAttributeValue} from "../../_models/process-attribute-value";

@Component({
	selector: 'capacity-level',
	templateUrl: 'capacity-level.component.html',
	styleUrls: ['capacity-level.component.scss']
})

export class CapacityLevelComponent implements OnInit {
	@Input('capacityLevels') capacityLevels: CapacityLevel[];
	@Input('ratings') ratings: Rating[];
	@Output() onConfirmCapacityLevels: EventEmitter<any> = new EventEmitter();
	private capacityLevelForms: FormGroup[] = [];

	constructor(private formBuilder: FormBuilder) {
	}

	ngOnInit() {
		if (isEmpty(this.capacityLevels)) {
			this.capacityLevels = [];
			const capacityLevel = new CapacityLevel();
			capacityLevel.name = 'Nível 1';
			const processAttribute = new ProcessAttribute();
			processAttribute.name = 'AP 1.1 O processo é executado';
			processAttribute.values = CapacityLevelComponent.createValue();
			processAttribute.ratings = ["4"];
			processAttribute.generateQuestions = false;
			capacityLevel.processAttributes = [processAttribute];
			this.capacityLevels.push(capacityLevel);
			this.onConfirmCapacityLevels.emit(this.capacityLevels);
		}
	}

	confirmCapacityLevel(index: number) {
		if (this.capacityLevelForms[index].invalid) {
			return;
		}
		this.capacityLevels[index] = this.capacityLevelForms[index].value;
		this.onConfirmCapacityLevels.emit(this.capacityLevels);
	}

	addCapacityLevel() {
		if (this.allValidForms()) {
			this.capacityLevels.push(new CapacityLevel());
		}
	}

	allValidForms(): boolean {
		return this.capacityLevelForms.every(form => form.valid);
	}

	deleteCapacityLevel(index: number) {
		this.capacityLevelForms.splice(index, 1);
		this.capacityLevels.splice(index, 1);
		this.onConfirmCapacityLevels.emit(this.capacityLevels);
	}

	getCapacityLevelForm(index: number) {
		let form = this.capacityLevelForms[index];
		if (form == null) {
			form = this.formBuilder.group({
				idCapacityLevel: [Guid.create().toString()],
				name: ['', Validators.required],
				processAttributes: []
			});
		}
		form.patchValue(this.capacityLevels[index]);
		this.capacityLevelForms[index] = form;
		return form;
	}

	confirmProcessAttributes(processAttributes: ProcessAttribute[], i: number) {
		this.getCapacityLevelForm(i).get('processAttributes').setValue(processAttributes);
	}

	private static createValue(): ProcessAttributeValue[] {
		const processAttributeValue = new ProcessAttributeValue();
		processAttributeValue.name = 'O processo produz os resultados definidos.';
		return [processAttributeValue];
	}
}
