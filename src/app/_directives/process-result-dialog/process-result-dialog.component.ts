import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Process, ProcessResult, ProcessResultDialogData, Rating} from "../../_models";
import {cloneDeep, flatMap, uniqBy, sortBy} from 'lodash';
import Highcharts = require('highcharts');

@Component({
	selector: 'process-result',
	templateUrl: 'process-result-dialog.component.html',
	styleUrls: ['process-result-dialog.component.scss']
})

export class ProcessResultDialogComponent {

	highcharts = Highcharts;
	chartOptions: any;

	constructor(private dialogRef: MatDialogRef<ProcessResultDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: ProcessResultDialogData) {
		this.createPieHighcharts(this.data.processResults);
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	get getCapacityLevel(): string {
		const processResults = cloneDeep(this.data.processResults.filter(processResult => processResult.result == 'Satisfeito'));
		if (processResults) {
			const processResult = processResults.pop();
			if (processResult) {
				return processResult.capacityResults.pop().capacityLevel.name;
			}
		}
		return 'Não atingido'
	}

	expectedResultNotSatisfied(ratings: string[], ratingAssessment: Rating) {
		if (ratingAssessment) {
			return !ratings.includes(ratingAssessment.id);
		}
		return true;
	}

	processAttributeValueNotSatisfied(ratings: string[], ratingAssessment: Map<string, Rating>, process: Process) {
		if (ratingAssessment) {
			return !ratings.includes(ratingAssessment[process.idProcess].id);
		}
		return true;
	}

	createPieHighcharts(processResults: ProcessResult[]): void {
		const ratings = flatMap(processResults, (processResult => {
			return flatMap(processResult.capacityResults, (capacityResult => {
				return flatMap(capacityResult.processAttributeResults, (processAttributeResult => {
					if (processAttributeResult.processAttribute.generateQuestions) {
						return flatMap(processAttributeResult.processAttribute.values, (value => {
							return value.ratingAssessmentByIdProcess[processResult.process.idProcess];
						}));
					}
					return flatMap(this.data.process.expectedResults, (expectedResult => {
						return expectedResult.ratingAssessment;
					}));
				}));
			}));
		}));
		this.chartOptions = {
			chart: {
				type: 'pie',
				height: 400,
				width: 250,
				marginLeft: 0
			},
			title: {
				text: 'Percentual de resultados',
				style: {
					fontSize: '15px',
					fontWeight: 'bold'
				}
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					center: [100, 100],
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: false,
					},
					showInLegend: true
				}
			},
			legend: {
				layout: 'vertical',
				verticalAlign: 'bottom',
			},
			series: [{
				name: 'Resultados',
				colorByPoint: true,
				data: ProcessResultDialogComponent.generateData(ratings)
			}],
			credits: {enabled: false}
		};
	}

	private static generateData(ratings: Rating[]): any[] {
		ratings = sortBy(ratings, (rating => !rating || rating && rating.id));
		const unique: any[] = uniqBy(ratings, (rating => !rating || rating.id));
		return flatMap(unique, (value => {
			const ratingsMapped = ratings.filter(rating => !rating && !value || (rating && value && rating.id == value.id));
			return {name: value ? value.name : 'Não avaliado', y: (ratingsMapped.length / ratings.length) * 100};
		}));
	}
}
