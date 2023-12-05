import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { KioskColorsVM } from 'src/app/grubbrr/generated/appearance_pb';
import {
  ConceptThemeVM,
  ConceptVM,
} from 'src/app/grubbrr/generated/kioskConfig_pb';
import { ConceptsService } from 'src/app/grubbrr/service/concepts.service';
import { AppearanceService } from 'src/app/grubbrr/service/appearance.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from 'src/app/grubbrr/service/menu.service';

@Component({
  selector: 'app-concept-edit',
  templateUrl: './concept-edit.component.html',
  styleUrls: ['./concept-edit.component.scss'],
})
export class ConceptEditComponent implements OnInit {
  currentTabIndex: number = ConceptTabs.Info;
  locationId: string;
  conceptId: string;
  addConceptForm: FormGroup;
  currentConcept: ConceptVM;
  color: KioskColorsVM;
  colorUpdated: boolean = false;

  constructor(
    private modalService: NgbActiveModal,
    private menuService: MenuService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private concepts: ConceptsService,
    private location: Location,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.conceptId = this.route.snapshot.params.conceptId;
    this.fetch();
  }

  private async fetch() {
    let concepts = await this.concepts.getConcepts(this.locationId);
    let concept = concepts.concepts.find((c) => c.id === this.conceptId);
    if (!concept) return;
    this.currentConcept = concept;
    this.initializeForm();
  }

  private async initializeForm() {
    this.addConceptForm = this.fb.group({
      name: [this.currentConcept?.name],
      id: [this.currentConcept?.id],
      isActive: this.currentConcept?.isActive,
      theme: this.fb.group({
        media: this.fb.group({
          logo: [this.currentConcept?.theme?.media?.logo],
        }),
      }),
    });
  }
  async onColorSave() {
    try {
      await this.concepts.updateConcept(this.locationId, this.currentConcept);
      this.toastr.success('Colors Updated');
    } catch (e: any) {
      this.toastr.error(e.message);
    }
  }

  delete() {
    this.concepts.removeConcept(this.locationId, this.conceptId);
    this.location.back();
  }
  onColorChangedEvent(color: string, key: keyof KioskColorsVM) {
    this.colorUpdated = true;
    if (!this.currentConcept) {
      this.currentConcept = {} as ConceptVM;
    }

    if (!this.currentConcept.theme) {
      this.currentConcept.theme = {} as ConceptThemeVM;
    }

    if (!this.currentConcept.theme.colors) {
      this.currentConcept.theme.colors = {} as KioskColorsVM;
    }
    this.currentConcept.theme.colors[key] = color.toUpperCase();
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

    if (concept.theme && this.colorUpdated) {
      concept.theme.colors = this.currentConcept.theme?.colors;
    }

    await this.concepts.updateConcept(this.locationId, concept);
    this.location.back();
  }
}

export enum ConceptTabs {
  Info = 1,
  Colours = 2,
  Fonts = 3,
  Images = 4,
  TextOverride = 5,
}
