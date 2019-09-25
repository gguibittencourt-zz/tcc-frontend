import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
	selector: 'about-dialog',
	templateUrl: 'about-dialog.component.html',
	styleUrls: ['about-dialog.component.scss']
})

export class AboutDialogComponent {

	constructor(public dialogRef: MatDialogRef<AboutDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: any) {
	}
}
