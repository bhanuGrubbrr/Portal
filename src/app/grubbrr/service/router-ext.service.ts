import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class RouterExtService implements OnDestroy {
  private previousUrl: string | undefined = undefined;
  private currentUrl: string | undefined = undefined;
  subscriptions: Subscription[] = [];

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    this.subscriptions.push(
      router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.previousUrl = this.currentUrl;
            this.currentUrl = event.url;
          }
        })
    );
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }

  public getCurrentUrl() {
    return this.currentUrl;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
