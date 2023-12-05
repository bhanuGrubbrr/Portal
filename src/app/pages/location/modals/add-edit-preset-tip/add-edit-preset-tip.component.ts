import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { presetTip } from 'src/app/grubbrr/core/models/graphql/menusetting.model';
import { StorageService } from 'src/app/grubbrr/service/storage.service';

@Component({
  selector: 'app-add-edit-preset-tip',
  templateUrl: './add-edit-preset-tip.component.html',
  styleUrls: ['./add-edit-preset-tip.component.scss'],
})
export class AddEditPresetTipComponent implements OnInit, AfterViewInit {
  @ViewChild('tipPercentageAmountLabel', { static: false })
  tipPercentageAmountLabel: ElementRef;
  @ViewChild('flatTipAmountLabel', { static: false })
  flatTipAmountLabel: ElementRef;
  @Input() fromParent: any;
  presetTip: presetTip;
  presetTipForm: FormGroup;
  addEditLabel = 'Add ';
  formReady = false;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private loader: NgxUiLoaderService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    public activeModal: NgbActiveModal
  ) {}

  ngAfterViewInit(): void {
    this.toggleTipAmount(
      this.presetTipForm?.get('tipIsPercentage')?.value ? 0 : 1
    );
  }

  ngOnInit(): void {
    this.presetTip = this.fromParent.presetTip;
    this.addEditLabel = this.fromParent.addNew;

    this.initForm();
    this.cdr.detectChanges();
    this.formReady = true;
  }

  initForm() {
    this.presetTipForm = this.fb.group({
      isDefault: this.fb.control(this.presetTip.isDefault),
      tipIsPercentage: this.fb.control(this.presetTip.tipIsPercentage),
      tipPercentageOrAmount: this.fb.control(
        this.presetTip.tipPercentageOrAmount
      ),
    });
  }

  closeModal(message: string) {
    this.activeModal.close(message);
  }

  toggleTipAmount(index: number): void {
    if (index === 0) {
      this.renderer.addClass(
        this.tipPercentageAmountLabel.nativeElement,
        'active'
      );
      this.renderer.removeClass(
        this.flatTipAmountLabel.nativeElement,
        'active'
      );
      this.presetTipForm.patchValue({ tipIsPercentage: true });
    } else {
      this.renderer.removeClass(
        this.tipPercentageAmountLabel.nativeElement,
        'active'
      );
      this.renderer.addClass(this.flatTipAmountLabel.nativeElement, 'active');
      this.presetTipForm.patchValue({ tipIsPercentage: false });
    }

    this.presetTipForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }
}
