import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthenticationService, DataSourceService} from '../_services';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataSource, User} from "../_models";
import {MatDialogRef, MatSnackBar} from "@angular/material";
import {SnackBarComponent} from "../_directives/snack-bar";
import {UrlValidator} from "../_helpers";
import {DataSourceDialogComponent} from "../_directives/data-source-dialog";

@Component({
	selector: 'register-data-source',
	templateUrl: './register-data-source.component.html',
	styleUrls: ['register-data-source.component.scss']

})
export class RegisterDataSourceComponent implements OnInit {
	dataSourceForm: FormGroup;
	loading = false;
	submitted = false;
	idDataSource: number = null;
	get: string = 'GET';
	@Input('dialogRef') dialogRef: MatDialogRef<DataSourceDialogComponent>;

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private authenticationService: AuthenticationService,
		private dataSourceService: DataSourceService,
		private snackBar: MatSnackBar) {
	}

	get getUser(): User {
		let user = null;
		this.authenticationService.isUserIn.subscribe(currentUser => user = currentUser);
		return user;
	}

	get f() {
		return this.dataSourceForm.controls;
	}


	ngOnInit() {
		this.dataSourceForm = this.formBuilder.group({
			idDataSource: [],
			idCompany: [this.getUser.idCompany],
			name: ['', Validators.required],
			url: ['', [Validators.required, UrlValidator.urlValidator()]],
			authenticated: [false, Validators.required],
			user: [''],
			password: ['']
		});

		this.route.params.subscribe(params => {
			this.idDataSource = params['idDataSource'];
			if (this.idDataSource) {
				this.dataSourceService.get(this.idDataSource).subscribe((data: DataSource) => {
					this.dataSourceForm.setValue(data);
					this.f.authenticated.setValue(data.authenticated.toUpperCase() == 'T');
				});
			}
		});

		this.f.authenticated.valueChanges.subscribe(value => {
			if (value == true || (value as string && value.toUpperCase() == 'T')) {
				this.f.user.setValidators(Validators.required);
				this.f.password.setValidators(Validators.required);
				return;
			}
			this.f.user.setValidators(null);
			this.f.user.reset('');
			this.f.password.setValidators(null);
			this.f.password.reset('');
		})
	}

	onSubmit() {
		this.submitted = true;

		if (this.dataSourceForm.invalid) {
			return;
		}

		this.loading = true;
		const value: DataSource = this.dataSourceForm.value;
		value.authenticated = this.f.authenticated.value ? 't' : 'f';

		if (this.idDataSource) {
			this.dataSourceService.update(value)
				.subscribe(
					data => {
						this.createSnackBar('Atualizado com sucesso', 'success');
						this.router.navigate(['/data-source']);
					},
					error => {
						this.createSnackBar(error, 'error');
						this.loading = false;
					});
		} else {
			this.dataSourceService.register(value)
				.subscribe(
					data => {
						this.createSnackBar('Cadastro com sucesso', 'success');
						if (this.dialogRef) {
							this.dialogRef.close(data);
							return;
						}
						this.router.navigate(['/data-source']);
					},
					error => {
						this.createSnackBar(error, 'error');
						this.loading = false;
					});
		}
	}

	private createSnackBar(message: string, panelClass: string): void {
		this.snackBar.openFromComponent(SnackBarComponent, {
			data: message,
			panelClass: [panelClass],
			duration: 5000
		});
	}
}
