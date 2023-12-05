import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TimeoutSettingsVM } from 'src/app/grubbrr/generated/kioskConfig_pb';
import { KioskConfigService } from 'src/app/grubbrr/service/kioskConfig.service';

@Component({
  selector: 'app-timeouts',
  templateUrl: './timeouts.component.html',
  styleUrls: ['./timeouts.component.scss'],
})
export class TimeoutsComponent implements OnInit {
  static TIMEOUT_WARNING_THRESHOLD = 10; // How many seconds requires re-thinking your actions?
  static TIMER_WARNING_THRESHOLD = 30; // How many seconds requires re-thinking your actions?
  locationId: string;
  TimeoutForm: FormGroup;
  TimeoutSettings: TimeoutSettingsVM;
  Loaded: boolean = false;

  ShowKioskTimeoutWarning: boolean = false;
  ShowKioskTimerWarning: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private loader: NgxUiLoaderService,
    private kioskConfigService: KioskConfigService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.FetchData();
  }

  get TimeoutWarningThreshold() {
    return TimeoutsComponent.TIMEOUT_WARNING_THRESHOLD;
  }
  get TimerWarningThreshold() {
    return TimeoutsComponent.TIMER_WARNING_THRESHOLD;
  }

  private async FetchData() {
    this.loader.start();
    this.TimeoutSettings = await this.kioskConfigService.getTimeoutSettings(
      this.locationId
    );
    this.InitializeForm();
    this.Loaded = true;
    this.loader.stop();
  }

  private InitializeForm(): void {
    this.TimeoutForm = this.fb.group({
      KioskTimeout: [this.TimeoutSettings.idleTimeout, [Validators.min(0)]],
      KioskRestartTimer: [
        this.TimeoutSettings.restartPromptTimer,
        [Validators.min(0)],
      ],
    });
    this.ValidateInputs();
  }

  public async save() {
    this.loader.start();
    let Timeout: number = this.TimeoutForm.get('KioskTimeout')?.value;
    let Timer: number = this.TimeoutForm.get('KioskRestartTimer')?.value;
    if (Timeout && Timeout > 0) {
      let UpsertCandidate: TimeoutSettingsVM = { ...this.TimeoutSettings };
      UpsertCandidate.idleTimeout = Timeout;
      UpsertCandidate.restartPromptTimer = Timer;
      try {
        await this.kioskConfigService.upsertTimeoutSettings(
          this.locationId,
          UpsertCandidate
        );
        this.TimeoutSettings = UpsertCandidate;
        this.toast.success('Updated timeout settings');
      } catch (ex: any) {
        this.toast.error('There was an issue updating timeout settings');
      }
    } else {
      this.toast.error('Please enter valid timeout settings');
    }
    this.loader.stop();
  }

  private ValidateInputs(): void {
    let Timeout: number = this.TimeoutForm.get('KioskTimeout')?.value;
    let Timer: number = this.TimeoutForm.get('KioskRestartTimer')?.value;
    this.ShowKioskTimeoutWarning =
      Timeout < TimeoutsComponent.TIMEOUT_WARNING_THRESHOLD;
    this.ShowKioskTimerWarning =
      Timer < TimeoutsComponent.TIMER_WARNING_THRESHOLD;
  }

  InputHook() {
    this.ValidateInputs();
  }
}
