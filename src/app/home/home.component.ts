import {Component, OnInit} from '@angular/core';

import {Assessment, MeasurementFramework, ReferenceModel, User} from '../_models';
import {AssessmentService, MeasurementFrameworkService, ReferenceModelService} from "../_services";
import {groupBy, keys} from 'lodash';
import Highcharts = require('highcharts');

@Component({
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
	currentUser: User;
	referenceModels: ReferenceModel[];
	measurementFrameworks: MeasurementFramework[];
	highcharts = Highcharts;
	chartOptions: any;
	loading: boolean = false;

	constructor(private referenceModelService: ReferenceModelService,
				private measurementFrameworkService: MeasurementFrameworkService,
				private assessmentService: AssessmentService) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.loading = true;
	}

	ngOnInit() {
		this.loading = true;
		this.referenceModelService.list().subscribe((value: ReferenceModel[]) => {
			this.referenceModels = value;
		});

		this.measurementFrameworkService.list().subscribe((value: MeasurementFramework[]) => {
			this.measurementFrameworks = value;
		});

		this.assessmentService.list(this.currentUser.idUser).subscribe((assessments: Assessment[]) => {
			const assessmentByDate = groupBy(assessments, (assessment: Assessment) => {
				return this.formatDate(assessment.date);
			});
			const assessmentByMeasurementFramework = groupBy(assessments, (assessment: Assessment) => {
				return assessment.jsonAssessment.measurementFramework.name;
			});
			const categories: any[] = keys(assessmentByDate).reverse();
			this.getSeries(assessmentByMeasurementFramework, categories).then(series => {
				this.chartOptions = {
					chart: {
						type: "spline"
					},
					title: {
						text: 'Total de avaliações por tempo'
					},
					series: series,
					yAxis: {
						title: {
							text: "Total de avaliações"
						},
						allowDecimals: false,
					},
					xAxis: {
						categories: categories
					},
					credits: {enabled: false},
				};
			});

			this.loading = false;
		});
	}

	private async getSeries(assessmentByMeasurementFramework: any, categories: any[]): Promise<any[]> {
		const series: any[] = [];
		for (let key in assessmentByMeasurementFramework) {
			if (assessmentByMeasurementFramework.hasOwnProperty(key)) {
				const byDate: any = groupBy(assessmentByMeasurementFramework[key], (assessment: Assessment) => {
					return this.formatDate(assessment.date);
				});
				const serie: any = {name: key, data: categories.map(value => 0)};
				for (let keyBy in byDate) {
					if (byDate.hasOwnProperty(keyBy)) {
						const index = categories.findIndex(categorie => categorie == keyBy);
						serie.data[index] = byDate[keyBy].length;
					}
				}
				series.push(serie);
			}
		}
		return series;
	}

	private formatDate(date: any): string {
		const dateFormat = new Date(date.date.year, date.date.month, date.date.day);
		return [dateFormat.getDate(), dateFormat.getMonth(), dateFormat.getFullYear()].join('/');
	}
}
