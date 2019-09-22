import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ProcessResult, ProcessResultDialogData, Rating} from "../../_models";

@Component({
	selector: 'process-result',
	templateUrl: 'process-result-dialog.component.html',
	styleUrls: ['process-result-dialog.component.scss']
})

export class ProcessResultDialogComponent {

	constructor(private dialogRef: MatDialogRef<ProcessResultDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: ProcessResultDialogData) {
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	expectedResultNotSatisfied(ratings: string[], ratingAssessment: Rating) {
		return !ratings.includes(ratingAssessment.id);
	}
}
