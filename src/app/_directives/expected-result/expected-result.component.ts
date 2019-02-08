import {Component, Input, OnInit} from '@angular/core';
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

	private _expectedResultForms: FormGroup[] = [];
	private _mapCloseAccordion: Map<number, boolean> = new Map<number, boolean>();

	constructor(private formBuilder: FormBuilder) {
	}

	ngOnInit() {
		this.expectedResultForms[0] = this.formBuilder.group({
			idExpectedResult: [Guid.create().toString()],
			name: ['', Validators.required],
			description: ['', Validators.required],
		});
		this.mapCloseAccordion.set(0, false);

		this.expectedResults.forEach((value, index) => {
			let form = this.formBuilder.group({
				idExpectedResult: ['', Validators.required],
				name: ['', Validators.required],
				description: ['', Validators.required],
			});

			form.patchValue(this.expectedResults[index]);
			this.expectedResultForms[index] = form;
			this.mapCloseAccordion.set(index, false);
		});
	}

	get expectedResultForms(): FormGroup[] {
		return this._expectedResultForms;
	}

	get mapCloseAccordion(): Map<number, boolean> {
		return this._mapCloseAccordion;
	}

	confirmExpectedResult(index: number) {
		if (this.expectedResultForms[index].invalid) {
			return;
		}
		this.mapCloseAccordion.set(index, false);
		this.expectedResults[index] = this.expectedResultForms[index].value;
	}

	addExpectedResult() {
		let expectedResult: ExpectedResult = new ExpectedResult();
		this.expectedResults.push(expectedResult);
		this.expectedResultForms[this.expectedResults.indexOf(expectedResult)] = this.formBuilder.group({
			idExpectedResult: [Guid.create().toString()],
			name: ['', Validators.required],
			description: ['', Validators.required]
		});
	}

	deleteExpectedResult(index: number) {
		this.expectedResults.splice(index, 1);
	}

	formChange(index: number) {
		this.mapCloseAccordion.set(index, true);
	}

	cancelExpectedResult(index: number) {
		this.mapCloseAccordion.set(index, false);
	}
}
