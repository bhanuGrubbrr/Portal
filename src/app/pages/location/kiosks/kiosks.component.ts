import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { KioskVM, SyncVersionVM } from 'src/app/grubbrr/generated/kiosks_pb';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import {
  getKioskQRCode,
  getKiosks,
  RemoteSync,
} from 'src/app/grubbrr/service/kiosks.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { PageInfoService } from 'src/app/metronic/_metronic/layout';
import { AddKioskComponent } from '../modals/add-kiosk/add-kiosk.component';
import { DeleteKioskModalComponent } from '../modals/delete-kiosk-modal/delete-kiosk-modal.component';
import { KioskOnboardCodeComponent } from '../modals/kiosk-onboard-code/kiosk-onboard-code.component';
import { UnlinkKioskComponent } from '../modals/unlink-kiosk/unlink-kiosk.component';

@Component({
  selector: 'app-kiosks',
  templateUrl: './kiosks.component.html',
  styleUrls: ['./kiosks.component.scss'],
})
export class KiosksComponent implements OnInit, OnDestroy {
  kiosks: KioskVM[] = [];
  modalOptions: NgbModalOptions;
  locationId: string;
  @ViewChild('testDevicesFilter', { static: false })
  testDevicesFilterRef: ElementRef;
  pageTitle: string;
  private subscriptions: Subscription[] = [];
  showTestDevices = false;
  contentLoaded: boolean;
  syncVersion: SyncVersionVM;
  cols: { field: string; header: string }[] = [];
  syncing: boolean = false;
  refreshing: boolean = false;

  constructor(
    private locationSerice: LocationService,
    protected loader: NgxUiLoaderService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private pageService: PageInfoService,
    private route: ActivatedRoute,
    private breadCrumbService: BreadCrumbService,
    private toastrService: ToastrService
  ) {
    this.modalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
      scrollable: true,
    };
    this.showTestDevices = localStorage.getItem('kioskTestDevicesFilter')
      ? true
      : false;

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'deviceDetails?.serialNumber', header: 'Device' },
      { field: 'deviceDetails?.appVersion', header: 'App_Version' },
      { field: 'kiosk?.lastSync', header: 'Last_Sync' },
    ];
  }

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    await this.fetchKioskDevices();

    this.contentLoaded = true;
  }

  async fetchKioskDevices() {
    this.loader.start();
    this.refreshing = true;

    var kiosks = await getKiosks(this.locationId);
    this.kiosks = kiosks.kiosks.map((k) => {
      if (k.lastSync) {
        let configDate = new Date(Number(k.lastSync));

        k.lastSync = configDate.toLocaleDateString('en-us', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        });
      }
      return k;
    });

    setTimeout(() => {
      this.refreshing = false;
    }, 100);

    this.loader.stopAll();

    this.cdr.detectChanges();
  }

  openDeleteConfirmModal(kiosk: KioskVM): void {
    let params = {
      locationId: this.locationId,
      kiosk: kiosk,
    };

    const modalRef = this.modalService.open(
      DeleteKioskModalComponent,
      this.modalOptions
    );

    modalRef.componentInstance.fromParent = params;
    modalRef.result.then((kioskId: string) => {
      this.kiosks = this.kiosks.filter((k) => k.kioskId != kioskId);
      this.cdr.detectChanges();
    });
  }

  async openAddKioskDialog(): Promise<void> {
    const modalRef = this.modalService.open(
      AddKioskComponent,
      this.modalOptions
    );

    const params = {
      locationId: this.locationId,
    };

    modalRef.componentInstance.fromParent = params;

    modalRef.result.then((kiosk?: KioskVM) => {
      if (kiosk) {
        this.kiosks.push(kiosk);
        this.cdr.detectChanges();
      }
    });
  }

  async syncKiosks() {
    this.syncing = true;
    await RemoteSync(this.locationId);

    setTimeout(() => {
      this.syncing = false;
    }, 1);
  }

  async openUnlinkKiosk(kiosk: KioskVM): Promise<void> {
    const modalRef = this.modalService.open(
      UnlinkKioskComponent,
      this.modalOptions
    );

    const params = {
      locationId: this.locationId,
      kiosk,
    };

    modalRef.componentInstance.fromParent = params;

    modalRef.result.then(() => this.fetchKioskDevices());
  }

  async openKioskOTPDialog(kiosk: KioskVM): Promise<void> {
    var code = await getKioskQRCode(this.locationId, kiosk.kioskId);

    const modalRef = this.modalService.open(
      KioskOnboardCodeComponent,
      this.modalOptions
    );
    let params = {
      code: code.code,
      qr: code.qrCodeImage,
      locationId: this.locationId,
      kioskId: kiosk.kioskId,
    };

    modalRef.componentInstance.fromParent = params;
    modalRef.result.then(() => {
      this.fetchKioskDevices();
    });
  }

  applyFilter(filterValue: any) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.kiosks.filter((x) => {
      x.name = filterValue;
    });
  }

  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    this.pageTitle = 'Kiosk Devices';

    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId,
      this.pageTitle
    );

    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }

  clear(table: Table) {
    table.clear();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
