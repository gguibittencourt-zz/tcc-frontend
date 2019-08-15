import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, MeasurementFrameworkService} from '../_services';
import {MeasurementFramework} from "../_models";
import {MatDialog, MatPaginator, MatTableDataSource} from "@angular/material";
import {ConfirmDialogComponent} from "../_directives/confirm-dialog";
import {DialogData} from "../_models/dialog-data";

@Component({
	templateUrl: './list-measurement-framework.component.html',
	styleUrls: ['./list-measurement-framework.component.scss']
})
export class ListMeasurementFrameworkComponent implements OnInit {

	loading = false;
	measurementFrameworks: Array<MeasurementFramework> = [];
	displayedColumns: string[] = ['name', 'actions'];
	dataSource = new MatTableDataSource();

	@ViewChild(MatPaginator) paginator: MatPaginator;

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
			this.dataSource.paginator = this.paginator;
		});
	}

	openConfirmationDialog(measurementFramework: MeasurementFramework) {
		let data: DialogData = new DialogData(measurementFramework.name, "Deletar Método de Avaliação", "Você deseja deletar o Método de Avaliação:");
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			disableClose: true,
			data: data
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
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
