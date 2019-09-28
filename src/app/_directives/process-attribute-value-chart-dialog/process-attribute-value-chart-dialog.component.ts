import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {LevelResult, Process, ProcessAttribute, ProcessAttributeValueChartDialog} from "../../_models";
import {flatMap, uniqBy} from 'lodash';
import {ProcessAttributeValue} from "../../_models/process-attribute-value";
import {ViewAssessmentComponent} from "../../assessment";
import Highcharts = require('highcharts');

@Component({
	selector: 'process-attribute-value-chart-dialog',
	templateUrl: 'process-attribute-value-chart-dialog.component.html',
	styleUrls: ['process-attribute-value-chart-dialog.component.scss']
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
				style: {
					display: 'none'
				}
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
					text: 'Resultado do atributo de processo'
				},
				labels: {
					formatter: function () {
						if (this.value == 0) {
							return '';
						}

						if (data.processAttribute.values[this.value - 1]) {
							const value = data.processAttribute.prefix + '.' + this.value + ' ' + data.processAttribute.values[this.value - 1].name;
							return (value.length < 60) ? value : value.substring(0, 59) + '...';
						}
					},
					y: ProcessAttributeValueChartDialogComponent.getY(data.processAttribute.values.length)
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
							const process = data.processes[indexProcess];
							const indexProcessAttributeValue: number = this.point.stackY - 1;
							const processAttributeValues = flatMap(data.jsonAssessment.levelResults, (levelResult => {
								return ProcessAttributeValueChartDialogComponent.getProcessAttributeValues(levelResult, data.processAttribute.idProcessAttribute);
							}));
							if (processAttributeValues[indexProcessAttributeValue]) {
								const ratingAssessmentByIdProcess = processAttributeValues[indexProcessAttributeValue].ratingAssessmentByIdProcess;
								const rating = ratingAssessmentByIdProcess ? ratingAssessmentByIdProcess[process.idProcess] : null;
								return rating ?
									'<span style="color: ' + ViewAssessmentComponent.getColor(rating.id) + '">' + rating.name[0] + '</span>'
									: '';
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
			series: this.generateSeries(data.processes, data.processAttribute),
			legend: {
				enabled: false
			},
			credits: {enabled: false},
		};
	}

	static getProcessAttributeValues(levelResult: LevelResult, idProcessAttribute: string): ProcessAttributeValue[] {
		let processAttributeValues: ProcessAttributeValue[] = flatMap(levelResult.processes, (processResult => {
			return flatMap(processResult.capacityResults, (capacityResult => {
				return flatMap(capacityResult.processAttributeResults, (processAttributeResult => {
					if (processAttributeResult.processAttribute.idProcessAttribute == idProcessAttribute) {
						return flatMap(processAttributeResult.processAttribute.values, (processAttributeValue => {
							return processAttributeValue;
						}));
					}
					return [];
				}));
			}));
		}));
		return uniqBy(processAttributeValues, (processAttributeValue: ProcessAttributeValue) => {
			return processAttributeValue.idProcessAttributeValue;
		});
	}

	private generateSeries(processes: Process[], processAttribute: ProcessAttribute) {
		return processAttribute.values.map(rating => {
			return {
				name: '', data: processes.map(value => 1), color: '#cecece'
			};
		});
	}

	private static getY(length: any) {
		if (length == 1) {
			return 150;
		}
		if (length > 4) {
			return 25;
		}
		return 40;
	}

	getColor(id: string) {
		return ViewAssessmentComponent.getColor(id);
	}
}
