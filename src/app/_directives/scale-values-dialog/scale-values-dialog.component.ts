import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ScaleValues} from "../../_models";

@Component({
	selector: 'scale-values',
	templateUrl: 'scale-values-dialog.component.html',
})

export class ScaleValuesDialogComponent {

	constructor(private dialogRef: MatDialogRef<ScaleValuesDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: ScaleValues[]) {
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	confirm(): void {
		this.dialogRef.close(this.data);
	}
}
