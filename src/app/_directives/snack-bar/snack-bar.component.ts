import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
	selector: 'snack-bar',
	templateUrl: './snack-bar.component.html',
	styleUrls: ['snack-bar.component.scss']
})

export class SnackBarComponent {

	constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
				private _snackRef: MatSnackBarRef<SnackBarComponent>) {
	}

	dismiss(): void {
		this._snackRef.dismiss();
	}
}
