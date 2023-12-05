import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConceptsService } from 'src/app/grubbrr/service/concepts.service';
import { ActivatedRoute } from '@angular/router';
import { ConceptVM } from 'src/app/grubbrr/generated/kioskConfig_pb';
import { MenuService } from 'src/app/grubbrr/service/menu.service';

@Component({
  selector: 'app-add-edit-concept',
  templateUrl: './add-edit-concept.component.html',
  styleUrls: ['./add-edit-concept.component.scss'],
})
export class AddEditConceptComponent implements OnInit {
  @Input() locationId: string;
  conceptId: string;
  addConceptForm: FormGroup;
  activeModal: any;
  img: File;
  Active: boolean = true;
  @Input() createConcept: Function;

  constructor(
    private modalService: NgbActiveModal,
    private conceptsService: ConceptsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private menuService: MenuService
  ) {}

  private async initializeForm() {
    this.addConceptForm = this.fb.group({
      name: this.fb.control(''),
      isActive: [true],
      theme: this.fb.group({
        media: this.fb.group({
          logo: [],
        }),
      }),
    });
  }

  onFileChanged(event: any) {
    console.log('Cng', event);
    this.img = event.target.files[0];
  }

  onClick() {
    this.Active = !this.Active; //not equal to condition
  }

  closeModal() {
    this.modalService.close();
  }

  delete() {
    this.conceptsService.removeConcept(this.locationId, this.conceptId);
  }

  async save() {
    let concept = this.addConceptForm.getRawValue() as ConceptVM;
    if (
      this.addConceptForm?.get('theme')?.get('media')?.get('logo')?.value &&
      this.addConceptForm?.get('theme')?.get('media')?.get('logo')?.dirty
    ) {
      let url = await this.menuService.uploadImage(
        this.locationId,
        this.addConceptForm?.get('theme')?.get('media')?.get('logo')?.value
      );
      concept.theme = {
        media: {
          logo: url,
          categoryHeader: '',
        },
      };
    }
    await this.conceptsService.createConcept(this.locationId, concept);
    this.modalService.close();
  }

  ngOnInit(): void {
    this.initializeForm();
  }
}
