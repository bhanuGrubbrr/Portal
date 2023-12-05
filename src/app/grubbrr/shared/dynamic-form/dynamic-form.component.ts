import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FormControlService } from './form-control.service';
import { FormFieldBase } from './formfield-base';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DynamicFormComponent),
      multi: true,
    },
  ],
})
export class DynamicFormComponent
  implements OnInit, AfterViewInit, ControlValueAccessor, OnDestroy
{
  @Input() fields$: Observable<FormFieldBase<any>[]>;
  @Input() patchValues: { [key: string]: any };
  @Input() showButton = true;
  dynamicform: FormGroup;
  payLoad = '';
  saving: boolean = false;
  @Output() formSavingEvent = new EventEmitter<string>();
  ready = false;
  @Input() shouldResetForm: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private formService: FormControlService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private loader: NgxUiLoaderService
  ) {}

  ngAfterViewInit(): void {
    this.dynamicform.updateValueAndValidity();
  }

  ngOnInit() {
    this.bindForm();
    this.cdr.detectChanges();
  }

  private bindForm() {
    if (this.fields$) {
      this.fields$
        .pipe(
          finalize(() => {
            this.ready = true;
            this.cdr.detectChanges();
            this.loader.stop();
          })
        )
        .subscribe((fields: FormFieldBase<string>[]) => {
          this.dynamicform = this.formService.toFormGroup(
            fields as FormFieldBase<string>[]
          );

          if (this.patchValues) {
            this.dynamicform.patchValue(this.patchValues);
          }
        });
    }
  }

  resetForm(): void {
    this.dynamicform.reset();
    this.dynamicform.updateValueAndValidity();
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.dynamicform.getRawValue());
    this.saving = false;
    this.formSavingEvent.emit(this.payLoad);

    if (this.shouldResetForm) {
      this.resetForm();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
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
            message: 'dynamicform fields are invalid',
          },
        };
  }
}
