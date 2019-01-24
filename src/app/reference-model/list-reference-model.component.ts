import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, ReferenceModelService} from '../_services';
import {ReferenceModel} from "../_models";
import {MatDialog, MatTableDataSource} from "@angular/material";
import {ConfirmDialogComponent} from "../_directives/confirm-dialog";
import {DialogData} from "../_models/dialog-data";

@Component({templateUrl: './list-reference-model.component.html'})
export class ListReferenceModelComponent implements OnInit {

	loading = false;
	referenceModels: Array<ReferenceModel> = [];
	displayedColumns: string[] = ['name', 'actions'];
	dataSource = new MatTableDataSource();

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private referenceModelService: ReferenceModelService,
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
		this.referenceModelService.list().subscribe(data => {
			this.referenceModels = data as Array<ReferenceModel>;
			this.dataSource = new MatTableDataSource(this.referenceModels);
			this.loading = false;
		});
	}

	openConfirmationDialog(referenceModel: ReferenceModel) {
		let data = new DialogData(referenceModel.name, "Delete Reference Model", "Do you want to delete the reference model: ");
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			disableClose: false,
			data
		});

		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				this.delete(referenceModel);
			}
		});
	}

	delete(referenceModel: ReferenceModel) {
		this.referenceModelService.delete(referenceModel.idReferenceModel).subscribe(value => {
			this.list();
			this.alertService.success('Delete successful', true);
		});
	}
}
