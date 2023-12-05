import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const retryAttempts = environment.retryAttempts;

@Injectable({ providedIn: 'root' })
export class ErrorIntercept implements HttpInterceptor {
  constructor(
    private toast: ToastrService,
    private router: Router,
    private loader: NgxUiLoaderService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(retryAttempts),
      catchError((error: HttpErrorResponse) => {
        console.log('intercept', error);
        console.log('error message', error?.error?.Message);
        let errorMessage =
          'There was an issue processing your request. Please try again later.';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = error.error.message;
        }

        if (error?.error?.Message) {
          // server-side error
          errorMessage = error?.error?.Message;

          if (error.error.errors) {
            // server-side validation error
            errorMessage += `\n${Object.values(error.error.errors).join('\n')}`;
          }

          const errorStatus = error?.status;
          this.loader.stopAll();

          if (errorStatus) {
            switch (errorStatus) {
              case 401:
                this.router.navigateByUrl('/welcome');
                break;

              case 403:
                this.router.navigateByUrl('/error/403');
                break;
            }
          }
        }

        this.toast.error(errorMessage);

        console.log('%c%s 🐛', 'color:red; font-size:14px', errorMessage);
        return throwError(errorMessage);
      })
    );
  }
}
