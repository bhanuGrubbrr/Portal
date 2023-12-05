export class PosSyncSchedule {
  public constructor(fields: { trackings: PosSyncScheduleTracking[] }) {
    this.trackings = fields?.trackings ?? [];
  }

  trackings: Array<PosSyncScheduleTracking>;
}

export class PosSyncScheduleTracking {
  public constructor(fields?: {
    daysOfTheWeek: number[];
    scheduleHour: number;
    scheduleHourQuarter: number;
  }) {
    this.isNew = true;
    this.daysOfTheWeek = fields?.daysOfTheWeek ?? [0, 1, 2, 3, 4, 5, 6];
    this.scheduleHour = fields?.scheduleHour ?? 0;
    this.scheduleHourQuarter = fields?.scheduleHourQuarter ?? 0;
    this.isAM = this.scheduleHour < 12;

    this.displayHour = this.isAM
      ? this.scheduleHour === 0
        ? 12
        : this.scheduleHour
      : this.scheduleHour % 12 || 12;

    this.displayTime = `${this.displayHour}:${
      this.scheduleHourQuarter == 0 ? '00' : this.scheduleHourQuarter
    } ${this.isAM ? 'AM' : 'PM'}`;
  }

  public calcDisplayTime = (
    isAM: boolean,
    scheduleHour: number,
    quarterHour: number
  ) => {
    this.isAM = isAM;

    let displayScheduleHour = scheduleHour;

    if (isAM) {
      const amTime = scheduleHour % 12;
      this.scheduleHour = amTime;
      displayScheduleHour = amTime % 12 || 12;
    } else {
      const pmTime = (scheduleHour % 12) + 12;
      this.scheduleHour = pmTime;
      displayScheduleHour = pmTime;
    }

    if (quarterHour) {
      this.scheduleHourQuarter = quarterHour;
    }

    this.displayTime = `${this.scheduleHour % 12 || 12}:${
      quarterHour == 0 ? '00' : quarterHour
    } ${isAM ? 'AM' : 'PM'}`;
  };

  updateScheduleHour(scheduleHour: number) {
    this.scheduleHour = scheduleHour;
  }

  updateScheduleHourQuarter(scheduleHourQuarter: number) {
    this.scheduleHourQuarter = scheduleHourQuarter;
  }

  updateMeridiem(meridiem: string) {
    this.isAM = meridiem === 'am';
  }

  isAM: boolean = true;
  isNew: boolean = false;
  daysOfTheWeek: number[];
  displayHour: number;
  scheduleHour: number;
  scheduleHourQuarter: number;
  displayTime: string;
}
