import {AbstractControl, ValidatorFn} from '@angular/forms';

// @dynamic
export class EmptyListValidator {

  static listaVaziaValidator(): ValidatorFn | null {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control) {
        return null;
      }
      if (!control.value || !control.value.length) {
        return {listaVazia: true};
      }
      return null;
    };
  }
}
