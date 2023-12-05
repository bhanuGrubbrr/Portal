import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { AdminUserModel } from 'src/app/grubbrr/core/models/adminuser.model';
import { StorageService } from 'src/app/grubbrr/service/storage.service';

@Component({
  selector: 'app-admin-add-edit-modal',
  templateUrl: './admin-add-edit-modal.component.html',
  styleUrls: ['./admin-add-edit-modal.component.scss'],
})
export class AdminAddEditModalComponent implements OnInit, OnDestroy {
  user: AdminUserModel;
  @Input() fromParent: any;
  users: AdminUserModel[];
  closeResult = '';
  accessList: any = ['SysAdmin', 'SupportAdmin'];
  userForm: FormGroup;
  actionLabel = 'Add';
  saving: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    public activeModal: NgbActiveModal
  ) {}

  initForm() {
    this.userForm = this.fb.group({
      email: this.fb.control(
        this.user?.email ?? '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320),
        ])
      ),
      role: this.fb.control(
        this.user?.role ?? '',
        Validators.compose([Validators.required])
      ),
    });
  }

  ngOnInit(): void {
    if (this.fromParent?.user) {
      this.actionLabel = 'Edit';
      this.user = this.fromParent.user;
    }

    this.users = this.fromParent.users;
    this.initForm();
  }

  onSubmit() {
    let user: AdminUserModel = {
      email: this.userForm.value.email,
      role: this.userForm.value.role,
    };
    this.activeModal.close(user);
  }

  checkUser() {
    const email: string = this.userForm.value.email;
    const originalEmail: string = this.user?.email ?? '';
    var matches = email === originalEmail;
    var exists = !!this.users.find((x) => x.email === email);

    if (exists && !matches) {
      this.userForm.setErrors({
        notUnique: true,
      });

      this.toastr.error('Email must be unique');
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
