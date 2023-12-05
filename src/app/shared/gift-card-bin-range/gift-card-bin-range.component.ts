import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentIntegrationConfigVM } from 'src/app/grubbrr/generated/payment_pb';
import { binRangeValidator } from 'src/app/grubbrr/shared/validators/bin-range.validator';

@Component({
  selector: 'app-gift-card-bin-range',
  templateUrl: './gift-card-bin-range.component.html',
  styleUrls: ['./gift-card-bin-range.component.scss'],
})
export class GiftCardBinRangeComponent implements OnInit {
  @Input() config: PaymentIntegrationConfigVM;
  @Input() binForm: FormGroup;
  public bins: FormArray;
  public submitted: boolean = false;
  public requiredError: boolean = false;
  public MAX_BINS_ALLOWED: number = 10;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initBinForm();
  }

  initBinForm() {
    //this.binForm = this.fb.group({});
    this.bins = this.fb.array([], binRangeValidator());
    if (this.config?.binRanges?.length > 0) {
      for (let bin of this.config.binRanges) {
        this.bins.push(this.createItemFormGroup(bin));
      }
    }
    this.binForm.addControl('bins', this.bins);
  }

  addBinRow() {
    this.requiredError = false;
    if (this.bins.value.filter((bin: any) => !bin.from || !bin.to).length > 0) {
      this.requiredError = true;
      return;
    }
    if (
      this.addDynamicRow.controls.length > 0 &&
      (this.addDynamicRow.controls.filter(
        (control: any) =>
          control.controls.from.status == 'INVALID' ||
          control.controls.to.status == 'INVALID' ||
          control.errors?.rangeInvalid
      ).length > 0 ||
        this.addDynamicRow.errors?.rangeIntersect)
    ) {
      this.submitted = true;
      return;
    }
    this.bins.push(this.createItemFormGroup());
  }

  removeBinRow(index: number) {
    this.bins.removeAt(index);
  }

  get addDynamicRow() {
    return this.binForm.get('bins') as FormArray;
  }

  createItemFormGroup(bin = { from: '', to: '' }): FormGroup {
    return this.fb.group(
      {
        // id: 0,
        from: this.fb.control(
          bin.from,
          Validators.compose([
            Validators.minLength(16),
            Validators.maxLength(16),
          ])
        ),
        to: this.fb.control(
          bin.to,
          Validators.compose([
            Validators.minLength(16),
            Validators.maxLength(16),
          ])
        ),
      },
      {
        validator: binRangeValidator(),
      }
    );
  }

  setBinRanges(editedPaytronixConfig: PaymentIntegrationConfigVM) {
    editedPaytronixConfig.binRanges = this.addDynamicRow.value.filter(
      (row: any) => row.from && row.to
    );
    return editedPaytronixConfig;
  }

  validateNumber(event: Event) {
    this.requiredError = false;
    const el = event.target as HTMLInputElement;
    el.value = el.value.replace(/[^0-9]*/g, '');
  }
}
