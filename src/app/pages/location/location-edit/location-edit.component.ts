import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AddressComponent } from 'ngx-google-places-autocomplete/objects/addressComponent';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { firstValueFrom, Subscription } from 'rxjs';
import {
  KioskImageTypeEnum,
  LocationImageTypeEnum,
} from 'src/app/core/global-constants';
import { mapGoogleAddressAutoCompleteComponents } from 'src/app/grubbrr/core/models/address.model';
import {
  LocationBaseVM,
  LocationDetailVM,
  LocationInheritanceVM,
} from 'src/app/grubbrr/generated/locations_pb';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { ImageService } from 'src/app/grubbrr/service/image.service';
import { LocationIdService } from 'src/app/grubbrr/service/location-id.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { RouterExtService } from 'src/app/grubbrr/service/router-ext.service';
import { NavigationService } from 'src/app/grubbrr/shared/navigation.service';
import { PageInfoService } from 'src/app/metronic/_metronic/layout/core/page-info.service';
import { Timezones } from './Timezones';
import { ClmmConfirmationComponent } from '../modals/clmm-confirmation/clmm-confirmation.component';

@Component({
  selector: 'app-location-edit',
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.scss'],
})
export class LocationEditComponent implements OnInit, OnDestroy {
  locationForm: FormGroup;
  locationSettings: FormGroup;
  locationProducts: FormGroup;
  saving: boolean = false;
  isEdit: boolean = false;
  formReady: boolean = false;
  location: LocationDetailVM;
  locationInheritance: LocationInheritanceVM;
  companyId: string;
  locationId: string;

  browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  scopeId: string;

  pageTitle: string = '';
  activeProductIndex: Array<number> = [];
  companyLocations: LocationBaseVM[] = [];
  cardViews: Array<string> = ['info', 'settings', 'products'];
  activeProducts: Array<string> = ['kiosk', 'pos', 'kds', 'oo', 'dmb', 'opb'];
  activeView: string = 'info';
  showPassword: string = 'password';
  @ViewChild('logoImageLabel', { static: false })
  logoImageLabel: ElementRef;
  logoPreview: string;
  homeScreenLogoPreview: string;
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  backButtonUrlLink: string;
  private subscriptions: Subscription[] = [];

  isCLMM: boolean = false;
  modalOptions: NgbModalOptions;
  private fromInfo: string = '';

  constructor(
    public navigation: NavigationService,
    private toast: ToastrService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private fb: FormBuilder,
    private pageService: PageInfoService,
    private imageService: ImageService,
    private breadCrumbService: BreadCrumbService,
    private locationIdService: LocationIdService,
    private routerExtService: RouterExtService,
    private modalService: NgbModal
  ) {
    this.modalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
      scrollable: true,
    };
  }

  ngOnInit(): void {
    this.initPage();
  }

  public get Timezones() {
    return Timezones;
  }
  public formatAddress(location: LocationDetailVM): string {
    let storeLocation = location.storeLocation;
    return `${storeLocation?.address?.address1}, ${storeLocation?.address?.city} ${storeLocation?.address?.state}, ${storeLocation?.address?.countryISO}`;
  }
  private async initPage() {
    await this.setupPageTitle();

    this.initForm();

    if (!this.locationId) {
      this.formReady = true;
      this.loader.stop();
      this.cdr.detectChanges();
      return;
    }

    this.fetchLocation(this.locationId);
  }

  handleAddressChange(address: Address) {
    this.locationForm
      ?.get('storeLocation')
      ?.get('timeZoneId')
      ?.patchValue(address.utc_offset); // need to get minutes in the plugin
    //?.patchValue(address.utc_offset_minutes);

    this.locationForm
      ?.get('storeLocation')
      ?.get('locationCoordinates')
      ?.get('latitude')
      ?.patchValue(address.geometry.location.lat());

    this.locationForm
      ?.get('storeLocation')
      ?.get('locationCoordinates')
      ?.get('longitude')
      ?.patchValue(address.geometry.location.lng());

    this.fillInAddress(address.address_components);
  }

  private fillInAddress(address_components: AddressComponent[]) {
    const { address1, city, state, country } =
      mapGoogleAddressAutoCompleteComponents(address_components);
    this.locationForm
      ?.get('storeLocation')
      ?.get('address')
      ?.get('address1')
      ?.patchValue(address1);

    this.locationForm
      ?.get('storeLocation')
      ?.get('address')
      ?.get('city')
      ?.patchValue(city);
    this.locationForm
      ?.get('storeLocation')
      ?.get('address')
      ?.get('state')
      ?.patchValue(state);
    this.locationForm
      ?.get('storeLocation')
      ?.get('address')
      ?.get('countryISO')
      ?.patchValue(country);

    // After filling the form with address components from the Autocomplete
    // prediction, set cursor focus on the second address line to encourage
    // entry of subpremise information such as apartment, unit, or floor number.
    //this.address2.focus();
  }

  initForm() {
    this.locationForm = this.fb.group({
      companyId: this.fb.control(this.companyId),
      locationBase: this.fb.group({
        name: this.fb.control(''),
        locationInheritance: this.fb.group({
          parentLocationId: this.fb.control(''),
          inheritMenu: this.fb.control(''),
          inheritKioskSettings: this.fb.control(''),
        }),
      }),
      timezone: this.fb.control(this.browserTimezone, Validators.required),
      countryName: this.fb.control(''),
      logo: this.fb.group({
        displayUrl: this.fb.control(''),
        imagePath: this.fb.control(''),
      }),
      logoSource: this.fb.control(''),
      homeScreenLogo: this.fb.group({
        displayUrl: this.fb.control(''),
        imagePath: this.fb.control(''),
      }),
      homeScreenLogoSource: this.fb.control(''),
      storeLocation: this.fb.group({
        address: this.fb.group({
          address1: this.fb.control(''),
          address2: this.fb.control(''),
          city: this.fb.control(''),
          state: this.fb.control(''),
          zipCode: this.fb.control(''),
          countryISO: this.fb.control(''),
        }),
        locationCoordinates: this.fb.group({
          latitude: this.fb.control(''),
          longitude: this.fb.control(''),
        }),
        timeZoneId: this.fb.control('timezone:21'),
        region: this.fb.control(''),
      }),
      ownerInfo: this.fb.group({
        email: this.fb.control('', Validators.compose([Validators.email])),
        homeScreenLogo: this.fb.group({
          displayUrl: this.fb.control(''),
          imagePath: this.fb.control(''),
        }),
        ownerProfilePic: this.fb.control(''),
        ownerName: this.fb.control(''),
        ownerContactNo: this.fb.group({
          countryCode: this.fb.control('USA'),
          number: [''],
        }),
      }),
      contactInfo: this.fb.group({
        locationEmail: this.fb.control(
          '',
          Validators.compose([Validators.required, Validators.email])
        ),
        customerSupportEmail: this.fb.control(
          '',
          Validators.compose([Validators.email])
        ),
        customerSupportNo: this.fb.group({
          countryCode: this.fb.control('USA'),
          number: ['', Validators.compose([Validators.required])],
        }),
        contactNo: this.fb.group({
          countryCode: this.fb.control('USA'),
          number: ['', Validators.compose([Validators.required])],
        }),
      }),
    });

    if (this.locationId) {
      this.locationForm.addControl(
        'locationId',
        new FormControl(this.locationId)
      );
    }
  }

  async fetchLocation(locationId: string) {
    this.loader.start();
    this.location = await this.locationService.getLocationDetails(locationId);
    this.locationInheritance =
      this.location.locationBase?.locationInheritance ||
      ({} as LocationInheritanceVM);
    this.loader.stop();
    this.formReady = true;
    this.cdr.detectChanges();

    if (this.location.locationBase?.timezone) {
      this.location.locationBase.timezone = this.browserTimezone;
    }

    // TODO: We should be explicitly mapping the location details to the form
    // values here
    this.locationForm.patchValue(this.location);

    if (!this.locationInheritance) {
      this.locationInheritance = {
        parentLocationId: '',
        inheritMenu: false,
        inheritKioskSettings: false,
        inheritTheme: false,
      };
    }

    this.logoPreview = this.location.logoUrl;
    this.homeScreenLogoPreview = this.location.homeScreenLogoUrl;

    const companyId = await this.locationIdService.GetCompanyIdFromLocationId(
      this.locationId
    );
    this.companyLocations = (
      await this.locationService.getLocations(companyId)
    ).locations.filter((l) => l.locationId !== locationId);
    if (!this.fromInfo) {
      this.backButtonUrlLink = `/company/${companyId}/locations`;
    } else {
      this.backButtonUrlLink = atob(this.fromInfo);
    }
    this.cdr.detectChanges();
  }

  async onSubmit(): Promise<void> {
    if (this.locationForm.invalid) {
      this.toast.warning('Please correct validation issues');
      return;
    }

    let toastMessage = '';
    this.loader.start();
    this.saving = true;

    if (!this.locationId) {
      await this.addLocation();
      toastMessage = 'Location Added';
    } else {
      toastMessage = 'Location Updated';
    }

    await this.handleImages();
    await this.updateLocation();

    this.toast.success(toastMessage);
    this.saving = false;
    this.loader.stop();
  }

  inheritanceCheckChanged($event: any) {
    if ($event.target.name === 'inheritMenu') {
      this.locationInheritance.inheritMenu = $event.target.checked;
    }
    if ($event.target.name === 'inheritKioskSettings') {
      this.locationInheritance.inheritKioskSettings = $event.target.checked;
    }

    this.locationForm
      .get('locationBase')
      ?.get('locationInheritance')
      ?.patchValue(this.locationInheritance);
  }

  updateParentLocation($event: any) {
    if (this.locationInheritance.parentLocationId === null) {
      this.locationInheritance.inheritMenu = true;
      this.locationInheritance.inheritKioskSettings = true;
    }
    if (!($event.target.value == '--')) {
      this.locationInheritance.parentLocationId = $event.target.value;
      this.locationInheritance.inheritMenu = false;
      this.locationInheritance.inheritKioskSettings = false;
    } else {
      this.locationInheritance.parentLocationId = '';
    }
    this.locationForm
      .get('locationBase')
      ?.get('locationInheritance')
      ?.patchValue(this.locationInheritance);

    this.cdr.detectChanges();
  }

  removeImage(imageType: LocationImageTypeEnum): void {
    switch (imageType) {
      case LocationImageTypeEnum.Logo:
        this.logoPreview = '';
        this.locationForm
          ?.get('logoSource')
          ?.patchValue('', { emitEvent: false });

        this.locationForm
          ?.get('logo')
          ?.get('imagePath')
          ?.patchValue('', { emitEvent: false });

        break;

      case LocationImageTypeEnum.HomeScreenLogo:
        this.homeScreenLogoPreview = '';
        this.locationForm
          ?.get('homeScreenLogoSource')
          ?.patchValue('', { emitEvent: false });

        this.locationForm
          ?.get('homeScreenLogo')
          ?.get('imagePath')
          ?.patchValue('', { emitEvent: false });

        break;

      default:
        break;
    }

    this.locationForm.updateValueAndValidity();
  }

  private async handleImages() {
    var formData = new FormData();
    let imageSourceMap = new Map<string, File>();
    let hasImages = false;

    if (this.locationForm.value?.logoSource) {
      imageSourceMap.set('logo', this.locationForm.value?.logoSource);

      var newFileName = `logo.${this.locationForm.value?.logoSource?.name.substring(
        this.locationForm.value?.logoSource?.name.lastIndexOf('.') + 1
      )}`;

      formData.append('file', this.locationForm.value?.logoSource, newFileName);
      hasImages = true;
    }

    if (this.locationForm.value?.homeScreenLogoSource) {
      imageSourceMap.set(
        'homeScreenLogo',
        this.locationForm.value?.homeScreenLogoSource
      );

      var newFileName = `homeScreenLogo.${this.locationForm.value?.homeScreenLogoSource?.name.substring(
        this.locationForm.value?.homeScreenLogoSource?.name.lastIndexOf('.') + 1
      )}`;

      formData.append(
        'file',
        this.locationForm.value?.homeScreenLogoSource,
        newFileName
      );
      hasImages = true;
    }

    if (hasImages === false) return false;

    let imageData = await firstValueFrom(
      this.imageService.uploadImages(this.locationId, formData)
    );

    const map = new Map(Object.entries(imageData));
    // TODO: This is disgusting - but our image uploading code is (really really) not good.
    const logoKey = [...map.keys()].find((k) => k.match(/.logo/g));
    const homeScreenLogoKey = [...map.keys()].find((k) =>
      k.match(/.homeScreenLogo/g)
    );

    const logoMap = logoKey && map.get(logoKey);
    const homeScreenLogoMap = homeScreenLogoKey && map.get(homeScreenLogoKey);
    if (logoMap) {
      this.locationForm?.get('logo')?.get('imagePath')?.patchValue(logoMap, {
        emitEvent: false,
      });
    }

    if (homeScreenLogoMap) {
      this.locationForm
        ?.get('homeScreenLogo')
        ?.get('imagePath')
        ?.patchValue(homeScreenLogoMap, {
          emitEvent: false,
        });
    }

    this.locationForm?.updateValueAndValidity();
  }

  handleInputFile(event: Event, imageType: LocationImageTypeEnum): void {
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

  private displayPreview(imageType: LocationImageTypeEnum, file: File) {
    const reader = new FileReader();
    let patchImageSource: string;

    reader.onload = () => {
      switch (imageType) {
        case LocationImageTypeEnum.Logo:
          patchImageSource = 'logoSource';
          this.logoPreview = reader.result as string;
          break;
        case LocationImageTypeEnum.HomeScreenLogo:
          patchImageSource = 'homeScreenLogoSource';
          this.homeScreenLogoPreview = reader.result as string;
          break;
      }

      this.locationForm
        ?.get(patchImageSource)
        ?.patchValue(file, { emitEvent: false });

      this.locationForm?.get(patchImageSource)?.updateValueAndValidity();
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }

  get LocationImageTypeEnum() {
    return LocationImageTypeEnum;
  }

  togglePassword(): void {
    if (this.showPassword == 'password') {
      this.showPassword = 'text';
    } else {
      this.showPassword = 'password';
    }
  }

  private async addLocation() {
    const locationModel = await this.locationService.addLocation(
      this.companyId,
      this.locationForm.getRawValue()
    );

    this.locationId = locationModel.locationBase?.locationId!;
    this.locationForm.addControl(
      'locationId',
      new FormControl(this.locationId)
    );
  }

  private async updateLocation() {
    const formData = this.locationForm.getRawValue();

    await this.locationService.updateLocation(this.locationId, {
      locationBase: formData.locationBase,
      ownerInfo: formData.ownerInfo,
      contactInfo: formData.contactInfo,
      storeLocation: formData.storeLocation,
      logoUrl:
        formData.logo?.imagePath !== ''
          ? formData.logo?.imagePath
          : this.logoPreview,
      homeScreenLogoUrl:
        formData.homeScreenLogo?.imagePath !== ''
          ? formData.homeScreenLogo?.imagePath
          : this.homeScreenLogoPreview,
    });
  }

  get f() {
    return this.locationForm.controls;
  }

  get KioskImageTypeEnum() {
    return KioskImageTypeEnum;
  }

  private async setupPageTitle() {
    this.companyId = this.route.snapshot.params.companyid;
    this.route.queryParams.subscribe((params) => {
      this.fromInfo = params['backurl'] ?? '';
    });
    if (this.route.snapshot.params.locationid) {
      // editing location
      await this.setupEditLocation();
      this.scopeId = this.locationId;
    } else {
      // adding location
      await this.setupAddLocation();
      this.scopeId = this.companyId;
    }
  }

  private async setupAddLocation() {
    const previousUrl = this.routerExtService.getPreviousUrl();
    const currentUrl = this.routerExtService.getCurrentUrl();
    const companyLocationsUrl = `/company/${this.companyId}/locations`;

    this.backButtonUrlLink =
      previousUrl !== undefined && previousUrl === currentUrl
        ? companyLocationsUrl
        : previousUrl !== undefined
        ? previousUrl
        : companyLocationsUrl;

    this.pageTitle = 'Add Location';

    // what if we're coming from the Location page, should reflect this?
    const breadCrumbInfo = await this.breadCrumbService.getCompanyBreadCrumb(
      this.companyId
    );

    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
    this.pageService.updateTitle(this.pageTitle);
  }

  private async setupEditLocation() {
    const previousUrl = this.routerExtService.getPreviousUrl();
    const currentUrl = this.routerExtService.getCurrentUrl();
    this.locationId = this.route.snapshot.params.locationid;
    const locationUrl = `/location/${this.locationId}`;

    this.backButtonUrlLink =
      previousUrl !== undefined && previousUrl === currentUrl
        ? locationUrl
        : previousUrl !== undefined
        ? previousUrl
        : locationUrl;

    this.pageTitle = 'Edit Location';

    // what if we're coming from the Location page, should reflect this?
    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId
    );

    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
    this.pageService.updateTitle(this.pageTitle);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onCLMMChange(event: any) {
    this.isCLMM = event;
    const modalRef = this.modalService.open(
      ClmmConfirmationComponent,
      this.modalOptions
    );
    modalRef.componentInstance.isCLMM = event;
    modalRef.result.then((result) => {
      if (!result) {
        this.isCLMM = !event;
        this.cdr.detectChanges();
      }
    });
  }
}
