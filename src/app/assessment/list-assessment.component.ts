import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, AssessmentService, MeasurementFrameworkService} from '../_services';
import {MatDialog, MatPaginator, MatTableDataSource} from "@angular/material";
import {ConfirmDialogComponent} from "../_directives/confirm-dialog";
import {DialogData, Assessment, MeasurementFramework} from "../_models";

@Component({
	templateUrl: './list-assessment.component.html',
	styleUrls: ['./list-assessment.component.scss']
})
export class ListAssessmentComponent implements OnInit {

	loading = false;
	assessments: Array<Assessment> = [];
	measurementFrameworks: Array<MeasurementFramework> = [];
	displayedColumns: string[] = ['measurementFramework', 'date', 'status', 'actions'];
	dataSource = new MatTableDataSource();

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private assessmentService: AssessmentService,
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
		this.assessmentService.list().subscribe(data => {
			this.assessments = data as Array<Assessment>;
			this.listMeasurementFrameworks(this.assessments);
			this.dataSource = new MatTableDataSource(this.assessments);
			this.loading = false;
			this.dataSource.paginator = this.paginator;
		});
	}

	openConfirmationDialog(assessment: Assessment) {
		let data: DialogData = new DialogData(assessment.jsonAssessment.measurementFramework.name, "Deletar avaliação", "Você deseja deletar a avaliação:");
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			disableClose: true,
			data: data
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.delete(assessment);
			}
		});
	}

	delete(assessment: Assessment) {
		this.assessmentService.delete(assessment.idAssessment).subscribe(value => {
			this.list();
			this.alertService.success('Deletado com sucesso', true);
		});
	}

	listMeasurementFrameworks(assessments: Assessment[]): void {
		this.measurementFrameworks = [...new Set(assessments.map(assessment => assessment.jsonAssessment.measurementFramework))];
	}

	formatDate(date: any): Date {
		return new Date(date.date.year,date.date.month, date.date.day, date.time.hour, date.time.minute, date.time.second);
	}

	formatStatus(status: string) {
		return status =='finalized' ? 'Finalizado' : 'Em progresso';
	}
}
