import {AbstractControl, ValidatorFn} from '@angular/forms';

export class UrlValidator {

	static readonly REGEX_LINK = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

	static urlValidator(): ValidatorFn | null {
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			if (!control) {
				return null;
			}
			if (!control.value || !this.REGEX_LINK.test(control.value)) {
				return {invalidUrl: true};
			}
			return null;
		};
	}
}
