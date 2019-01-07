import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {
	MatButtonModule,
	MatNativeDateModule,
	MatIconModule,
	MatSidenavModule,
	MatListModule,
	MatToolbarModule,
	MatCardModule, MatInputModule, MatFormFieldModule
} from '@angular/material';

@NgModule({
	exports: [CommonModule, MatButtonModule, MatToolbarModule, MatNativeDateModule, MatIconModule, MatSidenavModule, MatListModule, MatToolbarModule,
		MatCardModule,
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule],
})
export class CustomMaterialModule {
}
