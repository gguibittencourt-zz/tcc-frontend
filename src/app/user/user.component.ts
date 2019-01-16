import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService, UserService} from '../_services';

@Component({templateUrl: 'user.component.html'})
export class UserComponent implements OnInit {
	userForm: FormGroup;
	loading = false;
	submitted = false;
	roles: string[] = [];

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private userService: UserService,
		private alertService: AlertService) {
	}

	ngOnInit() {
		this.roles = ['ADM', 'USER'];

		this.userForm = this.formBuilder.group({
			name: ['', Validators.required],
			username: ['', Validators.required],
			password: ['', [Validators.required, Validators.minLength(6)]],
			role: ['', [Validators.required, Validators.maxLength(5)]]
		});
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.userForm.controls;
	}

	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
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
}
