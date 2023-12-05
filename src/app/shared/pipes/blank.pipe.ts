import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultstring',
})
export class DefaultStringPipe implements PipeTransform {
  transform(input: string | undefined, defaultValue = '--'): string {
    if (input === undefined) return defaultValue;
    return input ? input : defaultValue;
  }
}
