import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserService } from 'src/app/grubbrr/service/user.service';
import { UtilService } from 'src/app/grubbrr/service/utils.service';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-company-aside-menu',
  templateUrl: './company-aside-menu.component.html',
  styleUrls: ['./company-aside-menu.component.scss'],
})
export class CompanyAsideMenuComponent implements OnInit, OnDestroy {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  public companyId: string;
  private subscriptions: Subscription[] = [];

  constructor(
    public auth: AuthenticationService,
    private utilService: UtilService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.grubbrrRoutingChanges();
  }

  grubbrrRoutingChanges() {
    this.subscriptions.push(
      this.utilService.GrubbrrRouteParams$.pipe(take(1)).subscribe(
        (routeParams) => {
          this.companyId = routeParams?.companyId ?? '';

          if (!this.companyId) this.tryGetUserCompanyId();
        }
      )
    );
  }

  private async tryGetUserCompanyId() {
    const user = await this.userService.getUserMe();
    if (user && user.companyIds.length > 0) this.companyId = user.companyIds[0];
    else {
      this.router.navigateByUrl('/error/403');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
