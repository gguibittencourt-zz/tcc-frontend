export class ExpectedResult {
    private _idExpectedResult: string;
	private _name: string;
	private _description: string;


	get idExpectedResult(): string {
		return this._idExpectedResult;
	}

	set idExpectedResult(value: string) {
		this._idExpectedResult = value;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get description(): string {
		return this._description;
	}

	set description(value: string) {
		this._description = value;
	}
}
