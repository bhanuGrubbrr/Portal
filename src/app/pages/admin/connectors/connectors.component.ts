import { SystemService } from 'src/app/grubbrr/service/system.service';
import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PosTypeModel } from 'src/app/grubbrr/core/models/postype.model';
import {
  NgbModal,
  NgbModalOptions,
  NgbPanelChangeEvent,
} from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PosService } from 'src/app/grubbrr/service/pos.service';
import { ConnectorEditModalComponent } from '../modals/connector-edit-modal/connector-edit-modal.component';
import { ConnectorRemoveModalComponent } from '../modals/connector-remove-modal/connector-remove-modal.component';
import { ConnectorStatusComponent } from '../modals/connector-status/connector-status.component';

import {
  PosSyncMetaRecordVM,
  PosSyncTypeVM,
} from 'src/app/grubbrr/generated/system_pb';
import { SyncPosModalComponent } from '../modals/sync-pos-modal/sync-pos-modal.component';

@Component({
  selector: 'app-connectors',
  templateUrl: './connectors.component.html',
  styleUrls: ['./connectors.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ConnectorsComponent implements OnInit {
  gridData: any[] = [];
  posSyncData: PosSyncTypeVM[] = [];
  subscriptions: Subscription[] = [];
  contentLoaded = false;

  largeModalOptions: NgbModalOptions;
  removeModalOptions: NgbModalOptions;

  constructor(
    private cdr: ChangeDetectorRef,
    public loader: NgxUiLoaderService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private posService: PosService,
    private systemService: SystemService
  ) {
    this.largeModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'xl',
      scrollable: true,
    };

    this.removeModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
      scrollable: false,
      centered: true,
    };
  }

  ngOnInit(): void {
    this.FetchConnectors();
    this.FetchPosSyncData();
  }

  public FetchConnectors() {
    this.subscriptions.push(
      this.posService
        .getPosIntegrationDefinitions()
        .pipe(
          finalize(() => {
            this.contentLoaded = true;
            this.cdr.detectChanges();
          })
        )
        .subscribe((connectors: any[]) => {
          this.gridData = connectors;
        })
    );
  }

  async FetchPosSyncData() {
    try {
      var result =
        (await this.systemService.getPosSyncMetaRecordAsync()) as PosSyncMetaRecordVM;
      this.posSyncData = result?.posSyncType;
      console.log(result?.posSyncType);
      console.log(this.posSyncData);
    } catch (ex: any) {}

    this.cdr.detectChanges();
  }

  public SyncPOS(connector?: any) {
    const modalRef = this.modalService.open(
      SyncPosModalComponent,
      this.largeModalOptions
    );

    const syncRow =
      connector !== undefined
        ? this.posSyncData.filter((x) => x.id === connector.id)[0]
        : undefined;
    modalRef.componentInstance.fromParent = {
      connector,
      syncRow,
      connectorIds: this.gridData.map((x) => x.id),
    };

    modalRef.result.then(
      (ret: any) => {
        this.FetchConnectors();
        this.FetchPosSyncData();
      },
      (reason: any) => {}
    );
  }

  public AddOrUpdateConnector(connector?: any) {
    const modalRef = this.modalService.open(
      ConnectorEditModalComponent,
      this.largeModalOptions
    );

    const syncRow =
      connector !== undefined
        ? this.posSyncData.filter((x) => x.id === connector.id)[0]
        : undefined;
    modalRef.componentInstance.fromParent = {
      connector,
      syncRow,
      connectorIds: this.gridData.map((x) => x.id),
    };

    modalRef.result.then(
      (ret: any) => {
        this.FetchConnectors();
      },
      (reason: any) => {}
    );
  }

  public viewStatus() {
    this.modalService.open(ConnectorStatusComponent, this.largeModalOptions);
  }

  public RemoveConnector(connector: PosTypeModel) {
    const modalRef = this.modalService.open(
      ConnectorRemoveModalComponent,
      this.removeModalOptions
    );

    modalRef.componentInstance.fromParent = {
      connector,
    };

    modalRef.result.then(
      (ret: any) => {
        this.FetchConnectors();
      },
      (reason: any) => {}
    );
  }

  fromCamelCase(str: string): string {
    if (!str || (str && str.length == 0)) return '';

    const matches = str.match(/^[a-z]+|[A-Z][a-z]*/g);

    if (!matches) return str.replace(/./, (c) => c.toUpperCase());

    return matches
      .map(function (x) {
        return x[0].toUpperCase() + x.substring(1).toLowerCase();
      })
      .join(' ');
  }
}
