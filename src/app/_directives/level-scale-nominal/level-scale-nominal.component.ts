import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GoalScale, KnowledgeArea, Level} from '../../_models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isNil} from "lodash";
import {EmptyListValidator} from "../../_helpers";

@Component({
	selector: 'level-scale-nominal',
	templateUrl: 'level-scale-nominal.component.html',
	styleUrls: ['level-scale-nominal.component.scss']
})

export class LevelScaleNominalComponent implements OnInit {
	@Input('knowledgeAreas') knowledgeAreas: KnowledgeArea[];
	@Input('levels') levels: Level[];
	@Input('goals') goals: GoalScale[];
	@Output() onConfirmLevel: EventEmitter<any> = new EventEmitter();
	private levelForms: FormGroup[] = [];
	private mapCloseAccordion: Map<number, boolean> = new Map<number, boolean>();
	private _isPossibleConfirm: boolean = false;

	constructor(private formBuilder: FormBuilder) {
	}

	ngOnInit() {
		if (isNil(this.goals)) {
			this.goals = [];
		}

		if (isNil(this.levels)) {
			this.levels = [];
		}
		//TODO preencher os levelForms a partir dos levels
		this.levelForms = [] as FormGroup[];
		const formGroup = this.formBuilder.group({
			idProcessArea: [, Validators.required],
			values: [[], EmptyListValidator.listaVaziaValidator],
		});
		this.levelForms.push(formGroup);
	}

	confirmLevel(index: number) {
		if (this.levelForms[index].invalid) {
			return;
		}

		this._isPossibleConfirm = true;
		this.mapCloseAccordion.set(index, false);
		this.onConfirmLevel.emit(this.levels);
	}

	addLevel() {
		if (this.allValidForms()) {
			this._isPossibleConfirm = false;
			const level: Level = new Level();
			this.levels.push(level);
		}
	}

	allValidForms(): boolean {
		return this.levelForms.every(form => form.valid);
	}

	deleteLevel(index: number) {
		this.levelForms.splice(index, 1);
	}

	formChange(index: number) {
		this.mapCloseAccordion.set(index, true);
	}

	cancelLevel(index: number) {
		this.mapCloseAccordion.set(index, false);
	}

	getLevelForm(index: number) {
		let form = this.levelForms[index];
		if (form == null) {
			form = this.formBuilder.group({
				idProcessArea: [, Validators.required],
				values: [[], EmptyListValidator.listaVaziaValidator],
			});
			form.patchValue(this.levels[index]);
			this.levelForms[index] = form;
		}
		return form;
	}
}
