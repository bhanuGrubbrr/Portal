import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value.from || !value.to) return null;
    return startDateFromMidnight(value.from) > startDateFromMidnight(value.to)
      ? { rangeInvalid: true }
      : null;
  };
}

export function dateIntersectValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return multipleDateRangeOverlaps(value.hours)
      ? { rangeIntersect: true }
      : null;
  };
}
function dateRangeOverlaps(a_start: any, a_end: any, b_start: any, b_end: any) {
  if (a_start < b_start && b_start < a_end) return true; // b starts in a
  if (a_start < b_end && b_end < a_end) return true; // b ends in a
  if (b_start < a_start && a_end < b_end) return true; // a in b
  return false;
}

function multipleDateRangeOverlaps(timeEntries: any) {
  let i = 0,
    j = 0;
  let timeIntervals = timeEntries.filter(
    (entry: any) => entry.from != null && entry.to != null
  );

  if (timeIntervals != null && timeIntervals.length > 1)
    for (i = 0; i < timeIntervals.length - 1; i += 1) {
      for (j = i + 1; j < timeIntervals.length; j += 1) {
        if (
          dateRangeOverlaps(
            startDateFromMidnight(timeIntervals[i].from).getTime(),
            startDateFromMidnight(timeIntervals[i].to).getTime(),
            startDateFromMidnight(timeIntervals[j].from).getTime(),
            startDateFromMidnight(timeIntervals[j].to).getTime()
          )
        )
          return true;
      }
    }
  return false;
}

function startDateFromMidnight(date: Date) {
  return new Date(
    0,
    0,
    0,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  );
}
