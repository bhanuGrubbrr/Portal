import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KioskImageTypeEnum } from 'src/app/core/global-constants';
import { screenSaver } from 'src/app/grubbrr/core/models/screensaver.model';

@Component({
  selector: 'app-screen-saver-edit',
  templateUrl: './screen-saver-edit.component.html',
  styleUrls: ['./screen-saver-edit.component.scss'],
})
export class ScreenSaverEditComponent implements OnInit {
  @Input() fromParent: any;
  screenSaver: screenSaver;
  @ViewChild('imageLabel', { static: false }) imageLabel: ElementRef;
  @ViewChild('videoLabel', { static: false }) videoLabel: ElementRef;
  @ViewChild('uploadFileImageLabel', { static: false })
  uploadFileImageLabel: ElementRef;

  //screenSaverForm: FormGroup;
  screenSaverForm: FormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    sliderText: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    mediaType: this.fb.control('', [Validators.required]),
    image: this.fb.group({
      url: this.fb.control(''),
    }),
    videoUrl: this.fb.control('', [Validators.required]),
    duration: this.fb.control(6, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
  });

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.screenSaver = this.fromParent.screenSaver;
    this.screenSaverForm.patchValue(this.screenSaver);
  }

  toggleMediaType(index: number): void {
    if (index === 0) {
      this.renderer.addClass(this.imageLabel.nativeElement, 'active');
      this.renderer.removeClass(this.videoLabel.nativeElement, 'active');
    } else {
      this.renderer.removeClass(this.imageLabel.nativeElement, 'active');
      this.renderer.addClass(this.videoLabel.nativeElement, 'active');
    }
  }

  handleInputFile(event: Event, imageType: KioskImageTypeEnum): void {
    const target = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = target.files;
    if (fileList) {
      const file: File = fileList[0];

      this.screenSaverForm.get('image.url')?.patchValue(file.name);
      this.renderer.setProperty(
        this.uploadFileImageLabel.nativeElement,
        'innerHTML',
        file.name
      );

      this.cdr.detectChanges();
    }
  }

  private patchImage(controlName: string, file: File, elementRef: ElementRef) {
    this.screenSaverForm.get(controlName)?.patchValue(file.name);
    this.renderer.setProperty(elementRef.nativeElement, 'innerHTML', file.name);
  }

  get KioskImageTypeEnum() {
    return KioskImageTypeEnum;
  }

  closeModal(message: string) {
    this.screenSaverForm.reset();
    this.activeModal.close();
  }

  get f() {
    return this.screenSaverForm.controls;
  }
}
