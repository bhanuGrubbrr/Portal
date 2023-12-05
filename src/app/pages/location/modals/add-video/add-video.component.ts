import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppearanceService } from 'src/app/grubbrr/service/appearance.service';
import { ImageService } from 'src/app/grubbrr/service/image.service';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss'],
})
export class AddVideoComponent implements OnInit {
  @Input() fromParent: any;

  locationId: string;
  name: string = '';
  fileName: string = '';
  fileUrl: string = '';

  displayUrl: string;
  storagePath: string;
  uploadedPercent: number = 0;

  isUploading: boolean = false;
  isFileVsUrl: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    public imageService: ImageService,
    private toastr: ToastrService,
    private appearanceService: AppearanceService
  ) {}

  ngOnInit(): void {
    this.locationId = this.fromParent.locationId;
  }

  async handleUpload(e: any) {
    if (e.currentTarget.files.length == 0) return;

    this.isFileVsUrl = true;
    this.isUploading = true;

    const image: File = e.currentTarget.files[0];
    if (this.name === '') this.name = image.name;

    this.fileName = image.name;

    const vm = this;

    try {
      const res = await this.imageService.upload(
        this.locationId,
        this.fileName,
        image,
        (loaded: number, total: number) =>
          (vm.uploadedPercent = Math.round(
            ((loaded ?? 0) / (total ?? 1)) * 100
          ))
      );

      this.displayUrl = res.displayUrl;
      this.storagePath = res.storagePath;
    } catch (error: any) {
      this.toastr.error(
        `There was an issue processing this request. ${error.response.Message}`
      );
    }

    this.isUploading = false;
  }

  getFileNameLabel(): string {
    return this.fileName === '' ? 'Choose file' : this.fileName;
  }

  urlChanged(e: Event) {
    this.isFileVsUrl = false;
  }

  async addScreensaver() {
    if (!this.isFileVsUrl) {
      await this.imageService
        .uploadUrl(this.locationId, this.fileUrl)
        .subscribe(async (res) => {
          this.displayUrl = res.displayUrl;
          this.storagePath = res.storagePath;
          await this.saveAndClose();
        });
    } else await this.saveAndClose();
  }

  async saveAndClose() {
    const screensaverVM = {
      name: this.name,
      storagePath: this.storagePath,
      displayUrl: this.displayUrl,
    };

    await this.appearanceService.addScreensaver(this.locationId, screensaverVM);
    this.activeModal.close(screensaverVM);
  }
}
