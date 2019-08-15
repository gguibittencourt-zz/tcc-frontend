import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GoalScale, KnowledgeArea, Level, MetricScale} from '../../_models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isEmpty, isNil} from "lodash";
import {EmptyListValidator} from "../../_helpers";

@Component({
	selector: 'level-scale-nominal',
	templateUrl: 'level-scale-nominal.component.html',
	styleUrls: ['level-scale-nominal.component.scss']
})

export class LevelScaleNominalComponent implements OnInit {
	@Input('knowledgeAreas') knowledgeAreas: KnowledgeArea[];
	@Input('levels') levels: Level[];
	@Input('levelValues') levelValues: Map<string, MetricScale[]>;
	@Input('goals') goals: GoalScale[];
	@Output() onUpdateLevels: EventEmitter<any> = new EventEmitter();
	private levelForms: FormGroup[] = [];
	private _isPossibleConfirm: boolean = false;

	constructor(private formBuilder: FormBuilder) {
	}

	ngOnInit() {
		if (isNil(this.goals)) {
			this.goals = [];
		}

		if (isEmpty(this.levels)) {
			this.levels = [];
			const formGroup = this.createLevelForm();
			this.levelForms.push(formGroup);
		}
		this.levels.forEach(level => {
			const formGroup = this.createLevelForm();
			formGroup.patchValue(level);
			this.levelForms.push(formGroup);
		});

	}

	addLevel() {
		if (this.allValidForms()) {
			this._isPossibleConfirm = false;
			this.levelForms.push(this.createLevelForm());
		}
	}

	changeProcessArea(event: string): void {
		const goal = this.goals.find(goal => goal.idReference === event);
		this.levelValues.set(event, goal.metrics);
	}

	openLevelValues(event: boolean) {
		if (!event && this.allValidForms()) {
			this.onUpdateLevels.emit(this.parseFormToData(this.levelForms));
		}
	}

	allValidForms(): boolean {
		return this.levelForms.every(form => form.valid);
	}

	deleteLevel(index: number) {
		this.levelForms.splice(index, 1);
	}

	showProcessArea(processArea: KnowledgeArea): boolean {
		 return this.levelForms.some(form => form.controls['idProcessArea'].value === processArea.idKnowledgeArea)
	}

	disableProcessArea(form: FormGroup): boolean {
		return !form.controls['idProcessArea'].value;
	}

	hasError(field: string, form: FormGroup): boolean {
		return !isEmpty(form.controls[field].errors);
	}

	comparer(o1: any, o2: any): boolean {
		return o1 && o2 ? o1.idMetricScale === o2.idMetricScale : false;
	}

	private createLevelForm(): FormGroup {
		return this.formBuilder.group({
			idProcessArea: [, Validators.required],
			values: [[], EmptyListValidator.listaVaziaValidator()],
		});
	}

	private parseFormToData(forms: FormGroup[]): Level[] {
		return forms.map(form => {
			return form.value;
		});
	}

	getLevelValues(levelForm: FormGroup): MetricScale[] {
		return this.levelValues.get(levelForm.controls['idProcessArea'].value);
	}
}
