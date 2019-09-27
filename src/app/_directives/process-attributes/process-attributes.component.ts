import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProcessAttribute, Rating} from '../../_models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Guid} from "guid-typescript";

@Component({
	selector: 'process-attributes',
	templateUrl: 'process-attributes.component.html',
	styleUrls: ['process-attributes.component.scss']
})

export class ProcessAttributesComponent {
	@Input('processAttributes') processAttributes: ProcessAttribute[];
	@Input('ratings') ratings: Rating[];
	@Output() onConfirmProcessAttribute: EventEmitter<any> = new EventEmitter();
	private processAttributeForms: FormGroup[] = [];
	submitted = false;

	constructor(private formBuilder: FormBuilder) {
	}

	confirmProcessAttribute(index: number) {
		this.submitted = true;
		if (this.processAttributeForms[index].invalid) {
			return;
		}
		this.submitted = false;
		this.processAttributes[index] = this.processAttributeForms[index].value;
		this.onConfirmProcessAttribute.emit(this.processAttributes);
	}

	addProcessAttribute() {
		if (this.allValidForms()) {
			const processAttribute: ProcessAttribute = new ProcessAttribute();
			this.processAttributes.push(processAttribute);
		}
	}

	allValidForms(): boolean {
		return this.processAttributeForms.every(form => form.valid);
	}

	deleteProcessAttribute(index: number) {
		this.processAttributeForms.splice(index, 1);
		this.processAttributes.splice(index, 1);
		this.onConfirmProcessAttribute.emit(this.processAttributes);
	}

	getProcessAttributeForm(index: number) {
		let form = this.processAttributeForms[index];
		if (form == null) {
			form = this.formBuilder.group({
				idProcessAttribute: [Guid.create().toString()],
				name: ['', Validators.required],
				prefix: ['', Validators.required],
				generateQuestions: [],
				description: [''],
				values: this.formBuilder.array([]),
				ratings: [[]]
			});
		}
		form.patchValue(this.processAttributes[index]);
		this.processAttributeForms[index] = form;
		return form;
	}
}
