import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TenderOptionVM } from 'src/app/grubbrr/generated/common_pb';
import { TipSettingsVM, TipVM } from 'src/app/grubbrr/generated/kioskConfig_pb';
import { KioskConfigService } from 'src/app/grubbrr/service/kioskConfig.service';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss'],
})
export class TipsComponent implements OnInit {
  constructor(
    private kioskConfigService: KioskConfigService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService
  ) {}

  private locationId: string;
  public TipForm: FormGroup;
  public TipSettings: TipSettingsVM;
  public GratuityTenders: TenderOptionVM[];

  public loaded: boolean = false;

  public TipsEnabled: Boolean = false;
  public DefaultEnabled: Boolean = false;

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.FetchData();
  }
  toggleDefaultSelected() {
    this.TipSettings.tips.forEach((x) => (x.isDefault = false));
  }
  toggleTipDefault(index: number) {
    this.DefaultEnabled = true;
    if (this.TipSettings.tips[index].isDefault) return;
    this.TipSettings.tips.forEach(
      (x, i) => (x.isDefault = i === index ? true : false)
    );
  }
  async FetchData() {
    const [tipSettings, gratuityTenders] = await Promise.all([
      this.kioskConfigService.getTipSettings(this.locationId),
      this.kioskConfigService.getGratuityTenders(this.locationId),
    ]);

    this.TipSettings = tipSettings;
    this.TipsEnabled = this.TipSettings.enableTips;
    this.DefaultEnabled = this.TipSettings?.tips.some((x) => x.isDefault);
    this.GratuityTenders = gratuityTenders.gratuityTenders;

    this.InitalizeForm();
    this.loaded = true;
  }

  private InitalizeForm() {
    this.TipForm = this.fb.group({
      enableTips: [this.TipSettings.enableTips],
      showCalculatedTip: this.fb.control({
        value: this.TipSettings.showCalculatedTip,
        disabled: !this.TipSettings.enableTips,
      }),
      tips: this.fb.group({
        tip1: this.fb.control({
          value: this.TipSettings?.tips[0]?.value,
          disabled: !this.TipSettings.enableTips,
        }),
        tip2: this.fb.control({
          value: this.TipSettings?.tips[1]?.value,
          disabled: !this.TipSettings.enableTips,
        }),
        tip3: this.fb.control({
          value: this.TipSettings?.tips[2]?.value,
          disabled: !this.TipSettings.enableTips,
        }),
      }),
      customTipEnabled: this.fb.control({
        value: this.TipSettings.customTipEnabled,
        disabled: !this.TipSettings.enableTips,
      }),
      tender: this.fb.control({
        value: this.TipSettings.tender,
        disabled: !this.TipSettings.enableTips,
      }),
    });
  }
  public TipToggle() {
    this.TipsEnabled = !this.TipsEnabled;
    if (this.TipsEnabled) {
      this.TipForm.controls['showCalculatedTip'].enable();
      this.TipForm.controls['customTipEnabled'].enable();
      this.TipForm.controls['tender'].enable();
      this.TipForm.get('tips')?.enable();
    } else {
      this.TipForm.controls['showCalculatedTip'].disable();
      this.TipForm.controls['customTipEnabled'].disable();
      this.TipForm.controls['tender'].disable();
      this.TipForm.get('tips')?.disable();
    }
    this.TipForm.get('enableTips')?.patchValue(this.TipsEnabled);
  }
  async save() {
    let controls = (this.TipForm.get('tips') as FormArray).controls;
    let TipUpsertCandidate: Array<TipVM> = [];
    let controlsArray = Object.entries(controls);
    for (let i = 0; i < controlsArray.length; i++) {
      if (controlsArray[i][1].value && controlsArray[i][1].value > 0) {
        TipUpsertCandidate.push({
          value: controlsArray[i][1].value,
          isDefault: this.TipSettings.tips[i].isDefault,
        } as TipVM);
      }
    }

    try {
      let TipFormValue = this.TipForm.getRawValue() as TipSettingsVM;
      TipFormValue.tips = TipUpsertCandidate;
      await this.kioskConfigService.upsertTipSettings(
        this.locationId,
        TipFormValue
      );
      this.toast.success('Successfully updated tip settings');
    } catch (ex: any) {
      this.toast.error('There was an issue updating tip settings.', ex);
    }
  }
}
