import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KioskConfigService } from 'src/app/grubbrr/service/kioskConfig.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit {
  constructor(
    private kioskConfigService: KioskConfigService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private loader: NgxUiLoaderService
  ) {}

  public companyid: string;
  public companyLevelMenuManagementEnabled: boolean;
  loaded: boolean = false;

  public async companyLevelMenuManagementToggle() {
    this.loader.start();
    this.companyLevelMenuManagementEnabled =
      !this.companyLevelMenuManagementEnabled;
    try {
      await this.kioskConfigService.updateCompanyLevelMenuManagementFlag(
        this.companyid,
        this.companyLevelMenuManagementEnabled
      );
      this.loader.stop();
      this.toast.success(
        this.companyLevelMenuManagementEnabled === true
          ? 'Company Level Menu Management enabled.'
          : 'Company Level Menu Management disabled.'
      );
    } catch {
      this.toast.error('Error: Unable to change this setting.');
      this.loader.stop();
    }
  }

  async ngOnInit(): Promise<void> {
    this.companyid = this.route.snapshot.params.companyid;
    const config = await this.kioskConfigService.getCompanyConfig(
      this.companyid
    );
    this.companyLevelMenuManagementEnabled =
      config.companyLevelMenuManagementEnabled;
    this.loaded = true;
  }
}
