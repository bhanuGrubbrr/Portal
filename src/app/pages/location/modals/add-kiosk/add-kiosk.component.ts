import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { addKiosk } from 'src/app/grubbrr/service/kiosks.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-kiosk',
  templateUrl: './add-kiosk.component.html',
  styleUrls: ['./add-kiosk.component.scss'],
})
export class AddKioskComponent implements OnInit {
  @Input() fromParent: any;
  locationId: string;

  addKioskForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private locationSerice: LocationService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.locationId = this.fromParent.locationId;

    this.addKioskForm = this.fb.group({
      kioskName: this.fb.control(''),
    });

    this.cdr.detectChanges();
  }

  closeModal() {
    this.activeModal.close();
  }

  async addKiosk(): Promise<void> {
    var kioskName = this.addKioskForm.get('kioskName')?.value;

    if (kioskName === '') {
      this.toastr.error('Please enter a kiosk name.');
      return;
    }

    var kiosk = await addKiosk(this.locationId, kioskName);

    this.activeModal.close(kiosk);
  }
}
