import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {
	MatButtonModule,
	MatNativeDateModule,
	MatIconModule,
	MatSidenavModule,
	MatListModule,
	MatToolbarModule,
	MatSelectModule,
	MatTableModule,
	MatCardModule,
	MatExpansionModule,
	MatInputModule,
	MatFormFieldModule,
} from '@angular/material';

@NgModule({
	exports: [CommonModule, MatButtonModule, MatToolbarModule, MatNativeDateModule, MatIconModule, MatSidenavModule, MatListModule, MatToolbarModule,
		MatCardModule,
		MatSelectModule,
		MatTableModule,
		MatInputModule,
		MatFormFieldModule,
		MatExpansionModule,
		MatButtonModule],
})
export class CustomMaterialModule {
}
