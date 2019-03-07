import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KnowledgeArea, TreeNode} from "../../_models";
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
	@Output() onConfirmQuestions: EventEmitter<any> = new EventEmitter();

	private _treeControl = new NestedTreeControl<TreeNode>(node => node.children);
	private _dataSource = new MatTreeNestedDataSource<TreeNode>();

	constructor(private formBuilder: FormBuilder, private  dialog: MatDialog) {

	}

	ngOnInit() {
		this.dataSource.data = this.knowledgeAreas.map(knowledgeArea => {
			let treeNode: TreeNode = new TreeNode();
			treeNode.idTreeNode = String(knowledgeArea.idKnowledgeArea);
			treeNode.name = knowledgeArea.name;
			treeNode.children = knowledgeArea.processes.map(process => {
				let treeNodeChildren: TreeNode = new TreeNode();
				treeNodeChildren.idTreeNode = process.idProcess;
				treeNodeChildren.name = process.name;
				treeNodeChildren.children = process.expectedResults.map(expectedResult => {
					let expectedTreeNode: TreeNode = new TreeNode();
					expectedTreeNode.idTreeNode = expectedResult.idExpectedResult;
					expectedTreeNode.name = expectedResult.name;
					return expectedTreeNode;
				});
				return treeNodeChildren;
			});
			return treeNode;
		});
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
}
