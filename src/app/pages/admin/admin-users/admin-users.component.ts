import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  AdminUserModel,
  AdminDeactivateUserModel,
} from 'src/app/grubbrr/core/models/adminuser.model';
import { AdminService } from 'src/app/grubbrr/service/admin.service';
import { StorageService } from 'src/app/grubbrr/service/storage.service';
import { AdminAddEditModalComponent } from '../modals/admin-add-edit-modal/admin-add-edit-modal.component';
import { AdminDeactivateModalComponent } from '../modals/admin-deactivate-modal/admin-deactivate-modal.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
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
export class AdminUsersComponent implements OnInit, OnDestroy {
  users: AdminUserModel[] = [];
  contentLoaded = false;
  modalOptions: NgbModalOptions;
  private subscriptions: Subscription[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    public loader: NgxUiLoaderService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private storageService: StorageService,
    private adminService: AdminService,
    private router: Router
  ) {
    this.modalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
      scrollable: true,
    };
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.subscriptions.push(
      this.adminService
        .getUsers()
        .pipe(
          finalize(() => {
            this.contentLoaded = true;
            this.cdr.detectChanges();
          })
        )
        .subscribe((users: AdminUserModel[]) => {
          this.users = users;
        })
    );
  }

  openEditUser(user?: AdminUserModel) {
    const modalRef = this.modalService.open(
      AdminAddEditModalComponent,
      this.modalOptions
    );

    let params = {
      user: user ?? null,
      users: this.users,
    };

    modalRef.componentInstance.fromParent = params;

    modalRef.result.then(
      (returnedUser: any) => {
        this.loader.start();
        this.subscriptions.push(
          this.adminService
            .addUser(returnedUser)
            .pipe(
              finalize(() => {
                this.contentLoaded = true;
                this.loader.stop();
                this.fetchUsers(); // just reload for now
              })
            )
            .subscribe((subscribeUser: AdminUserModel) => {
              this.contentLoaded = false;
              this.toast.success(
                `User ${subscribeUser.email} ${user ? 'updated' : 'added'} `
              );
            })
        );
      },
      (reason: any) => {}
    );
  }

  openDeactiveModal(user: AdminDeactivateUserModel) {
    const userReduced: AdminDeactivateUserModel = { email: user.email };

    let params = {
      user: userReduced,
    };

    const modalRef = this.modalService.open(AdminDeactivateModalComponent, {
      scrollable: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.fromParent = params;
    modalRef.result.then(
      (result: any) => {
        if (result === user.email) {
          this.loader.start();
          this.subscriptions.push(
            this.adminService
              .removeUser(user)
              .pipe(
                finalize(() => {
                  this.contentLoaded = true;
                  this.loader.stop();
                  this.fetchUsers(); // just reload for now
                })
              )
              .subscribe((result: boolean) => {
                this.contentLoaded = false;
                this.toast.success(`User ${userReduced.email} removed`);
              })
          );
        }
      },
      (reason: any) => {}
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
