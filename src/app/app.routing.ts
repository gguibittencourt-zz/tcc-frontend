import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {UserComponent} from './user';
import {AuthGuard} from './_guards';
import {CompanyComponent} from "./company";
import {ListReferenceModelComponent, RegisterReferenceModelComponent} from "./reference-model";

const appRoutes: Routes = [
	{path: '', component: HomeComponent, canActivate: [AuthGuard]},
	{path: 'login', component: LoginComponent},
	{path: 'user', component: UserComponent},
	{path: 'company/:idCompany', component: CompanyComponent, canActivate: [AuthGuard]},
	{path: 'reference-model', component: ListReferenceModelComponent, canActivate: [AuthGuard]},
	{path: 'reference-model/:idReferenceModel', component: RegisterReferenceModelComponent, canActivate: [AuthGuard]},
	{path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
