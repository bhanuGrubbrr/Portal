import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { PaymentGrid } from 'src/app/grubbrr/core/models/payment/paymentgrid.model';
import {
  PaymentIntegrationDefinitionVM,
  PaymentIntegrationsVM,
} from 'src/app/grubbrr/generated/payment_pb';
import { CompanyService } from 'src/app/grubbrr/service/company.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { PaymentService } from 'src/app/grubbrr/service/payment.service';
import { StorageService } from 'src/app/grubbrr/service/storage.service';
import { UtilService } from 'src/app/grubbrr/service/utils.service';
import { FormControlService } from 'src/app/grubbrr/shared/dynamic-form/form-control.service';
import { NavigationService } from 'src/app/grubbrr/shared/navigation.service';
import { PageLink } from 'src/app/metronic/_metronic/layout';
import { ConfirmDeletePaymentSettingsComponent } from '../../modals/confirm-delete-payment-settings/confirm-delete-payment-settings.component';
import { SetupPaymentTypeComponent } from '../../modals/setup-payment-type/setup-payment-type.component';
import { TenderOptionVM } from 'src/app/grubbrr/generated/common_pb';

@Component({
  selector: 'app-payment-settings',
  templateUrl: './payment-settings.component.html',
  styleUrls: ['./payment-settings.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class PaymentSettingsComponent implements OnInit, OnDestroy {
  breadCrumbs: Array<PageLink> = [];
  saving: boolean = false;
  contentLoaded = false;
  locationId: string;
  // paymentProviderSettings: PaymentProviderSettingModel[];
  availablePaymentIntegrations: PaymentIntegrationDefinitionVM[];
  paymentIntegrations: PaymentIntegrationsVM;
  public paymentForm: FormGroup = new FormGroup({});
  paymentGrid: PaymentGrid[] = [];
  modalOptions: NgbModalOptions;
  subscriptions: Subscription[] = [];
  availableDefaultTenders: TenderOptionVM[];
  selectedDefaultTender: FormControl = new FormControl('');
  enableAmazonOnePay: FormControl = new FormControl('');

  isNCRPOS: boolean = false;
  isCard: boolean = false;
  private readonly paytronixGiftCardLabel = 'Paytronix Gift Card';

  constructor(
    private loader: NgxUiLoaderService,
    private fb: FormBuilder,
    private formService: FormControlService,
    private toast: ToastrService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private paymentService: PaymentService,
    private locationService: LocationService,
    public navigation: NavigationService,
    private elementRef: ElementRef,
    private companyService: CompanyService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private utilService: UtilService
  ) {
    this.modalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
      scrollable: true,
    };
  }

  initForm() {
    this.paymentForm = this.fb.group({
      paymentOptions: this.fb.array([]),
      selectedDefaultTender: this.fb.control(''),
      enableAmazonOnePay: this.fb.control(''),
    });
  }

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.grubbrrRoutingChanges();
    this.initForm();
    await this.fetchData();
    this.cdr.detectChanges();
  }

  private async grubbrrRoutingChanges() {
    this.subscriptions.push(
      this.utilService.GrubbrrRouteParams$.subscribe((routeParams) => {
        this.locationId = this.route.snapshot.params.locationid;
      })
    );
  }

  async fetchData() {
    try {
      // Api Calls
      this.paymentIntegrations =
        await this.paymentService.getLocationPaymentIntegrations(
          this.locationId
        );

      this.isNCRPOS = await this.locationService.checkIfNCR(this.locationId);

      const tenders = await this.paymentService.getLocationPaymentTenders(
        this.locationId,
        ''
      );
      this.availableDefaultTenders = tenders.tenderOptions.sort((a, b) => {
        return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
      });

      this.loadData();

      await this.loadDefaultValues();
    } catch (error: any) {
      this.toast.error(error.message);
    } finally {
      this.loader.stop();
      this.saving = false;
      this.contentLoaded = true;
      this.cdr.detectChanges();
    }
  }

  async loadData() {
    this.availablePaymentIntegrations =
      this.paymentIntegrations.availableIntegrations;

    this.paymentGrid = this.paymentIntegrations.availableIntegrations.map(
      (p) => {
        let config = this.paymentIntegrations.configuredList.find(
          (pp) => pp.paymentIntegrationId == p.paymentIntegrationId
        );
        return new PaymentGrid(
          p.displayName,
          p.paymentIntegrationId,
          !!config,
          Object.keys(p.locationFields).length > 0, // checking for location only fields
          p.paymentMethod
        );
      }
    );
  }

  async loadDefaultValues() {
    this.paymentForm
      .get('selectedDefaultTender')
      ?.setValue(this.paymentIntegrations.defaultPaymentTender);

    this.paymentForm
      .get('enableAmazonOnePay')
      ?.setValue(this.paymentIntegrations.enableAmazonOnePay);

    this.isCard =
      this.paymentGrid.filter((x) => x.isSetup && x.paymentMethod == 'Card')
        .length > 0;
  }

  async onDefaultSelected() {
    const defaultTender = this.paymentForm.value.selectedDefaultTender;
    const isAmazonOnePay = this.paymentForm.value.enableAmazonOnePay;

    await this.paymentService.updateLocationPaymentDefaultTender(
      this.locationId,
      defaultTender,
      isAmazonOnePay
    );
  }

  onPaymentSettingToggled(
    $event: any,
    paymentGrid: PaymentGrid,
    channel: string
  ) {
    //if ($event.target.checked && paymentGrid.hasSetupFields) {
    if ($event.target.checked) {
      this.openSetupPaymentModal(paymentGrid);
    } else if ($event.target.checked === false) {
      this.openRemovePaymentModal(paymentGrid);
    }

    // just setup the payment type, there aren't any fields to add
    // if ($event.target.checked && paymentGrid.hasSetupFields === false) {
    //   this.loader.start();
    //   let postData = new PaymentIntegrationConfigModel();
    //   //postData.orderChannels = [channel];
    //   postData.paymentIntegrationId = paymentGrid.paymentIntegrationId;

    //   this.subscriptions.push(
    //     this.paymentService
    //       .updatePaymentProviderSetting(this.locationId, postData)
    //       .pipe(finalize(() => {}))
    //       .subscribe((paymentProviderSetting: PaymentIntegrationConfigModel) => {
    //         this.toast.success('Payment Settings Saved');
    //         this.fetchData();
    //       })
    //   );
    // }
  }

  async openRemovePaymentModal(grid: PaymentGrid): Promise<void> {
    let integration = this.paymentIntegrations.availableIntegrations.find(
      (pp) => pp.paymentIntegrationId == grid.paymentIntegrationId
    );
    let params = {
      paymentIntegrationName: integration?.displayName,
      paymentIntegrationId: grid.paymentIntegrationId,
    };

    const modalRef = this.modalService.open(
      ConfirmDeletePaymentSettingsComponent,
      this.modalOptions
    );

    modalRef.componentInstance.fromParent = params;
    var result = await modalRef.result;
    if (result === grid.paymentIntegrationId) {
      await this.paymentService.deletePaymentProviderSetting(
        this.locationId,
        grid.paymentIntegrationId
      );

      grid.isSetup = false;
      this.isCard =
        this.paymentGrid.filter((x) => x.isSetup && x.paymentMethod == 'Card')
          .length > 0;
      this.cdr.detectChanges();

      this.toast.success('Payment settings cleared');
    }
  }

  async openSetupPaymentModal(paymentGrid: PaymentGrid) {
    let params = {
      paymentIntegrationId: paymentGrid.paymentIntegrationId,
      locationId: this.locationId,
      integrationDefinition:
        this.paymentIntegrations.availableIntegrations.find(
          (p) => p.paymentIntegrationId == paymentGrid.paymentIntegrationId
        ),
      integrationConfig: this.paymentIntegrations.configuredList.find(
        (p) => p.paymentIntegrationId === paymentGrid.paymentIntegrationId
      ),
    };

    this.modalOptions.size =
      params.integrationDefinition?.displayName == this.paytronixGiftCardLabel
        ? 'xl'
        : 'lg';
    const modalRef = this.modalService.open(
      SetupPaymentTypeComponent,
      this.modalOptions
    );

    modalRef.componentInstance.fromParent = params;
    let result = await modalRef.result;
    //if (result !== 'cancel') {
    this.fetchData(); // just reload for now
    //}
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
