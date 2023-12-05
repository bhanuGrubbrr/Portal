import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { firstValueFrom, Observable, of } from 'rxjs';
import { FormFieldTypeModel } from 'src/app/grubbrr/core/models/formfieldtype.model';
import {
  PosIntegrationConfigVM,
  PosSyncIntegrationConfigVM,
} from 'src/app/grubbrr/generated/locations_pb';
import { PosType } from 'src/app/grubbrr/generated/system_pb';
import { LocationPosService } from 'src/app/grubbrr/service/location-pos.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { FormControlService } from 'src/app/grubbrr/shared/dynamic-form/form-control.service';
import { FormFieldBase } from 'src/app/grubbrr/shared/dynamic-form/formfield-base';
import { PosProxyOnboardCodeComponent } from '../../modals/pos-proxy-onboard-code/pos-proxy-onboard-code.component';
import { ChangePOSComponent } from '../modals/change-pos/change-pos.component';

@Component({
  selector: 'app-pos-setting',
  templateUrl: './pos-setting.component.html',
  styleUrls: ['./pos-setting.component.scss'],
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
export class PosSettingComponent implements OnInit {
  @Input() hasPOS = false;
  @ViewChild('posList', { static: false }) posList: ElementRef;
  @Output() posSelectedEvent = new EventEmitter<string>();
  @Output() disableSyncEvnt = new EventEmitter<boolean>();
  posForm: FormGroup;
  posTypes: PosType[];
  posSyncIntegrationSetting: PosSyncIntegrationConfigVM | undefined;
  posSetting?: PosIntegrationConfigVM;
  posIntegrationId: string;
  saving: boolean = false;
  formFieldTypeModels: FormFieldTypeModel[] = [];
  posType?: PosType;
  fields$: Observable<FormFieldBase<any>[]> | undefined;
  patchValues: { [key: string]: any };
  posName: string;
  showPosList = false;
  contentLoaded = false;
  savingSync: boolean;
  changePos = false;
  locationId: string;
  requiresPosProxy: boolean = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private locationPosService: LocationPosService,
    private loader: NgxUiLoaderService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private formService: FormControlService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.initForm();
    this.fetchPosSettings();
  }

  private async displayPosList() {
    this.showPosList = true;
    this.disableSyncEvnt.emit(false);
    this.cdr.detectChanges();
    this.contentLoaded = true;
  }

  private async fetchPosSettings() {
    var settings = await this.locationService.getLocationPosSettings(
      this.locationId
    );
    this.posTypes = settings.allowedDefinitions;
    this.posSyncIntegrationSetting = settings.posSyncIntegrationConfig;
    if (!this.hasPOS) {
      this.displayPosList();
    } else {
      this.posSetting = settings.config;
      if (this.posSetting) {
        this.hasPOS = true;
        this.showPosList = false;
        this.posIntegrationId = this.posSetting.posIntegrationId;
        this.patchValues = JSON.parse(this.posSetting.fields);
        this.contentLoaded = true;
        this.displayPosSettingsForm(this.posSetting.posIntegrationId);
        this.cdr.detectChanges();
      } else {
        this.displayPosList();
      }
    }
  }

  private async displayPosSettingsForm(posIntegrationId: string) {
    this.fields$ = undefined; // reset observable
    this.showPosList = false;
    this.posType = this.posTypes.find(
      (i) => i.posIntegrationId == posIntegrationId
    );
    const fields: FormFieldBase<string>[] = [];
    if (this.posType) {
      this.posName = this.posType.displayName;
      this.posIntegrationId = this.posType.posIntegrationId;

      this.requiresPosProxy = !this.posType.isCloudIntegration;

      Object.entries(JSON.parse(this.posType.fields)).forEach(
        ([key, setting]) => {
          fields.push(
            this.formService.getNewField(setting as FormFieldTypeModel, key, 1)
          );
        }
      );
    }

    this.fields$ = of(fields.sort((a, b) => a.order - b.order));

    this.cdr.detectChanges();
  }

  async onSettingsSubmit(formPayload: any) {
    this.loader.start();

    let IntegrationConfig = {} as PosIntegrationConfigVM;
    IntegrationConfig.fields = formPayload;
    IntegrationConfig.posIntegrationId = this.posIntegrationId;
    IntegrationConfig.id = this.posSetting?.id ?? '';
    try {
      await this.locationService.updateLocationPos(
        this.locationId,
        IntegrationConfig
      );
      this.toast.success('Pos settings saved');
    } catch (ex: any) {
      this.toast.error('There was an issue updating the POS setting.');
    }

    this.cdr.detectChanges();
    this.loader.stop();
    this.hasPOS = true;
    this.posSelectedEvent.emit(this.posIntegrationId);
  }

  async openPosProxyAgentOnBoard(): Promise<void> {
    const modalRef = this.modalService.open(PosProxyOnboardCodeComponent);

    const params = {
      locationId: this.locationId,
    };

    modalRef.componentInstance.fromParent = params;

    await modalRef.result;
  }

  async syncProxy() {
    await this.locationService.proxyRemoteSync(this.locationId);
  }

  async onSync() {
    this.loader.start();
    this.savingSync = true;

    var result = await firstValueFrom(
      this.locationPosService.syncPosMenu(this.locationId)
    );
    this.cdr.detectChanges();
    this.loader.stop();
    this.savingSync = false;

    if (result) {
      this.toast.info('Menu Sync Successfully Queued');
    } else {
      this.toast.success(
        'Unable to Menu Sync at this time. Please try again later.'
      );
    }
  }

  posSelected(posIntegrationId: string): void {
    this.posIntegrationId = posIntegrationId;
    this.displayPosSettingsForm(posIntegrationId);
  }

  openChangePosModal(posName: string) {
    this.changePos = true;

    let params = {
      posName: `${posName}`,
    };

    const modalRef = this.modalService.open(ChangePOSComponent, {
      scrollable: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.fromParent = params;
    modalRef.result.then(
      (result: any) => {
        this.changePos = false;
        if (result === 'clear') {
          this.displayPosList();
          this.patchValues = [];
          this.posSyncIntegrationSetting = undefined;
        }
        this.cdr.detectChanges();
      },
      (reason: any) => {
        this.changePos = false;
        this.cdr.detectChanges();
      }
    );
  }

  initForm() {
    this.posForm = this.fb.group({
      pos: ['', [Validators.required]],
    });
  }
}
