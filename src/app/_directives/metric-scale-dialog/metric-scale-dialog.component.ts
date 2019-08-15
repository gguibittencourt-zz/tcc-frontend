import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {MetricScale, TreeNode} from "../../_models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {isEmpty} from "lodash";
import {Guid} from "guid-typescript";
import {EmptyListValidator} from "../../_helpers";

@Component({
	selector: 'metric-scale-dialog',
	templateUrl: 'metric-scale-dialog.component.html',
	styleUrls: ['metric-scale-dialog.component.scss']
})

export class MetricScaleDialogComponent {

	metricScaleForms: FormGroup[] = [];
	submitted: boolean = false;
	private _isPossibleConfirm: boolean = true;

	constructor(private dialogRef: MatDialogRef<MetricScaleDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: TreeNode,
				private formBuilder: FormBuilder) {
		if (isEmpty(data.metricScale)) {
			const values: MetricScale[] = [{idMetricScale: '5', name: 'Totalmente implementado'}];
			this.metricScaleForms = [this.createMetricScaleForm('Totalmente', values)];
		} else {
			this.data.metricScale.map(value => {
				const metricScaleForm = this.createMetricScaleForm();
				metricScaleForm.patchValue(value);
				this.metricScaleForms.push(metricScaleForm);
			});
		}
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	confirmMetric(): void {
		this.submitted = true;
		if (!this.allValidForms()) {
			return;
		}
		this.dialogRef.close(this.parseFormToData(this.metricScaleForms));
	}

	addMetric() {
		if (this.allValidForms()) {
			this._isPossibleConfirm = false;
			this.metricScaleForms.push(this.createMetricScaleForm());
		}
	}

	deleteMetric(index: number) {
		this.metricScaleForms.splice(index, 1);
	}

	hasError(field: string, form: FormGroup): boolean {
		return !isEmpty(form.controls[field].errors);
	}

	comparer(o1: any, o2: any): boolean {
		return o1 && o2 ? o1.idMetricScale === o2.idMetricScale : false;
	}

	private allValidForms(): boolean {
		return this.metricScaleForms.every(form => form.valid);
	}

	private parseFormToData(forms: FormGroup[]): MetricScale[] {
		return forms.map(form => {
			return form.value;
		});
	}

	private createMetricScaleForm(name?: string, values?: MetricScale[]): FormGroup {
		return this.formBuilder.group({
			idMetricScale: [Guid.create().toString()],
			name: [name ? name : '', Validators.required],
			values: [isEmpty(values) ? '': values, EmptyListValidator.listaVaziaValidator()]
		});
	}
}
