import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PopupPlacement } from 'src/app/core/global-constants';
import { PrinterSettingsModel } from 'src/app/grubbrr/core/models/printersettings.model';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { PageLink } from 'src/app/metronic/_metronic/layout';
import { DeletePrinterModelComponent } from '../modals/delete-printer-model/delete-printer-model.component';

@Component({
  selector: 'app-location-printer-settings',
  templateUrl: './location-printer-settings.component.html',
  styleUrls: ['./location-printer-settings.component.scss'],
})
export class LocationPrinterSettingsComponent implements OnInit, OnDestroy {
  modalReference: any;
  saving: boolean = false;
  addPrinterForm: FormGroup;
  subscriptions: Subscription[] = [];
  allPrinters: any;
  locationId: string;
  pageTitle: string;
  deleteId: string;
  url: string;
  printerName: string;
  breadCrumbs: Array<PageLink> = [];
  modalOptions: NgbModalOptions;
  contentLoaded: boolean;
  cols: { field: string; header: string }[] = [];

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    public fb: FormBuilder,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'model', header: 'Model' },
      { field: 'ipAddress', header: 'Ip Address' },
      { field: 'kitchenPrinter', header: 'Backup Printer' },
    ];
  }

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    await this.fetchPrinters();
    this.contentLoaded = true;
  }

  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    this.pageTitle = 'Printer Devices';
  }

  fetchPrinters() {
    this.loader.start();
    this.subscriptions.push(
      this.locationService
        .getPrinterSettings(this.locationId)
        .pipe(
          finalize(() => {
            this.loader.stop();
            this.saving = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe(
          (result) => {
            this.saving = false;

            this.allPrinters = result;
          },
          (err) => {
            this.toastr.error('Unable to fetch printers');
          }
        )
    );
  }

  // onKitchenPrinterChanged(printer: PrinterSettingsModel, updatedVal: boolean) {
  //   printer.kitchenPrinter = updatedVal;
  //   this.onPrinterChanged(printer);
  // }

  onPrinterStatusChange(printer: PrinterSettingsModel, updatedVal: boolean) {
    printer.enabled = updatedVal;
    this.onPrinterChanged(printer);
  }

  onPrinterChanged(printer: PrinterSettingsModel) {
    this.loader.start();
    const sb = this.locationService
      .upsertPrinterSettings(this.locationId, printer.id, printer)
      .pipe(
        finalize(() => {
          this.loader.stop();
          this.cdr.detectChanges();
          this.saving = false;
        })
      )
      .subscribe(
        () => {
          this.saving = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Printer Updated',
            key: PopupPlacement.TopCenter,
          });
        },
        (err) => {
          this.toastr.error('Unable to update printer at this time');
        }
      );
  }

  onDelete(printer: PrinterSettingsModel): void {
    let params = {
      locationId: this.locationId,
      printer: printer,
    };

    const modalRef = this.modalService.open(
      DeletePrinterModelComponent,
      this.modalOptions
    );

    modalRef.componentInstance.fromParent = params;
    modalRef.result.then((returnPrinter: any) => {
      this.allPrinters = this.allPrinters.filter(
        (k: any) => k.id != returnPrinter.id
      );
      this.cdr.detectChanges();
    });
  }

  closeModal(message: string) {
    this.activeModal.close();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
