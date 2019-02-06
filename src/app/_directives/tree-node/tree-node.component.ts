import {Component, Input, OnInit} from '@angular/core';
import {KnowledgeArea} from "../../_models";
import {MatTreeNestedDataSource} from "@angular/material";
import {NestedTreeControl} from "@angular/cdk/tree";
import {TreeNode} from "../../_models/tree-node";

@Component({
	selector: 'tree-node',
	templateUrl: 'tree-node.component.html',
	styleUrls: ['tree-node.component.scss']
})

export class TreeNodeComponent implements OnInit {
	@Input('knowledgeAreas') private _knowledgeAreas: KnowledgeArea[];

	private _treeControl = new NestedTreeControl<TreeNode>(node => node.children);
	private _dataSource = new MatTreeNestedDataSource<TreeNode>();

	private _hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

	ngOnInit() {
		this.dataSource.data = this._knowledgeAreas.map(knowledgeArea => {
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

	get knowledgeAreas(): KnowledgeArea[] {
		return this._knowledgeAreas;
	}

	set knowledgeAreas(value: KnowledgeArea[]) {
		this._knowledgeAreas = value;
	}

	get treeControl(): NestedTreeControl<TreeNode> {
		return this._treeControl;
	}

	set treeControl(value: NestedTreeControl<TreeNode>) {
		this._treeControl = value;
	}

	get dataSource(): MatTreeNestedDataSource<TreeNode> {
		return this._dataSource;
	}

	set dataSource(value: MatTreeNestedDataSource<TreeNode>) {
		this._dataSource = value;
	}

	get hasChild(): (_: number, node: TreeNode) => boolean {
		return this._hasChild;
	}

	set hasChild(value: (_: number, node: TreeNode) => boolean) {
		this._hasChild = value;
	}
}
