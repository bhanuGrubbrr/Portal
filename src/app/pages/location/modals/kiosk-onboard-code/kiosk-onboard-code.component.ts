import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  getKioskQRCode,
  unlinkKiosk,
} from 'src/app/grubbrr/service/kiosks.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';

@Component({
  selector: 'app-kiosk-onboard-code',
  templateUrl: './kiosk-onboard-code.component.html',
  styleUrls: ['./kiosk-onboard-code.component.scss'],
})
export class KioskOnboardCodeComponent implements OnInit {
  @Input() fromParent: any;
  code: string;
  qr: string;
  locationId: string;
  kioskId: string;

  constructor(
    public activeModal: NgbActiveModal,
    public sanitizer: DomSanitizer,
    private locationSerice: LocationService
  ) {}

  ngOnInit(): void {
    this.code = this.fromParent.code;
    this.qr = this.formatQr(this.fromParent.qr);
    this.locationId = this.fromParent.locationId;
    this.kioskId = this.fromParent.kioskId;
  }

  closeModal() {
    this.activeModal.close();
  }

  formatQr(base64String: string): string {
    return 'data:image/png;base64, ' + base64String;
  }

  async refreshToken(): Promise<void> {
    var result = await getKioskQRCode(this.locationId, this.kioskId);
    this.code = result.code;
    this.qr = this.formatQr(result.qrCodeImage);
  }

  async relink(): Promise<void> {
    await unlinkKiosk(this.locationId, this.kioskId);
    var result = await getKioskQRCode(this.locationId, this.kioskId);
    this.code = result.code;
    this.qr = this.formatQr(result.qrCodeImage);
  }
}
