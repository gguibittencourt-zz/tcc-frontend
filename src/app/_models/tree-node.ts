export class TreeNode {
    private _idTreeNode: string;
    private _name: string;
    private _children?: TreeNode[];

	get idTreeNode(): string {
		return this._idTreeNode;
	}

	set idTreeNode(value: string) {
		this._idTreeNode = value;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get children(): TreeNode[] {
		return this._children;
	}

	set children(value: TreeNode[]) {
		this._children = value;
	}
}
