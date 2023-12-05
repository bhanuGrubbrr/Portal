import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { unlinkKiosk } from 'src/app/grubbrr/service/kiosks.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';

@Component({
  selector: 'app-unlink-kiosk',
  templateUrl: './unlink-kiosk.component.html',
  styleUrls: ['./unlink-kiosk.component.scss'],
})
export class UnlinkKioskComponent implements OnInit {
  @Input() fromParent: any;
  kioskId: string;
  locationId: string;

  constructor(
    public activeModal: NgbActiveModal,
    private locationSerice: LocationService
  ) {}

  ngOnInit(): void {
    this.locationId = this.fromParent.locationId;
    this.kioskId = this.fromParent.kiosk.kioskId;
  }

  async confirm(): Promise<void> {
    await unlinkKiosk(this.locationId, this.kioskId);
    this.activeModal.close();
  }
}
