import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material";

@Component({
	selector: 'data-source-dialog',
	templateUrl: 'data-source-dialog.component.html'
})

export class DataSourceDialogComponent {

	constructor(public dialogRef: MatDialogRef<DataSourceDialogComponent>) {
	}
}
