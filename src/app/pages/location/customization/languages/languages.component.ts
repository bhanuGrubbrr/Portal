import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TemplateConfigVM } from 'src/app/grubbrr/generated/appearance_pb';
import { LocalizationVM } from 'src/app/grubbrr/generated/kioskConfig_pb';
import { AppearanceService } from 'src/app/grubbrr/service/appearance.service';
import { KioskConfigService } from 'src/app/grubbrr/service/kioskConfig.service';

export interface LanguageRowModel {
  page: string;
  element: string;
  id: string;
  default: string;
  current: string;
  color: string;
}

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
})
export class LanguagesComponent implements OnInit {
  locationId: string;
  templateConfigVM: TemplateConfigVM;
  localizationVM: LocalizationVM;

  langForm: FormGroup;
  //selectedLang: string = "en-US"
  languages: { id: string; label: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private kioskConfigService: KioskConfigService,
    private appearanceService: AppearanceService
  ) {}

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    this.langForm = this.fb.group({
      enabledLanguages: this.fb.array([]),
      defaultLanguage: this.fb.array([]),
    });

    this.locationId = this.route.snapshot.params.locationid;
    await this.fetchData();

    let list = this.langForm.get('enabledLanguages') as FormArray;
    this.languages.forEach((lang) => {
      let checked = this.isSelectedLanaguage(lang.id);
      list.controls.push(this.fb.control(checked));
    });

    list = this.langForm.get('defaultLanguage') as FormArray;
    this.languages.forEach((lang) => {
      list.controls.push(this.fb.control(false));
    });

    //this.cdr.detectChanges();
  }

  isReadyForSave(): boolean {
    return (
      this.localizationVM.enabledLanguages.length > 0 &&
      !!this.localizationVM.defaultLanguage &&
      this.isSelectedLanaguage(this.localizationVM.defaultLanguage)
    );
  }

  isSelectedLanaguage(langId: string): boolean {
    return !!this.localizationVM.enabledLanguages.find((l) => l == langId);
  }

  isDefaultLanguage(langId: string): boolean {
    return (
      this.localizationVM.defaultLanguage == langId &&
      this.isSelectedLanaguage(langId)
    );
  }

  async fetchData() {
    this.loader.start();

    this.templateConfigVM = await this.appearanceService.getTemplateConfig(
      this.locationId
    );
    this.localizationVM = await this.kioskConfigService.getLocalization(
      this.locationId
    );

    this.templateConfigVM.text?.default.forEach((o) => {
      const curCode = o.languageCode;

      const languageNames = new Intl.DisplayNames(curCode.substring(0, 2), {
        type: 'language',
      });
      const label = languageNames.of(curCode);

      this.languages.push({
        id: curCode,
        label: label!,
      });
    });

    this.loader.stop();
  }

  makeUpperAndRemoveUnderscore(name: string): string {
    var splitString = name.split('_');
    if (splitString.length == 0)
      return (
        name.charAt(0).toUpperCase() + (name.length > 1 ? name.slice(1) : '')
      );

    return splitString
      .map((s) => {
        return s.charAt(0).toUpperCase() + (s.length > 1 ? s.slice(1) : '');
      })
      .join(' ');
  }

  onDefaultChanged(e: any) {
    if (e.target.checked) {
      this.localizationVM.defaultLanguage = e.target.value;
    }
  }

  checkboxOnChange(e: any) {
    // remove this language and add it back if its checked.
    this.localizationVM.enabledLanguages =
      this.localizationVM.enabledLanguages.filter((l) => l != e.target.id);
    if (e.target.checked) {
      this.localizationVM.enabledLanguages.push(e.target.id);
    }

    console.log('languages: ' + this.localizationVM.enabledLanguages);
  }

  async save() {
    if (!this.isReadyForSave()) {
      this.toast.error('A default language must be selected');
      return;
    }

    this.loader.start();
    try {
      this.localizationVM.currency = undefined; // don't update this field;
      this.localizationVM.locale = undefined;
      await this.kioskConfigService.setLocalization(
        this.locationId,
        this.localizationVM
      );
      this.toast.success('Languages Updated');
    } catch (e) {
      this.toast.success('Unable to update the languages.');
      console.log('update languages failed:' + e);
    }

    this.loader.stop();
  }

  getPageColorHash(name: string): string {
    const getHash = (namge: string): number =>
      Array.from(namge).reduce(
        (hash, char) => 0 | (hash + char.charCodeAt(0)),
        0
      );

    const h = Math.round(getHash(name) / 36);
    const s = Math.round(getHash(name) / 100);
    const l = 60; //brightness is high as black text should be readable

    return `hsl(${h}deg, ${s}%, ${l}%)`;
  }

  reset(row: LanguageRowModel) {
    row.current = row.default;
    this.cdr.detectChanges();
  }
}
