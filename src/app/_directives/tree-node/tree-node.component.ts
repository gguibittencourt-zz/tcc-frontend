import {Component, Input, OnInit} from '@angular/core';
import {KnowledgeArea, Question} from "../../_models";
import {MatDialog, MatTreeNestedDataSource} from "@angular/material";
import {NestedTreeControl} from "@angular/cdk/tree";
import {TreeNode} from "../../_models/tree-node";
import {FormBuilder} from "@angular/forms";
import {QuestionComponent} from "../question";
import {cloneDeep} from "lodash";

@Component({
	selector: 'tree-node',
	templateUrl: 'tree-node.component.html',
	styleUrls: ['tree-node.component.scss']
})

export class TreeNodeComponent implements OnInit {
	@Input('knowledgeAreas') private _knowledgeAreas: KnowledgeArea[];
	@Input('questions') private _questions: Question[];

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
				return treeNodeChildren;
			});
			return treeNode;
		});
	}

	openDialog(node: TreeNode): void {
		const dialogRef = this.dialog.open(QuestionComponent, {
			width: '800px',
			data: cloneDeep(this.questions),
		});

		dialogRef.afterClosed().subscribe(result => {
		});
	}

	hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

	get knowledgeAreas(): KnowledgeArea[] {
		return this._knowledgeAreas;
	}

	get questions(): Question[] {
		return this._questions;
	}

	get treeControl(): NestedTreeControl<TreeNode> {
		return this._treeControl;
	}

	get dataSource(): MatTreeNestedDataSource<TreeNode> {
		return this._dataSource;
	}
}
