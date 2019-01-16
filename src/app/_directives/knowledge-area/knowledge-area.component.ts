import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KnowledgeArea} from "../../_models";

@Component({
	selector: 'knowledge-area',
	templateUrl: 'knowledge-area.component.html',
	styleUrls: ['knowledge-area.component.scss']
})

export class KnowledgeAreaComponent implements OnInit {
	@Input('knowledgeAreas') knowledgeAreas: KnowledgeArea[];
	@Output() onAddKnowledgeArea: EventEmitter<any> = new EventEmitter();
	@Output() onDeleteKnowledgeArea: EventEmitter<any> = new EventEmitter();

	constructor() {
	}

	ngOnInit() {
	}

	addKnowledgeArea() {
		let knowledgeArea: KnowledgeArea = new KnowledgeArea();
		this.onAddKnowledgeArea.emit(knowledgeArea);
	}

	deleteKnowledgeArea(index: number) {
		this.onDeleteKnowledgeArea.emit(index);
	}
}
