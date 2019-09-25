import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HighchartsChartComponent} from 'highcharts-angular';
import {AppComponent} from './app.component';
import {routing} from './app.routing';
import {AuthGuard} from './_guards';
import {ErrorInterceptor, JwtInterceptor} from './_helpers';
import {
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
import {TreeNodeQuestionsProcessAttributesComponent} from "./_directives/tree-node-questions-process-attributes";
import {QuestionComponent} from "./_directives/question";
import {LoadingComponent} from "./_directives/loading";
import {TreeNodeMetricsComponentBoolean} from "./_directives/tree-node-metrics-boolean";
import {TreeNodeMetricsComponentScaleNominal} from "./_directives/tree-node-metrics-scale-nominal";
import {ClassificationScaleNominalComponent} from "./_directives/classification-scale-nominal";
import {ListAssessmentComponent, RegisterAssessmentComponent, ViewAssessmentComponent} from "./assessment";
import {QuestionAssessmentComponent} from "./_directives/question-assessment";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {LevelScaleNominalComponent} from "./_directives/level-scale-nominal";
import {ScaleValuesDialogComponent} from "./_directives/scale-values-dialog";
import {LevelScaleOrdinalComponent} from "./_directives/level-scale-ordinal";
import {ProcessAttributesComponent} from "./_directives/process-attributes";
import {ProcessAttributeValueComponent} from "./_directives/process-attribute-value";
import {CapacityDialogComponent} from "./_directives/capacity-dialog";
import {SnackBarComponent} from "./_directives/snack-bar";
import {CompanyDialogComponent} from "./_directives/company-dialog";
import {CapacityLevelComponent} from "./_directives/capacity-level";
import {ProcessResultDialogComponent} from "./_directives/process-result-dialog";
import {TutorialDialogComponent} from "./_directives/tutorial-dialog";
import { ProcessAttributeValueChartDialogComponent } from './_directives/process-attribute-value-chart-dialog';
import {AboutDialogComponent} from "./_directives/about-dialog";

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
		TreeNodeQuestionsProcessAttributesComponent,
		TreeNodeMetricsComponentBoolean,
		TreeNodeMetricsComponentScaleNominal,
		QuestionComponent,
		LoadingComponent,
		ListAssessmentComponent,
		RegisterAssessmentComponent,
		QuestionAssessmentComponent,
		ClassificationScaleNominalComponent,
		LevelScaleNominalComponent,
		LevelScaleOrdinalComponent,
		ProcessAttributesComponent,
		ProcessAttributeValueComponent,
		ScaleValuesDialogComponent,
		CapacityDialogComponent,
		CompanyDialogComponent,
		SnackBarComponent,
		HighchartsChartComponent,
		CapacityLevelComponent,
		ProcessResultDialogComponent,
		ViewAssessmentComponent,
		TutorialDialogComponent,
		ProcessAttributeValueChartDialogComponent,
		AboutDialogComponent
	],
	providers: [
		{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		AuthGuard,
		AuthenticationService,
		UserService,
		CompanyService,
		ReferenceModelService,
		MeasurementFrameworkService,
		AssessmentService
	],
	entryComponents: [
		ProcessComponent,
		ConfirmDialogComponent,
		QuestionComponent,
		MetricScaleDialogComponent,
		ScaleValuesDialogComponent,
		CapacityDialogComponent,
		SnackBarComponent,
		CompanyDialogComponent,
		CompanyComponent,
		ProcessResultDialogComponent,
		TutorialDialogComponent,
		ProcessAttributeValueChartDialogComponent,
		AboutDialogComponent
	],
	bootstrap: [AppComponent]
})

export class AppModule {
}
