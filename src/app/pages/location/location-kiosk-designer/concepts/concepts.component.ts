import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AddEditConceptComponent } from '../../modals/add-edit-concept/add-edit-concept.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConceptsService } from 'src/app/grubbrr/service/concepts.service';
import { ActivatedRoute } from '@angular/router';
import { ConceptVM } from 'src/app/grubbrr/generated/kioskConfig_pb';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-concepts',
  templateUrl: './concepts.component.html',
  styleUrls: ['./concepts.component.scss'],
})
export class ConceptsComponent implements OnInit {
  locationId: string;
  modalOptions: NgbModalOptions;
  concepts: ConceptVM[];

  constructor(
    private modalService: NgbModal,
    private conceptService: ConceptsService,
    private route: ActivatedRoute,
    private change: ChangeDetectorRef,
    private loader: NgxUiLoaderService
  ) {
    this.modalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'md',
      scrollable: true,
    };
  }

  async drop(event: CdkDragDrop<string[], string[], any>) {
    moveItemInArray(this.concepts, event.previousIndex, event.currentIndex);

    const ordererdIds: string[] = this.concepts.map((concept) => concept.id);

    await this.conceptService.reorderConcepts(this.locationId, ordererdIds);
  }

  async createNewConceptModal() {
    const modalRef = this.modalService.open(
      AddEditConceptComponent,
      this.modalOptions
    );
    modalRef.componentInstance.locationId = this.locationId;
    await modalRef.result;
    this.fetchData();
  }

  async onChangeActiveStatus(concept: ConceptVM, locationId: string) {
    this.loader.start();

    concept.isActive = !concept.isActive;
    await this.conceptService.updateConcept(locationId, concept);
    this.change.detectChanges();

    this.loader.stop();
  }

  async fetchData() {
    const result = await this.conceptService.getConcepts(this.locationId);
    this.concepts = result.concepts;
    this.change.detectChanges();
  }

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.fetchData();
  }
}
