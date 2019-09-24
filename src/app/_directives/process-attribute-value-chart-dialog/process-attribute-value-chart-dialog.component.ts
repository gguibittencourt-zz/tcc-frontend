import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {JsonAssessment, LevelResult, Process, ProcessAttributeValueChartDialog} from "../../_models";
import {flatMap, groupBy} from 'lodash';
import {ProcessAttributeValue} from "../../_models/process-attribute-value";
import Highcharts = require('highcharts');

@Component({
	selector: 'process-attribute-value-chart-dialog',
	templateUrl: 'process-attribute-value-chart-dialog.component.html'
})

export class ProcessAttributeValueChartDialogComponent {

	highcharts = Highcharts;
	chartOptions: any;

	constructor(public dialogRef: MatDialogRef<ProcessAttributeValueChartDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: ProcessAttributeValueChartDialog) {
		this.chartOptions = {
			chart: {
				type: 'column'
			},
			title: {
				text: 'Capacidade dos processos'
			},
			xAxis: {
				categories: data.processes.map(process => process.name),
				title: {
					text: 'Processos'
				},
			},
			yAxis: {
				min: 0,
				tickInterval: 1,
				max: data.processAttribute.values.length,
				title: {
					text: 'Atributos de processo'
				},
				labels: {
					formatter: function () {
						if (this.value == 0) {
							return '';
						}

						if (data.processAttribute.values[this.value - 1]) {
							return data.processAttribute.prefix + '.' + this.value + ' ' + data.processAttribute.values[this.value - 1].name;
						}
					}
				},
			},
			tooltip: {enabled: false},
			plotOptions: {
				column: {
					stacking: 'normal',
					animation: false,
					borderWidth: 0,
					dataLabels: {
						enabled: true,
						formatter: function () {
							const indexProcess: number = this.point.x;
							const indexProcessAttributeValue: number = this.point.stackY - 1;
							const map = flatMap(data.jsonAssessment.levelResults, (levelResult => {
								return ProcessAttributeValueChartDialogComponent.getRatingsByProcessAttribute(levelResult);
							}));
							if (map[indexProcessAttributeValue]) {
								const rating = map[indexProcessAttributeValue].ratings[indexProcess];
								return rating ? rating.name[0] : '';
							}
							return '';
						},
						style: {
							fontSize: 16,
							color: 'white'
						}
					},
				},
			},
			series: this.generateSeries(data.processes, data.jsonAssessment),
			legend: {
				enabled: false
			},
			credits: {enabled: false},
		};
	}

	static getRatingsByProcessAttribute(levelResult: LevelResult): any[] {
		const processAttributeValues: ProcessAttributeValue[] = flatMap(levelResult.processes, (processResult => {
			return flatMap(processResult.capacityResults, (capacityResult => {
				return flatMap(capacityResult.processAttributeResults, (processAttributeResult => {
					return flatMap(processAttributeResult.processAttribute.values, (processAttributeValue => {
						return processAttributeValue;
					}));
				}));
			}));
		}));
		const dictionary = groupBy(processAttributeValues, (processAttributeValue: ProcessAttributeValue) => {
			return processAttributeValue.idProcessAttributeValue;
		});

		const ratingByProcessAttributeValue = [];
		for (let key in dictionary) {
			if (dictionary.hasOwnProperty(key)) {
				ratingByProcessAttributeValue.push({
					processAttributeValue: dictionary[key][0],
					ratings: dictionary[key].map((processAttributeValue: ProcessAttributeValue) => processAttributeValue.ratingAssessment)
				});
			}
		}
		return ratingByProcessAttributeValue;
	}

	private generateSeries(processes: Process[], jsonAssessment: JsonAssessment) {
		return jsonAssessment.measurementFramework.ratings.map(rating => {
			return {
				name: rating.name, data: processes.map(value => 1), color: '#bfbfbf'
			};
		});
	}
}
