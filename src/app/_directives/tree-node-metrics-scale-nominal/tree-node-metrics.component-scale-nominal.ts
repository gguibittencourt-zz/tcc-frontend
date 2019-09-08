import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GoalScale, KnowledgeArea, MetricScale, TreeNode} from '../../_models';
import {MatDialog, MatTreeNestedDataSource} from '@angular/material';
import {NestedTreeControl} from '@angular/cdk/tree';
import {FormBuilder} from '@angular/forms';
import {MetricScaleDialogComponent} from "../metric-scale-dialog";
import {flatMap, isEmpty, isNil} from "lodash";

@Component({
	selector: 'tree-node-metrics-scale-nominal',
	templateUrl: 'tree-node-metrics.component-scale-nominal.html',
	styleUrls: ['tree-node-metrics.component-scale-nominal.scss']
})

export class TreeNodeMetricsComponentScaleNominal implements OnInit {
	@Input('knowledgeAreas') knowledgeAreas: KnowledgeArea[];
	@Input('goals') goals: GoalScale[];
	@Output() onConfirmGoals: EventEmitter<any> = new EventEmitter();

	treeControl = new NestedTreeControl<TreeNode>(node => node.children);
	dataSource = new MatTreeNestedDataSource<TreeNode>();
	readonly valueMetrics: MetricScale[] = [
		{idMetricScale: '1', name: 'Não implementado'},
		{idMetricScale: '2', name: 'Parcialmente implementado'},
		{idMetricScale: '3', name: 'Não avaliado'},
		{idMetricScale: '4', name: 'Largamente implementado'},
		{idMetricScale: '5', name: 'Totalmente implementado'},
	];

	constructor(private formBuilder: FormBuilder, private  dialog: MatDialog) {
	}

	ngOnInit() {
		if (isNil(this.goals)) {
			this.goals = [];
		}
		this.dataSource.data = this.knowledgeAreas.map(knowledgeArea => {
			let treeNode: TreeNode = new TreeNode();
			treeNode.idTreeNode = String(knowledgeArea.idKnowledgeArea);
			treeNode.name = knowledgeArea.name;
			const goal: GoalScale = this.goals.find(goal => goal.idReference == String(knowledgeArea.idKnowledgeArea));
			if (goal) {
				treeNode.metricScale = goal.metrics;
				treeNode.hasMetricScale = !isEmpty(goal.metrics);
			} else {
				treeNode.metricScale = [];
				treeNode.hasMetricScale = false;
			}
			treeNode.children = knowledgeArea.processes.map(process => {
				const treeNodeChildren: TreeNode = new TreeNode();
				treeNodeChildren.idTreeNode = process.idProcess;
				treeNodeChildren.name = process.name;
				const goal: GoalScale = this.goals.find(goal => goal.idReference == process.idProcess);
				if (goal) {
					treeNodeChildren.metricScale = goal.metrics;
					treeNodeChildren.hasMetricScale = !isEmpty(goal.metrics);
				} else {
					this.createScaleTotalmente(treeNodeChildren, process.idProcess);
				}
				return treeNodeChildren;
			});
			return treeNode;
		});
	}

	toggleHasMetricScale(event: any, node: TreeNode, hasChild?: boolean) {
		node.hasMetricScale = event.checked;
		if (node.hasMetricScale) {
			this.openMetricScaleDialog(node, hasChild);
		}
	}

	hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

	openMetricScaleDialog(node: TreeNode, hasChild?: boolean) {
		if (hasChild) {
			node.valueMetrics = flatMap(node.children, child => {
				return child.metricScale;
			});
		} else {
			node.valueMetrics = this.valueMetrics;
		}
		const dialogRef = this.dialog.open(MetricScaleDialogComponent, {
			width: '480px',
			disableClose: true,
			data: node,
		});

		dialogRef.afterClosed().subscribe((result: MetricScale[]) => {
			if (result) {
				let actualGoal = this.goals.find(value => value.idReference === node.idTreeNode);
				if (actualGoal) {
					let indexActualGoal = this.goals.indexOf(actualGoal);
					this.goals.splice(indexActualGoal, 1);
					actualGoal.metrics = result;
				} else {
					actualGoal = new GoalScale();
					actualGoal.idReference = node.idTreeNode;
					actualGoal.metrics = result;
				}
				node.hasMetricScale = true;
				node.metricScale = result;
				this.goals.push(actualGoal);
				this.onConfirmGoals.emit(this.goals);
				return;
			}
			if (isEmpty(node.metricScale)) {
				node.hasMetricScale = false;
			}
		});
	}

	allChildrensHasMetric(node: TreeNode): boolean {
		return node.children.every(value => value.hasMetricScale && !isEmpty(value.metricScale))
	}

	private createScaleTotalmente(treeNodeChildren: TreeNode, idProcess: string) {
		const metricScale = new MetricScale();
		metricScale.name = 'Totalmente';
		metricScale.values = [{idMetricScale: '5', name: 'Totalmente implementado'}];
		treeNodeChildren.metricScale = [metricScale];
		treeNodeChildren.hasMetricScale = true;
		const goalScale = new GoalScale();
		goalScale.idReference = idProcess;
		goalScale.metrics = [metricScale];
		this.goals.push(goalScale);
	}
}
