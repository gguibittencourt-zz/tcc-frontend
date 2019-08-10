import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';


import {AppComponent} from './app.component';
import {routing} from './app.routing';

import {AlertComponent} from './_directives/alert';
import {AuthGuard} from './_guards';
import {ErrorInterceptor, JwtInterceptor} from './_helpers';
import {
	AlertService,
	AssessmentService,
	AuthenticationService,
	CompanyService,
	MeasurementFrameworkService,
	ReferenceModelService,
	UserService
} from './_services';
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
import {MetricScaleDialogComponent} from "./_directives/metric-scale-dialog";
import {ListMeasurementFrameworkComponent, RegisterMeasurementFrameworkComponent} from "./measurement-framework";
import {ExpectedResultComponent} from "./_directives/expected-result";
import {TreeNodeQuestionsComponent} from "./_directives/tree-node-questions";
import {QuestionComponent} from "./_directives/question";
import {LoadingComponent} from "./_directives/loading";
import {TreeNodeMetricsComponentBoolean} from "./_directives/tree-node-metrics-boolean";
import {TreeNodeMetricsComponentScaleNominal} from "./_directives/tree-node-metrics-scale-nominal";
import {TreeNodeMetricsComponentScaleNumeric} from "./_directives/tree-node-metrics-scale-numeric";
import {ClassificationScaleNominalComponent} from "./_directives/classification-scale-nominal";
import {ListAssessmentComponent, RegisterAssessmentComponent} from "./assessment";
import {QuestionAssessmentComponent} from "./_directives/question-assessment";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {LevelScaleNominalComponent} from "./_directives/level-scale-nominal";

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
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
		MetricScaleDialogComponent,
		ListMeasurementFrameworkComponent,
		RegisterMeasurementFrameworkComponent,
		ExpectedResultComponent,
		TreeNodeQuestionsComponent,
		TreeNodeMetricsComponentBoolean,
		TreeNodeMetricsComponentScaleNominal,
		TreeNodeMetricsComponentScaleNumeric,
		QuestionComponent,
		LoadingComponent,
		ListAssessmentComponent,
		RegisterAssessmentComponent,
		QuestionAssessmentComponent,
		ClassificationScaleNominalComponent,
		LevelScaleNominalComponent
	],
	providers: [
		{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}},
		AuthGuard,
		AlertService,
		AuthenticationService,
		UserService,
		CompanyService,
		ReferenceModelService,
		MeasurementFrameworkService,
		AssessmentService
	],
	entryComponents: [ProcessComponent, ConfirmDialogComponent, QuestionComponent, MetricScaleDialogComponent],
	bootstrap: [AppComponent]
})

export class AppModule {
}
