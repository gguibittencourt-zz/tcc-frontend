import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {MetricScale} from "../../_models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {isEmpty} from "lodash";
import {Guid} from "guid-typescript";

@Component({
	selector: 'metric-scale-dialog',
	templateUrl: 'metric-scale-dialog.component.html',
	styleUrls: ['metric-scale-dialog.component.scss']
})

export class MetricScaleDialogComponent {

	metricScaleForm: FormGroup;
	submitted: boolean = false;

	constructor(private _dialogRef: MatDialogRef<MetricScaleDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: MetricScale,
				private formBuilder: FormBuilder) {
		this.metricScaleForm = this.formBuilder.group({
			idMetricScale: [Guid.create().toString()],
			name: ['', Validators.required],
			values: [],
			valueMetrics: []
		});
		this.metricScaleForm.patchValue(this.data);
	}

	get dialogRef(): MatDialogRef<MetricScaleDialogComponent> {
		return this._dialogRef;
	}

	get f() {
		return this.metricScaleForm.controls;
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	confirmMetric(): void {
		this.submitted = true;
		if (this.metricScaleForm.invalid) {
			return;
		}
		this.dialogRef.close(this.metricScaleForm.value);
	}

	valuesEmpty(): boolean {
		return isEmpty(this.f['values'].value);
	}

	comparer(o1: any, o2: any): boolean {
		return o1 && o2 ? o1.idMetricScale === o2.idMetricScale : o2 === o2;
	}
}
