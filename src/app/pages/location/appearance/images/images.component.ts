import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { firstValueFrom } from 'rxjs';
import {
  TemplateConfigVM,
  TemplateImagesVM,
  AnimationsVM,
} from 'src/app/grubbrr/generated/appearance_pb';
import { AppearanceService } from 'src/app/grubbrr/service/appearance.service';
import { ImageService } from 'src/app/grubbrr/service/image.service';
import { AddVideoComponent } from '../../modals/add-video/add-video.component';
import { ConfirmRemoveComponent } from '../../modals/confirm-remove/confirm-remove.component';
import { ViewVideoComponent } from '../../modals/view-video/view-video.component';

export interface ScreensaverRow {
  name: string;
  url: string;
  storagePath: string;
}

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent implements OnInit {
  loaded = false;
  locationId: string;
  gridData: ScreensaverRow[] = [];
  templateConfigVM: TemplateConfigVM;

  editModalOptions: NgbModalOptions;
  animations?: AnimationsVM;
  defaultCategoryHeaderImagePreviewUrl: SafeUrl | string | null = null;
  defaultCategoryHeaderImageFile: File | null = null;

  templateImages?: TemplateImagesVM;

  get hasModifiedDefaultCategoryHeaderImage(): boolean {
    const hasUploadedFile = !!this.defaultCategoryHeaderImageFile;
    const hasRemovedExistingImage =
      this.defaultCategoryHeaderImagePreviewUrl === null &&
      !!this.templateConfigVM?.images?.defaultCategoryHeaderImage;
    return hasUploadedFile || hasRemovedExistingImage;
  }

  isSaving: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private loader: NgxUiLoaderService,
    private toastr: ToastrService,
    private appearanceService: AppearanceService,
    private sanitizer: DomSanitizer,
    public imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.initPage();
    this.editModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'xl',
      scrollable: true,
    };
  }

  private async initPage() {
    this.locationId = this.route.snapshot.params.locationid;
    await this.fetchData();
  }

  async fetchData() {
    this.loader.start();

    this.templateConfigVM = await this.appearanceService.getTemplateConfig(
      this.locationId
    );
    const screenSavers = this.templateConfigVM.screensavers;

    this.templateImages = this.templateConfigVM.images;

    this.animations = this.templateConfigVM.animations;

    this.defaultCategoryHeaderImagePreviewUrl =
      this.templateConfigVM.images?.defaultCategoryHeaderImage?.displayUrl ??
      null;

    this.gridData = screenSavers!.files.map((k, i) => {
      return {
        name: k.name,
        url: k.displayUrl,
        storagePath: k.storagePath,
      };
    });

    this.loaded = true;
    this.loader.stop();
    this.cdr.detectChanges();
  }

  async saveAnimations() {
    if (!this.animations) return;
    await this.appearanceService.updateTemplateAnimations(
      this.locationId,
      this.animations
    );
    this.toastr.success(`Animations Saved`);
  }

  async remove(row: ScreensaverRow) {
    const modalOptions: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
    };

    const modalRef = this.modalService.open(
      ConfirmRemoveComponent,
      modalOptions
    );

    modalRef.result.then(async (isConfirmed: boolean) => {
      if (!isConfirmed) return;

      await this.appearanceService.removeScreensaver(this.locationId, row.name);
      this.gridData = this.gridData.filter((r) => r.name !== row.name);
      this.cdr.detectChanges();
    });
  }

  add() {
    const modalOptions: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
      scrollable: true,
    };

    const modalRef = this.modalService.open(AddVideoComponent, modalOptions);

    const params = {
      locationId: this.locationId,
    };

    modalRef.componentInstance.fromParent = params;

    modalRef.result.then((screensaverRow: ScreensaverRow) => {
      if (!screensaverRow) return;
      this.gridData.push(screensaverRow);
      this.cdr.detectChanges();
    });
  }

  removeDefaultCategoryHeaderImageChange() {
    if (this.defaultCategoryHeaderImageFile) {
      this.defaultCategoryHeaderImageFile = null;
      this.defaultCategoryHeaderImagePreviewUrl =
        this.templateConfigVM.images?.defaultCategoryHeaderImage?.displayUrl ??
        null;
    } else {
      this.defaultCategoryHeaderImagePreviewUrl = null;
    }
  }

  handleDefaultCategoryHeaderImageChange(e: any) {
    if (e.currentTarget.files.length == 0) return;

    const image: File = e.currentTarget.files[0];
    this.defaultCategoryHeaderImageFile = image;
    this.defaultCategoryHeaderImagePreviewUrl =
      this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(image));
  }

  async saveDefaultCategoryHeaderImage() {
    this.isSaving = true;

    try {
      if (this.defaultCategoryHeaderImageFile) {
        const newFileName = `defaultCategoryHeaderImageFile.${this.defaultCategoryHeaderImageFile.name.substring(
          this.defaultCategoryHeaderImageFile.name.lastIndexOf('.') + 1
        )}`;

        const formData = new FormData();
        formData.append(
          'file',
          this.defaultCategoryHeaderImageFile,
          newFileName
        );

        let imageUploadRes = await firstValueFrom(
          this.imageService.uploadImages(this.locationId, formData)
        );
        let storagePath = Object.keys(imageUploadRes)[0];

        await this.appearanceService.updateTemplateImages(
          this.locationId,
          Object.assign({}, this.templateImages, {
            defaultCategoryHeaderImage: {
              storagePath,
              name: newFileName,
              displayUrl: '',
            },
          })
        );

        this.defaultCategoryHeaderImageFile = null;
        await this.fetchData();
      } else {
        await this.appearanceService.updateTemplateImages(
          this.locationId,
          Object.assign({}, this.templateImages, {
            defaultCategoryHeaderImage: undefined,
          })
        );
      }

      this.toastr.success('Saved image successfully');
    } catch (error: any) {
      this.toastr.error(
        `There was an issue processing this request. ${error.response?.Message}`
      );
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }

  async view(row: ScreensaverRow) {
    const modalRef = this.modalService.open(
      ViewVideoComponent,
      this.editModalOptions
    );

    const params = {
      src: row,
    };

    modalRef.componentInstance.fromParent = params;
  }
}
