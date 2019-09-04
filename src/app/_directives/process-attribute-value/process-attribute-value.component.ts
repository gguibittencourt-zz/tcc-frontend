import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ProcessAttributeValue} from "../../_models/process-attribute-value";
import {isEmpty} from "lodash";

@Component({
	selector: 'process-attribute-value',
	templateUrl: 'process-attribute-value.component.html',
	styleUrls: ['process-attribute-value.component.scss']
})

export class ProcessAttributeValueComponent implements OnInit {
	@Input('values') values: ProcessAttributeValue[];
	@Input('formGroup') formGroup: FormGroup;
	@Output() onConfirmProcessAttribute: EventEmitter<any> = new EventEmitter();

	constructor(private formBuilder: FormBuilder) {
	}

	get valuesForm() {
		return this.formGroup.get('values') as FormArray;
	}

	ngOnInit() {
		if (isEmpty(this.valuesForm.value) && this.values) {
			this.values.forEach(value => {
				this.valuesForm.push(this.formBuilder.control((value)));
			});
		}
	}

	addProcessAttributeValue() {
		const processAttributeValue = new ProcessAttributeValue();
		this.values.push(processAttributeValue);
	}

	onBlurValue(event: any, index: number) {
		if (this.valuesForm.value[index]) {
			return;
		}
		this.valuesForm.push(this.formBuilder.control(this.values[index]));
	}

	deleteProcessAttributeValue(index: number) {
		this.values.splice(index, 1);
		this.valuesForm.removeAt(index);
	}
}
