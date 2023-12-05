import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Console } from 'console';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RoleAssignmentVM } from 'src/app/grubbrr/generated/accessList_pb';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { CompanyService } from 'src/app/grubbrr/service/company.service';
import { PageInfoService, PageLink } from 'src/app/metronic/_metronic/layout';
import { CompanyAccessRemoveModalComponent } from '../company-access-remove-user-modal/company-access-remove-user-modal.component';
import { CompanyAccessEditUserModalComponent } from '../company-access-edit-user-modal/company-access-edit-user-modal.component';
@Component({
  selector: 'app-company-access',
  templateUrl: './company-access.component.html',
  styleUrls: ['./company-access.component.scss'],
})
export class CompanyAccessComponent implements OnInit {
  companyId: string;
  pageTitle: string;
  companyUsers: RoleAssignmentVM[] = [];
  modalOptions: NgbModalOptions;
  breadCrumbs: Array<PageLink> = [];

  constructor(
    private loader: NgxUiLoaderService,
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private pageService: PageInfoService,
    public route: ActivatedRoute,
    private breadCrumbService: BreadCrumbService
  ) {
    this.modalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
      scrollable: true,
    };
  }

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    await this.fetchUsers();
  }

  private async fetchUsers() {
    this.loader.start();

    try {
      this.companyUsers = await this.companyService.getCompaniesUsers(
        this.companyId
      );
    } catch (ex) {
      this.toastr.error('Unable to retrieve company users');
      console.error(ex);
    } finally {
      this.loader.stop();
      this.cdr.detectChanges();
    }
  }

  newUserAdded(newItem: string) {
    this.fetchUsers();
  }

  openEditAccessModal(userRole: RoleAssignmentVM) {
    const modalRef = this.modalService.open(
      CompanyAccessEditUserModalComponent,
      this.modalOptions
    );

    let params = {
      userRole: userRole,
      companyId: this.companyId,
    };

    modalRef.componentInstance.fromParent = params;

    modalRef.result.then(
      (result: any) => {
        this.fetchUsers();
      },
      (reason: any) => {}
    );
  }

  openRemoveAccessModal(userRole: RoleAssignmentVM) {
    const modalRef = this.modalService.open(
      CompanyAccessRemoveModalComponent,
      this.modalOptions
    );

    modalRef.componentInstance.fromParent = userRole;
    modalRef.result.then(
      (userId: string) => {
        if (userId == userRole.userId) {
          this.removeAccess(userRole);
        }
      },
      (reason: any) => {}
    );
  }

  async removeAccess(userRole: RoleAssignmentVM) {
    this.loader.start();

    try {
      await this.companyService.deleteCompanyUserAccess(
        this.companyId,
        userRole.userId
      );
      this.toastr.success('User access has been removed.');
      this.fetchUsers();
    } catch (ex) {
      this.toastr.error('unable to remove the user from the company');
    }
  }

  private async setupPageTitle(): Promise<void> {
    this.companyId = this.route.snapshot.params.companyid;
    this.pageTitle = 'Company > Users';

    const breadCrumbInfo = await this.breadCrumbService.getCompanyBreadCrumb(
      this.companyId,
      this.pageTitle
    );

    this.pageService.updateTitle(this.pageTitle);
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }
}
