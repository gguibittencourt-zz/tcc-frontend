import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService, UserService} from '../_services';
import {User} from "../_models";

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
		private alertService: AlertService) {
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
		this.userService.register(this.userForm.value)
			.pipe(first())
			.subscribe(
				data => {
					this.alertService.success('Registration successful', true);
					this.router.navigate(['/login']);
				},
				error => {
					this.alertService.error(error.error);
					this.loading = false;
				});
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
}
