import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KnowledgeArea, Level} from '../../_models';
import {MatOptionSelectionChange} from "@angular/material";
import {flatten} from 'lodash';
import {FormControl} from '@angular/forms';

@Component({
	selector: 'level-scale-ordinal',
	templateUrl: 'level-scale-ordinal.component.html',
	styleUrls: ['level-scale-ordinal.component.scss']
})

export class LevelScaleOrdinalComponent implements OnInit {
	@Input('knowledgeAreas') knowledgeAreas: KnowledgeArea[];
	@Input('levels') levels: Level[];
	@Output() onUpdateLevels: EventEmitter<any> = new EventEmitter();
	valuesForm: FormControl;

	ngOnInit(): void {
		this.valuesForm = new FormControl();
		this.valuesForm.patchValue(flatten(this.levels.map(level => level.values)));
	}

	updateLevel(event: MatOptionSelectionChange, idProcessArea: number) {
		let level = this.levels.find(level => level.idProcessArea === idProcessArea);
		if (level) {
			const index = this.levels.indexOf(level);
			if (event.source.selected) {
				if (level.values.includes(event.source.value)) {
					return;
				}
				level.values.push(event.source.value);
				this.levels.splice(index, 1, level);
				return;
			}
			const indexValue = level.values.indexOf(event.source.value);
			level.values.splice(indexValue, 1);
			if (level.values) {
				this.levels.splice(index, 1, level);
				return;
			}
			this.levels.splice(index, 1);
			return;
		}
		level = new Level();
		level.idProcessArea = idProcessArea;
		level.values = [event.source.value];
		this.levels.push(level);
	}

	openLevelValues(event: boolean) {
		if (!event) {
			this.onUpdateLevels.emit(this.levels);
		}
	}
}
