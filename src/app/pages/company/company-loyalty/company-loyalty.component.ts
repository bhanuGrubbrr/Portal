import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormFieldBase } from 'src/app/grubbrr/shared/dynamic-form/formfield-base';

import { Observable, of, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoyaltyService } from 'src/app/grubbrr/service/loyalty.service';

import { LoyaltyProviderModel } from 'src/app/grubbrr/core/models/loyaltyprovider.model';
import { LoyaltySettingModel } from 'src/app/grubbrr/core/models/loyaltysetting.model';
import { ActivatedRoute } from '@angular/router';
import { FormControlService } from 'src/app/grubbrr/shared/dynamic-form/form-control.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-loyalty',
  templateUrl: './company-loyalty.component.html',
  styleUrls: ['./company-loyalty.component.scss'],
})
export class CompanyLoyaltyComponent implements OnInit {
  contentLoaded = false;
  hasLoyalty = false;
  isActive = false;

  companyId: string;
  loyaltyProvider: LoyaltyProviderModel;
  loyaltySetting: LoyaltySettingModel;

  subscriptions: Subscription[] = [];
  loyaltyForm: FormGroup;
  fields$: Observable<FormFieldBase<any>[]>;
  patchValues: { [key: string]: any };

  loyaltyProviders: LoyaltyProviderModel[];

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private loyaltyService: LoyaltyService,
    private route: ActivatedRoute,
    private formService: FormControlService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.companyId = this.route.snapshot.params.companyid;
    this.initForm();
    this.fetchLoyaltyProviders();
  }

  initForm() {
    this.loyaltyForm = this.fb.group({
      loyalty: ['', [Validators.required]],
    });
  }

  activeToggled(isActive: boolean) {
    this.isActive = !isActive;
  }

  fetchLoyaltySettings() {
    const sb = this.loyaltyService
      .getCompanySettings(this.companyId)
      .pipe(finalize(() => {}))
      .subscribe((loyaltySetting: LoyaltySettingModel) => {
        this.loyaltySetting = loyaltySetting;
        if (this.loyaltySetting) {
          this.isActive = this.loyaltySetting.isActive;
          this.loyaltyProvider = this.loyaltyProviders.filter(
            (p) => p.name === this.loyaltySetting.loyaltyProvider
          )[0];
          this.hasLoyalty = true;
          this.patchValues = this.loyaltySetting.settings;

          const fields: FormFieldBase<string>[] = [];

          Object.entries(this.loyaltyProvider.companyFields).forEach(
            ([key, setting]) => {
              fields.push(this.formService.getNewField(setting, key, 1));
            }
          );

          this.fields$ = of(fields.sort((a, b) => a.order - b.order));

          this.cdr.detectChanges();
        }
      });

    this.subscriptions.push(sb);

    this.loyaltyForm.removeControl('dynamicForm', { emitEvent: false });
    this.loyaltyForm.addControl('dynamicForm', new FormControl(''), {
      emitEvent: false,
    });
    this.loyaltyForm.controls['dynamicForm']?.updateValueAndValidity({
      emitEvent: false,
      onlySelf: true,
    });
  }

  fetchLoyaltyProviders() {
    const sb = this.loyaltyService
      .getAllLoyaltyProviders()
      .pipe(
        finalize(() => {
          this.cdr.detectChanges();
        })
      )
      .subscribe((loyaltyProviders: any) => {
        this.fetchLoyaltySettings();
        this.loyaltyProviders = loyaltyProviders;
        this.contentLoaded = true;
      });

    this.subscriptions.push(sb);
  }

  loyaltySelected(loyaltyProvider: LoyaltyProviderModel): void {
    this.isActive = true;
    this.hasLoyalty = true;
    this.loyaltyProvider = loyaltyProvider;

    const fields: FormFieldBase<string>[] = [];

    Object.entries(this.loyaltyProvider.companyFields).forEach(
      ([key, setting]) => {
        fields.push(this.formService.getNewField(setting, key, 1));
      }
    );

    this.fields$ = of(fields.sort((a, b) => a.order - b.order));
    this.cdr.detectChanges();
  }

  onSettingsSubmit(formPayload: any): void {
    let postData = new LoyaltySettingModel();
    postData.isActive = this.isActive;
    postData.loyaltyProvider = this.loyaltyProvider.name;
    postData.settings = JSON.parse(formPayload);

    this.subscriptions.push(
      this.loyaltyService
        .updateCompanySettings(this.companyId, postData)
        .pipe(
          finalize(() => {
            this.cdr.detectChanges();
          })
        )
        .subscribe((loyaltySetting: LoyaltySettingModel) => {
          this.toast.success('Loyalty settings saved');
          this.loyaltySetting = loyaltySetting;
        })
    );
  }
}
