import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-aside-menu',
  templateUrl: './admin-aside-menu.component.html',
  styleUrls: ['./admin-aside-menu.component.scss'],
})
export class AdminAsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;

  constructor() {}

  ngOnInit(): void {}
}
