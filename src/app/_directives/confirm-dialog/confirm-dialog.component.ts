import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
	selector: 'confirm-dialog',
	templateUrl: 'confirm-dialog.component.html',
	styleUrls: ['confirm-dialog.component.scss']
})

export class ConfirmDialogComponent {

	constructor(private _dialogRef: MatDialogRef<ConfirmDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: string) {
	}

	get dialogRef(): MatDialogRef<ConfirmDialogComponent> {
		return this._dialogRef;
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
