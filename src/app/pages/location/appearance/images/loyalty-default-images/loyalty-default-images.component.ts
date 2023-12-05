import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import {
  LoyaltyMediaVM,
  TemplateImagesVM,
} from 'src/app/grubbrr/generated/appearance_pb';
import { AppearanceService } from 'src/app/grubbrr/service/appearance.service';
import { ImageService } from 'src/app/grubbrr/service/image.service';

interface DisplayProps {
  modified: boolean;
  file: File | null;
  preview: SafeUrl | undefined;
  json_key: keyof KeyedDefaults;
}

type KeyedDefaults = {
  [key in
    | 'defaultProfileHeaderImage'
    | 'defaultTopCornerImage'
    | 'defaultRewardsBackgroundImage'
    | 'defaultRewardImage'
    | 'defaultProfileFooterImage'
    | 'defaultCheckoutHeaderImage']: DisplayProps;
};

@Component({
  selector: 'app-loyalty-default-images',
  templateUrl: './loyalty-default-images.component.html',
  styleUrls: ['./loyalty-default-images.component.scss'],
})
export class LoyaltyDefaultImagesComponent implements OnInit {
  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private imageService: ImageService,
    private appearanceService: AppearanceService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  @Input() loyaltyMedia: LoyaltyMediaVM | undefined;
  @Input() defaultCategoryHeaderImage: any;

  DisplayData: KeyedDefaults = {} as KeyedDefaults;
  locationId: string;

  public get HEADER(): DisplayProps | undefined {
    return this.DisplayData?.defaultProfileHeaderImage;
  }
  public get TOP_CORNER(): DisplayProps | undefined {
    return this?.DisplayData?.defaultTopCornerImage;
  }
  public get REWARDS_BACKGROUND(): DisplayProps | undefined {
    return this?.DisplayData?.defaultRewardsBackgroundImage;
  }
  public get REWARD(): DisplayProps | undefined {
    return this?.DisplayData?.defaultRewardImage;
  }
  public get FOOTER(): DisplayProps | undefined {
    return this?.DisplayData?.defaultProfileFooterImage;
  }
  public get CHECKOUT_HEADER(): DisplayProps | undefined {
    return this?.DisplayData?.defaultCheckoutHeaderImage;
  }

  handleImageChange(e: any, d: keyof KeyedDefaults) {
    if (e.currentTarget.files.length == 0) return;

    const image: File = e.currentTarget.files[0];
    if (!this.DisplayData) this.DisplayData = {} as KeyedDefaults;
    let obj = {
      modified: true,
      file: image,
      preview: this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(image)
      ),
      json_key: d,
    };
    this.DisplayData[d] = obj;

    this.cdr.detectChanges();
  }

  removeImageChange(d: keyof KeyedDefaults) {
    if (!this.DisplayData) return;
    if (this.DisplayData[d]) {
      if (this.DisplayData[d].file) {
        this.DisplayData[d].file = null;
        this.DisplayData[d].preview = this.loyaltyMedia
          ? this.loyaltyMedia[d]?.displayUrl
          : undefined;
        this.DisplayData[d].modified = true;
      } else {
        this.DisplayData[d].preview = undefined;
        this.DisplayData[d].modified = true;
      }
    }
  }

  async saveDefaultLoyaltyRewardImage() {
    // this.isSaving = true;

    try {
      let loyaltyMediaCandidate = Object.assign({}, this.loyaltyMedia);

      for (const [key, value] of Object.entries(this.DisplayData)) {
        if (value.file) {
          const newFileName = `${value.json_key}.${value.file.name.substring(
            value.file.name.lastIndexOf('.') + 1
          )}`;
          const formData = new FormData();
          formData.append('file', value.file, newFileName);

          let imageUploadRes = await firstValueFrom(
            this.imageService.uploadImages(this.locationId, formData)
          );
          let storagePath = Object.keys(imageUploadRes)[0];

          let upsert = {
            storagePath,
            name: newFileName,
            displayUrl: '',
          };
          loyaltyMediaCandidate[value.json_key] = upsert;
        } else if (value.modified) {
          loyaltyMediaCandidate[value.json_key] = undefined;
        }
      }
      await this.appearanceService.updateTemplateImages(
        this.locationId,
        Object.assign(
          {},
          {
            defaultCategoryHeaderImage: this.defaultCategoryHeaderImage,
          },
          {
            defaultLoyaltyMedia: loyaltyMediaCandidate,
          }
        )
      );
      this.toastr.success('Saved images successfully');
    } catch (error: any) {
      console.error(error);
      this.toastr.error(
        `There was an issue processing this request. ${error.response?.Message}`
      );
    } finally {
      // this.isSaving = false;
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    if (this.loyaltyMedia) {
      for (const [key, value] of Object.entries(this.loyaltyMedia)) {
        if (key as keyof KeyedDefaults) {
          this.DisplayData[key as keyof KeyedDefaults] = {
            modified: false,
            file: null,
            preview: value.displayUrl,
            json_key: key as keyof KeyedDefaults,
          };
        }
      }
    }
    this.cdr.detectChanges();
  }

  save() {}

  handleDefaultLoyaltyRewardImageChange(a: any) {}
  removeDefaultLoyaltyRewardImageChange() {}
}
