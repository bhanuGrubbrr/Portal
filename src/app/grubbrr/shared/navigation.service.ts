import { Location } from '@angular/common';
import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService implements OnDestroy {
  private history: string[] = [];
  subscriptions: Subscription[] = [];

  constructor(private router: Router, private location: Location) {
    this.subscriptions.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.history.push(event.urlAfterRedirects);
        }
      })
    );
  }

  back(backURL = ''): void {
    if (backURL) {
      this.router.navigateByUrl(backURL);
    } else if (this.history.length > 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
