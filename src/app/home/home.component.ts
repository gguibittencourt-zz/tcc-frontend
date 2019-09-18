import {Component, OnInit} from '@angular/core';

import {Assessment, ReferenceModel, User} from '../_models';
import {AssessmentService, ReferenceModelService} from "../_services";
import {groupBy, keys} from 'lodash';
import Highcharts = require('highcharts');

@Component({
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
	currentUser: User;
	referenceModels: ReferenceModel[];
	highcharts = Highcharts;
	chartOptions: any;
	loading: boolean = false;

	constructor(private referenceModelService: ReferenceModelService,
				private assessmentService: AssessmentService) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	ngOnInit() {
		this.loading = true;
		this.referenceModelService.list().subscribe((value: ReferenceModel[]) => {
			this.referenceModels = value;
		});

		this.assessmentService.list(this.currentUser.idUser).subscribe((assessments: Assessment[]) => {
			const assessmentByDate = groupBy(assessments, (assessment: Assessment) => {
				return this.formatDate(assessment.date);
			});

			const series = assessments.map(value => {
				return {name: value.jsonAssessment.measurementFramework.name, data: []}
			});

			this.chartOptions = {
				chart: {
					type: "spline"
				},
				series: series,
				yAxis: {
					title: {
						text: "Níveis de Maturidade"
					}
				},
				xAxis: {
					categories: keys(assessmentByDate)
				},
			};
			this.loading = false;
		});
	}

	private formatDate(date: any): string {
		const dateFormat = new Date(date.date.year, date.date.month, date.date.day);
		return [dateFormat.getDate(), dateFormat.getMonth(), dateFormat.getFullYear()].join('/');
	}
}
