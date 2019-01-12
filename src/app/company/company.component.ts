import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService, CompanyService} from '../_services';

@Component({templateUrl: 'company.component.html'})
export class CompanyComponent implements OnInit {
	companyForm: FormGroup;
	loading = false;
	submitted = false;

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private companyService: CompanyService,
		private alertService: AlertService) {
	}

	ngOnInit() {
		this.companyForm = this.formBuilder.group({
			idCompany: ['', Validators.required],
			name: ['', Validators.required],
			contributors: ['', Validators.required],
			projects: ['', Validators.required],
			occupationArea: ['', Validators.required],
		});

		this.route.params.subscribe(params => {
			let idCompany: number = params['idCompany'];
			console.log(idCompany, 'id-company:  ');
			this.companyService.get(idCompany).subscribe(data => {
				console.log(data);
				this.companyForm.setValue(data);
			});
		});
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.companyForm.controls;
	}

	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.companyForm.invalid) {
			return;
		}

		this.loading = true;
		this.companyService.update(this.companyForm.value)
			.pipe(first())
			.subscribe(
				data => {
					this.alertService.success('Update successful', true);
					this.router.navigate(['/home']);
				},
				error => {
					this.alertService.error(error.error);
					this.loading = false;
				});
	}
}
