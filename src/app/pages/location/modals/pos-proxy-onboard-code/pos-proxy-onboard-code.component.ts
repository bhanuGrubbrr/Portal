import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LocationPosService } from 'src/app/grubbrr/service/location-pos.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-pos-proxy-onboard-code',
  templateUrl: './pos-proxy-onboard-code.component.html',
  styleUrls: ['./pos-proxy-onboard-code.component.scss'],
})
export class PosProxyOnboardCodeComponent implements OnInit {
  @Input() fromParent: any;
  code: string;
  locationId: string;

  constructor(
    public activeModal: NgbActiveModal,
    public sanitizer: DomSanitizer,
    private locationPosService: LocationPosService
  ) {}

  ngOnInit(): void {
    this.locationId = this.fromParent.locationId;
    this.refreshToken();
  }

  closeModal() {
    this.activeModal.close();
  }

  async refreshToken(): Promise<void> {
    var result = await firstValueFrom(
      this.locationPosService.getPosProxyOnboardCode(this.locationId)
    );
    this.code = result.code;
  }
}
