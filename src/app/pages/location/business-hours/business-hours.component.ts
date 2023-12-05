import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  BusinessHoursModel,
  HourModel,
} from 'src/app/grubbrr/core/models/location/location.model';
import { DayOfWeekVM } from 'src/app/grubbrr/generated/common_pb';
import {
  BusinessHoursConfigurationVM,
  BusinessHoursMessageVM,
  BusinessHoursVM,
} from 'src/app/grubbrr/generated/kioskConfig_pb';
import { KioskConfigService } from 'src/app/grubbrr/service/kioskConfig.service';
import {
  dateIntersectValidator,
  dateRangeValidator,
} from 'src/app/grubbrr/shared/validators/date-range.validator';
@Component({
  selector: 'app-business-hours',
  templateUrl: './business-hours.component.html',
  styleUrls: ['./business-hours.component.scss'],
})
export class BusinessHoursComponent implements OnInit {
  businessHoursForm: FormGroup;
  public businessHours: FormArray;
  formReady: boolean = false;
  locationId: string = '';
  daysOfWeek = new Map<number, string>([
    [0, 'Sunday'],
    [1, 'Monday'],
    [2, 'Tuesday'],
    [3, 'Wednesday'],
    [4, 'Thursday'],
    [5, 'Friday'],
    [6, 'Saturday'],
  ]);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private kioskConfigService: KioskConfigService,
    private loader: NgxUiLoaderService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.initForm();
  }

  async initForm() {
    this.loader.start();
    const businessHoursConfiguration: BusinessHoursConfigurationVM | null =
      await this.kioskConfigService.getBusinessHoursConfiguration(
        this.locationId
      );
    this.loader.stop();
    let showMessage = '1';
    let showScreensaver = true;
    let enabled = false;
    if (typeof businessHoursConfiguration?.showMessage == 'boolean') {
      showMessage = businessHoursConfiguration.showMessage ? '1' : '0';
    }
    if (
      typeof businessHoursConfiguration?.message?.showScreensaver == 'boolean'
    ) {
      showScreensaver = businessHoursConfiguration.message.showScreensaver;
    }
    if (typeof businessHoursConfiguration?.enabled == 'boolean') {
      enabled = businessHoursConfiguration.enabled;
    }
    this.businessHoursForm = this.fb.group({
      showType: this.fb.control(showMessage),
      title: this.fb.control(businessHoursConfiguration?.message?.title ?? ''),
      subtitle: this.fb.control(
        businessHoursConfiguration?.message?.subtitle ?? ''
      ),
      message: this.fb.control(
        businessHoursConfiguration?.message?.message ??
          'Kiosk ordering is currently closed. Come back later!'
      ),
      showScreensaver: this.fb.control(showScreensaver),
      enabled: this.fb.control(enabled),
    });
    this.formReady = true;
    this.businessHours = this.fb.array([]);
    this.initBusinessHours(businessHoursConfiguration?.businessHours);
    this.businessHoursForm.addControl('businessHours', this.businessHours);
  }

  initBusinessHours(businessHours: BusinessHoursVM[] | undefined) {
    const days = [
      DayOfWeekVM.MONDAY,
      DayOfWeekVM.TUESDAY,
      DayOfWeekVM.WEDNESDAY,
      DayOfWeekVM.THURSDAY,
      DayOfWeekVM.FRIDAY,
      DayOfWeekVM.SATURDAY,
      DayOfWeekVM.SUNDAY,
    ];
    let hours = [];
    for (let day of days) {
      const initHours = {
        selected: false,
        hours: [
          {
            from: new Date(0, 0),
            to: new Date(0, 0),
          },
        ],
      };
      if (businessHours && businessHours.length) {
        const businessHour = businessHours.find((bh) => bh.day == day);
        if (businessHour) {
          initHours.selected = true;
          initHours.hours = businessHour.hours.map((hour) => ({
            from: new Date(
              new Date(0, 0).getTime() + hour.startMinutes * 60000
            ),
            to: new Date(new Date(0, 0).getTime() + hour.endMinutes * 60000),
          }));
        }
      }
      hours.push({
        day,
        ...initHours,
      });
    }

    for (let hour of hours) {
      this.businessHours.push(this.createItemFormGroup(hour));
    }
  }

  get addDynamicRow() {
    return this.businessHoursForm.get('businessHours') as FormArray;
  }

  createItemFormGroup(hour = {} as BusinessHoursModel): FormGroup {
    let hoursArrayControl = [];
    for (let h of hour.hours) {
      let obj = {
        from: this.fb.control(h.from, [Validators.required]),
        to: this.fb.control(h.to, [Validators.required]),
      };
      hoursArrayControl.push(
        this.fb.group(obj, {
          validator: dateRangeValidator(),
        })
      );
    }
    let hoursControl = this.fb.array(hoursArrayControl);
    return this.fb.group(
      { ...hour, hours: hoursControl },
      {
        validator: dateIntersectValidator(),
      }
    );
  }

  async onSubmit() {
    this.loader.start();
    try {
      const processedBusinessHours = this.processBusinessHours();
      let configuration: BusinessHoursConfigurationVM = {
        message: this.businessHoursForm.value as BusinessHoursMessageVM,
        businessHours: processedBusinessHours as BusinessHoursVM[],
        showMessage:
          this.businessHoursForm.value.showType === '1' ? true : false,
        enabled: this.businessHoursForm.value.enabled,
      };
      await this.kioskConfigService.upsertBusinessHoursConfiguration(
        this.locationId,
        configuration
      );
      this.loader.stop();
      this.toast.success('Business hours updated.');
    } catch {
      this.toast.error('Error: Unable to change this setting.');
      this.loader.stop();
    }
  }

  processBusinessHours() {
    const selectedBusinessHours =
      this.businessHoursForm.value.businessHours.filter(
        (businessHour: BusinessHoursModel) => businessHour.selected
      );
    let expectedBusinessHours = [];
    for (let selectedBusinessHour of selectedBusinessHours) {
      let hours = [];
      for (let hour of selectedBusinessHour.hours) {
        let date = new Date(hour.from);
        let minutesFrom = 60 * date.getHours() + date.getMinutes();
        date = new Date(hour.to);
        let minutesTo = 60 * date.getHours() + date.getMinutes();
        hours.push({
          startMinutes: minutesFrom,
          endMinutes: minutesTo,
        });
      }
      expectedBusinessHours.push({
        ...selectedBusinessHour,
        hours: hours,
      });
    }
    return expectedBusinessHours;
  }

  remove(row: any, index: number) {
    row.get('hours').removeAt(index);
  }

  add(
    row: any,
    hour: HourModel = { from: new Date(0, 0), to: new Date(0, 0) }
  ) {
    let obj = {
      from: this.fb.control(hour.from, [Validators.required]),
      to: this.fb.control(hour.to, [Validators.required]),
    };
    row.get('hours').push(
      this.fb.group(obj, {
        validator: dateRangeValidator(),
      })
    );
  }

  changeWeek(row: any) {
    let selected = row.get('selected');
    if (selected.value) return;
    let controls: any[] = [];
    row.get('hours')?.controls.forEach((control: any, index: number) => {
      if (index != 0 && control.errors) {
        controls.push(control);
      } else if (index == 0 && control.errors) {
        let obj = {
          from: new Date(0, 0),
          to: new Date(0, 0),
        };
        control.setValue(obj);
      }
    });
    controls.forEach((control: any) => {
      this.remove(row, row.get('hours')?.controls.indexOf(control));
    });
  }

  applyAll(row: any, index: number) {
    const currentHours = row.get('hours')?.value;
    this.addDynamicRow.controls.forEach((control: any, i: number) => {
      if (i != index) {
        control.get('hours').clear();
        for (let hour of currentHours) {
          this.add(control, hour);
        }
      }
    });
  }
}
