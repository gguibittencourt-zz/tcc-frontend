import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Rating} from "../../_models";

@Component({
	selector: 'scale-values',
	templateUrl: 'scale-values-dialog.component.html',
	styleUrls: ['scale-values-dialog.component.scss']
})

export class ScaleValuesDialogComponent {

	constructor(private dialogRef: MatDialogRef<ScaleValuesDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: Rating[]) {
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	confirm(): void {
		this.dialogRef.close(this.data);
	}
}
