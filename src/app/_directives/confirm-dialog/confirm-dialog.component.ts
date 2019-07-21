import {Component, Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {DialogData} from "../../_models";

@Component({
	selector: 'confirm-dialog',
	templateUrl: 'confirm-dialog.component.html',
	styleUrls: ['confirm-dialog.component.scss']
})

export class ConfirmDialogComponent {

	@Input() message?: string = 'Confirmar';

	constructor(private _dialogRef: MatDialogRef<ConfirmDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: DialogData) {
	}

	get dialogRef(): MatDialogRef<ConfirmDialogComponent> {
		return this._dialogRef;
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
