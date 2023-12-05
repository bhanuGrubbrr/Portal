import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, of, Subscription } from 'rxjs';
import { TenderTypeId } from 'src/app/grubbrr/core/models/card-network.model';
import {
  PaymentIntegrationDefinitionVM,
  PaymentTendersVM,
  PaymentIntegrationConfigVM,
  CardNetworkMappingVM,
} from 'src/app/grubbrr/generated/payment_pb';
import { LocationService } from 'src/app/grubbrr/service/location.service';
//import { PaymentGrid } from 'src/app/grubbrr/core/models/payment/paymentgrid.model';
// import { PaymentIntegrationDefinitionModel } from 'src/app/grubbrr/core/models/payment/paymentintegrationdefinition.model';
// import { PaymentIntegrationConfigModel } from 'src/app/grubbrr/core/models/payment/paymentintegration.model';
import { PaymentService } from 'src/app/grubbrr/service/payment.service';
import { FormControlService } from 'src/app/grubbrr/shared/dynamic-form/form-control.service';
import { FormFieldBase } from 'src/app/grubbrr/shared/dynamic-form/formfield-base';

@Component({
  selector: 'app-setup-payment-type',
  templateUrl: './setup-payment-type.component.html',
  styleUrls: ['./setup-payment-type.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SetupPaymentTypeComponent implements OnInit, OnDestroy {
  paymentTypeLabel: string;

  setupPaymentForm: FormGroup;
  formReady = false;
  posRequiresTenders = false;
  showCardNetworkTenders = false;
  paytronixGiftCardLabel: string = 'Paytronix Gift Card';
  //paymentGrid: PaymentGrid;
  orderChannels: [] = [];
  @Input() fromParent: any;
  //paymentProviderSettings: PaymentProviderSettingModel;
  //paymentProvider: PaymentIntegrationDefinitionModel;
  fields$: Observable<FormFieldBase<any>[]>;
  patchValues: { [key: string]: string };
  contentLoaded = false;
  subscriptions: Subscription[] = [];
  tenderMapping: PaymentTendersVM;
  selectedTenderOption: string;
  selectedCardNetworkMapping: CardNetworkMappingVM;
  isNCRPOS: boolean = false;

  inputs: {
    paymentIntegrationId: string;
    locationId: string;
    integrationDefinition: PaymentIntegrationDefinitionVM;
    integrationConfig: PaymentIntegrationConfigVM;
  };

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private paymentService: PaymentService,
    private locationService: LocationService,
    private toast: ToastrService,
    private loader: NgxUiLoaderService,
    private formService: FormControlService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.initForm();
    this.fetchData();
  }

  initForm() {
    this.setupPaymentForm = this.fb.group({
      name: this.fb.control(this.inputs.paymentIntegrationId),
      binForm: this.fb.group({}),
    });
  }

  async onSettingsSubmit(formPayload: any): Promise<void> {
    this.loader.start();
    var form = JSON.parse(JSON.stringify(this.setupPaymentForm.getRawValue()));
    var dynamicForm = JSON.parse(formPayload);
    this.setupPaymentForm.patchValue(dynamicForm);

    var isCardNetwork =
      this.tenderMapping.requiredTenderType === 'CardNetworks';

    console.log('SetupPaymentForm', this.setupPaymentForm);
    // Get the form data here
    let postData: PaymentIntegrationConfigVM = {
      paymentIntegrationId: this.inputs.paymentIntegrationId,
      tenderMapping: isCardNetwork
        ? {
            oneofKind: 'cardNetworks',
            cardNetworks: this.selectedCardNetworkMapping,
          }
        : { oneofKind: 'tender', tender: this.selectedTenderOption },
      settings: {
        values: dynamicForm,
      },
      binRanges: [...(this?.bins?.value ?? [])],
      paymentIntegrationUrls: [
        ...(this.inputs?.integrationConfig?.paymentIntegrationUrls ?? []),
      ],
    };

    try {
      await this.paymentService.updateLocationPaymentIntegrationConfig(
        this.inputs.locationId,
        postData
      );
      this.toast.success('Payment Settings Saved');
      this.activeModal.close('saved');
    } catch (ex: any) {
      let msg = 'Unable to save settings.';
      if (ex.message) msg += ' ' + ex.message;

      this.toast.error(msg);
      this.loader.stop();
    }
  }

  get binFormGroup(): FormGroup {
    return this.setupPaymentForm?.get('binForm') as FormGroup;
  }

  get bins(): FormArray {
    return this.binFormGroup?.get('bins') as FormArray;
  }

  closeModal(message: string) {
    this.activeModal.close(message);
  }

  sortTenders() {
    return this.tenderMapping.tenderOptions.sort((a, b) => {
      return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
    });
  }

  private getParams() {
    this.inputs = {
      locationId: this.fromParent.locationId,
      integrationConfig: this.fromParent.integrationConfig,
      integrationDefinition: this.fromParent.integrationDefinition,
      paymentIntegrationId: this.fromParent.paymentIntegrationId,
    };
    this.paymentTypeLabel = this.inputs.integrationDefinition.displayName;
  }

  async fetchData() {
    this.tenderMapping = await this.paymentService.getLocationPaymentTenders(
      this.inputs.locationId,
      this.inputs.paymentIntegrationId
    );
    this.isNCRPOS = await this.locationService.checkIfNCR(
      this.inputs.locationId
    );

    this.formReady = true;
    this.contentLoaded = true;

    this.cdr.detectChanges();
    this.loadData();
  }

  loadData() {
    if (this.tenderMapping.requiredTenderType === TenderTypeId.None) {
      this.posRequiresTenders = false;
    } else if (this.tenderMapping.requiredTenderType === TenderTypeId.Payment) {
      this.posRequiresTenders = true;
      this.showCardNetworkTenders = false;

      if (this.inputs.integrationConfig?.tenderMapping?.oneofKind === 'tender')
        this.selectedTenderOption =
          this.inputs.integrationConfig.tenderMapping.tender;
    } else if (
      this.tenderMapping.requiredTenderType === TenderTypeId.CardNetworks
    ) {
      this.posRequiresTenders = true;
      this.showCardNetworkTenders = true;

      if (
        this.inputs?.integrationConfig?.tenderMapping?.oneofKind ===
        'cardNetworks'
      )
        this.selectedCardNetworkMapping =
          this.inputs.integrationConfig.tenderMapping?.cardNetworks;

      if (!this.selectedCardNetworkMapping)
        this.selectedCardNetworkMapping = {
          visa: '',
          masterCard: '',
          discover: '',
          amex: '',
          unknown: '',
        };
    }

    const fields: FormFieldBase<string>[] = [];
    let counter = 0;
    Object.entries(this.inputs.integrationDefinition.locationFields).forEach(
      ([key, formField]) => {
        fields.push(
          this.formService.createFormField(formField, key, counter++)
        );
      }
    );

    this.fields$ = of(fields.sort((a, b) => a.order - b.order));

    // Get Patch Values from existing data
    this.patchValues = this.inputs.integrationConfig?.settings?.values ?? {};

    if (this.inputs.paymentIntegrationId == 'payment-integration-verifone') {
      const idx = fields.findIndex((x) => x.key == 'integrationUrl');
      const selectedIntegrationUrl = this.patchValues['integrationUrl'] ?? '';
      if (idx != -1) {
        fields[idx].options =
          this.inputs.integrationConfig?.paymentIntegrationUrls ?? [];

        fields[idx].options = fields[idx].options.map((x) => {
          const isSelected = x.key === selectedIntegrationUrl;
          return { ...x, selected: isSelected };
        });
      }
    }

    console.log('Fields', fields);

    this.setupPaymentForm?.removeControl('dynamicForm', { emitEvent: false });
    this.setupPaymentForm.addControl('dynamicForm', new FormControl(''), {
      emitEvent: false,
    });
    this.setupPaymentForm.controls['dynamicForm']?.updateValueAndValidity({
      emitEvent: false,
      onlySelf: true,
    });

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => x.unsubscribe);
  }
}
