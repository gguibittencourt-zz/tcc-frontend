import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AlertService, ReferenceModelService} from '../_services';
import {ReferenceModel} from "../_models";
import {MatTableDataSource} from "@angular/material";

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
		private alertService: AlertService) {
	}

	ngOnInit() {
		this.loading = true;
		this.referenceModelService.list().subscribe(data => {
			this.referenceModels = data as Array<ReferenceModel>;
			this.dataSource = new MatTableDataSource(this.referenceModels);
			this.loading = false;
		});
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
}
