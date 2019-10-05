import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AssessmentService, AuthenticationService, MeasurementFrameworkService} from '../_services';
import {MatDialog, MatPaginator, MatSnackBar, MatTableDataSource} from "@angular/material";
import {ConfirmDialogComponent} from "../_directives/confirm-dialog";
import {Assessment, DialogData, MeasurementFramework, User} from "../_models";
import {SnackBarComponent} from "../_directives/snack-bar";

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
		private authenticationService: AuthenticationService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar) {
	}

	get getUser(): User {
		let user = null;
		this.authenticationService.isUserIn.subscribe(currentUser => user = currentUser);
		return user;
	}

	ngOnInit() {
		this.list();
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	list() {
		this.loading = true;
		this.assessmentService.list(this.getUser.idUser).subscribe(data => {
			this.assessments = data as Array<Assessment>;
			this.listMeasurementFrameworks(this.assessments);
			this.dataSource = new MatTableDataSource(this.assessments);
			this.loading = false;
			this.dataSource.paginator = this.paginator;
		});
	}

	openConfirmationDialog(assessment: Assessment) {
		const data: DialogData = new DialogData(assessment.jsonAssessment.measurementFramework.name, "Excluir avaliação", "Você deseja excluir a avaliação:");
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
			this.createSnackBar('Deletado com sucesso', 'success');
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

	private createSnackBar(message: string, panelClass: string): void {
		this.snackBar.openFromComponent(SnackBarComponent, {
			data: message,
			panelClass: [panelClass],
			duration: 5000
		});
	}
}
