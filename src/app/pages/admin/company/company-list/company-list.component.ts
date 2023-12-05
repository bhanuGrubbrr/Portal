import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CompanyAdminLinkModel } from 'src/app/grubbrr/core/models/company/companyadminlink.model';
import { CompanyService } from '../../../../grubbrr/service/company.service';
import { CompanyCloneComponent } from '../modals/company-clone/company-clone.component';
import { CompanyDeactivateComponent } from '../modals/company-deactivate/company-deactivate.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class CompanyListComponent implements OnInit, OnDestroy {
  closeModal: any;
  contentLoaded = false;
  Companies: CompanyAdminLinkModel[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private CompanyService: CompanyService,
    private cdr: ChangeDetectorRef,
    public loader: NgxUiLoaderService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchCompanies();
  }

  sortComparator(c1: CompanyAdminLinkModel, c2: CompanyAdminLinkModel) {
    return c1.companyName.localeCompare(c2.companyName);
  }

  fetchCompanies() {
    this.subscriptions.push(
      this.CompanyService.getAllAdminCompanies()
        .pipe(
          finalize(() => {
            this.contentLoaded = true;
            this.cdr.detectChanges();
          })
        )
        .subscribe(
          (results: CompanyAdminLinkModel[]) => {
            this.Companies = results;
            this.cdr.detectChanges();
          },
          (error) => {
            this.toast.error(
              'Unable to Show Companies at this time, please try again later'
            );
          }
        )
    );
  }

  navigateToCompany(companyId: string, companyName: string): void {
    this.router.navigate(['/company', companyId]);
  }

  navigateToCompanyLocations(companyId: string, companyName: string): void {
    this.router.navigate(['/company', companyId, 'locations']);
  }

  openDeactiveModal(companyId: string, companyName: string) {
    let params = {
      companyName: `${companyName}`,
      companyId: `${companyId}`,
    };

    const modalRef = this.modalService.open(CompanyDeactivateComponent, {
      scrollable: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.fromParent = params;
    modalRef.result.then(
      (result: boolean) => {
        if (result) {
          this.fetchCompanies();
        }
      },
      (reason: any) => {}
    );
  }

  openCloneModal(companyName: string) {
    let params = {
      companyName: `${companyName}`,
    };

    const modalRef = this.modalService.open(CompanyCloneComponent, {
      scrollable: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.fromParent = params;
    modalRef.result.then(
      (result: any) => {},
      (reason: any) => {}
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  clear(table: Table, input: HTMLInputElement) {
    table.clear();
    input.value = '';
  }
}
