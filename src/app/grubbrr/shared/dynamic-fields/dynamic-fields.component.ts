import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormFieldBase } from '../dynamic-form/formfield-base';
import { FormControlService } from '../dynamic-form/form-control.service';

@Component({
  selector: 'app-dynamic-fields',
  templateUrl: './dynamic-fields.component.html',
  styleUrls: ['./dynamic-fields.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicFieldsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DynamicFieldsComponent),
      multi: true,
    },
  ],
})
export class DynamicFieldsComponent implements OnInit {
  @Input() fields$: Observable<FormFieldBase<any>[]>;
  @Input() patchValues: { [key: string]: any };
  @Input() dynamicform: FormGroup;

  constructor(
    //private cdr: ChangeDetectorRef,
    private formService: FormControlService
  ) {}

  ngOnInit(): void {
    //this.cdr.detectChanges();
    this.bindForm();
  }

  private bindForm() {
    this.fields$
      .pipe(finalize(() => {}))
      .subscribe((fields: FormFieldBase<string>[]) => {
        fields.forEach((f) =>
          this.dynamicform.addControl(f.key, this.formService.getFormControl(f))
        );
        if (this.patchValues) {
          this.dynamicform.patchValue(this.patchValues);
        }
      });
  }

  // // Save the callbacks, make sure to have a default so your app
  // // doesn't crash when one isn't (yet) registered
  // public onChange = (v: any) => {};

  // public onTouched: () => void = () => {};

  // // writeValue(val: any): void {
  // //   val && this.dynamicform.setValue(val, { emitEvent: false });
  // // }

  // registerOnChange(fn: any): void {
  //   this.onChange = fn;
  //   //this.dynamicform.valueChanges.subscribe(fn);
  // }

  // registerOnTouched(fn: any): void {
  //   this.onTouched = fn;
  // }

  // setDisabledState?(isDisabled: boolean): void {
  //   isDisabled ? this.dynamicform.disable() : this.dynamicform.enable();
  // }

  // validate(c: AbstractControl): ValidationErrors | null {
  //   return this.dynamicform.valid
  //     ? null
  //     : {
  //         invalidForm: {
  //           valid: false,
  //           message: 'sub dynamicform fields are invalid',
  //         },
  //       };
  // }
}
