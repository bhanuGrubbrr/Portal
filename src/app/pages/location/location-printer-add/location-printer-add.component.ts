import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PrinterSettingsModel } from 'src/app/grubbrr/core/models/printersettings.model';
import { LocationService } from 'src/app/grubbrr/service/location.service';

@Component({
  selector: 'app-location-printer-add',
  templateUrl: './location-printer-add.component.html',
  styleUrls: ['./location-printer-add.component.scss'],
})
export class LocationPrinterAddComponent implements OnInit, OnDestroy {
  addPrinterForm: FormGroup;
  locationId: string;
  pageTitle: string;
  printerId: string;
  saving: boolean = false;
  formReady: boolean = false;
  printerSettings: PrinterSettingsModel;
  subscriptions: Subscription[] = [];
  model: any = 'Epson TM88';

  constructor(
    public fb: FormBuilder,
    private locationService: LocationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    this.initForm();
    this.loadData();
  }

  loadData() {
    if (this.printerId) {
      this.addPrinterForm.addControl('id', new FormControl(this.printerId));
      this.subscriptions.push(
        this.locationService
          .getLocationPrinterSetting(this.locationId, this.printerId)
          .pipe(
            finalize(() => {
              this.loader.stop();
              this.formReady = true;
              this.addPrinterForm.patchValue(this.printerSettings);
              this.cdr.detectChanges();
            })
          )
          .subscribe((printer: PrinterSettingsModel) => {
            this.printerSettings = printer;
          })
      );
    } else {
      this.formReady = true;
    }
  }

  modelChanged(event: any) {
    if (event) {
      this.model = event;
    }
  }

  onSubmit(): void {
    this.saving = !this.saving;
    this.loader.start();

    const sb = this.locationService
      .upsertPrinterSettings(
        this.locationId,
        this.addPrinterForm.value.id,
        this.addPrinterForm.getRawValue()
      )
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
          var url = 'location/' + this.locationId + '/kiosk/printer';
          this.router.navigateByUrl(url);
        },
        (err) => {
          this.toastr.error('Unable to add printer at this time');
        }
      );

    this.subscriptions.push(sb);
  }

  initForm() {
    this.addPrinterForm = this.fb.group({
      locationId: this.fb.control(this.locationId),
      name: this.fb.control('', Validators.compose([Validators.required])),
      ipAddress: this.fb.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
          ),
        ])
      ),
      kitchenPrinter: this.fb.control(false),
      model: this.fb.control('', Validators.compose([Validators.required])),
      enabled: this.fb.control(true),
    });
  }

  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    this.printerId = this.route.snapshot.params.printerId;
    this.pageTitle = this.printerId ? 'Edit Printer' : 'Add Printer';
  }

  onCancel() {
    var url = 'location/' + this.locationId + '/kiosk/printer';
    this.router.navigateByUrl(url);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  get f() {
    return this.addPrinterForm.controls;
  }
}
