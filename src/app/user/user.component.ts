import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthenticationService, UserService} from '../_services';
import {User} from "../_models";
import {SnackBarComponent} from "../_directives/snack-bar";
import {MatSnackBar} from "@angular/material";

@Component({templateUrl: 'user.component.html'})
export class UserComponent implements OnInit {
	userForm: FormGroup;
	loading = false;
	submitted = false;
	roles: string[] = [];
	private _idUser: number;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private userService: UserService,
		private authenticationService: AuthenticationService,
		private snackBar: MatSnackBar) {
	}

	ngOnInit() {
		this.roles = ['ADM', 'USER'];

		this.userForm = this.formBuilder.group({
			idUser: [],
			idCompany: [],
			name: ['', Validators.required],
			username: ['', Validators.required],
			password: ['', [Validators.required, Validators.minLength(6)]],
			role: ['', [Validators.required, Validators.maxLength(5)]]
		});

		this.route.params.subscribe(params => {
			this.idUser = params['idUser'];
			if (this.idUser) {
				this.userService.get(this.idUser).subscribe((data: User) => {
					this.userForm.setValue(data);
				});
			}
		});
	}

	onSubmit() {
		this.submitted = true;

		if (this.userForm.invalid) {
			return;
		}

		this.loading = true;
		if (this.idUser) {
			this.userService.update(this.userForm.value)
				.subscribe(
					data => {
						this.createSnackBar('Atualizado com sucesso', 'success');
						this.authenticationService.setUser(this.userForm.value);
						this.router.navigate(['/home']);
					},
					error => {
						this.createSnackBar(error.error, 'error');
						this.loading = false;
					});
		} else {
			this.userService.register(this.userForm.value)
				.subscribe(
					data => {
						this.createSnackBar('Registrado com sucesso', 'success');
						this.router.navigate(['/login']);
					},
					error => {
						this.createSnackBar(error.error, 'error');
						this.loading = false;
					});
		}
	}

	get f() {
		return this.userForm.controls;
	}

	get idUser(): number {
		return this._idUser;
	}

	set idUser(value: number) {
		this._idUser = value;
	}

	private createSnackBar(message: string, panelClass: string): void {
		this.snackBar.openFromComponent(SnackBarComponent, {
			data: message,
			panelClass: [panelClass],
			duration: 5000
		});
	}
}
