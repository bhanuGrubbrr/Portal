import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dropsubstr',
})
export class DropsubstrPipe implements PipeTransform {
  transform(value: string, ...args: string[]): unknown {
    var ret = value.replace(args[0], '');
    return ret;
  }
}
