import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { PageEnum } from 'src/app/core/global-constants';
import { UserService } from 'src/app/grubbrr/service/user.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'default-page',
  template: '',
  styles: [],
})
export class DefaultComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private loader: NgxUiLoaderService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initPage();
  }

  private async initPage() {
    const user = await this.userService.getUserMe();

    if (user.isAdmin) {
      sessionStorage.setItem('badgeRole', 'Admin');
      this.router.navigate([PageEnum.AdminHome]);
      return;
    }

    sessionStorage.setItem('badgeRole', 'User');
    const defaultCompanyId =
      user.companyIds.length > 0 ? user.companyIds[0] : undefined;

    if (defaultCompanyId === undefined) {
      window.location.href = PageEnum.NoCompanyAccess;
      return;
    }

    this.router.navigate([`${PageEnum.CompanyHome}/${defaultCompanyId}`]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
