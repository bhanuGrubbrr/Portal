import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEnum, FeatureRoles } from 'src/app/core/global-constants';
import { NavMenuItem } from '../core/models/menu/navmenu.model';

export const MENUADMIN: NavMenuItem[] = [
  {
    id: 1,
    //label: 'MENUITEMS.MENU.TEXT', Using translated strings
    label: 'Admin',
    isTitle: true,
    link: PageEnum.AdminHome,
    roles: ['Admin'],
  },
];

@Injectable({ providedIn: 'root' })
export class NavMenuService {
  constructor(private http: HttpClient) {}

  isIn(roles: FeatureRoles[], s: NavMenuItem) {
    let isIn = false;
    roles.forEach((k) => {
      if (!s.roles) {
        return;
      }
      if (s.roles.indexOf(k?.permission) !== -1) {
        isIn = true;
        return;
      }
    });
    return isIn;
  }

  getMenu(roles: Array<FeatureRoles>): Array<NavMenuItem> {
    return MENUADMIN.map((m) => {
      let n = { ...m };
      if (m.subItems) {
        n.subItems = m.subItems.filter((s) => this.isIn(roles, s));
      }

      return n;
    }).filter((m) => this.isIn(roles, m));
  }
}
