import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { AppearanceMediaAssetVM } from 'src/app/grubbrr/generated/appearance_pb';
import { ImageService } from 'src/app/grubbrr/service/image.service';

@Component({
  selector: 'app-appearance-asset',
  templateUrl: './appearance-asset.component.html',
  styleUrls: ['./appearance-asset.component.scss'],
})
export class AppearanceAssetComponent implements OnInit {
  locationId: string;
  uploadedPercent: number = 0;

  @Input() label: string;
  @Input() mediaAsset: AppearanceMediaAssetVM | undefined;
  @Output() mediaAssetChange = new EventEmitter<AppearanceMediaAssetVM>();

  constructor(
    private route: ActivatedRoute,
    private imageService: ImageService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
  }

  public remove() {
    if (!this.mediaAsset) return;
    this.mediaAsset.name = '';
    this.mediaAsset.displayUrl = '';
    this.mediaAsset.storagePath = '';
    this.mediaAssetChange.emit(this.mediaAsset);
  }

  async handleUpload(e: any) {
    if (e.currentTarget.files.length == 0) return;

    const image: File = e.currentTarget.files[0];
    const vm = this;

    const fileSize = image.size;
    const maxSize = 500 * 1024; //500KB

    if (fileSize > maxSize) {
      this.toastr.error(
        `File size exceed ${maxSize / 1024}kb`,
        'File Validation'
      );
    } else {
      try {
        const res = await this.imageService.upload(
          this.locationId,
          image.name,
          image,
          (loaded: number, total: number) =>
            (vm.uploadedPercent = Math.round(
              ((loaded ?? 0) / (total ?? 1)) * 100
            ))
        );

        this.mediaAsset = {
          displayUrl: res.displayUrl,
          storagePath: res.storagePath,
          name: image.name,
        };

        this.mediaAssetChange.emit(this.mediaAsset);
      } catch (error: any) {
        this.toastr.error(
          `There was an issue processing this request. ${error.response.Message}`
        );
      }
    }
  }
}
