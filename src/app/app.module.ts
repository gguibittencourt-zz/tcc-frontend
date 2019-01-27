import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';


import {AppComponent} from './app.component';
import {routing} from './app.routing';

import {AlertComponent} from './_directives/alert';
import {AuthGuard} from './_guards';
import {ErrorInterceptor, JwtInterceptor} from './_helpers';
import {AlertService, AuthenticationService, CompanyService, ReferenceModelService, UserService} from './_services';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {UserComponent} from './user';
import {NavbarComponent} from "./_directives/navbar";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CustomMaterialModule} from "./material/material.module";
import {CompanyComponent} from "./company";
import {ListReferenceModelComponent, RegisterReferenceModelComponent} from "./reference-model";
import {KnowledgeAreaComponent} from "./_directives/knowledge-area";
import {ProcessComponent} from "./_directives/process";
import {ConfirmDialogComponent} from "./_directives/confirm-dialog";
import {MeasurementFrameworkService} from "./_services/measurement-framework.service";
import {ListMeasurementFrameworkComponent, RegisterMeasurementFrameworkComponent} from "./measurement-framework";
import {ExpectedResultComponent} from "./_directives/expected-result";

@NgModule({
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		HttpClientModule,
		routing,
		BrowserAnimationsModule,
		CustomMaterialModule
	],
	declarations: [
		AppComponent,
		AlertComponent,
		HomeComponent,
		LoginComponent,
		UserComponent,
		CompanyComponent,
		NavbarComponent,
		ListReferenceModelComponent,
		RegisterReferenceModelComponent,
		KnowledgeAreaComponent,
		ProcessComponent,
		ConfirmDialogComponent,
		ListMeasurementFrameworkComponent,
		RegisterMeasurementFrameworkComponent,
		ExpectedResultComponent
	],
	providers: [
		{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
		AuthGuard,
		AlertService,
		AuthenticationService,
		UserService,
		CompanyService,
		ReferenceModelService,
		MeasurementFrameworkService
	],
	entryComponents: [ProcessComponent, ConfirmDialogComponent],
	bootstrap: [AppComponent]
})

export class AppModule {
}
