import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  PosSyncIntegrationConfigVM,
  PosIntegrationConfigVM,
} from 'src/app/grubbrr/generated/locations_pb';
import { LocationService } from 'src/app/grubbrr/service/location.service';

@Component({
  selector: 'app-pos-sync-setting',
  templateUrl: './pos-sync-setting.component.html',
  styleUrls: ['./pos-sync-setting.component.scss'],
})
export class PosSyncSettingComponent implements OnInit {
  @Input() hasPosSyncEnabled = false;
  posSyncForm: FormGroup;
  locationId: string;
  saving: boolean = false;
  posIntegrationId: string = '';
  posSetting?: PosIntegrationConfigVM;
  @Input() posSettings: any;
  constructor(
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
  }

  initForm(values: any) {
    let kioskPushSetting = values?.kioskPushSetting;
    let posSyncSetting = values?.posSyncSetting;

    let updateValue;
    if (kioskPushSetting?.kioskNoUpdate) {
      updateValue = 'kioskNoUpdate';
    } else if (kioskPushSetting.kioskPriceUpdate) {
      updateValue = 'kioskPriceUpdate';
    } else if (kioskPushSetting.kioskFullMenuUpdate) {
      updateValue = 'kioskFullMenuUpdate';
    }
    this.posSyncForm = this.fb.group({
      menuItemOverrides: this.fb.control(posSyncSetting.menuItemOverrides),
      menuCategoryOverrides: this.fb.control(
        posSyncSetting.menuCategoryOverrides
      ),
      modifierGroupOverrides: this.fb.control(
        posSyncSetting.modifierGroupOverrides
      ),
      modifierOverrides: this.fb.control(posSyncSetting.modifierOverrides),
      updates: this.fb.control(updateValue),
    });
    this.cdr.detectChanges();
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnChanges() {
    this.fetchPosSettings();
  }

  private async fetchPosSettings() {
    var settings = this.posSettings;
    const posTypes = settings.allowedDefinitions;
    this.posSetting = settings.config;
    this.posIntegrationId = settings?.config?.posIntegrationId
      ? settings.config.posIntegrationId
      : '';
    const posType = posTypes.find(
      (pos: any) => pos.posIntegrationId == this.posIntegrationId
    );
    const posSyncMetaRecord =
      settings.posSyncMetaRecordConfig.find(
        (x: any) => x.posIntegrationId == this.posIntegrationId
      ) || undefined;

    if (settings?.posSyncIntegrationConfig.posIntegrationId !== '') {
      this.initForm(settings?.posSyncIntegrationConfig);
    } else if (posSyncMetaRecord != undefined) {
      const syncDefaultData = {
        posSyncSetting: JSON.parse(posSyncMetaRecord.posSyncSetting),
        kioskPushSetting: JSON.parse(posSyncMetaRecord.kioskPushSetting),
      };
      this.initForm(syncDefaultData);
    }
  }

  async onSubmit() {
    this.saving = true;
    this.loader.start();
    let integrationConfig = {} as PosIntegrationConfigVM;
    let posSyncSettingConfig = {} as PosSyncIntegrationConfigVM;
    let posSyncIntSetting: any = {
      posIntegrationId: this.posIntegrationId,
      kioskPushSetting: {},
      posSyncSetting: { ...this.posSyncForm.value },
    };

    posSyncIntSetting.kioskPushSetting.kioskNoUpdate = false;
    posSyncIntSetting.kioskPushSetting.kioskPriceUpdate = false;
    posSyncIntSetting.kioskPushSetting.kioskFullMenuUpdate = false;
    if (posSyncIntSetting.posSyncSetting.updates) {
      posSyncIntSetting.kioskPushSetting[
        posSyncIntSetting.posSyncSetting.updates
      ] = true;
    }
    delete posSyncIntSetting.posSyncSetting.updates;
    posSyncSettingConfig = posSyncIntSetting;
    try {
      await this.locationService.updatePosSyncSetting(
        this.locationId,
        posSyncSettingConfig
      );
      this.toast.success('Pos Sync settings saved');
    } catch (ex: any) {
      console.error(ex);
      this.toast.error('There was an issue updating the POS Sync setting.');
    }
    this.saving = false;
    this.loader.stop();
  }
}
