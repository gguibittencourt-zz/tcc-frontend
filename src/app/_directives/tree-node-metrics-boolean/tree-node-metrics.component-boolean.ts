import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GoalBoolean, KnowledgeArea, TreeNode} from "../../_models";
import {MatDialog, MatTreeNestedDataSource} from "@angular/material";
import {NestedTreeControl} from "@angular/cdk/tree";
import {FormBuilder} from "@angular/forms";

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

	constructor(private formBuilder: FormBuilder, private  dialog: MatDialog) {
	}

	ngOnInit() {
		this.dataSource.data = this.knowledgeAreas.map(knowledgeArea => {
			let treeNode: TreeNode = new TreeNode();
			treeNode.idTreeNode = String(knowledgeArea.idKnowledgeArea);
			treeNode.name = knowledgeArea.name;
			let goal: GoalBoolean = this.goals ? this.goals.find(goal => goal.idReference == String(knowledgeArea.idKnowledgeArea)) : null;
			if (goal) {
				treeNode.percentage = goal.percentage;
			} else {
				treeNode.percentage = Number((100.0 / this.knowledgeAreas.length).toFixed(2));
			}
			treeNode.children = knowledgeArea.processes.map(process => {
				const treeNodeChildren: TreeNode = new TreeNode();
				treeNodeChildren.idTreeNode = process.idProcess;
				treeNodeChildren.name = process.name;
				const goal: GoalBoolean = this.goals ? this.goals.find(goal => goal.idReference == process.idProcess) : null;
				if (goal) {
					treeNodeChildren.percentage = goal.percentage;
				} else {
					treeNodeChildren.percentage = Number((100.0 / knowledgeArea.processes.length).toFixed(2));
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

	hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;
}
