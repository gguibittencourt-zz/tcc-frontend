import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KnowledgeArea} from "../../_models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProcessComponent} from "../process";
import {MatDialog} from "@angular/material";
import {Guid} from "guid-typescript";
import {cloneDeep} from "lodash";

@Component({
	selector: 'knowledge-area',
	templateUrl: 'knowledge-area.component.html',
	styleUrls: ['knowledge-area.component.scss']
})

export class KnowledgeAreaComponent implements OnInit {
	@Input('knowledgeAreas') knowledgeAreas: KnowledgeArea[];
	@Output() onAddKnowledgeArea: EventEmitter<any> = new EventEmitter();
	@Output() onDeleteKnowledgeArea: EventEmitter<any> = new EventEmitter();
	@Output() onUpdateKnowledgeArea: EventEmitter<any> = new EventEmitter();
	private knowledgeAreaForms: FormGroup[] = [];
	private mapCloseAccordion: Map<number, boolean> = new Map<number, boolean>();
	private _isPossibleConfirm: boolean = false;

	constructor(private formBuilder: FormBuilder, private  dialog: MatDialog) {
	}

	ngOnInit() {
		this.knowledgeAreas.forEach((value, index) => {
			this.knowledgeAreaForms[index] = this.formBuilder.group({
				idKnowledgeArea: [],
				name: ['', Validators.required],
				purpose: ['', Validators.required],
				processes: [[]]

			});
			this.mapCloseAccordion.set(index, false)
		});
	}

	get isPossibleConfirm(): boolean {
		return this._isPossibleConfirm;
	}

	confirmKnowledgeArea(index: number) {
		if (this.knowledgeAreaForms[index].invalid) {
			return;
		}

		this._isPossibleConfirm = true;
		this.mapCloseAccordion.set(index, false);
		this.onUpdateKnowledgeArea.emit([index, this.knowledgeAreaForms[index].value]);
	}

	addKnowledgeArea() {
		if (this.allValidForms()) {
			this._isPossibleConfirm = false;
			let knowledgeArea: KnowledgeArea = new KnowledgeArea();
			this.onAddKnowledgeArea.emit(knowledgeArea);
		}
	}

	allValidForms(): boolean {
		return this.knowledgeAreaForms.every(form => form.valid);
	}

	deleteKnowledgeArea(index: number) {
		this.onDeleteKnowledgeArea.emit(index);
		this.knowledgeAreaForms.splice(index, 1);
	}

	formChange(index: number) {
		this.mapCloseAccordion.set(index, true);
	}

	cancelKnowledgeArea(index: number) {
		this.mapCloseAccordion.set(index, false);
	}

	getKnowledgeAreaForm(index: number) {
		let form = this.knowledgeAreaForms[index];
		if (form == null) {
			form = this.formBuilder.group({
				idKnowledgeArea: [Guid.create().toString()],
				name: ['', Validators.required],
				purpose: ['', Validators.required],
				processes: [[]]
			});
			form.patchValue(this.knowledgeAreas[index]);
			this.knowledgeAreaForms[index] = form;
		}
		return form;
	}

	openDialog(index: number): void {
		this.mapCloseAccordion.set(index, true);

		let knowledgeArea = this.knowledgeAreas[index];
		const dialogRef = this.dialog.open(ProcessComponent, {
			disableClose: true,
			height: '95%',
			width: '95%',
			maxWidth: '95%',
			data: knowledgeArea.processes == null ? [] : cloneDeep(knowledgeArea.processes),
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.knowledgeAreas[index].processes = result;
				this.knowledgeAreaForms[index].controls["processes"].setValue(this.knowledgeAreas[index].processes);
			}
		});
	}
}
