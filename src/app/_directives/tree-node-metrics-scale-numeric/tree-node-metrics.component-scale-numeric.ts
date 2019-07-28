import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GoalBoolean, KnowledgeArea, MetricScale, TreeNode} from '../../_models';
import {MatDialog, MatTreeNestedDataSource} from '@angular/material';
import {NestedTreeControl} from '@angular/cdk/tree';
import {FormBuilder} from '@angular/forms';
import {isNil} from "lodash";

@Component({
	selector: 'tree-node-metrics-scale-numeric',
	templateUrl: 'tree-node-metrics.component-scale-numeric.html',
	styleUrls: ['tree-node-metrics.component-scale-numeric.scss']
})

export class TreeNodeMetricsComponentScaleNumeric implements OnInit {
	@Input('knowledgeAreas') knowledgeAreas: KnowledgeArea[];
	@Input('goals') goals: GoalBoolean[];
	@Output() onConfirmGoals: EventEmitter<any> = new EventEmitter();

	treeControl = new NestedTreeControl<TreeNode>(node => node.children);
	dataSource = new MatTreeNestedDataSource<TreeNode>();
	readonly valueMetrics: MetricScale[] = [
		{idMetricScale: '1', name: 'Não ainda'},
		{idMetricScale: '2', name: 'Não implementado'},
		{idMetricScale: '3', name: 'Parcialmente implementado'},
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
			treeNode.percentage = null;

			treeNode.children = knowledgeArea.processes.map(process => {
				const treeNodeChildren: TreeNode = new TreeNode();
				treeNodeChildren.idTreeNode = process.idProcess;
				treeNodeChildren.name = process.name;
				const goal: GoalBoolean = this.goals ? this.goals.find(goal => goal.idReference == process.idProcess) : null;
				if (goal) {
					treeNodeChildren.percentage = goal.percentage;
				} else {
					treeNodeChildren.percentage = 100;
				}
				treeNodeChildren.children = process.expectedResults.map(expectedResult => {
					let expectedTreeNode: TreeNode = new TreeNode();
					expectedTreeNode.idTreeNode = expectedResult.idExpectedResult;
					expectedTreeNode.name = expectedResult.name;
					let goal: GoalBoolean = this.goals ? this.goals.find(goal => goal.idReference == expectedResult.idExpectedResult): null;
					if (goal) {
						expectedTreeNode.percentage = goal.percentage;
					} else {
						expectedTreeNode.percentage = Number((100.0 / process.expectedResults.length).toFixed(2));
					}
					return expectedTreeNode;
				});
				return treeNodeChildren;
			});
			return treeNode;
		});
	}

	addGoal(percentage: any, node: TreeNode) {
		let actualGoal = this.goals.find(value => value.idReference === node.idTreeNode);
		if (actualGoal) {
			let indexActualGoal = this.goals.indexOf(actualGoal);
			this.goals.splice(indexActualGoal, 1);
			actualGoal.percentage = percentage as number;
		} else {
			actualGoal = new GoalBoolean();
			actualGoal.idReference = node.idTreeNode;
			actualGoal.percentage = percentage as number;
		}
		this.goals.push(actualGoal);
		this.onConfirmGoals.emit(this.goals);
	}

	isPercentageInvalid(percentage: any): boolean {
		return Number(percentage) > 100;
	}

	hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;
}
