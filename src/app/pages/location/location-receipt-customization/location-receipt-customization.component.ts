import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressComponent } from 'ngx-google-places-autocomplete/objects/addressComponent';
import { mapGoogleAddressAutoCompleteComponents } from 'src/app/grubbrr/core/models/address.model';
import { ImageService } from 'src/app/grubbrr/service/image.service';
import { AppearanceService } from 'src/app/grubbrr/service/appearance.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AppearanceMediaAssetVM,
  ReceiptSettingsVM,
} from 'src/app/grubbrr/generated/appearance_pb';

@Component({
  selector: 'app-location-receipt-customization',
  templateUrl: './location-receipt-customization.component.html',
  styleUrls: ['./location-receipt-customization.component.scss'],
})
export class LocationReceiptCustomizationComponent implements OnInit {
  locationId: string;
  receiptSettings: ReceiptSettingsVM;
  locationForm: FormGroup;
  formReady: boolean = true;
  logoImageLabel: ElementRef;
  logoPreview: string;
  isChecked: boolean = false;
  saving: boolean = false;
  autoPrint: boolean;
  uploadedPercent: number = 0;
  mediaAsset: AppearanceMediaAssetVM;

  constructor(
    private toast: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private appearanceService: AppearanceService,
    private router: Router,
    private route: ActivatedRoute,
    private loader: NgxUiLoaderService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initPage();
  }

  private async initPage() {
    this.locationId = this.route.snapshot.params.locationid;
    await this.fetchLocation(this.locationId);
  }

  async fetchLocation(locationId: string) {
    this.loader.start();
    this.receiptSettings = await this.appearanceService.getReceiptSettings(
      locationId
    );
    this.loader.stop();
    this.formReady = true;
    this.cdr.detectChanges();

    this.locationForm.patchValue(this.receiptSettings);
    this.enabledEmailChange();
    this.enabledSMSChange();

    this.mediaAsset = {
      displayUrl: this.receiptSettings.logo?.displayUrl ?? '',
      storagePath: this.receiptSettings.logo?.storagePath ?? '',
      name: this.receiptSettings.logo?.name ?? '',
    };

    this.logoPreview = this.receiptSettings.logo?.displayUrl ?? '';

    this.cdr.detectChanges();
  }

  initForm() {
    this.locationForm = this.fb.group({
      headerText: this.fb.control(''),
      footerText: this.fb.control(''),
      autoPrint: this.fb.control(''),
      receiptAddress: this.fb.group({
        address1: this.fb.control(''),
        address2: this.fb.control(''),
        city: this.fb.control(''),
        state: this.fb.control(''),
        zipCode: this.fb.control(''),
        countryISO: this.fb.control(''),
      }),
      phone: new FormGroup({
        countryCode: this.fb.control('USA'),
        number: this.fb.control('', [
          Validators.required,
          Validators.pattern('[- +()0-9]+'),
        ]),
      }),
      logo: this.fb.group({
        displayUrl: this.fb.control(''),
        storagePath: this.fb.control(''),
        name: this.fb.control(''),
      }),
      logoSource: this.fb.control(''),
      enableEmailReceipt: this.fb.control(''),
      emailFrom: this.fb.control(''),
      emailFromName: this.fb.control(''),
      emailSubject: this.fb.control('Your Receipt'),
      templateId: this.fb.control(''),
      enableSmsReceipt: this.fb.control(''),
      smsApiKey: this.fb.control(''),
      smsMessageFormat: this.fb.control(''),
      receiptVisibilityOptions: this.fb.group({
        modifierGroupNames: this.fb.control(false),
        defaultModifiers: this.fb.control(true),
        freeModifiers: this.fb.control(true),
        pricedModifiers: this.fb.control(true),
      }),
    });
  }

  async onSubmit() {
    if (this.locationForm.invalid) {
      this.toast.warning('Please correct validation issues');
      return;
    }

    this.loader.start();
    this.saving = true;

    if (this.locationForm.value?.logoSource) {
      const image: File = this.locationForm.value?.logoSource;
      const vm = this;

      const res = await this.imageService.upload(
        this.locationId,
        image.name,
        image,
        (loaded: number, total: number) =>
          (vm.uploadedPercent = Math.round(
            ((loaded ?? 0) / (total ?? 1)) * 100
          ))
      );

      this.mediaAsset = {
        displayUrl: res.displayUrl,
        storagePath: res.storagePath,
        name: image.name,
      };
    } else {
      this.mediaAsset = {
        displayUrl:
          this.locationForm?.get('logo')?.get('displayUrl')?.value ?? '',
        storagePath:
          this.locationForm?.get('logo')?.get('storagePath')?.value ?? '',
        name: this.locationForm?.get('logo')?.get('name')?.value ?? '',
      };
    }

    const {
      headerText,
      footerText,
      receiptAddress,
      phone,
      autoPrint,
      enableEmailReceipt,
      emailFrom,
      emailFromName,
      emailSubject,
      templateId,
      enableSmsReceipt,
      smsApiKey,
      smsMessageFormat,
      receiptVisibilityOptions,
    } = this.locationForm.getRawValue();

    await this.appearanceService.updateReceiptSettings(this.locationId, {
      headerText,
      footerText,
      receiptAddress,
      logo: this.mediaAsset,
      phone,
      autoPrint,
      enableEmailReceipt,
      emailFrom,
      emailFromName,
      templateId,
      smsApiKey,
      enableSmsReceipt,
      smsMessageFormat,
      emailSubject,
      receiptVisibilityOptions,
    });

    this.toast.success('Settings saved');
    this.loader.stop();
    this.saving = false;
    this.locationForm?.updateValueAndValidity();
    this.autoPrint = !this.autoPrint;
  }

  handleAddressChange(address: Address) {
    this.fillInAddress(address);
  }

  private fillInAddress(address: Address) {
    const address_components: AddressComponent[] = address.address_components;
    const { address1, postcode, city, state, country } =
      mapGoogleAddressAutoCompleteComponents(address_components);
    this.locationForm
      ?.get('receiptAddress')
      ?.get('address1')
      ?.patchValue(address.name);

    if (address.name !== address1) {
      this.locationForm
        ?.get('receiptAddress')
        ?.get('address2')
        ?.patchValue(address1);
    }

    this.locationForm?.get('receiptAddress')?.get('city')?.patchValue(city);
    this.locationForm?.get('receiptAddress')?.get('state')?.patchValue(state);
    this.locationForm
      ?.get('receiptAddress')
      ?.get('countryISO')
      ?.patchValue(country);
    this.locationForm
      ?.get('receiptAddress')
      ?.get('zipCode')
      ?.patchValue(postcode);
  }

  handleInputFile(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;

    const file = target?.files[0];
    var mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      this.toast.warning('Only images are supported.');
      return;
    }

    this.displayPreview(file);
  }

  private displayPreview(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview = reader.result as string;

      this.locationForm
        ?.get('logoSource')
        ?.patchValue(file, { emitEvent: false });

      this.locationForm?.get('logoSource')?.updateValueAndValidity();
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }

  removeImage() {
    this.logoPreview = '';
    this.locationForm?.get('logoSource')?.patchValue('', { emitEvent: false });

    this.locationForm
      ?.get('logo')
      ?.get('storagePath')
      ?.patchValue('', { emitEvent: false });

    this.locationForm
      ?.get('logo')
      ?.get('displayUrl')
      ?.patchValue('', { emitEvent: false });

    this.locationForm
      ?.get('logo')
      ?.get('name')
      ?.patchValue('', { emitEvent: false });
  }

  enabledEmailChange() {
    if (this.locationForm.get('enableEmailReceipt')?.value) {
      this.locationForm
        .get('emailFrom')
        ?.setValidators([
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]);
      this.locationForm.get('emailFrom')?.updateValueAndValidity();
      this.locationForm.get('templateId')?.setValidators([Validators.required]);
      this.locationForm.get('templateId')?.updateValueAndValidity();
      this.locationForm
        .get('emailSubject')
        ?.setValidators([Validators.required]);
      this.locationForm.get('emailSubject')?.updateValueAndValidity();
    } else {
      this.locationForm.get('emailFrom')?.clearValidators();
      this.locationForm.get('emailFrom')?.updateValueAndValidity();
      this.locationForm.get('templateId')?.clearValidators();
      this.locationForm.get('templateId')?.updateValueAndValidity();
      this.locationForm.get('emailSubject')?.clearValidators();
      this.locationForm.get('emailSubject')?.updateValueAndValidity();
    }
  }

  enabledSMSChange() {
    if (this.locationForm.get('enableSmsReceipt')?.value) {
      this.locationForm.get('smsApiKey')?.setValidators([Validators.required]);
      this.locationForm.get('smsApiKey')?.updateValueAndValidity();
    } else {
      this.locationForm.get('smsApiKey')?.clearValidators();
      this.locationForm.get('smsApiKey')?.updateValueAndValidity();
    }
  }

  changePrintFreeModifiers() {
    const freeModifiers = this.locationForm
      ?.get('receiptVisibilityOptions')
      ?.get('freeModifiers')?.value;
    if (!freeModifiers) {
      this.locationForm
        ?.get('receiptVisibilityOptions')
        ?.get('defaultModifiers')
        ?.setValue(false);
    }
  }

  changePrintPricedModifiers() {
    const pricedModifiers = this.locationForm
      ?.get('receiptVisibilityOptions')
      ?.get('pricedModifiers')?.value;
    if (!pricedModifiers) {
      this.locationForm
        ?.get('receiptVisibilityOptions')
        ?.get('defaultModifiers')
        ?.setValue(false);
      this.locationForm
        ?.get('receiptVisibilityOptions')
        ?.get('freeModifiers')
        ?.setValue(false);
    }
  }
}
