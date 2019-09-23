import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ProcessResultDialogData, Rating} from "../../_models";
import {cloneDeep} from 'lodash';

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

	get getCapacityLevel(): string {
		const processResults = cloneDeep(this.data.processResults.filter(processResult => processResult.result == 'Satisfeito'));
		if (processResults) {
			const processResult = processResults.pop();
			if (processResult) {
				return processResult.capacityResults.pop().capacityLevel.name;
			}
		}
		return 'Não atingido'
	}

	expectedResultNotSatisfied(ratings: string[], ratingAssessment: Rating) {
		return !ratings.includes(ratingAssessment.id);
	}
}
