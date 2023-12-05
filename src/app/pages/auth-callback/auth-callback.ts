import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'auth-callback',
  template: '<div>Loading...</div>',
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class AuthCallback implements OnInit {
  constructor(private oauthService: OAuthService, private router: Router) {}

  ngOnInit() {
    this.initPage();
  }

  private async initPage() {
    this.oauthService.events
      .pipe(filter((e) => e.type === 'token_received'))
      .subscribe((_) => {
        if (!this.oauthService.state) {
          this.router.navigate(['/']);
          return;
        }
        let stateUrl = this.oauthService.state;
        stateUrl = decodeURIComponent(stateUrl);
        this.router.navigateByUrl(stateUrl);
      });
  }
}
