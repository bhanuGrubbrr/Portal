import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  pure: false,
})
export class SortPipe implements PipeTransform {
  transform<T>(
    array: T[],
    comparator: (el1: T, el2: T) => number,
    direction: 'asc' | 'desc'
  ): T[] | undefined {
    array.sort((a: T, b: T) => {
      return comparator(a, b);
    });

    if (direction === 'desc') {
      array.reverse();
    }

    return array;
  }
}
