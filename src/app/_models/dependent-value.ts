export class DependentValue {

	private _id: string;
	private _title: string;
	private _value: any;

	constructor(id: string, title: string, value: any) {
		this._id = id;
		this._title = title;
		this._value = value;
	}

	get id(): string {
		return this._id;
	}

	set id(value: string) {
		this._id = value;
	}


	get title(): string {
		return this._title;
	}

	set title(value: string) {
		this._title = value;
	}

	get value(): any {
		return this._value;
	}

	set value(value: any) {
		this._value = value;
	}
}
