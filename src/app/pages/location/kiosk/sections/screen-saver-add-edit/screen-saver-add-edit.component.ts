import {
  animate,
  group,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { screenSaver } from 'src/app/grubbrr/core/models/screensaver.model';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { ImageService } from 'src/app/grubbrr/service/image.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { NavigationService } from 'src/app/grubbrr/shared/navigation.service';
import { PageInfoService } from 'src/app/metronic/_metronic/layout';

@Component({
  selector: 'app-screen-saver-add-edit',
  templateUrl: './screen-saver-add-edit.component.html',
  styleUrls: ['./screen-saver-add-edit.component.scss'],
  animations: [
    trigger('flyInOut', [
      state(
        'in',
        style({
          width: '*',
          transform: 'translateX(0)',
          opacity: 1,
        })
      ),
      transition(':enter', [
        style({ width: 10, transform: 'translateX(50px)', opacity: 0 }),
        group([
          animate(
            '0.3s 0.1s ease',
            style({
              transform: 'translateX(0)',
              width: '*',
            })
          ),
          animate(
            '0.3s ease',
            style({
              opacity: 1,
            })
          ),
        ]),
      ]),
      transition(':leave', [
        group([
          animate(
            '0.3s ease',
            style({
              transform: 'translateX(50px)',
              width: 10,
            })
          ),
          animate(
            '0.3s 0.2s ease',
            style({
              opacity: 0,
            })
          ),
        ]),
      ]),
    ]),
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('50ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(
          '50ms ease-in',
          style({ opacity: 0, backgroundColor: 'yellow' })
        ),
      ]),
    ]),
  ],
})
export class ScreenSaverAddEditComponent implements OnInit, OnDestroy {
  screenSaverForm: FormGroup;
  screenSaver: screenSaver;
  imagePreview: string;
  @ViewChild('imageLabel', { static: false }) imageLabel: ElementRef;
  @ViewChild('videoLabel', { static: false }) videoLabel: ElementRef;
  @ViewChild('uploadFileImageLabel', { static: false })
  uploadFileImageLabel: ElementRef;
  showImage: boolean = true;
  pageTitle: string = 'Add';
  formReady: boolean = false;
  locationId: string;
  displayOrder: number = -1;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService,
    public navigation: NavigationService,
    private loader: NgxUiLoaderService,
    private pageService: PageInfoService,
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private breadCrumbService: BreadCrumbService,
    private imageService: ImageService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    this.loader.start();
    await this.setupPageTitle();
    this.fetchScreenSaver();
  }

  fetchScreenSaver() {
    if (this.displayOrder) {
      this.subscriptions.push(
        this.locationService
          .getScreenSaver(this.locationId, this.displayOrder)
          .pipe(
            finalize(() => {
              this.loader.stop();
              this.formReady = true;

              this.cdr.detectChanges();
              var mediaTypeEnum = (<any>MediaType)[this.screenSaver.mediaType];
              this.toggleMediaType(mediaTypeEnum);
            })
          )
          .subscribe((screensaver: screenSaver) => {
            this.screenSaver = screensaver;
            this.screenSaverForm.patchValue(this.screenSaver);
          })
      );
    } else {
      this.displayOrder = -1;
      this.formReady = true;
      this.loader.stop();
    }
  }

  private initForm() {
    this.screenSaverForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      sliderText: this.fb.control('', [Validators.required]),
      description: this.fb.control('', [Validators.required]),
      mediaType: this.fb.control('', [Validators.required]),
      image: this.fb.group({
        displayUrl: this.fb.control(''),
        imagePath: this.fb.control(''),
      }),
      imageSource: this.fb.control(''),
      videoUrl: this.fb.control('', [Validators.required]),
      duration: this.fb.control(6, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      displayOrder: this.fb.control(this.displayOrder),
    });
  }

  handleInputFile(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;

    const file = target?.files[0];
    var mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      this.toast.warning('Only images are supported.');
      return;
    }

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;

      this.screenSaverForm.patchValue(
        {
          imageSource: file,
        },
        { emitEvent: false }
      );

      this.screenSaverForm?.get('imageSource')?.updateValueAndValidity();
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }

  toggleMediaType(mediaType: MediaType): void {
    if (mediaType === MediaType.Image) {
      this.imagePreview = this.screenSaver?.image?.displayUrl;

      this.showImage = true;
      this.renderer.addClass(this.imageLabel.nativeElement, 'active');
      this.renderer.removeClass(this.videoLabel.nativeElement, 'active');

      this.screenSaverForm?.get('imageSource')?.patchValue(null);
      this.screenSaverForm?.get('mediaType')?.patchValue('Image');
    } else {
      this.showImage = false;
      this.screenSaverForm?.get('mediaType')?.patchValue('Video');

      this.renderer.removeClass(this.imageLabel.nativeElement, 'active');
      this.renderer.addClass(this.videoLabel.nativeElement, 'active');
    }
  }

  async onSubmit(): Promise<void> {
    this.loader.start();
    await this.handleImage();

    this.subscriptions.push(
      this.locationService
        .updateScreenSaver(
          this.locationId,
          this.screenSaverForm.getRawValue(),
          this.displayOrder
        )
        .pipe(
          finalize(() => {
            this.cdr.detectChanges();
            this.loader.stop();
          })
        )
        .subscribe((result: boolean) => {
          if (result) {
            this.toast.success('Screen Saver Updated');
            location.href = `location/${this.locationId}/kiosk/#screensavers`;
          } else {
            this.toast.error(
              'Unable to update Screen Saver, please try again later.'
            );
          }
        })
    );
  }

  private async handleImage(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      var formData = new FormData();

      if (this.showImage == false) {
        this.screenSaverForm?.get('image')?.get('imagePath')?.patchValue('');
        this.imagePreview = '';
        return resolve(false);
      }

      if (!this.screenSaverForm.value.imageSource) return resolve(false);

      var newFileName = `screensaver.${this.screenSaverForm.value.imageSource.name.substring(
        this.screenSaverForm.value.imageSource.name.lastIndexOf('.') + 1
      )}`;

      formData.append(
        'file',
        this.screenSaverForm.value.imageSource,
        newFileName
      );

      this.imageService
        .uploadImages(this.locationId, formData)
        .pipe(finalize(() => resolve(true)))
        .subscribe((data: any) => {
          this.screenSaverForm
            ?.get('image')
            ?.get('imagePath')
            ?.patchValue(data.screensaver);

          this.screenSaverForm.patchValue({ videoUrl: null });

          this.screenSaverForm?.get('imageSource')?.updateValueAndValidity();

          resolve(true);
        });
    });
  }

  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    this.displayOrder = this.route.snapshot.params.displayOrder;
    this.pageTitle = 'Screen Saver';

    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId,
      this.pageTitle
    );

    this.pageService.updateTitle(this.pageTitle);
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }

  get f() {
    return this.screenSaverForm.controls;
  }

  get MediaType() {
    return MediaType;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}

export enum MediaType {
  Image = 0,
  Video = 1,
}
