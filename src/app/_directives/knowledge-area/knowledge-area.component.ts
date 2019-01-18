import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KnowledgeArea} from "../../_models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
	knowledgeAreaForm: FormGroup;
	private mapCloseAccordion: Map<number, boolean> = new Map<number, boolean>();

	constructor(private formBuilder: FormBuilder) {
	}

	ngOnInit() {
		this.knowledgeAreaForm = this.formBuilder.group({
			idKnowledgeArea: [''],
			name: [''],
			purpose: ['']
		});

		this.knowledgeAreas.forEach(value => this.mapCloseAccordion.set(this.knowledgeAreas.indexOf(value), false));
	}

	confirmKnowledgeArea(index: number, knowledgeArea: KnowledgeArea) {
		console.log(knowledgeArea);
		this.mapCloseAccordion.set(index, false);

		this.onUpdateKnowledgeArea.emit([index, knowledgeArea]);
	}

	addKnowledgeArea() {
		let knowledgeArea: KnowledgeArea = new KnowledgeArea();
		this.onAddKnowledgeArea.emit(knowledgeArea);
	}

	deleteKnowledgeArea(index: number) {
		this.onDeleteKnowledgeArea.emit(index);
	}

	formChange(index: number) {
		this.mapCloseAccordion.set(index, true);
	}

	get f() {
		return this.knowledgeAreaForm.controls;
	}
}
