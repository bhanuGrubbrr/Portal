import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilService } from 'src/app/grubbrr/service/utils.service';
import { AuthenticationService } from '../../../../../shared/authentication.service';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';
  locationId: string = '';
  showLocationSyncButton: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private layout: LayoutService,
    private utilService: UtilService,
    public auth: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.initPage();
    this.headerLeft = this.layout.getProp('header.left') as string;
  }

  private async initPage() {
    await this.grubbrrRoutingChanges();
  }

  async grubbrrRoutingChanges() {
    this.subscriptions.push(
      this.utilService.GrubbrrRouteParams$.subscribe(async (routeParams) => {
        if (routeParams && routeParams?.locationId) {
          this.locationId = routeParams?.locationId ?? '';
          this.showLocationSyncButton = true;
          this.cdr.detectChanges();
        } else {
          this.showLocationSyncButton = false;
          this.cdr.detectChanges();
        }
      })
    );
  }
}
