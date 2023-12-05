import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-logout',
  template: `
    <div class="card shadow-sm d-flex align-items-center">
      <div class="card-header">
        <h3 class="card-title">Logging you in, please wait ...</h3>
        <div class="card-toolbar"></div>
      </div>
      <div class="card-body">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class LogoutComponent {
  constructor(private auth: AuthenticationService, private router: Router) {
    sessionStorage.removeItem('badgeRole');
    this.auth.logout();
    window.location.href = `${environment.auth0Issuer}v2/logout?client_id=${environment.auth0ClientId}&returnTo=${environment.auth0ReturnUrl}`;
  }

  login(): void {
    this.router.navigate(['/']);
    document.location.reload();
  }
}
