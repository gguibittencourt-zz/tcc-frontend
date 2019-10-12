import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthenticationService, DataSourceService} from '../_services';
import {DialogData, DataSource} from "../_models";
import {MatDialog, MatPaginator, MatSnackBar, MatTableDataSource} from "@angular/material";
import {ConfirmDialogComponent} from "../_directives/confirm-dialog";
import {SnackBarComponent} from "../_directives/snack-bar";

@Component({
	templateUrl: './list-data-source.component.html',
	styleUrls: ['./list-data-source.component.scss']
})
export class ListDataSourceComponent implements OnInit {

	loading = false;
	dataSources: Array<DataSource> = [];
	displayedColumns: string[] = ['name', 'url', 'actions'];
	dataSource = new MatTableDataSource();

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private dataSourceService: DataSourceService,
		private dialog: MatDialog,
		private authenticationService: AuthenticationService,
		private snackBar: MatSnackBar) {
	}

	ngOnInit() {
		this.loading = true;
		this.listByIdCompany();

	}

	listByIdCompany() {
		this.authenticationService.isUserIn.subscribe(currentUser => {
			this.list(currentUser.idCompany);
		});
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	list(idCompany: number) {
		this.dataSourceService.list(idCompany).subscribe(data => {
			this.dataSources = data as Array<DataSource>;
			this.dataSource = new MatTableDataSource(this.dataSources);
			this.loading = false;
			this.dataSource.paginator = this.paginator;
		});
	}

	openConfirmationDialog(dataSource: DataSource) {
		const data = new DialogData(dataSource.name, "Excluir Fonte de Dados", "Você deseja excluir a fonte de dados: ");
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			disableClose: true,
			data
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.delete(dataSource);
			}
		});
	}

	delete(dataSource: DataSource) {
		this.dataSourceService.delete(dataSource.idDataSource).subscribe(value => {
			this.listByIdCompany();
			this.createSnackBar('Deletado com sucesso', 'success');
		}, error => {
			this.createSnackBar(error, 'error');
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
