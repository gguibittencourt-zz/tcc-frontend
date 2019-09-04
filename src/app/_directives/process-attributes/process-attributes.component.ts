import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CapacityDialog, GoalScale, KnowledgeArea, ProcessAttribute} from '../../_models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isEmpty} from "lodash";
import {Guid} from "guid-typescript";
import {MatDialog} from "@angular/material";
import {CapacityDialogComponent} from "../capacity-dialog";

@Component({
	selector: 'process-attributes',
	templateUrl: 'process-attributes.component.html',
	styleUrls: ['process-attributes.component.scss']
})

export class ProcessAttributesComponent implements OnInit {
	@Input('knowledgeAreas') knowledgeAreas: KnowledgeArea[];
	@Input('processAttributes') processAttributes: ProcessAttribute[];
	@Input('goals') goals: GoalScale[];
	@Output() onConfirmProcessAttribute: EventEmitter<any> = new EventEmitter();
	private processAttributeForms: FormGroup[] = [];

	constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {
	}

	ngOnInit() {
		if (isEmpty(this.processAttributes)) {
			this.processAttributes = [];
			const processAttribute = new ProcessAttribute();
			processAttribute.name = 'AP 1.1 O processo é executado';
			this.processAttributes.push(processAttribute);
			this.onConfirmProcessAttribute.emit(this.processAttributes);
		}
	}

	confirmProcessAttribute(index: number) {
		if (this.processAttributeForms[index].invalid) {
			return;
		}
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
				description: [''],
				values: this.formBuilder.array([])
			});
		}
		form.patchValue(this.processAttributes[index]);
		this.processAttributeForms[index] = form;
		return form;
	}

	openDialog(): void {
		const capacityDialog: CapacityDialog = {goals: this.goals, knowledgeAreas: this.knowledgeAreas};
		const dialogRef = this.dialog.open(CapacityDialogComponent, {
			minWidth: '300px',
			data: capacityDialog,
			disableClose: true
		});

		dialogRef.afterClosed().subscribe((result: CapacityDialog) => {
			if (result) {
			}
		});
	}
}
