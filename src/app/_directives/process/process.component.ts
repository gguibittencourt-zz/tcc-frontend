import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Process} from "../../_models";

@Component({
	selector: 'process',
	templateUrl: 'process.component.html',
	styleUrls: ['process.component.scss']
})

export class ProcessComponent {

	constructor(public dialogRef: MatDialogRef<ProcessComponent>,
				@Inject(MAT_DIALOG_DATA) public data: Process) {}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
