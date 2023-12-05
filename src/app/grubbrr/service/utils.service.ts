import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
/**
 * @class UtilService
 */
export class UtilService {
  Data$: Subject<any> = new BehaviorSubject<any>([]);
  GrubbrrRouteParams$: BehaviorSubject<GrubbrrRouteParams> =
    new BehaviorSubject<GrubbrrRouteParams>({});

  constructor(private translate: TranslateService) {}

  /**
   * @description
   * PassData is an Observable with this Subject as the source. You can do this
   * to create customize Observer-side logic of the Subject and conceal it from
   * code that uses the Observable.
   *
   * * @usageNotes
   *
   * ```typescript
   * this.utilService.PassData('some data that you're passing');
   * ```
   *
   * ```typescript
   *     this.utilService.Data$
   *                      .subscribe(data => {
   *                         console.log(`${data} data`);
   *     })
   * ```
   *
   * @return {Observable} Observable that the Subject casts to
   */
  PassData(data: any) {
    this.Data$.next(data);
  }

  /**
   * @description
   * GrubbrrRouteEvent is an observable that emits the RouterEvents that contain
   * Grubbrr Route Params such as locationId and companyId
   * * @usageNotes
   *
   * ```typescript
   * this.utilService.PassData('some data that you're passing');
   * ```
   *
   * ```typescript
   *     this.utilService.Data$
   *                      .subscribe(data => {
   *                         console.log(`${data} data`);
   *     })
   * ```
   *
   * @return {Observable} Observable that the Subject casts to
   */
  GrubbrrRouteEvent(data: GrubbrrRouteParams) {
    this.GrubbrrRouteParams$.next(data);
  }

  /**
   * @description
   * isNullOrEmpty
   *
   * * @usageNotes
   *
   * ```typescript
   * this.utilService.isNullOrEmtpy('');
   * ```
   *
   * @return {boolean} returns true if the value is null, empty or undefined
   */
  isNullOrEmtpy(value: any): boolean {
    if (typeof value !== 'undefined' && value) {
      return false;
    }

    return true;
  }

  patchImage(
    renderer: Renderer2,
    formGroup: FormGroup,
    controlName: string,
    file: File,
    elementRef: ElementRef
  ) {
    formGroup.get(controlName)?.patchValue(file);
    renderer.setProperty(elementRef.nativeElement, 'innerHTML', file.name);
  }

  public GetTranslationValue(key: string): string {
    let keyValue = '';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translation: string) => {
        keyValue = translation;
      });
    return keyValue;
  }
}

export class GrubbrrRouteParams {
  locationId?: string;
  companyId?: string;
}
