import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fixLabels' })
export class FixLabelsPipe implements PipeTransform {
  constructor(private titlecasePipe: TitleCasePipe) {}

  transform(value: any, args?: any): any {
    return this.titlecasePipe.transform(value.replace(/-/g, ' '));
  }
}
