import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material";

@Component({
	selector: 'tutorial-dialog',
	templateUrl: 'tutorial-dialog.component.html'
})

export class TutorialDialogComponent {

	constructor(public dialogRef: MatDialogRef<TutorialDialogComponent>) {
	}
}
