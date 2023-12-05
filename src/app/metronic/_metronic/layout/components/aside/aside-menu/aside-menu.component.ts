import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuTypeEnum } from 'src/app/core/global-constants';
import { environment } from '../../../../../../../environments/environment';
@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          '200ms',
          style({
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('200ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class AsideMenuComponent implements OnInit, OnDestroy {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  menuType: MenuTypeEnum;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .forEach((next) => {
        this.handleAsideMenu(next.url);
      });
  }

  private handleAsideMenu(currentUrl: string) {
    if (currentUrl.startsWith('/admin')) {
      this.menuType = MenuTypeEnum.Admin;
    } else if (currentUrl.startsWith('/location')) {
      this.menuType = MenuTypeEnum.Location;
    } else if (currentUrl.startsWith('/company')) {
      this.menuType = MenuTypeEnum.Customer;
    } else if (currentUrl.startsWith('/dashboard')) {
      this.menuType = MenuTypeEnum.Customer;
    } else {
      // if they are on the root of the site, show the "Company Menu"
      this.menuType = MenuTypeEnum.Customer;
    }
  }

  ngOnDestroy(): void {
    // get rid of obs
  }

  ngOnInit(): void {}

  get MenuTypeEnum() {
    return MenuTypeEnum;
  }
}
