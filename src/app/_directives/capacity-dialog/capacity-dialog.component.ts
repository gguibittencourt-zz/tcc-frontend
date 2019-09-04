import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {CapacityDialog} from "../../_models";

@Component({
	selector: 'capacity',
	templateUrl: 'capacity-dialog.component.html',
	styleUrls: ['capacity-dialog.component.scss']
})

export class CapacityDialogComponent {

	constructor(private dialogRef: MatDialogRef<CapacityDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: CapacityDialog) {
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	confirm(): void {
		this.dialogRef.close(this.data);
	}

	confirmGoals($event: any) {
	}
}
