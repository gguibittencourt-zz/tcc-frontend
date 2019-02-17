import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {UserComponent} from './user';
import {AuthGuard} from './_guards';
import {CompanyComponent} from "./company";
import {ListReferenceModelComponent, RegisterReferenceModelComponent} from "./reference-model";
import {ListMeasurementFrameworkComponent, RegisterMeasurementFrameworkComponent} from "./measurement-framework";

const appRoutes: Routes = [
	{path: '', component: HomeComponent, canActivate: [AuthGuard]},
	{path: 'login', component: LoginComponent},
	{path: 'user', component: UserComponent},
	{path: 'user/:idUser', component: UserComponent, canActivate:[AuthGuard]},
	{path: 'company/:idCompany', component: CompanyComponent, canActivate: [AuthGuard]},
	{path: 'reference-model', component: ListReferenceModelComponent, canActivate: [AuthGuard]},
	{path: 'reference-model/register', component: RegisterReferenceModelComponent, canActivate: [AuthGuard]},
	{path: 'reference-model/:idReferenceModel', component: RegisterReferenceModelComponent, canActivate: [AuthGuard]},
	{path: 'measurement-framework', component: ListMeasurementFrameworkComponent, canActivate: [AuthGuard]},
	{path: 'measurement-framework/register', component: RegisterMeasurementFrameworkComponent, canActivate: [AuthGuard]},
	{path: 'measurement-framework/:idMeasurementFramework', component: RegisterMeasurementFrameworkComponent, canActivate: [AuthGuard]},
	{path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
