import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatQuestionDialogData, ProcessAttribute, Question, TreeNode} from "../../_models";
import {MatDialog, MatTreeNestedDataSource} from "@angular/material";
import {NestedTreeControl} from "@angular/cdk/tree";
import {FormBuilder} from "@angular/forms";
import {QuestionComponent} from "../question";
import {cloneDeep, isEmpty, reject} from "lodash";

@Component({
	selector: 'tree-node-questions-process-attributes',
	templateUrl: 'tree-node-questions-process-attributes.component.html',
	styleUrls: ['tree-node-questions-process-attributes.component.scss']
})

export class TreeNodeQuestionsProcessAttributesComponent implements OnInit {
	@Input('processAttributes') processAttributes: ProcessAttribute[];
	@Input('questions') questions: Question[] = [];
	@Input('type') type: string;
	@Output() onConfirmQuestions: EventEmitter<any> = new EventEmitter();

	treeControl = new NestedTreeControl<TreeNode>(node => node.children);
	dataSource = new MatTreeNestedDataSource<TreeNode>();

	constructor(private formBuilder: FormBuilder, private  dialog: MatDialog) {
	}

	ngOnInit() {
		if (!this.processAttributes) {
			this.processAttributes = [];
		}
		this.dataSource.data = this.processAttributes.filter(value => value.generateQuestions)
			.map(processAttribute => {
				const treeNode: TreeNode = new TreeNode();
				treeNode.idTreeNode = processAttribute.idProcessAttribute;
				treeNode.name = processAttribute.name;
				treeNode.prefix = processAttribute.prefix;
				treeNode.processAttributeValues = processAttribute.values;
				return treeNode;
			});
	}

	openDialog(node: TreeNode): void {
		const data = new MatQuestionDialogData();
		data.node = node;
		data.type = this.type;
		data.isProcessAttribute = true;
		data.questions = isEmpty(this.questions) ? [] : cloneDeep(this.getQuestionsByNode(node.idTreeNode));
		const dialogRef = this.dialog.open(QuestionComponent, {
			height: '95%',
			width: '95%',
			maxWidth: '95%',
			data: data,
			disableClose: true
		});

		dialogRef.afterClosed().subscribe((result: Question[]) => {
			if (result) {
				if (this.questions == null) {
					this.questions = [];
				}
				const idProcessAttribute = result[0].idProcessAttribute;
				const idQuestions: string[] = this.questions.map((question: Question) => question.idQuestion);
				result.forEach(value => {
					if (!idQuestions.includes(value.idQuestion)) {
						this.questions.push(value);
					} else {
						const actualQuestion = this.questions.find((question: Question) => question.idQuestion === value.idQuestion);
						if (actualQuestion !== value) {
							this.questions.splice(this.questions.indexOf(actualQuestion), 1);
							this.questions.push(value);
						}
					}
				});
				this.questions = reject(this.questions, (question => question.idProcessAttribute === idProcessAttribute && !result.includes(question)));
				this.onConfirmQuestions.emit(this.questions);
			}
		});
	}

	getQuestionsByNode(idNode: string) {
		return this.questions ? this.questions.filter(value => value.idProcessAttribute === idNode) : [];
	}
}
