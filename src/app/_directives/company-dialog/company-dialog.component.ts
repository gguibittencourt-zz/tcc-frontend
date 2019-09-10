import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Company} from "../../_models";

@Component({
	selector: 'company-dialog',
	templateUrl: 'company-dialog.component.html'
})

export class CompanyDialogComponent {

	constructor(public dialogRef: MatDialogRef<CompanyDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: Company) {
	}
}
