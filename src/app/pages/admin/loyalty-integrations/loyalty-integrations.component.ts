import { trigger, transition, style, animate } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoyaltyIntegrationDefinitionVM } from 'src/app/grubbrr/generated/loyalty_pb';
import { LoyaltyService2 } from 'src/app/grubbrr/service/loyaltyService.service';
import {
  EditIntegrationComponent,
  ValidateIntegrationProp,
} from '../modals/edit-integration/edit-integration.component';
import { RemoveIntegrationComponent } from '../modals/remove-integration/remove-integration.component';

@Component({
  selector: 'app-loyalty-integrations',
  templateUrl: './loyalty-integrations.component.html',
  styleUrls: ['./loyalty-integrations.component.scss'],
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
export class LoyaltyIntegrationsComponent implements OnInit {
  gridData: any[] = [];
  contentLoaded = false;

  largeModalOptions: NgbModalOptions;
  removeModalOptions: NgbModalOptions;

  constructor(
    public loader: NgxUiLoaderService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private loyaltyService: LoyaltyService2,
    private cdr: ChangeDetectorRef
  ) {
    this.largeModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'xl',
      scrollable: true,
    };

    this.removeModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
      scrollable: false,
      centered: true,
    };
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.gridData = (await this.loyaltyService.getIntegrations()).integrations;
    this.contentLoaded = true;
  }

  public addOrUpdate(row?: any) {
    const modalRef = this.modalService.open(
      EditIntegrationComponent,
      this.largeModalOptions
    );

    modalRef.componentInstance.fromParent = {};

    if (row) modalRef.componentInstance.fromParent.integrationObject = row;
    else
      modalRef.componentInstance.fromParent.defaultObject = {
        name: '',
        integrationId: 'int-REPLACE_WITH_NAME',
        fields: {
          field1: {
            defaultValue: '',
            minLength: 0,
            maxLength: 0,
            minValue: 0,
            maxValue: 0,
            formFieldValueType: 'TEXT',
            label: '',
            required: false,
          },
        },
      };

    modalRef.componentInstance.fromParent.validateJson = (
      jsonObj: ValidateIntegrationProp
    ) => {
      const definition = jsonObj as unknown as LoyaltyIntegrationDefinitionVM;
      //jsonObj.errorList.push()
    };

    modalRef.result.then(async (jsonObj?: string) => {
      if (jsonObj) {
        const definition = jsonObj as unknown as LoyaltyIntegrationDefinitionVM;
        await this.loyaltyService.upsertIntegrationDefinition(definition);

        const oldDefinition = this.gridData.filter(
          (g) => g.integrationId === definition.integrationId
        )[0];
        if (oldDefinition)
          this.gridData[this.gridData.indexOf(oldDefinition)] = definition;
        else this.gridData.push(definition);

        this.cdr.detectChanges();
      }
    });
  }

  public remove(row: any) {
    const modalRef = this.modalService.open(
      RemoveIntegrationComponent,
      this.removeModalOptions
    );

    modalRef.componentInstance.fromParent = {
      name: row.name,
    };

    modalRef.result.then(async (removeConfirmed: boolean) => {
      if (removeConfirmed) {
        await this.loyaltyService.removeIntegrationDefinition(
          row.integrationId
        );
        this.gridData = this.gridData.filter(
          (d) => d.integrationId !== row.integrationId
        );
        this.cdr.detectChanges();
      }
    });
  }
}
