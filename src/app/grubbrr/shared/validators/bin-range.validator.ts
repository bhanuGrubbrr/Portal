import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function binRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value.length && value[0].from) {
      return value.length > 1 && someIntersect(value)
        ? { rangeIntersect: true }
        : null;
    } else {
      return value.from > value.to ? { rangeInvalid: true } : null;
    }
  };
}

const someIntersect = (ranges: { from: string; to: string }[]) => {
  return ranges.some((range1, index1) => {
    return ranges.some((range2, index2) => {
      if (index1 === index2) {
        return false;
      }
      return allIntersect([range1, range2]);
    });
  });
};
const allIntersect = (ranges: { from: string; to: string }[]) => {
  const minimums = ranges.map((r) => +r.from);
  const maximums = ranges.map((r) => +r.to);
  const maximalMinimum = Math.max(...minimums);
  const minimalMaximum = Math.min(...maximums);
  return maximalMinimum <= minimalMaximum;
};
