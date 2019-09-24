import {Question} from "./question";
import {TreeNode} from "./tree-node";
import {Rating} from "./rating";

export class MatQuestionDialogData {

	questions: Question[];
	node: TreeNode;
	type: string;
	ratings: Rating[];
	isProcessAttribute: boolean;
}
