import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ExpectedResult, Process} from "../../_models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Guid} from "guid-typescript";

@Component({
	selector: 'process',
	templateUrl: 'process.component.html',
	styleUrls: ['process.component.scss']
})

export class ProcessComponent implements OnInit {

	processForms: FormGroup[] = [];
	mapCloseAccordion: Map<number, boolean> = new Map<number, boolean>();
	private _isPossibleConfirm: boolean = true;

	constructor(private dialogRef: MatDialogRef<ProcessComponent>,
				@Inject(MAT_DIALOG_DATA) public data: Process[],
				private formBuilder: FormBuilder) {
	}

	ngOnInit(): void {
		this.data.forEach((value, index) => {
			let form = this.formBuilder.group({
				idProcess: ['', Validators.required],
				name: ['', Validators.required],
				prefix: [''],
				purpose: ['', Validators.required],
				expectedResults: [[]]
			});

			form.patchValue(this.data[index]);
			this.processForms[index] = form;
			this.mapCloseAccordion.set(index, false);
		});
	}

	get isPossibleConfirm(): boolean {
		return this._isPossibleConfirm;
	}

	onNoClick(): void {
		this.dialogRef.close(false);
	}

	confirmProcess(index: number) {
		if (this.processForms[index].invalid) {
			return;
		}
		this._isPossibleConfirm = true;
		this.mapCloseAccordion.set(index, false);
		this.data[index] = this.processForms[index].value;
	}

	addProcess() {
		if (this.allValidForms()) {
			this._isPossibleConfirm = false;
			let process: Process = new Process();
			this.data.push(process);
			this.processForms[this.data.indexOf(process)] = this.formBuilder.group({
				idProcess: [Guid.create().toString()],
				name: ['', Validators.required],
				purpose: ['', Validators.required],
				expectedResults: [[]]
			});
		}
	}

	deleteProcess(index: number) {
		this.data.splice(index, 1);
		this.processForms.splice(index, 1);
	}

	confirmExpectedResults(expectedResults: ExpectedResult[], process: Process, index: number) {
		process.expectedResults = expectedResults;
		this.processForms[index].controls["expectedResults"].setValue(expectedResults);
	}

	allValidForms(): boolean {
		return this.processForms.every(form => form.valid);
	}

	createPrefix(name: string, index: number) {
		if (name) {
			let prefix = '';
			const splitName: string[] = name.split(' ');
			if (splitName.length > 1) {
				prefix = splitName[0].charAt(0).toUpperCase();
				if (splitName[1].charAt(0) == splitName[1].charAt(0).toUpperCase()) {
					prefix += splitName[1].substring(0, 2).toUpperCase();
				} else {
					prefix += splitName[2].substring(0, 2).toUpperCase();
				}
			} else {
				prefix = splitName[0].substring(0, 3).toUpperCase();
			}
			this.processForms[index].controls['prefix'].setValue(prefix);
		}
	}
}
