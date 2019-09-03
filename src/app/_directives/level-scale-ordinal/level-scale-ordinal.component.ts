import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KnowledgeArea, Level} from '../../_models';
import {MatOptionSelectionChange} from "@angular/material";
import {flatten, uniqWith, isEqual} from 'lodash';
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
		this.levels = this.levels.map(level => {
			level.values = uniqWith(level.values, isEqual);
			return level;
		});
		this.valuesForm = new FormControl();
		this.valuesForm.patchValue(flatten(this.levels.map(level => level.values)));
	}

	updateLevel(event: MatOptionSelectionChange, idProcessArea: number) {
		let level = this.levels.find(level => level.idProcessArea === idProcessArea);
		const index = this.levels.indexOf(level);
		if (level) {
			if (event.source.selected) {
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
		console.log(this.levels);
		this.levels.push(level);
	}

	openLevelValues(event: boolean) {
		if (!event) {
			this.onUpdateLevels.emit(this.levels);
		}
	}
}
