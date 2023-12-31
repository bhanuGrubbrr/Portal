import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  transform(input: Array<any>, sep = ', '): string {
    if (!input) return '';
    return input.map((x) => x).join(sep);
  }
}
