import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material";

@Component({
	selector: 'reference-model-dialog',
	templateUrl: 'reference-model-dialog.component.html'
})

export class ReferenceModelDialogComponent {

	constructor(public dialogRef: MatDialogRef<ReferenceModelDialogComponent>) {
	}
}
