import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, finalize } from 'rxjs';
import { PrinterSettingsModel } from 'src/app/grubbrr/core/models/printersettings.model';
import { LocationService } from 'src/app/grubbrr/service/location.service';

@Component({
  selector: 'app-delete-printer-model',
  templateUrl: './delete-printer-model.component.html',
  styleUrls: ['./delete-printer-model.component.scss'],
})
export class DeletePrinterModelComponent implements OnInit {
  @Input() fromParent: any;
  locationId: string;
  printer: PrinterSettingsModel;
  subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    public locationService: LocationService,
    private loader: NgxUiLoaderService,
    private toastr: ToastrService
  ) {}

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    this.locationId = this.fromParent.locationId;
    this.printer = this.fromParent.printer;
  }

  async delete() {
    this.removePrinter();
  }

  async removePrinter() {
    if (this.printer.id != '') {
      this.loader.start();
      const sb = this.locationService
        .deletePrinterSettings(this.locationId, this.printer.id)
        .pipe(
          finalize(() => {
            this.loader.stop();
            this.activeModal.close(this.printer);

            // this.fetchPrinters();
          })
        )
        .subscribe(
          () => {},
          (err) => {
            this.toastr.error(
              'Unable to delete printer, please try again later'
            );
          }
        );

      this.subscriptions.push(sb);
    }
  }
}
