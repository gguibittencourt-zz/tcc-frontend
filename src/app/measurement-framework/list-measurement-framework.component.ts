import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, MeasurementFrameworkService} from '../_services';
import {MeasurementFramework} from "../_models";
import {MatDialog, MatTableDataSource} from "@angular/material";
import {ConfirmDialogComponent} from "../_directives/confirm-dialog";
import {DialogData} from "../_models/dialog-data";

@Component({templateUrl: './list-measurement-framework.component.html'})
export class ListMeasurementFrameworkComponent implements OnInit {

	loading = false;
	measurementFrameworks: Array<MeasurementFramework> = [];
	displayedColumns: string[] = ['name', 'actions'];
	dataSource = new MatTableDataSource();

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private measurementFrameworkService: MeasurementFrameworkService,
		private dialog: MatDialog,
		private alertService: AlertService) {
	}

	ngOnInit() {
		this.loading = true;
		this.list();
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	list() {
		this.measurementFrameworkService.list().subscribe(data => {
			this.measurementFrameworks = data as Array<MeasurementFramework>;
			this.dataSource = new MatTableDataSource(this.measurementFrameworks);
			this.loading = false;
		});
	}

	openConfirmationDialog(measurementFramework: MeasurementFramework) {
		let data: DialogData = new DialogData(measurementFramework.name, "Delete Measurement Framework", "Do you want to delete the measurement framework:");
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			disableClose: false,
			data: data
		});

		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				this.delete(measurementFramework);
			}
		});
	}

	delete(measurementFramework: MeasurementFramework) {
		this.measurementFrameworkService.delete(measurementFramework.idMeasurementFramework).subscribe(value => {
			this.list();
			this.alertService.success('Delete successful', true);
		});
	}
}
