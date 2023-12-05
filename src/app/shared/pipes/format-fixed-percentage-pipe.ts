import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTipOrFixedAmount',
})
export class FormatTipOrFixedAmountPipe implements PipeTransform {
  transform(value: string, isPercentage: boolean): any {
    if (isPercentage) {
      return `${value} %`;
    } else {
      return `$${value}`;
    }
  }
}
