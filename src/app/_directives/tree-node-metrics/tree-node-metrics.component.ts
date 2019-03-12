import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Goal, KnowledgeArea, TreeNode} from "../../_models";
import {MatDialog, MatTreeNestedDataSource} from "@angular/material";
import {NestedTreeControl} from "@angular/cdk/tree";
import {FormBuilder} from "@angular/forms";

@Component({
	selector: 'tree-node-metrics',
	templateUrl: 'tree-node-metrics.component.html',
	styleUrls: ['tree-node-metrics.component.scss']
})

export class TreeNodeMetricsComponent implements OnInit {
	@Input('knowledgeAreas') private _knowledgeAreas: KnowledgeArea[];
	@Input('goals') private _goals: Goal[];
	@Output() onConfirmGoals: EventEmitter<any> = new EventEmitter();

	private _treeControl = new NestedTreeControl<TreeNode>(node => node.children);
	private _dataSource = new MatTreeNestedDataSource<TreeNode>();

	constructor(private formBuilder: FormBuilder, private  dialog: MatDialog) {
	}

	ngOnInit() {
		this.dataSource.data = this.knowledgeAreas.map(knowledgeArea => {
			let treeNode: TreeNode = new TreeNode();
			treeNode.idTreeNode = String(knowledgeArea.idKnowledgeArea);
			treeNode.name = knowledgeArea.name;
			let goal: Goal = this.goals.find(goal => goal.idReference == String(knowledgeArea.idKnowledgeArea));
			if (goal) {
				treeNode.percentage = goal.percentage;
			} else {
				treeNode.percentage = Number((100.0 / this.knowledgeAreas.length).toFixed(2));
			}
			treeNode.children = knowledgeArea.processes.map(process => {
				let treeNodeChildren: TreeNode = new TreeNode();
				treeNodeChildren.idTreeNode = process.idProcess;
				treeNodeChildren.name = process.name;
				let goal: Goal = this.goals.find(goal => goal.idReference == process.idProcess);
				if (goal) {
					treeNodeChildren.percentage = goal.percentage;
				} else {
					treeNodeChildren.percentage = Number((100.0 / knowledgeArea.processes.length).toFixed(2));
				}
				treeNodeChildren.children = process.expectedResults.map(expectedResult => {
					let expectedTreeNode: TreeNode = new TreeNode();
					expectedTreeNode.idTreeNode = expectedResult.idExpectedResult;
					expectedTreeNode.name = expectedResult.name;
					let goal: Goal = this.goals.find(goal => goal.idReference == expectedResult.idExpectedResult);
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
			actualGoal = new Goal();
			actualGoal.idReference = node.idTreeNode;
			actualGoal.percentage = percentage as number;
		}
		this.goals.push(actualGoal);
		this.onConfirmGoals.emit(this.goals);
	}

	hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

	get knowledgeAreas(): KnowledgeArea[] {
		return this._knowledgeAreas;
	}

	get treeControl(): NestedTreeControl<TreeNode> {
		return this._treeControl;
	}

	get dataSource(): MatTreeNestedDataSource<TreeNode> {
		return this._dataSource;
	}

	get goals(): Goal[] {
		return this._goals;
	}
}
