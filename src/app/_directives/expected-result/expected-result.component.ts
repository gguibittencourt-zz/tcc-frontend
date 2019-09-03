import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExpectedResult} from "../../_models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Guid} from "guid-typescript";

@Component({
	selector: 'expected-result',
	templateUrl: 'expected-result.component.html',
	styleUrls: ['expected-result.component.scss']
})

export class ExpectedResultComponent implements OnInit {
	@Input('expectedResults') expectedResults: ExpectedResult[];
	@Input('prefix') prefix: string;
	@Output() onConfirmExpectedResults: EventEmitter<any> = new EventEmitter();

	expectedResultForms: FormGroup[] = [];
	mapCloseAccordion: Map<number, boolean> = new Map<number, boolean>();
	submitted: boolean = false;
	private _isPossibleConfirm = true;

	constructor(private formBuilder: FormBuilder) {
	}

	ngOnInit(): void {
		if (!this.expectedResults) {
			this.expectedResults = [];
		}
		this.expectedResults.forEach((value, index) => {
			let form = this.formBuilder.group({
				idExpectedResult: ['', Validators.required],
				name: ['', Validators.required],
			});

			form.patchValue(this.expectedResults[index]);
			this.expectedResultForms[index] = form;
			this.mapCloseAccordion.set(index, false);
		});
	}

	get isPossibleConfirm(): boolean {
		return this._isPossibleConfirm;
	}

	confirmExpectedResult(index: number) {
		this.submitted = true;

		if (this.expectedResultForms[index].invalid) {
			return;
		}
		this._isPossibleConfirm = true;
		this.mapCloseAccordion.set(index, false);
		this.expectedResults[index] = this.expectedResultForms[index].value;
		this.onConfirmExpectedResults.emit(this.expectedResults);
	}

	addExpectedResult() {
		if (this.allValidForms()) {
			this._isPossibleConfirm = false;
			let expectedResult: ExpectedResult = new ExpectedResult();
			this.expectedResults.push(expectedResult);
			this.expectedResultForms[this.expectedResults.indexOf(expectedResult)] = this.formBuilder.group({
				idExpectedResult: [Guid.create().toString()],
				name: ['', Validators.required],
			});
		}
	}

	deleteExpectedResult(index: number) {
		this.expectedResultForms.splice(index, 1);
		this.expectedResults.splice(index, 1);
	}

	formChange(index: number) {
		this.mapCloseAccordion.set(index, true);
	}

	cancelExpectedResult(index: number) {
		this.mapCloseAccordion.set(index, false);
	}

	getControlsByForm(form: FormGroup) {
		return form.controls;
	}

	allValidForms(): boolean {
		return this.expectedResultForms.every(form => form.valid);
	}
}
