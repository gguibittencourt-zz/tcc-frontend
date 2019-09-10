import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {ReferenceModelService} from '../_services';
import {DialogData, ReferenceModel} from "../_models";
import {MatDialog, MatPaginator, MatSnackBar, MatTableDataSource} from "@angular/material";
import {ConfirmDialogComponent} from "../_directives/confirm-dialog";
import {SnackBarComponent} from "../_directives/snack-bar";

@Component({
	templateUrl: './list-reference-model.component.html',
	styleUrls: ['./list-reference-model.component.scss']
})
export class ListReferenceModelComponent implements OnInit {

	loading = false;
	referenceModels: Array<ReferenceModel> = [];
	displayedColumns: string[] = ['name', 'actions'];
	dataSource = new MatTableDataSource();

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private referenceModelService: ReferenceModelService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar) {
	}

	ngOnInit() {
		this.loading = true;
		this.list();
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	list() {
		this.referenceModelService.list().subscribe(data => {
			this.referenceModels = data as Array<ReferenceModel>;
			this.dataSource = new MatTableDataSource(this.referenceModels);
			this.loading = false;
			this.dataSource.paginator = this.paginator;
		});
	}

	openConfirmationDialog(referenceModel: ReferenceModel) {
		const data = new DialogData(referenceModel.name, "Deletar Modelo de Referência", "Você deseja deletar o modelo de referência: ");
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			disableClose: true,
			data
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.delete(referenceModel);
			}
		});
	}

	delete(referenceModel: ReferenceModel) {
		this.referenceModelService.delete(referenceModel.idReferenceModel).subscribe(value => {
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
