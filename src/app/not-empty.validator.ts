import { AbstractControl } from '@angular/forms';

export function notEmptyValidator(control: AbstractControl) {
  if (control.value.trim() === '') {
    return { notEmpty: true };
  }
  return null;
}