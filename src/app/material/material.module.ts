import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {
	MatButtonModule,
	MatTooltipModule,
	MatCardModule,
	MatCheckboxModule,
	MatDialogModule,
	MatExpansionModule,
	MatFormFieldModule,
	MatDividerModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatSelectModule,
	MatSidenavModule, MatSliderModule,
	MatSlideToggleModule,
	MatStepperModule,
	MatTableModule,
	MatTabsModule,
	MatToolbarModule,
	MatTreeModule
} from '@angular/material';

@NgModule({
	exports: [
		CommonModule,
		MatButtonModule,
		MatTooltipModule,
		MatToolbarModule,
		MatNativeDateModule,
		MatIconModule,
		MatSidenavModule,
		MatListModule,
		MatToolbarModule,
		MatCardModule,
		MatSelectModule,
		MatTableModule,
		MatInputModule,
		MatFormFieldModule,
		MatExpansionModule,
		MatDialogModule,
		MatButtonModule,
		MatCheckboxModule,
		MatSlideToggleModule,
		MatTabsModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatStepperModule,
		MatTreeModule,
		MatPaginatorModule,
		MatRadioModule,
		MatSliderModule,
		MatDividerModule
	],
})
export class CustomMaterialModule {
}
