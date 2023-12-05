import { Injectable } from '@angular/core';
import { end } from '@popperjs/core';
import { Timestamp } from '../generated/google/protobuf/timestamp_pb';
import { ReportsServiceClient } from '../generated/reportsService_pb.client';
import { KPIDashboardReportVM } from '../generated/reports_pb';
import { grpcTransport } from './grpc/transport';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private loggingService: LoggingService) {}

  private get_client() {
    return new ReportsServiceClient(grpcTransport());
  }

  async getKPIReport(
    locationId: string,
    startDate: string,
    endDate: string
  ): Promise<KPIDashboardReportVM> {
    const client = this.get_client();
    const startDateDate = new Date(startDate);
    const endDateDate = new Date(endDate);

    // // Create a new google.protobuf.Timestamp object and set its seconds and nanos fields
    const startTimestamp = Timestamp.fromDate(startDateDate);
    const endTimestamp = Timestamp.fromDate(endDateDate);
    // timestamp.seconds = (startDateDate.getTime() / 1000).toString();
    // timestamp.nanos = ((startDateDate.getTime() % 1000) * 1000000);

    const result = await client.getKPIReport({
      locationId: locationId,
      startDate: startTimestamp,
      endDate: endTimestamp,
    });
    return result.response;
  }
}
