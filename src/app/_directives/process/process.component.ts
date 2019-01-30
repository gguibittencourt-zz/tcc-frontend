import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ExpectedResult, Process} from "../../_models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Guid} from "guid-typescript";

@Component({
	selector: 'process',
	templateUrl: 'process.component.html',
	styleUrls: ['process.component.scss']
})

export class ProcessComponent {

	private _processForms: FormGroup[] = [];
	private _mapCloseAccordion: Map<number, boolean> = new Map<number, boolean>();

	constructor(private _dialogRef: MatDialogRef<ProcessComponent>,
				@Inject(MAT_DIALOG_DATA) public data: Process[],
				private formBuilder: FormBuilder) {

		this.processForms[0] = this.formBuilder.group({
			idProcess: [Guid.create().toString()],
			name: ['', Validators.required],
			purpose: ['', Validators.required],
			expectedResults: [[]]
		});
		this.mapCloseAccordion.set(0, false);

		this.data.forEach((value, index) => {
			let form = this.formBuilder.group({
				idProcess: ['', Validators.required],
				name: ['', Validators.required],
				purpose: ['', Validators.required],
				expectedResults: [[]]
			});

			form.patchValue(this.data[index]);
			this.processForms[index] = form;
			this.mapCloseAccordion.set(index, false);
		});
	}

	get processForms(): FormGroup[] {
		return this._processForms;
	}

	get mapCloseAccordion(): Map<number, boolean> {
		return this._mapCloseAccordion;
	}

	get dialogRef(): MatDialogRef<ProcessComponent> {
		return this._dialogRef;
	}

	onNoClick(): void {
		this.dialogRef.close(false);
	}

	confirmProcess(index: number) {
		if (this.processForms[index].invalid) {
			return;
		}
		this.mapCloseAccordion.set(index, false);
		this.data[index] = this.processForms[index].value;
	}

	addProcess() {
		let process: Process = new Process();
		this.data.push(process);
		this.processForms[this.data.indexOf(process)] = this.formBuilder.group({
			idProcess: [Guid.create().toString()],
			name: ['', Validators.required],
			purpose: ['', Validators.required],
			expectedResults: [[]]
		});
	}

	deleteProcess(index: number) {
		this.data.splice(index, 1);
	}

	formChange(index: number) {
		this.mapCloseAccordion.set(index, true);
	}

	cancelProcess(index: number) {
		this.mapCloseAccordion.set(index, false);
	}
}
