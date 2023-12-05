import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  LoyaltyIntegrationConfigVM,
  PunchhIntegrationConfigVM,
} from 'src/app/grubbrr/generated/loyalty_pb';
import { LoyaltyService2 } from 'src/app/grubbrr/service/loyaltyService.service';

@Component({
  selector: 'app-punchh',
  templateUrl: './punchh.component.html',
  styleUrls: ['./punchh.component.scss'],
})
export class PunchhComponent implements OnInit {
  @Input() Config: LoyaltyIntegrationConfigVM;
  @Input() LocationId: string;
  private punchhConfig: PunchhIntegrationConfigVM;
  public PunchhForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private loyaltyService: LoyaltyService2,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.punchhConfig =
      this.Config.configuration.oneofKind == 'punchh'
        ? this.Config.configuration.punchh
        : ({} as PunchhIntegrationConfigVM);
    this.buildForm();
  }

  private buildForm(): void {
    this.PunchhForm = this.fb.group({
      locationKey: this.fb.control(this.punchhConfig.locationKey),
      businessKey: this.fb.control(this.punchhConfig.businessKey),
      askForDateOfBirth: this.fb.control(this.punchhConfig.askForDateOfBirth),
      askForGender: this.fb.control(this.punchhConfig.askForGender),
    });
  }

  async save() {
    let editedConfig =
      this.PunchhForm.getRawValue() as PunchhIntegrationConfigVM;
    let newConfig = Object.assign({}, this.Config, {
      configuration: {
        oneofKind: 'punchh',
        punchh: editedConfig,
      },
    });
    try {
      await this.loyaltyService.updateLocationConfig(
        this.LocationId,
        newConfig,
        'punchh'
      );
      this.Config = newConfig;
      this.toast.success('Successfully saved integration');
    } catch (ex: any) {
      if (ex instanceof Error) {
        console.log(ex.message);
      }
      this.toast.error(
        'There was an error saving, please make sure credentials are correct.'
      );
    }
  }
}
