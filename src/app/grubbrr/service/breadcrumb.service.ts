import { Injectable } from '@angular/core';
import { PageLink } from 'src/app/metronic/_metronic/layout';
import { environment } from 'src/environments/environment';
import { LocationIdService } from './location-id.service';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class BreadCrumbService {
  // Cache / Dictionary

  constructor(private locationIdService: LocationIdService) {}

  // Breadcrumb
  public async getAdminBreadCrumb(
    companyId?: string,
    area?: string
  ): Promise<BreadCrumbInfo> {
    const breadCrumbInfo: BreadCrumbInfo = new BreadCrumbInfo();

    if (companyId) {
      breadCrumbInfo.companyId = companyId;
      breadCrumbInfo.companyName = await this.locationIdService.GetCompanyName(
        companyId
      );
    }

    breadCrumbInfo.buildAdminBreadCrumbs(area);
    return breadCrumbInfo;
  }

  public async getCompanyBreadCrumb(
    companyId: string,
    area?: string
  ): Promise<BreadCrumbInfo> {
    const breadCrumbInfo: BreadCrumbInfo = new BreadCrumbInfo();
    breadCrumbInfo.companyId = companyId;
    breadCrumbInfo.companyName = await this.locationIdService.GetCompanyName(
      companyId
    );

    breadCrumbInfo.buildCompanyBreadCrumbs(area);
    return breadCrumbInfo;
  }

  public async getLocationBreadCrumb(
    locationId: string,
    area?: string,
    areaUrl?: string
  ): Promise<BreadCrumbInfo> {
    const breadCrumbInfo: BreadCrumbInfo = new BreadCrumbInfo();

    breadCrumbInfo.setLocationId = locationId;
    breadCrumbInfo.locationName = await this.locationIdService.GetLocationName(
      locationId
    );
    breadCrumbInfo.companyId =
      await this.locationIdService.GetCompanyIdFromLocationId(locationId);
    breadCrumbInfo.companyName = await this.locationIdService.GetCompanyName(
      breadCrumbInfo.companyId
    );

    breadCrumbInfo.buildLocationBreadCrumbs(area);
    return breadCrumbInfo;
  }
}

export class BreadCrumbInfo {
  companyName?: string;
  companyId?: string;
  locationName?: string;
  locationId?: string;

  breadCrumbs: Array<PageLink> = []; // Metronic object

  set setLocationId(locationId: string) {
    this.locationId = locationId;
    this.companyId = locationId.split('.')[1];
  }

  buildAdminBreadCrumbs(area?: string, areaUrl?: string): void {
    this.breadCrumbs.push(
      {
        title: `Admin Home`,
        path: `admin/company`,
        isActive: false,
        isSeparator: false,
      },
      {
        title: '',
        path: '',
        isActive: false,
        isSeparator: true,
      }
    );

    if (this.companyId) {
      this.breadCrumbs.push(
        {
          title: `${this.companyName}`,
          path: `company/${this.companyId}`,
          isActive: false,
          isSeparator: false,
        },
        {
          title: '',
          path: '',
          isActive: false,
          isSeparator: true,
        }
      );
    }

    if (area) {
      this.breadCrumbs.push({
        title: `${area}`,
        path: areaUrl ?? '',
        isActive: true,
        isSeparator: false,
      });
    }
  }

  buildCompanyBreadCrumbs(area?: string, areaUrl?: string): void {
    this.breadCrumbs.push(
      {
        title: `${this.companyName}`,
        path: `company/${this.companyId}`,
        isActive: false,
        isSeparator: false,
      },
      {
        title: '',
        path: '',
        isActive: false,
        isSeparator: true,
      }
    );

    if (area) {
      this.breadCrumbs.push({
        title: `${area}`,
        path: areaUrl ?? '',
        isActive: true,
        isSeparator: false,
      });
    }
  }

  buildLocationBreadCrumbs(area?: string, areaUrl?: string): void {
    this.breadCrumbs.push(
      {
        title: `${this.companyName}`,
        path: `company/${this.companyId}`,
        isActive: false,
        isSeparator: false,
      },
      {
        title: '',
        path: '',
        isActive: false,
        isSeparator: true,
      },
      {
        title: `${this.locationName}`,
        path: `location/${this.locationId}`,
        isActive: false,
        isSeparator: false,
      },
      {
        title: '',
        path: '',
        isActive: false,
        isSeparator: true,
      }
    );

    if (area) {
      this.breadCrumbs.push({
        title: `${area}`,
        path: '', // areaUrl ?? '',
        isActive: false,
        isSeparator: false,
      });
    }
  }
}
