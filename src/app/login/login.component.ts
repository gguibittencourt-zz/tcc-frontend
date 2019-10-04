import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthenticationService} from '../_services';
import {SnackBarComponent} from "../_directives/snack-bar";
import {MatSnackBar} from "@angular/material";

@Component({
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	loading = false;
	submitted = false;
	returnUrl: string;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private snackBar: MatSnackBar) {
	}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});

		this.authenticationService.logout();
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	get f() {
		return this.loginForm.controls;
	}

	onSubmit() {
		this.submitted = true;

		if (this.loginForm.invalid) {
			return;
		}

		this.loading = true;
		this.authenticationService.login(this.f.username.value, this.f.password.value)
			.subscribe(
				data => {
					this.router.navigate([this.returnUrl]);
				},
				error => {
					this.createSnackBar(error, 'error');
					this.loading = false;
				});
	}

	private createSnackBar(message: string, panelClass: string): void {
		this.snackBar.openFromComponent(SnackBarComponent, {
			data: message,
			panelClass: [panelClass],
			duration: 5000
		});
	}
}
