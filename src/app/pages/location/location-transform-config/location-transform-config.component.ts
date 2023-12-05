import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from 'src/app/grubbrr/service/location.service';

@Component({
  selector: 'app-location-transform-config',
  templateUrl: './location-transform-config.component.html',
  styleUrls: ['./location-transform-config.component.scss'],
})
export class LocationTransformConfigComponent implements OnInit {
  configForm: FormGroup;
  locationId: string;
  loaded = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public locationService: LocationService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.fetchConfig();
  }

  async fetchConfig() {
    const config = await this.locationService.getTransformConfig(
      this.locationId
    );
    this.configForm = this.fb.group({
      menuWorkflowName: this.fb.control(config.menuWorkflowName ?? ''),
      menuWorkflowJson: this.fb.control(config.menuWorkflowJson ?? ''),
      orderWorkflowName: this.fb.control(config.orderWorkflowName ?? ''),
      orderWorkflowJson: this.fb.control(config.orderWorkflowJson ?? ''),
    });

    this.loaded = true;
  }

  async onSave() {
    this.saving = true;
    await this.locationService.saveTransformConfig(
      this.locationId,
      this.configForm.getRawValue()
    );

    this.toast.success('Saved rules successfully');
  }
}
