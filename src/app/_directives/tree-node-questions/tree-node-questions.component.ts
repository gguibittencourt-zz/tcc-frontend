﻿import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KnowledgeArea, MatQuestionDialogData, Question, TreeNode} from "../../_models";
import {MatDialog, MatTreeNestedDataSource} from "@angular/material";
import {NestedTreeControl} from "@angular/cdk/tree";
import {FormBuilder} from "@angular/forms";
import {QuestionComponent} from "../question";
import {cloneDeep, isEmpty} from "lodash";

@Component({
	selector: 'tree-node-questions',
	templateUrl: 'tree-node-questions.component.html',
	styleUrls: ['tree-node-questions.component.scss']
})

export class TreeNodeQuestionsComponent implements OnInit {
	@Input('knowledgeAreas') private _knowledgeAreas: KnowledgeArea[];
	@Input('questions') private _questions: Question[];
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
				treeNodeChildren.expectedResults = process.expectedResults;
				return treeNodeChildren;
			});
			return treeNode;
		});
	}

	openDialog(node: TreeNode): void {
		let data = new MatQuestionDialogData();
		data.node = node;
		data.questions = isEmpty(this.questions) ?  [] : cloneDeep(this.getQuestionsByProcess(node.idTreeNode));
		const dialogRef = this.dialog.open(QuestionComponent, {
			height: '600px',
			width: '1000px',
			data: data
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.questions = result;
				this.onConfirmQuestions.emit(this.questions);
			}
		});
	}

	getQuestionsByProcess(idProcess: string) {
		return this.questions.filter(value => value.idProcess === idProcess);
	}

	hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

	get knowledgeAreas(): KnowledgeArea[] {
		return this._knowledgeAreas;
	}

	get questions(): Question[] {
		return this._questions;
	}

	set questions(value: Question[]) {
		this._questions = value;
	}

	get treeControl(): NestedTreeControl<TreeNode> {
		return this._treeControl;
	}

	get dataSource(): MatTreeNestedDataSource<TreeNode> {
		return this._dataSource;
	}
}