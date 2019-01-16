import {Component, Input, OnInit} from '@angular/core';
import {KnowledgeArea} from "../../_models";

@Component({
    selector: 'knowledge-area',
    templateUrl: 'knowledge-area.component.html',
})

export class KnowledgeAreaComponent implements OnInit {
	panelOpenState = false;
	@Input('knowledgeAreas') knowledgeAreas: KnowledgeArea[];

    constructor() {
	}

    ngOnInit() {
    	console.log(this.knowledgeAreas);
    }
}
