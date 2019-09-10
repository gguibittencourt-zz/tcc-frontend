import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {CompanyService} from '../_services';
import {Company} from "../_models";
import {MatDialogRef, MatSnackBar} from "@angular/material";
import {CompanyDialogComponent} from "../_directives/company-dialog";
import {SnackBarComponent} from "../_directives/snack-bar";

@Component({
	selector: 'company',
	templateUrl: 'company.component.html'
})
export class CompanyComponent implements OnInit {
	companyForm: FormGroup;
	loading = false;
	submitted = false;
	@Input('company') company: Company;
	@Input('dialogRef') dialogRef: MatDialogRef<CompanyDialogComponent>;

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private companyService: CompanyService,
		private snackBar: MatSnackBar) {
	}

	ngOnInit() {
		this.companyForm = this.formBuilder.group({
			idCompany: ['', Validators.required],
			name: ['', Validators.required],
			contributors: ['', Validators.required],
			projects: ['', Validators.required],
			occupationArea: ['', Validators.required],
		});

		if (this.company) {
			this.companyForm.setValue(this.company);
		} else {
			this.route.params.subscribe(params => {
				const idCompany: number = params['idCompany'];
				this.companyService.get(idCompany).subscribe(data => {
					this.companyForm.setValue(data);
				});
			});
		}
	}

	get f() {
		return this.companyForm.controls;
	}

	onSubmit() {
		this.submitted = true;

		if (this.companyForm.invalid) {
			return;
		}

		this.loading = true;
		this.companyService.update(this.companyForm.value)
			.subscribe(
				data => {
					if (this.company) {
						this.dialogRef.close(false);
					} else {
						this.createSnackBar('Organização atualizada', 'success');
						this.router.navigate(['/home']);
					}
				},
				error => {
					this.createSnackBar(error.error, 'error');
					this.loading = false;
				});
	}

	cancel(): void {
		if (this.company) {
			this.dialogRef.close(false);
			return;
		}
		this.router.navigate(['/home']);
	}

	private createSnackBar(message: string, panelClass: string): void {
		this.snackBar.openFromComponent(SnackBarComponent, {
			data: message,
			panelClass: [panelClass],
			duration: 5000
		});
	}
}
