import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompanyAdminLinkModel } from '../core/models/company/companyadminlink.model';
import { RoleAssignmentVM } from '../generated/accessList_pb';
import { EmptyResponse } from '../generated/common_pb';
import { CompaniesServiceClient } from '../generated/companiesService_pb.client';
import { CompanyVM } from '../generated/companies_pb';
import { grpcTransport } from './grpc/transport';
import { StorageService } from './storage.service';

const API_URL = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService
  ) {}

  private get_client() {
    return new CompaniesServiceClient(grpcTransport());
  }

  async getCompany(companyId: string): Promise<CompanyVM> {
    const client = this.get_client();
    const result = await client.getCompany({ companyId });
    return result.response;
  }

  async updateCompany(
    companyId: string,
    company: CompanyVM
  ): Promise<CompanyVM> {
    const client = this.get_client();
    const result = await client.upsertCompany({ companyId, company });
    return result.response;
  }

  async addCompany(company: CompanyVM): Promise<CompanyVM> {
    const client = this.get_client();
    const result = await client.addCompany({ company });
    return result.response;
  }

  async deactivateCompany(companyId: string): Promise<EmptyResponse> {
    const client = this.get_client();
    const result = await client.deactivateCompany({ companyId });
    return result.response;
  }

  getAllAdminCompanies(): Observable<CompanyAdminLinkModel[]> {
    return this.httpClient.get<CompanyAdminLinkModel[]>(
      `${API_URL}/admin/company`
    );
  }

  async getCompaniesUsers(companyId: string): Promise<RoleAssignmentVM[]> {
    const client = this.get_client();
    const result = await client.getCompanyUserAccessList({ companyId });
    return result.response.list;
  }

  // Access
  async addCompanyUserAccess(
    companyId: string,
    userEmail: string,
    roleName: string
  ): Promise<RoleAssignmentVM[]> {
    const client = this.get_client();
    const result = await client.addUserAccess({
      companyId,
      userEmail,
      roleName,
    });
    return result.response.list;
  }

  async updateCompanyUserAccess(
    companyId: string,
    userId: string,
    roleName: string
  ): Promise<RoleAssignmentVM[]> {
    const client = this.get_client();
    const result = await client.updateUserAccess({
      companyId,
      userId,
      roleName,
    });
    return result.response.list;
  }

  async deleteCompanyUserAccess(
    companyId: string,
    userId: string
  ): Promise<RoleAssignmentVM[]> {
    const client = this.get_client();
    const result = await client.removeUserAccess({ companyId, userId });
    return result.response.list;
  }

  async getCompanyMenus(companyId: string) {
    const companyMenus = localStorage.getItem('companyMenus');
    return companyMenus ? JSON.parse(companyMenus) : [];
  }

  async setCompanyMenus(companyId: string, menus: {}[]) {
    let menu = await this.getCompanyMenus(companyId);
    localStorage.setItem('companyMenus', JSON.stringify(menu.concat(menus)));
  }

  async updateCompanyMenus(companyId: string, menuId: string, menus: {}[]) {
    return;
  }

  async getCompanyMenuById(companyId: string, menuId: string) {
    let menu = await this.getCompanyMenus(companyId);
    if (menu.length) {
      return menu.find((m: any) => m.id == menuId);
    }
    return {};
  }
}
