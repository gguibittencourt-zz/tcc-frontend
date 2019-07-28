import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GoalBoolean, KnowledgeArea, TreeNode} from "../../_models";
import {MatTreeNestedDataSource} from "@angular/material";
import {NestedTreeControl} from "@angular/cdk/tree";
import {isNil} from 'lodash';

@Component({
	selector: 'tree-node-metrics-boolean',
	templateUrl: 'tree-node-metrics.component-boolean.html',
	styleUrls: ['tree-node-metrics.component-boolean.scss']
})

export class TreeNodeMetricsComponentBoolean implements OnInit {
	@Input('knowledgeAreas') knowledgeAreas: KnowledgeArea[];
	@Input('goals') goals: GoalBoolean[];
	@Output() onConfirmGoals: EventEmitter<any> = new EventEmitter();

	treeControl = new NestedTreeControl<TreeNode>(node => node.children);
	dataSource = new MatTreeNestedDataSource<TreeNode>();

	ngOnInit() {
		if (isNil(this.goals)) {
			this.goals = [];
		}
		this.dataSource.data = this.knowledgeAreas.map(knowledgeArea => {
			let treeNode: TreeNode = new TreeNode();
			treeNode.idTreeNode = String(knowledgeArea.idKnowledgeArea);
			treeNode.name = knowledgeArea.name;
			let goal: GoalBoolean = this.goals ? this.goals.find(goal => goal.idReference == String(knowledgeArea.idKnowledgeArea)) : null;
			if (goal) {
				treeNode.percentage = goal.percentage;
			} else {
				treeNode.percentage = Number((100.0 / this.knowledgeAreas.length).toFixed(2));
				goal = new GoalBoolean();
				goal.idReference = treeNode.idTreeNode;
				goal.percentage = treeNode.percentage;
				this.goals.push(goal);
			}
			treeNode.children = knowledgeArea.processes.map(process => {
				const treeNodeChildren: TreeNode = new TreeNode();
				treeNodeChildren.idTreeNode = process.idProcess;
				treeNodeChildren.name = process.name;
				let goal: GoalBoolean = this.goals ? this.goals.find(goal => goal.idReference == process.idProcess) : null;
				if (goal) {
					treeNodeChildren.percentage = goal.percentage;
				} else {
					treeNodeChildren.percentage = Number((100.0 / knowledgeArea.processes.length).toFixed(2));
					goal = new GoalBoolean();
					goal.idReference = treeNodeChildren.idTreeNode;
					goal.percentage = treeNodeChildren.percentage;
					this.goals.push(goal);
				}
				treeNodeChildren.children = process.expectedResults.map(expectedResult => {
					let expectedTreeNode: TreeNode = new TreeNode();
					expectedTreeNode.idTreeNode = expectedResult.idExpectedResult;
					expectedTreeNode.name = expectedResult.name;
					let goal: GoalBoolean = this.goals ? this.goals.find(goal => goal.idReference == expectedResult.idExpectedResult) : null;
					if (goal) {
						expectedTreeNode.percentage = goal.percentage;
					} else {
						expectedTreeNode.percentage = Number((100.0 / process.expectedResults.length).toFixed(2));
						goal = new GoalBoolean();
						goal.idReference = expectedTreeNode.idTreeNode;
						goal.percentage = expectedTreeNode.percentage;
						this.goals.push(goal);
					}
					return expectedTreeNode;
				});
				return treeNodeChildren;
			});
			return treeNode;
		});
	}

	addGoal(percentage: any, node: TreeNode) {
		percentage = Number(percentage);
		const actualGoal = this.goals.find(value => value.idReference === node.idTreeNode);
		const indexActualGoal = this.goals.indexOf(actualGoal);
		this.goals.splice(indexActualGoal, 1);
		actualGoal.percentage = percentage;
		node.percentage = percentage;
		this.isInvalidPercentage(percentage, node);
		this.goals.push(actualGoal);
		this.onConfirmGoals.emit(this.goals);
	}

	hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

	private isInvalidPercentage(percentage: any, node: TreeNode): boolean {
		if (Number(percentage) > 100) {
			return true;
		}

		const isProcessArea: boolean = this.dataSource.data.some(value => {
			return node.idTreeNode == value.idTreeNode;
		});

		if (isProcessArea) {
			const allPercentages: number = this.fillAllPercentages(this.dataSource.data, node.idTreeNode, percentage);
			this.dataSource.data.forEach(value => {
				value.isInvalid = this.isInvalidRange(allPercentages);
			});
			if (this.isInvalidRange(allPercentages)) {
				return true;
			}
		} else {
			let isProcess: boolean = false;
			let allPercentages: number = 0;
			this.dataSource.data.some(processArea => {
				isProcess = processArea.children.some(process => {
					return process.idTreeNode == node.idTreeNode;
				});
				if (isProcess) {
					allPercentages = this.fillAllPercentages(processArea.children, node.idTreeNode, percentage);
					processArea.children.forEach(value => {
						value.isInvalid = this.isInvalidRange(allPercentages);
					});
					return true;
				}
			});
			if (isProcess) {
				if (this.isInvalidRange(allPercentages)) {
					return true;
				}
			} else {
				let isExpectedResult: boolean = false;
				this.dataSource.data.some(processArea => {
					return processArea.children.some(process => {
						isExpectedResult = process.children.some(expectedResult => {
							return expectedResult.idTreeNode == node.idTreeNode;
						});
						if (isExpectedResult) {
							allPercentages = this.fillAllPercentages(process.children, node.idTreeNode, percentage);
							process.children.forEach(value => {
								value.isInvalid = this.isInvalidRange(allPercentages);
							});
							return true;
						}
					});
				});
				if (isExpectedResult) {
					if (this.isInvalidRange(allPercentages)) {
						return true;
					}
				}
			}
		}
		return false;
	}

	private fillAllPercentages(nodes: TreeNode[], idTreeNode: string, percentage: number): number {
		let allPercentages = percentage;
		nodes.forEach(node => {
			if (idTreeNode != node.idTreeNode) {
				allPercentages += node.percentage;
			}
		});
		return allPercentages;
	}

	private isInvalidRange(percentage: number): boolean {
		return percentage > 100 || percentage < 99.99
	}
}
