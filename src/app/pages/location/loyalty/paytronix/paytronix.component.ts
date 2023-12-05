import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GenericIntegrationConfig } from 'src/app/grubbrr/generated/loyalty_pb';
import {
  LoyaltyIntegrationConfigVM,
  PaytronixIntegrationConfigVM,
} from 'src/app/grubbrr/generated/loyalty_pb';
import { LoyaltyService2 } from 'src/app/grubbrr/service/loyaltyService.service';

@Component({
  selector: 'app-paytronix',
  templateUrl: './paytronix.component.html',
  styleUrls: ['./paytronix.component.scss'],
})
export class PaytronixComponent implements OnInit {
  @Input() Config: LoyaltyIntegrationConfigVM;
  @Input() LocationId: string;
  private paytronixConfig: PaytronixIntegrationConfigVM;
  public PaytronixForm: FormGroup;
  public ConfigForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private loyaltyService: LoyaltyService2,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.paytronixConfig =
      this.Config.configuration.oneofKind == 'paytronix'
        ? this.Config.configuration.paytronix
        : ({} as PaytronixIntegrationConfigVM);
    this.buildForms();
  }

  private buildForms(): void {
    this.PaytronixForm = this.fb.group({
      merchantId: this.fb.control(this.paytronixConfig.merchantId),
      storeCode: this.fb.control(this.paytronixConfig.storeCode),
      operatorId: this.fb.control(this.paytronixConfig.operatorId),
      terminalId: this.fb.control(this.paytronixConfig.terminalId),
      url: this.fb.control(this.paytronixConfig.url),
      apiVersion: this.fb.control(this.paytronixConfig.apiVersion),
      loyaltyTemplateCode: this.fb.control(
        this.paytronixConfig.loyaltyTemplateCode
      ),
      loyaltyWalletCode: this.fb.control(
        this.paytronixConfig.loyaltyWalletCode
      ),
    });

    this.ConfigForm = this.fb.group({
      enabled: this.fb.control(this.Config.enabled),
      maximumSelectableRewards: this.fb.control(
        this.Config.maximumSelectableRewards
      ),
    });
    //this.initBinForm();
  }

  async save() {
    let editedPaytronixConfig =
      this.PaytronixForm.getRawValue() as PaytronixIntegrationConfigVM;
    // editedPaytronixConfig = this.setBinRanges(editedPaytronixConfig);
    var z: { [key: string]: string } = {};

    const as = Object.entries(editedPaytronixConfig).map(([key, value]) => {
      return { [key]: JSON.stringify(value) };
    });
    let editedConfig =
      this.ConfigForm.getRawValue() as LoyaltyIntegrationConfigVM;

    for (const [key, value] of Object.entries(editedPaytronixConfig)) {
      if (typeof value == 'object') z[key] = JSON.stringify(value);
      else z[key] = value.toString();
    }

    let config: GenericIntegrationConfig = {
      values: z,
    };

    // let newPaytronixConfig = Object.assign(
    //   {},
    //   Object.assign({}, this.Config, editedConfig),
    //   {
    //     configuration: {
    //       oneofKind: 'paytronix',
    //       paytronix: editedPaytronixConfig,
    //     },
    //   }
    // );
    let newPaytronixConfig = Object.assign(
      {},
      Object.assign({}, this.Config, editedConfig, {
        configuration: {
          oneofKind: 'generic',
          generic: config,
        },
      })
    );
    try {
      await this.loyaltyService.updateLocationConfig(
        this.LocationId,
        newPaytronixConfig,
        'paytronix'
      );
      this.Config = newPaytronixConfig;
      this.toast.success('Successfully saved integration');
    } catch (ex: any) {
      if (ex instanceof Error) {
        console.log(ex);
      }
      this.toast.error(
        'There was an error saving, please make sure credentials are correct.'
      );
    }
  }
}
