import {
  EventEmitter,
  Output,
  Component,
  Input,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

type ImageUploadControlValue = File | string;

export const IMAGE_UPLOAD_CONTROL_COMPONENT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ImageUploadControlComponent),
  multi: true,
};

@Component({
  selector: 'app-image-upload-control',
  templateUrl: './image-upload-control.component.html',
  styleUrls: ['./image-upload-control.component.scss'],
  providers: [IMAGE_UPLOAD_CONTROL_COMPONENT_VALUE_ACCESSOR],
})
export class ImageUploadControlComponent implements ControlValueAccessor {
  @Input() restrictionsText: string;
  @Input() label: string = 'Upload Logo';
  @Input() toolTip: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  onFileDrop(e: any) {
    const fileListAsArray = Array.from(e);
    const firstFile = fileListAsArray[0] as File;
    this.value = firstFile;
    this.onChange(this.value);

    this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(firstFile)
    );
  }

  onClickRemove() {
    this.value = null;
    this.imagePreviewUrl = null;
    this.onChange(null);
  }

  imagePreviewUrl: SafeUrl | string | null;
  value: ImageUploadControlValue | null;
  onChange = (value: ImageUploadControlValue | null) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  writeValue(value: ImageUploadControlValue | null) {
    this.value = value;
    this.imagePreviewUrl = value;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
