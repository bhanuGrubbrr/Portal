import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AddressComponent } from 'ngx-google-places-autocomplete/objects/addressComponent';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CompanyImageTypeEnum } from 'src/app/core/global-constants';
import { CompanyVM } from 'src/app/grubbrr/generated/companies_pb';
import { LoyaltyIntegrationDefinitionVM } from 'src/app/grubbrr/generated/loyalty_pb';
import { PaymentIntegrationDefinitionVM } from 'src/app/grubbrr/generated/payment_pb';
import {
  PaymentSettingsVM,
  PosType,
} from 'src/app/grubbrr/generated/system_pb';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { CompanyService } from 'src/app/grubbrr/service/company.service';
import { ImageService } from 'src/app/grubbrr/service/image.service';
import { LoyaltyService2 } from 'src/app/grubbrr/service/loyaltyService.service';
import { PaymentService } from 'src/app/grubbrr/service/payment.service';
import { SystemService } from 'src/app/grubbrr/service/system.service';
import { NavigationService } from 'src/app/grubbrr/shared/navigation.service';
import {
  PageInfoService,
  PageLink,
} from 'src/app/metronic/_metronic/layout/core/page-info.service';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss'],
})
export class CompanyEditComponent implements OnInit, OnDestroy {
  model: NgbDateStruct;
  breadCrumbs: Array<PageLink> = [];
  companyForm: FormGroup;
  public company: CompanyVM;
  saving: boolean = false;
  companyId: string = '';
  emailValidation: boolean = true;
  private subscriptions: Subscription[] = [];
  errorMessage = '';
  pageTitle: string;
  @ViewChild('businessLogoLabel', { static: false })
  businessLogoLabel: ElementRef;
  businessLogoPreview?: string;
  defaultPaymentProviders: PaymentSettingsVM;
  allPosProviders: PosType[];
  allLoyaltyIntegrations: LoyaltyIntegrationDefinitionVM[];

  constructor(
    public navigation: NavigationService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private pageService: PageInfoService,
    private fb: FormBuilder,
    private imageService: ImageService,
    private paymentService: PaymentService,
    private router: Router,
    private breadCrumbService: BreadCrumbService,
    private companyService: CompanyService,
    private systemService: SystemService,
    private loyaltyService: LoyaltyService2
  ) {
    this.company = {} as CompanyVM;
    this.initForm();
  }

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    this.fetchData();
    this.cdr.detectChanges();
  }

  async fetchData() {
    let payment_provider_data = await this.systemService.getPaymentSettings();
    this.allLoyaltyIntegrations =
      (await this.loyaltyService.getIntegrations())?.integrations ?? [];
    this.allPosProviders = (await this.systemService.getPosSettings()).values;
    this.defaultPaymentProviders = payment_provider_data;
    let company_data;
    if (this.companyId) {
      company_data = await this.companyService.getCompany(this.companyId);
    }
    this.loadData(company_data);
    this.loader.stop();
    this.saving = false;
    this.cdr.detectChanges();
  }

  private initForm() {
    this.companyForm = new FormGroup({
      enabledPaymentIntegrations: this.fb.array([]),
      enabledPosIntegrations: this.fb.array([]),
      enabledLoyaltyIntegrations: this.fb.array([]),
      loyaltyProvidersArrayUI: this.fb.group({
        providers: this.fb.array([]),
      }),
      posProvidersArrayUI: this.fb.group({
        providers: this.fb.array([]),
      }),
      paymentProvidersArrayUI: this.fb.group({
        cardOptions: this.fb.array([]),
        cashOptions: this.fb.array([]),
        otherOptions: this.fb.array([]),
      }),
      companyName: new FormControl('', Validators.required),
      businessLogo: this.fb.group({
        url: this.fb.control(''),
      }),
      address: this.fb.group({
        tempAddress: this.fb.control(''),
        address1: this.fb.control('', Validators.required),
        address2: this.fb.control(''),
        city: this.fb.control('', Validators.required),
        state: this.fb.control('', Validators.required),
        zipCode: this.fb.control('', Validators.required),
        countryISO: this.fb.control('USA', Validators.required),
      }),
      businessEmail: new FormControl('', Validators.required),
      businessPhone: new FormGroup({
        countryCode: this.fb.control('USA'),
        number: new FormControl('', Validators.required),
      }),
      alternatePhone: new FormGroup({
        countryCode: this.fb.control('USA'),
        number: new FormControl(''),
      }),
    });
  }

  private loadData(comp?: CompanyVM) {
    if (comp) {
      Object.assign(this.company, comp);
      this.companyForm.patchValue(comp);
      this.pageTitle = `Editing ${comp.companyName}`;

      this.companyForm
        ?.get('address')
        ?.get('tempAddress')
        ?.patchValue(this.company?.address?.address1);

      this.businessLogoPreview = this.company?.businessLogo?.url;
    } else {
      this.pageTitle = 'Add New Company';
    }

    const cardProviders = this.defaultPaymentProviders.values.filter(
      (p) => p.paymentMethod.toLowerCase() == 'card'
    );
    const cashProviders = this.defaultPaymentProviders.values.filter(
      (p) => p.paymentMethod.toLowerCase() == 'cash'
    );
    const otherProviders = this.defaultPaymentProviders.values.filter(
      (p) => !cardProviders.includes(p) && !cashProviders.includes(p)
    );

    this.mapPosProviders(this.allPosProviders, this.posProvidersFormArr);
    this.mapLoyaltyProviders(
      this.allLoyaltyIntegrations,
      this.loyaltyProvidersFormArr
    );
    this.mapPaymentProviders(cardProviders, this.cardPaymentProvidersFormArr);
    this.mapPaymentProviders(cashProviders, this.cashPaymentProvidersFormArr);
    this.mapPaymentProviders(otherProviders, this.otherPaymentProvidersFormArr);

    this.cardPaymentProvidersFormArr.patchValue(
      this.company?.enabledPaymentIntegrations?.map((r) => this.fb.group([r]))
    );
  }

  onCardTypeChanged(index: number) {
    for (let i = 0; i < this.cardPaymentProvidersFormArr.length; i++) {
      if (i == index) continue;

      this.cardPaymentProvidersFormArr.at(i)?.setValue({
        displayName: this.cardPaymentProvidersFormArr.at(i).value.displayName,
        name: this.cardPaymentProvidersFormArr.at(i).value.name,
        paymentType: this.cardPaymentProvidersFormArr.at(i).value.paymentType,
        enabled: false,
        paymentIntegrationId:
          this.cardPaymentProvidersFormArr.at(i).value.paymentIntegrationId,
      });
    }

    this.companyForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  private mapPosProviders(providers: PosType[], formGroup: FormArray) {
    formGroup.clear();

    for (let index = 0; index < providers?.length; index++) {
      const mappedProvider = this.company.enabledPosIntegrations?.find((p) => {
        if (p == providers[index].posIntegrationId) {
          return true;
        }
      });

      formGroup.push(
        this.fb.group({
          displayName: this.fb.control(providers[index].displayName),
          name: this.fb.control(providers[index].posIntegrationId),
          enabled: this.fb.control(mappedProvider ? true : false),
          paymentIntegrationId: this.fb.control(
            providers[index].posIntegrationId
          ),
        })
      );
    }
  }

  private mapLoyaltyProviders(
    providers: LoyaltyIntegrationDefinitionVM[],
    formGroup: FormArray
  ) {
    formGroup.clear();

    for (let index = 0; index < providers?.length; index++) {
      const mappedProvider = this.company.enabledLoyaltyIntegrations?.find(
        (p) => p == providers[index].integrationId
      );

      formGroup.push(
        this.fb.group({
          displayName: this.fb.control(providers[index].name),
          name: this.fb.control(providers[index].integrationId),
          enabled: this.fb.control(mappedProvider ? true : false),
        })
      );
    }
  }

  private mapPaymentProviders(
    providers: PaymentIntegrationDefinitionVM[],
    formGroup: FormArray
  ) {
    formGroup.clear();

    for (let index = 0; index < providers?.length; index++) {
      const mappedProvider = this.company.enabledPaymentIntegrations?.find(
        (p) => {
          if (p == providers[index].paymentIntegrationId) {
            return true;
          }
        }
      );

      formGroup.push(
        this.fb.group({
          displayName: this.fb.control(providers[index].displayName),
          name: this.fb.control(providers[index].paymentIntegrationId),
          paymentType: this.fb.control(providers[index].paymentMethod),
          enabled: this.fb.control(mappedProvider ? true : false),
          paymentIntegrationId: this.fb.control(
            providers[index].paymentIntegrationId
          ),
        })
      );
    }
  }

  handleAddressChange(address: Address) {
    this.companyForm
      ?.get('locationCoordinates')
      ?.get('latitude')
      ?.patchValue(address.geometry.location.lat());

    this.companyForm
      ?.get('locationCoordinates')
      ?.get('longitude')
      ?.patchValue(address.geometry.location.lng());

    this.fillInAddress(address.address_components);
  }

  private fillInAddress(address_components: AddressComponent[]) {
    let address1 = '';
    let postcode = '';
    let city = '';
    let state = '';
    let country = '';

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    // place.address_components are google.maps.GeocoderAddressComponent objects
    // which are documented at http://goo.gle/3l5i5Mr
    for (const component of address_components) {
      // @ts-ignore remove once typings fixed
      const componentType = component.types[0];

      switch (componentType) {
        case 'street_number': {
          address1 = `${component.long_name} ${address1}`;
          break;
        }

        case 'route': {
          address1 += component.short_name;
          break;
        }

        case 'postal_code': {
          postcode = `${component.long_name}${postcode}`;
          break;
        }

        case 'postal_code_suffix': {
          postcode = `${postcode}-${component.long_name}`;
          break;
        }

        case 'locality':
          city = component.long_name;
          break;

        case 'administrative_area_level_1': {
          state = component.short_name;
          break;
        }

        case 'country':
          country = component.short_name;
          break;
      }
    }

    this.companyForm?.get('address')?.get('address1')?.patchValue(address1);
    this.companyForm?.get('address')?.get('zipCode')?.patchValue(postcode);
    this.companyForm?.get('address')?.get('city')?.patchValue(city);
    this.companyForm?.get('address')?.get('state')?.patchValue(state);
    this.companyForm?.get('address')?.get('countryISO')?.patchValue(country);

    // After filling the form with address components from the Autocomplete
    // prediction, set cursor focus on the second address line to encourage
    // entry of subpremise information such as apartment, unit, or floor number.
    //this.address2.focus();
  }

  async onSubmit(): Promise<void> {
    // if (this.companyForm.invalid) {
    //   this.toast.warning('Please correct validation issues');
    //   return;
    // } else {
    this.loader.start();
    this.saving = true;

    await this.handleImages();

    // combine payment options down to a single form group/array
    try {
      this.enabledPaymentIntegrations.clear();
      this.enabledPosIntegrations.clear();
      this.enabledLoyaltyIntegrations.clear();

      this.updatePaymentProvidersForm([
        this.cardPaymentProvidersFormArr,
        this.cashPaymentProvidersFormArr,
        this.otherPaymentProvidersFormArr,
      ]);

      this.updatePosProvidersForm(this.posProvidersFormArr);
      this.updateLyaltyProvidersForm(this.loyaltyProvidersFormArr);
    } catch (ex: any) {
      this.toast.warning(ex);
      this.loader.stop();
      this.saving = false;
      return;
    }
    this.cdr.detectChanges();
    this.companyForm.updateValueAndValidity();

    // clear out form fields that should be excluded
    const companyBodyString = `${JSON.stringify(
      this.companyForm.getRawValue(),
      this.ignoreList_replacer
    )}`;
    const companyBody = JSON.parse(companyBodyString);
    if (!this.companyId) {
      this.createNewCompany(companyBody);
    } else {
      this.updateCompany(companyBody);
    }
  }

  private async updateCompany(companyBody: CompanyVM) {
    try {
      await this.companyService.updateCompany(this.companyId, companyBody);
      this.companyForm.patchValue(companyBody);
      this.toast.success('Company Updated');
    } catch (ex: any) {
      this.toast.error('Unable Perform Update, Contact Support', ex);
    }
    this.saving = false;
    this.loader.stop();
    this.router.navigate(['admin', 'company']);
  }

  private async createNewCompany(companyBody: CompanyVM) {
    try {
      let company = await this.companyService.addCompany(companyBody);
      this.toast.success('Company Added');
      this.router.navigate(['company', company.companyId, 'locations']);
    } catch (ex: any) {
      console.log(ex);
      this.toast.error('Unable to Add User Contact Support');
    }
    this.saving = false;
    this.loader.stop();
  }

  private updatePaymentProvidersForm(forms: FormArray[]) {
    const test = (value: FormArray) => {
      const controls = value.controls.filter((c) => c.value.enabled);
      return controls.length == 0;
    };
    if (forms.every(test)) {
      throw new Error('Select one payment provider!');
    }
    forms.forEach((formArray) => {
      const controls = formArray.controls.filter((c) => c.value.enabled);
      for (let index = 0; index < controls?.length; index++) {
        this.enabledPaymentIntegrations.push(
          this.fb.control(controls[index].value.name)
        );
      }
    });
  }

  private updatePosProvidersForm(formArray: FormArray) {
    const controls = formArray.controls.filter((c) => c.value.enabled);
    if (controls.length == 0) {
      throw new Error('Select at least one POS!');
    }
    for (let index = 0; index < controls?.length; index++) {
      this.enabledPosIntegrations.push(
        this.fb.control(controls[index].value.name)
      );
    }
  }

  private updateLyaltyProvidersForm(formArray: FormArray) {
    const controls = formArray.controls.filter((c) => c.value.enabled);
    for (let index = 0; index < controls?.length; index++) {
      this.enabledLoyaltyIntegrations.push(
        this.fb.control(controls[index].value.name)
      );
    }
  }

  removeImage(): void {
    this.companyForm
      ?.get('businessLogo')
      ?.get('imagePath')
      ?.patchValue('', { emitEvent: false });

    this.companyForm
      ?.get('businessLogoSource')
      ?.patchValue('', { emitEvent: false });

    this.businessLogoPreview = '';
    this.companyForm.updateValueAndValidity();
  }

  private async handleImages() {
    return new Promise((resolve) => {
      var formData = new FormData();
      let imageSourceMap = new Map<string, File>();
      let imageCount = 0;

      imageCount = this.addImageToForm(
        'businessLogo',
        this.companyForm.value?.businessLogoSource,
        imageSourceMap,
        formData
      );

      if (imageCount === 0) return resolve(false);

      this.subscriptions.push(
        this.imageService
          .uploadCompanyImages(this.companyId, formData)
          .pipe(finalize(() => resolve(true)))
          .subscribe((data: any) => {
            const map = new Map(Object.entries(data));
            var businessLogoMap = map.get('businessLogo');

            if (businessLogoMap) {
              this.companyForm
                ?.get('businessLogo')
                ?.get('imagePath')
                ?.patchValue(businessLogoMap, {
                  emitEvent: false,
                });
            }

            this.companyForm?.updateValueAndValidity();
          })
      );
    });
  }

  private addImageToForm(
    mapKey: string,
    imageFileSource: File,
    imageSourceMap: Map<string, File>,
    formData: FormData
  ): number {
    if (imageFileSource) {
      imageSourceMap.set(mapKey, imageFileSource);

      var newFileName = `${mapKey}.${imageFileSource?.name.substring(
        imageFileSource?.name.lastIndexOf('.') + 1
      )}`;

      formData.append('file', imageFileSource, newFileName);
      return 1;
    }

    return 0;
  }

  handleInputFile(event: Event, imageType: CompanyImageTypeEnum): void {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;

    const file = target?.files[0];
    var mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      this.toast.warning('Only images are supported.');
      return;
    }

    // File Preview
    this.displayPreview(imageType, file);
  }

  private displayPreview(imageType: CompanyImageTypeEnum, file: File) {
    const reader = new FileReader();
    let patchImageSource: string;

    reader.onload = () => {
      switch (imageType) {
        case CompanyImageTypeEnum.BusinessLogo:
          patchImageSource = 'businessLogoSource';
          this.businessLogoPreview = reader.result as string;
          break;
      }

      this.companyForm
        ?.get(patchImageSource)
        ?.patchValue(file, { emitEvent: false });

      this.companyForm?.get(patchImageSource)?.updateValueAndValidity();
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }

  get CompanyImageTypeEnum() {
    return CompanyImageTypeEnum;
  }

  // Api Calls
  //fetchCompany$ = this.companyService.getCompanyById(this.companyId);
  readonly fetchAllPaymentOptions$ =
    this.paymentService.getAllPaymentProviders();

  get f() {
    return this.companyForm.controls;
  }

  get enabledPaymentIntegrations(): FormArray {
    let formArray = this.companyForm?.get(
      'enabledPaymentIntegrations'
    ) as FormArray;
    return formArray;
  }
  get enabledPosIntegrations(): FormArray {
    let formArray = this.companyForm?.get(
      'enabledPosIntegrations'
    ) as FormArray;
    return formArray;
  }

  get enabledLoyaltyIntegrations(): FormArray {
    let formArray = this.companyForm?.get(
      'enabledLoyaltyIntegrations'
    ) as FormArray;
    return formArray;
  }

  get posProvidersFormArr(): FormArray {
    let formArray = this.companyForm
      ?.get('posProvidersArrayUI')
      ?.get('providers') as FormArray;
    return formArray;
  }

  get loyaltyProvidersFormArr(): FormArray {
    let formArray = this.companyForm
      ?.get('loyaltyProvidersArrayUI')
      ?.get('providers') as FormArray;
    return formArray;
  }

  get cardPaymentProvidersFormArr(): FormArray {
    let formArray = this.companyForm
      ?.get('paymentProvidersArrayUI')
      ?.get('cardOptions') as FormArray;
    return formArray;
  }

  get cashPaymentProvidersFormArr(): FormArray {
    let formArray = this.companyForm
      ?.get('paymentProvidersArrayUI')
      ?.get('cashOptions') as FormArray;
    return formArray;
  }

  get otherPaymentProvidersFormArr(): FormArray {
    let formArray = this.companyForm
      ?.get('paymentProvidersArrayUI')
      ?.get('otherOptions') as FormArray;
    return formArray;
  }

  ignoreList_replacer(key: any, value: any): any {
    const ignoreList = ['paymentProvidersArrayUI', 'posProvidersArrayUI'];
    if (ignoreList.indexOf(key) > -1) return undefined;
    else return value;
  }

  private async setupPageTitle(): Promise<void> {
    this.companyId = this.route.snapshot.params.companyid;
    this.pageTitle = this.companyId ? 'Company Edit' : 'Company Add';
    const breadCrumbInfo = await this.breadCrumbService.getAdminBreadCrumb(
      this.companyId
    );

    this.pageService.updateTitle(this.pageTitle);
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
