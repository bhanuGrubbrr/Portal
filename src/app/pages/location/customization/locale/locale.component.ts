import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  CurrencyVM,
  LocaleVM,
  LocalizationVM,
} from 'src/app/grubbrr/generated/kioskConfig_pb';
import {
  CurrencyOptionVM,
  LocaleOptionVM,
} from 'src/app/grubbrr/generated/system_pb';
import { KioskConfigService } from 'src/app/grubbrr/service/kioskConfig.service';
import { SystemService } from 'src/app/grubbrr/service/system.service';
@Component({
  selector: 'app-locale',
  templateUrl: './locale.component.html',
  styleUrls: ['./locale.component.scss'],
})
export class LocaleComponent implements OnInit {
  locationId: string;
  intlRegionNames: Intl.DisplayNames;
  intlLanguageNames: Intl.DisplayNames;
  Loaded: boolean = false;
  LocaleForm: FormGroup;

  Localization: LocalizationVM;

  CurrentCurrency: CurrencyVM;
  CurrentLocale: LocaleVM;

  currencyOptions: CurrencyOptionVM[] = [];
  localeOptions: LocaleOptionVM[] = [];

  constructor(
    private kioskConfigService: KioskConfigService,
    private systemService: SystemService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toast: ToastrService,
    private loader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.intlRegionNames = new Intl.DisplayNames([], { type: 'region' });
    this.intlLanguageNames = new Intl.DisplayNames([], { type: 'language' });

    this.FetchData();
  }

  private async FetchData() {
    this.loader.start();

    this.Localization = await this.kioskConfigService.getLocalization(
      this.locationId
    );
    this.CurrentCurrency = this.Localization.currency ?? ({} as CurrencyVM);
    this.CurrentLocale = this.Localization.locale ?? ({} as LocaleVM);

    const currencyOptions = await this.systemService.getCurrencyOptions();
    const localeOptions = await this.systemService.getLocaleOptions();
    this.currencyOptions = currencyOptions.currencyOptions;
    this.localeOptions = localeOptions.localeOptions;

    this.InitializeForm();
    this.loader.stop();
    this.Loaded = true;
  }

  private InitializeForm(): void {
    this.LocaleForm = this.fb.group({
      currency: this.fb.group({
        code: [this.CurrentCurrency.code.toUpperCase(), [Validators.required]],
        divisor: [this.CurrentCurrency.divisor],
      }),
      enabledLanguages: [this.Localization.enabledLanguages],
      locale: this.fb.group({
        code: [this.CurrentLocale.code, [Validators.required]],
      }),
    });
  }

  public async save() {
    let FormData = this.LocaleForm.getRawValue();
    this.loader.start();
    let UpsertCandidate = FormData as LocalizationVM;

    const selectedCurrencyOption =
      this.currencyOptions.find(
        (c) => c.code == UpsertCandidate.currency?.code
      ) ?? this.currencyOptions[0];

    UpsertCandidate.currency = selectedCurrencyOption;

    try {
      await this.kioskConfigService.setLocalization(
        this.locationId,
        UpsertCandidate
      );
      this.Localization = UpsertCandidate;
      this.toast.success('Updated Locale');
    } catch (ex: any) {
      console.log(ex);
      this.toast.error('There was an issue updating locale');
    }
    this.loader.stop();
  }

  public localeLabel(code: string): string {
    const locale = new Intl.Locale(code);

    let region = code;
    if (locale.region) {
      region = this.intlRegionNames.of(locale.region) ?? locale.region;
    }
    let lang = '';
    if (locale.language) {
      lang = this.intlLanguageNames.of(locale.language) ?? locale.language;
    }

    var label = `${region}(${lang})`;
    console.log(`${code}: ${label}`);
    return label;
  }
}
