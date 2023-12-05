import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { KioskModel } from 'src/app/grubbrr/core/models/kiosks.model';
import { removeKiosk } from 'src/app/grubbrr/service/kiosks.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';

@Component({
  selector: 'app-delete-kiosk-modal',
  templateUrl: './delete-kiosk-modal.component.html',
  styleUrls: ['./delete-kiosk-modal.component.scss'],
})
export class DeleteKioskModalComponent implements OnInit {
  @Input() fromParent: any;
  locationId: string;
  kiosk: KioskModel;

  constructor(
    public activeModal: NgbActiveModal,
    public locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.locationId = this.fromParent.locationId;
    this.kiosk = this.fromParent.kiosk;
  }

  async delete() {
    await removeKiosk(this.locationId, this.kiosk.kioskId);
    this.activeModal.close(this.kiosk.kioskId);
  }
}
