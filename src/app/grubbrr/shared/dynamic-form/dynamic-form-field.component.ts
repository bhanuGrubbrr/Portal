import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormGroup,
  NgControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormFieldBase } from './formfield-base';

@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html',
  styleUrls: ['./dynamic-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicFormFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DynamicFormFieldComponent),
      multi: true,
    },
  ],
})
export class DynamicFormFieldComponent
  implements OnInit, AfterViewInit, ControlValueAccessor
{
  @Input() field: FormFieldBase<string>;
  @Input() dynamicform: FormGroup;
  showPassword: string = 'password';

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute) {}

  get f() {
    return this.dynamicform.controls[this.field.key];
  }

  ngOnInit(): void {
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.dynamicform.updateValueAndValidity();
  }

  togglePassword(): void {
    if (this.showPassword == 'password') {
      this.showPassword = 'text';
    } else {
      this.showPassword = 'password';
    }
  }

  // Save the callbacks, make sure to have a default so your app
  // doesn't crash when one isn't (yet) registered
  private onChange = (v: any) => {};

  public onTouched: () => void = () => {};

  writeValue(val: any): void {
    val && this.dynamicform.setValue(val, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.dynamicform.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.dynamicform.disable() : this.dynamicform.enable();
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.dynamicform.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: 'sub dynamicform fields are invalid',
          },
        };
  }

  goTo(url: string): void {
    const locationId = this.route.snapshot.params.locationid;
    const urlToOpen = url.replace('{locationId}', locationId);
    window.open(urlToOpen, '_blank');
  }
}
