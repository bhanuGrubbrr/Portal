import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserService } from 'src/app/grubbrr/service/user.service';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { TranslationService } from '../../../../../../modules/i18n';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @ViewChild('darkMode', { read: ElementRef, static: false })
  darkMode: ElementRef;

  language: LanguageFlag;
  langs = languages;
  private unsubscribe: Subscription[] = [];

  constructor(
    public auth: AuthenticationService,
    private translationService: TranslationService,
    private router: Router,
    private loader: NgxUiLoaderService,
    private userService: UserService,
    private toastr: ToastrService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.setLanguage(this.translationService.getSelectedLanguage());
  }

  toggleDarkMode() {}

  changePassword() {
    this.loader.start();

    this.unsubscribe.push(
      this.userService
        .resetPassword(this.location.path())
        .pipe(
          finalize(() => {
            this.loader.stop();
          })
        )
        .subscribe(
          (result: Boolean) => {
            if (result) {
              this.toastr.success(
                'Password reset email has been sent, please check your inbox'
              );
            } else {
              this.toastr.warning(
                'Unable to reset password for email provided. Please try again later'
              );
            }
          },
          (error) => {
            this.loader.stop();
            this.toastr.error(error.error.message);
          }
        )
    );
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'zh',
    name: 'Mandarin',
    flag: './assets/media/flags/china.svg',
  },
  {
    lang: 'es',
    name: 'Spanish',
    flag: './assets/media/flags/spain.svg',
  },
  {
    lang: 'ja',
    name: 'Japanese',
    flag: './assets/media/flags/japan.svg',
  },
  {
    lang: 'de',
    name: 'German',
    flag: './assets/media/flags/germany.svg',
  },
  {
    lang: 'fr',
    name: 'French',
    flag: './assets/media/flags/france.svg',
  },
];
