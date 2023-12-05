import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NavMenuItem } from 'src/app/grubbrr/core/models/menu/navmenu.model';
import { NavMenuService } from 'src/app/grubbrr/service/nav-menu.service';
import { UserService } from 'src/app/grubbrr/service/user.service';
import { AuthenticationService } from 'src/app/shared/authentication.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  menu: NavMenuItem[];
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    public auth: AuthenticationService,
    private cdr: ChangeDetectorRef,
    public loader: NgxUiLoaderService,
    private userService: UserService,
    private navMenuService: NavMenuService
  ) {}

  ngOnInit(): void {
    this.pageInit();
    this.cdr.detectChanges();
  }

  private async pageInit() {
    const user = await this.userService.getUserMe();
    this.isAdmin = user.isAdmin;
    this.menu = this.navMenuService.getMenu(user.featureRoles);
  }

  calculateMenuItemCssClass(url: string): string {
    return checkIsActive(this.router.url, url) ? 'active' : '';
  }
}

const getCurrentUrl = (pathname: string): string => {
  return pathname.split(/[?#]/)[0];
};

const checkIsActive = (pathname: string, url: string) => {
  const current = getCurrentUrl(pathname);
  if (!current || !url) {
    return false;
  }

  if (current === url) {
    return true;
  }

  if (current.indexOf(url) > -1) {
    return true;
  }

  return false;
};
