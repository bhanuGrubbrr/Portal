import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeIdPrefix',
})
export class RemoveIdPrefix implements PipeTransform {
  transform(input: string): string {
    const separator = input.indexOf('-');
    if (separator === -1) return '';

    return input.substring(separator + 1);
  }
}
