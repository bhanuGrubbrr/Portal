import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { over } from 'lodash';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  TemplateConfigVM,
  TemplateLanguageTextVM,
} from 'src/app/grubbrr/generated/appearance_pb';
import { AppearanceService } from 'src/app/grubbrr/service/appearance.service';

export interface LanguageRowModel {
  page: string;
  element: string;
  id: string;
  default: string;
  override: string;
  blank: boolean;
  color: string;
}

@Component({
  selector: 'app-textoverrides',
  templateUrl: './textoverrides.component.html',
  styleUrls: ['./textoverrides.component.scss'],
})
export class TextoverridesComponent implements OnInit {
  locationId: string;
  templateConfigVM: TemplateConfigVM;

  selectedLang: string;
  languages: { id: string; label: string }[] = [];
  gridData: LanguageRowModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private appearanceService: AppearanceService
  ) {}

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    this.locationId = this.route.snapshot.params.locationid;
    await this.fetchData();
  }

  private refreshText() {
    const defaultText = this.templateConfigVM.text!.default.find(
      (o) => o.languageCode == this.selectedLang
    )!;
    const textOverrides = this.templateConfigVM.text!.overrides.find(
      (o) => o.languageCode == this.selectedLang
    );

    this.gridData = Object.keys(defaultText.strings).map((k) => {
      const pageElement = k.split('.');

      return {
        page: this.makeUpperAndRemoveUnderscore(pageElement[0]),
        element: this.makeUpperAndRemoveUnderscore(pageElement[1]),
        id: k,
        default: defaultText.strings[k],
        override: textOverrides?.strings[k] ?? '', // TODO: verify this key exists
        blank: textOverrides?.strings[k] === '',
        color: '',
      };
    });
  }

  async languageChanged(event: any) {
    this.bindOverrides();
    this.selectedLang = event.target.value;
    this.refreshText();
    this.cdr.detectChanges();
  }

  async fetchData() {
    this.loader.start();

    this.templateConfigVM = await this.appearanceService.getTemplateConfig(
      this.locationId
    );
    this.selectedLang = this.templateConfigVM.text!.default[0].languageCode;

    // TODO: change to use default texts list
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

    this.refreshText();

    this.loader.stop();
    this.cdr.detectChanges();
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

  private bindOverrides(): TemplateLanguageTextVM {
    let index = this.templateConfigVM.text!.overrides.findIndex(
      (o) => o.languageCode == this.selectedLang
    );
    let overrides;
    if (index > 0) {
      overrides = this.templateConfigVM.text!.overrides[index];
    } else {
      overrides = {
        languageCode: this.selectedLang,
        strings: {},
      };
    }

    overrides.strings = Object.assign(
      {},
      ...this.gridData
        .filter((s) => s.override || s.blank)
        .map((d) => ({ [d.id]: d.blank ? '' : d.override })) //to dictionary
    );

    if (index >= 0) {
      this.templateConfigVM.text!.overrides[index] = overrides;
    } else {
      this.templateConfigVM.text!.overrides.push(overrides);
    }

    return overrides;
  }

  async save() {
    this.loader.start();

    this.bindOverrides();

    for (
      let index = 0;
      index < this.templateConfigVM.text!.overrides.length;
      index++
    ) {
      const o = this.templateConfigVM.text!.overrides[index];
      await this.appearanceService.updateTemplateTextOverrides(
        this.locationId,
        o
      );
    }

    this.loader.stop();
    this.cdr.detectChanges();
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
    row.override = '';
    this.cdr.detectChanges();
  }

  blank(row: LanguageRowModel, event: any) {
    row.override = '';
    row.blank = event.target.checked;
    this.cdr.detectChanges();
  }
}
