import {Question} from "./question";
import {TreeNode} from "./tree-node";

export class MatDialogData {

	private _questions: Question[];
	private _node: TreeNode;

	get questions(): Question[] {
		return this._questions;
	}

	set questions(value: Question[]) {
		this._questions = value;
	}

	get node(): TreeNode {
		return this._node;
	}

	set node(value: TreeNode) {
		this._node = value;
	}
}
