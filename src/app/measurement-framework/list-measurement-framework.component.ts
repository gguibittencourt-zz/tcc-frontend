import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {MeasurementFrameworkService} from '../_services';
import {DialogData, MeasurementFramework} from "../_models";
import {MatDialog, MatPaginator, MatSnackBar, MatTableDataSource} from "@angular/material";
import {ConfirmDialogComponent} from "../_directives/confirm-dialog";
import {SnackBarComponent} from "../_directives/snack-bar";

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
		private snackBar: MatSnackBar) {
	}

	ngOnInit() {
		this.list();
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	list() {
		this.loading = true;
		this.measurementFrameworkService.list().subscribe(data => {
			this.measurementFrameworks = data as Array<MeasurementFramework>;
			this.dataSource = new MatTableDataSource(this.measurementFrameworks);
			this.loading = false;
			this.dataSource.paginator = this.paginator;
		});
	}

	openConfirmationDialog(measurementFramework: MeasurementFramework) {
		const data: DialogData = new DialogData(measurementFramework.name, "Excluir Modelo de Avaliação", "Você deseja excluir o Método de Avaliação:");
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
			this.createSnackBar('Deletado com sucesso', 'success');
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
