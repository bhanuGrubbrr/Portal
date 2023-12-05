import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ppid } from 'process';
import { of, combineLatest, Observable, Subscription } from 'rxjs';
import {
  KioskPaymentConfigVM,
  PaymentIntegrationsVM,
  KioskPaymentIntegrationConfigVM,
} from 'src/app/grubbrr/generated/payment_pb';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { PaymentService } from 'src/app/grubbrr/service/payment.service';
import { FormControlService } from 'src/app/grubbrr/shared/dynamic-form/form-control.service';
import { FormFieldBase } from 'src/app/grubbrr/shared/dynamic-form/formfield-base';
import { NavigationService } from 'src/app/grubbrr/shared/navigation.service';
import { PageInfoService } from 'src/app/metronic/_metronic/layout';

@Component({
  selector: 'app-add-edit-kiosk',
  templateUrl: './add-edit-kiosk.component.html',
  styleUrls: ['./add-edit-kiosk.component.scss'],
})
export class AddEditKioskComponent implements OnInit, AfterViewInit {
  pageTitle = 'Add';
  formReady = false;
  kioskForm: FormGroup;
  paymentForms: Map<string, Observable<FormFieldBase<any>[]>> = new Map();
  //fields$: Observable<FormFieldBase<any>[]>;
  paymentValues: Map<string, { [key: string]: string }> = new Map();
  //patchValues: { [key: string]: string }

  //kiosk: KioskModel;
  paymentIntegrationVM: PaymentIntegrationsVM;

  @ViewChild('deviceModeLiveLabel', { read: ElementRef, static: false })
  deviceModeLiveLabelRef: ElementRef;
  @ViewChild('deviceModeTestLabel', { read: ElementRef, static: false })
  deviceModeTestLabelRef: ElementRef;
  //defaultPaymentProviders: PaymentIntegrationDefinitionVM[];
  //printerDevices: PrinterSettingsModel[];
  //hasKioskFields = false;
  locationId: string;
  //companyId: string;
  kioskId: string;

  //private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private loader: NgxUiLoaderService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private locationService: LocationService,
    private paymentService: PaymentService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    public navigation: NavigationService,
    private formService: FormControlService,
    private pageService: PageInfoService,
    private breadCrumbService: BreadCrumbService
  ) {
    //this.kiosk = new KioskModel();
  }

  ngAfterViewInit(): void {
    this.kioskForm.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    this.initForm();
    await this.setupPageTitle();

    await this.fetchData();
    this.loadData();
  }

  private initForm() {
    this.kioskForm = this.fb.group({});
  }

  private async setupPageTitle() {
    this.locationId = this.route.snapshot.params.locationid;
    this.kioskId = this.route.snapshot.params.kioskId;

    this.pageTitle = this.kioskId ? 'Edit' : 'Add';
    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId
    );

    this.pageService.updateTitle(this.pageTitle);
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }

  private async fetchData() {
    this.paymentIntegrationVM =
      await this.paymentService.getKioskPaymentIntegrations(
        this.locationId,
        this.kioskId
      );
    this.loader.stop();
    // this.printerDevices = combinedStream[0];
    // this.printerDevices.filter((p) => p.tokenPrinter === true);
  }

  private loadData() {
    this.mapPaymentProviderGroup();
    this.formReady = true;
  }

  mapPaymentProviderGroup() {
    // Check if we have any kiosk fields
    this.paymentIntegrationVM.availableIntegrations.forEach((def) => {
      let counter = 0;
      const fields: FormFieldBase<string>[] = [];
      var properties = Object.entries(def.kioskFields);
      if (properties.length == 0) return;

      var prefix = this.payPrefix(def.paymentIntegrationId);

      properties.forEach(([key, formField]) => {
        fields.push(
          this.formService.createFormField(
            formField,
            `${prefix}${key}`,
            counter++
          )
        );
      });

      this.paymentForms.set(
        def.paymentIntegrationId,
        of(fields.sort((a, b) => a.order - b.order))
      );
      var config = this.paymentIntegrationVM.configuredList.find(
        (i) => i.paymentIntegrationId == def.paymentIntegrationId
      );
      if (!config || !config.settings) return;

      var settings = Object.entries(config.settings.values);
      if (settings.length === 0) return;

      let values: Record<string, string> = {};
      settings.forEach(([key, value]) => {
        var prefixedKey = `${prefix}${key}`;
        values[prefixedKey] = value;
      });

      this.paymentValues.set(def.paymentIntegrationId, values);
    });
  }

  private payPrefix(paymentIntegrationId: string): string {
    return `${paymentIntegrationId}:`;
  }

  async onSubmit(): Promise<void> {
    this.loader.start();
    let kioskData = Object.assign({}, this.kioskForm.getRawValue()); // will get most fields

    // Each form variable is prefixed with the PaymentIntegrationId.
    // We need to group them by the Id and then remove the prefix before sending to the API
    let configList = new Array<KioskPaymentIntegrationConfigVM>();
    this.paymentIntegrationVM.availableIntegrations.forEach((p) => {
      var prefix = this.payPrefix(p.paymentIntegrationId);
      var keys = Object.keys(kioskData).filter((k: string) =>
        k.startsWith(prefix)
      );

      let values: Record<string, string> = {};
      keys.forEach((k: string) => {
        var value = kioskData[k];
        var key = k.replace(prefix, '');
        values[key] = value;
      });

      configList.push({
        paymentIntegrationId: p.paymentIntegrationId,
        settings: {
          values: values,
        },
      });
    });

    var paymentConfig: KioskPaymentConfigVM = {
      integrations: configList,
    };

    try {
      await this.paymentService.updateKioskPaymentIntegrations(
        this.locationId,
        this.kioskId,
        paymentConfig
      );
    } catch (ex) {
      let message;
      if (ex instanceof Error) message = ex.message;
      else message = String(ex);

      this.toastr.error(message);
    } finally {
      this.loader.stop();
    }
  }

  toggleDeviceMode(index: number): void {
    if (index === 1) {
      // Live
      this.renderer.addClass(
        this.deviceModeLiveLabelRef.nativeElement,
        'active'
      );
      this.renderer.removeClass(
        this.deviceModeTestLabelRef.nativeElement,
        'active'
      );
    } else {
      this.renderer.removeClass(
        this.deviceModeLiveLabelRef.nativeElement,
        'active'
      );
      this.renderer.addClass(
        this.deviceModeTestLabelRef.nativeElement,
        'active'
      );
    }
  }
}
