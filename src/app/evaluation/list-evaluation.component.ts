import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, EvaluationService, MeasurementFrameworkService} from '../_services';
import {MatDialog, MatPaginator, MatTableDataSource} from "@angular/material";
import {ConfirmDialogComponent} from "../_directives/confirm-dialog";
import {DialogData, Evaluation, MeasurementFramework} from "../_models";

@Component({
	templateUrl: './list-evaluation.component.html',
	styleUrls: ['./list-evaluation.component.scss']
})
export class ListEvaluationComponent implements OnInit {

	private _loading = false;
	private _evaluations: Array<Evaluation> = [];
	private _measurementFrameworks: Array<MeasurementFramework> = [];
	private _displayedColumns: string[] = ['idMeasurementFramework', 'date', 'status', 'actions'];
	private _dataSource = new MatTableDataSource();

	@ViewChild(MatPaginator) private _paginator: MatPaginator;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private evaluationService: EvaluationService,
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
		this.evaluationService.list().subscribe(data => {
			this.evaluations = data as Array<Evaluation>;
			this.listMeasurementFrameworks(this.evaluations);
			this.dataSource = new MatTableDataSource(this.evaluations);
			this.loading = false;
			this.dataSource.paginator = this._paginator;
		});
	}

	openConfirmationDialog(evaluation: Evaluation) {
		let data: DialogData = new DialogData(this.getMeasurementFrameworkName(evaluation.idMeasurementFramework), "Delete Measurement Framework", "Do you want to delete the measurement framework:");
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			disableClose: false,
			data: data
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.delete(evaluation);
			}
		});
	}

	delete(evaluation: Evaluation) {
		this.evaluationService.delete(evaluation.idEvaluation).subscribe(value => {
			this.list();
			this.alertService.success('Delete successful', true);
		});
	}

	getMeasurementFrameworkName(idMeasurementFramework: number): string {
		let measurementFramework: MeasurementFramework = this.measurementFrameworks.find(value => value.idMeasurementFramework == idMeasurementFramework);
		return measurementFramework != null ? measurementFramework.name : "";
	}

	listMeasurementFrameworks(evaluations: Evaluation[]): void {
		let idMeasurementFrameworks = [...new Set(evaluations.map(value => value.idMeasurementFramework))];
		if (idMeasurementFrameworks.length) {
			this.measurementFrameworkService.getByList(idMeasurementFrameworks).subscribe(value => {
				this.measurementFrameworks = value as Array<MeasurementFramework>;
			});
		}
	}


	get loading(): boolean {
		return this._loading;
	}

	set loading(value: boolean) {
		this._loading = value;
	}

	get evaluations(): Array<Evaluation> {
		return this._evaluations;
	}

	set evaluations(value: Array<Evaluation>) {
		this._evaluations = value;
	}

	get measurementFrameworks(): Array<MeasurementFramework> {
		return this._measurementFrameworks;
	}

	set measurementFrameworks(value: Array<MeasurementFramework>) {
		this._measurementFrameworks = value;
	}

	get displayedColumns(): string[] {
		return this._displayedColumns;
	}

	set displayedColumns(value: string[]) {
		this._displayedColumns = value;
	}

	get dataSource(): MatTableDataSource<any> {
		return this._dataSource;
	}

	set dataSource(value: MatTableDataSource<any>) {
		this._dataSource = value;
	}

	get paginator(): MatPaginator {
		return this._paginator;
	}

	set paginator(value: MatPaginator) {
		this._paginator = value;
	}
}
