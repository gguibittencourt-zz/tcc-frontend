import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AssessmentService} from '../_services';
import {
	Assessment,
	Classification,
	Company,
	JsonAssessment,
	LevelResult,
	MeasurementFramework,
	Process,
	ProcessAttribute,
	ProcessAttributeResult,
	ProcessAttributeValueChartDialog,
	ProcessResult,
	ProcessResultDialogData,
	Rating,
	ReferenceModel
} from "../_models";
import {flatMap, groupBy, indexOf, uniqBy} from "lodash";
import {ProcessResultDialogComponent} from "../_directives/process-result-dialog";
import {MatDialog} from "@angular/material";
import {ProcessAttributeValueChartDialogComponent} from "../_directives/process-attribute-value-chart-dialog";
import Highcharts = require('highcharts');

@Component({
	templateUrl: './view-assessment.component.html',
	styleUrls: ['view-assessment.component.scss']

})
export class ViewAssessmentComponent implements OnInit {
	loading = false;
	idAssessment: number = null;
	assessment: Assessment;
	referenceModel: ReferenceModel;
	measurementFramework: MeasurementFramework;
	classification: Classification;
	processes: Process[];
	processAttributes: ProcessAttribute[];
	highcharts = Highcharts;
	chartOptions: any;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private assessmentService: AssessmentService,
		private dialog: MatDialog) {
	}

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			this.idAssessment = params['idAssessment'];
			if (this.idAssessment) {
				this.loading = true;
				this.assessmentService.get(this.idAssessment).subscribe((data: Assessment) => {
					this.assessment = data;
					this.measurementFramework = this.assessment.jsonAssessment.measurementFramework;
					this.referenceModel = this.assessment.jsonAssessment.referenceModel;
					this.createHighchartOptions(this.assessment.jsonAssessment);
					this.loading = false;
				});
			}
		});
	}

	get ratings(): Rating[] {
		return this.measurementFramework ? this.measurementFramework.ratings : [];
	}

	get getCompany(): Company {
		return this.assessment.jsonAssessment.company;
	}

	get getAssessmentResult(): string {
		return this.assessment.jsonAssessment.assessmentResult;
	}

	get getDate() {
		return this.formatDate(this.assessment.date);
	}

	static getRatingsByProcessAttribute(levelResult: LevelResult): any[] {
		const processAttributeResults: ProcessAttributeResult[] = flatMap(levelResult.processes, (processResult => {
			return flatMap(processResult.capacityResults, (capacityResult => {
				return capacityResult.processAttributeResults;
			}));
		}));
		const dictionary = groupBy(processAttributeResults, (processAttributeResult: ProcessAttributeResult) => {
			return processAttributeResult.processAttribute.idProcessAttribute;
		});

		const ratingByProcessAttribute = [];
		for (let key in dictionary) {
			if (dictionary.hasOwnProperty(key)) {
				ratingByProcessAttribute.push({
					processAttribute: dictionary[key][0].processAttribute,
					ratings: dictionary[key].map((processAttributeResult: ProcessAttributeResult) => processAttributeResult.rating)
				});
			}
		}
		levelResult.ratingByProcessAttribute = ratingByProcessAttribute;
		return ratingByProcessAttribute;
	}

	getRatingsByProcessAttribute(levelResult: LevelResult, index: number): any[] {
		const isLast = (this.assessment.jsonAssessment.levelResults.length - 1) == index;
		const processAttributeResults: ProcessAttributeResult[] = flatMap(levelResult.processes, (processResult => {
			return flatMap(processResult.capacityResults, (capacityResult => {
				return capacityResult.processAttributeResults;
			}));
		}));

		const dictionary = groupBy(processAttributeResults, (processAttributeResult: ProcessAttributeResult) => {
			return processAttributeResult.processAttribute.idProcessAttribute;
		});

		const ratingByProcessAttribute = [];
		for (let key in dictionary) {
			if (dictionary.hasOwnProperty(key)) {
				ratingByProcessAttribute.push({
					processAttribute: dictionary[key][0].processAttribute,
					ratings: dictionary[key].map((processAttributeResult: ProcessAttributeResult) => {
						const processAttributeSatisfied = isLast ?
							processAttributeResult.processAttribute.ratings.includes(processAttributeResult.rating.id) :
							processAttributeResult.rating.id == '4';
						return {
							color: processAttributeSatisfied ? 'green' : 'red',
							rating: processAttributeResult.rating
						};
					}),
				});
			}
		}
		levelResult.ratingByProcessAttribute = ratingByProcessAttribute;
		return ratingByProcessAttribute;
	}

	getLevelResultProcesses(processes: ProcessResult[]) {
		return processes.map(processResult => {
			return processResult.process;
		})
	}

	openResultDialog(levelResult: LevelResult, processResult: ProcessResult) {
		const processResultDialogData = new ProcessResultDialogData();
		const processes: ProcessResult[] = flatMap(this.assessment.jsonAssessment.levelResults.filter(value => {
			return indexOf(this.assessment.jsonAssessment.levelResults, value) <=
				indexOf(this.assessment.jsonAssessment.levelResults, levelResult);
		}), (levelResult => {
			return levelResult.processes.filter(value => value.process.idProcess == processResult.process.idProcess);
		}));
		processResultDialogData.process = processResult.process;
		processResultDialogData.processResults = processes;
		this.dialog.open(ProcessResultDialogComponent, {
			data: processResultDialogData,
			width: '95%',
			disableClose: true
		});
	}

	private formatDate(date: any): Date {
		return new Date(date.date.year, date.date.month, date.date.day, date.time.hour, date.time.minute, date.time.second);
	}

	private createHighchartOptions(jsonAssessment: JsonAssessment) {
		const classifications: Classification[] = jsonAssessment.measurementFramework.classifications.filter(classification => {
			const index = jsonAssessment.measurementFramework.classifications.findIndex(value => value.idClassification == jsonAssessment.targetLevel.idClassification);
			return indexOf(jsonAssessment.measurementFramework.classifications, classification) <= index;
		});
		const processAttributes: ProcessAttribute[] = uniqBy(flatMap(classifications, (classification => {
			const capacityLevels = jsonAssessment.measurementFramework.capacityLevels.filter(value => classification.capacityLevels.includes(value.idCapacityLevel));
			return flatMap(capacityLevels, (capacityLevel => capacityLevel.processAttributes));
		})), (processAttribute => processAttribute.idProcessAttribute));

		const processes = uniqBy(flatMap(jsonAssessment.levelResults, (levelResult => {
			return flatMap(levelResult.processes, (processResult => {
				return processResult.process;
			}));
		})), (process => process.idProcess));

		const dialog = this.dialog;

		this.chartOptions = {
			chart: {
				type: 'column'
			},
			title: {
				text: 'Capacidade dos processos'
			},
			xAxis: {
				categories: processes.map(process => process.name),
				title: {
					text: 'Processos'
				},
			},
			yAxis: {
				min: 0,
				tickInterval: 1,
				max: processAttributes.length,
				title: {
					text: 'Atributos de processo'
				},
				labels: {
					formatter: function () {
						if (this.value == 0) {
							return '';
						}

						if (processAttributes[this.value - 1]) {
							const processAttribute = processAttributes[this.value - 1];
							return processAttribute.prefix + ' ' + processAttribute.name;
						}
					},
					y: ViewAssessmentComponent.getY(processAttributes.length)
				},
			},
			tooltip: {
				formatter: function () {
					return 'Clique para visualizar os resultados do atributo de processo';
				}
			},
			plotOptions: {
				column: {
					stacking: 'normal',
					animation: false,
					borderWidth: 0,
					dataLabels: {
						enabled: true,
						formatter: function () {
							const indexProcess: number = this.point.x;
							const indexProcessAttribute: number = this.point.stackY - 1;
							const map = flatMap(jsonAssessment.levelResults, (levelResult => {
								return ViewAssessmentComponent.getRatingsByProcessAttribute(levelResult);
							}));
							if (map[indexProcessAttribute]) {
								return map[indexProcessAttribute].ratings[indexProcess].name[0];
							}
							return '';
						},
						style: {
							fontSize: 16,
							color: 'white',
							cursor: 'pointer'
						}
					},
					point: {
						events: {
							click: function () {
								const processAttribute = processAttributes[this.stackY - 1];
								ViewAssessmentComponent.openValueOfProcessAttribute(processAttribute, processes, jsonAssessment, dialog);
							}
						}
					}
				},
			},
			series: this.generateSeries(processes, processAttributes),
			legend: {
				enabled: false
			},
			credits: {enabled: false},
		};
	}

	private generateSeries(processes: Process[], processAttributes: ProcessAttribute[]) {
		return processAttributes.map(rating => {
			return {
				name: '', data: processes.map(value => 1), color: '#bfbfbf', cursor: 'pointer'
			};
		});
	}

	private static openValueOfProcessAttribute(processAttribute: ProcessAttribute,
											   processes: Process[],
											   jsonAssessment: JsonAssessment,
											   dialog: MatDialog): void {
		const processAttributeValueChartDialog: ProcessAttributeValueChartDialog = {
			processAttribute,
			processes,
			jsonAssessment
		};
		dialog.open(ProcessAttributeValueChartDialogComponent, {
			data: processAttributeValueChartDialog,
			width: '80%',
			disableClose: true
		})
	}

	private static getY(length: any) {
		if (length == 1) {
			return 150;
		}
		if (length > 4) {
			return 25;
		}
		return 50;
	}
}
