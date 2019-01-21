export class Process {
    private _idProcess: string;
    private _name: string;
    private _purpose: string;


	get idProcess(): string {
		return this._idProcess;
	}

	set idProcess(value: string) {
		this._idProcess = value;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get purpose(): string {
		return this._purpose;
	}

	set purpose(value: string) {
		this._purpose = value;
	}
}
