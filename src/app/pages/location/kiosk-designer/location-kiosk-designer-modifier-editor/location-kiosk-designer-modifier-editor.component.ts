import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  MenuItemWithCategoryAndModifierGroups,
  MenuService,
  ModifierGroup,
} from 'src/app/grubbrr/service/menu.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

export type MenuItemFormValues = {
  displayName: string;
  description: string;
  image: File | string | null;
  selectedImage: File | string | null;
  selectedDisplayName: string;
  isActive: boolean;
  calorieText: string;
  modifierGroups: ModifierGroup[];
};
@Component({
  selector: 'app-location-kiosk-designer-modifier-editor',
  templateUrl: './location-kiosk-designer-modifier-editor.component.html',
  styleUrls: ['./location-kiosk-designer-modifier-editor.component.scss'],
})
export class LocationKioskDesignerModifierEditorComponent implements OnInit {
  @Input() menuItem: MenuItemWithCategoryAndModifierGroups | undefined;
  @Input() locationId: string;
  @Output() formSubmitted = new EventEmitter<MenuItemFormValues>();

  itemForm: FormGroup;
  descriptionPlaceholderText: string = 'Enter modifier description here';
  formReady = false;
  tab: number = 1;

  allModifierGroups: ModifierGroup[];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private menuService: MenuService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.tab = params['tab'] ?? 1;
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.fetchData();
  }

  initForm() {
    this.itemForm = this.fb.group({
      displayName: this.fb.control(this.menuItem?.displayName ?? ''),
      description: this.fb.control(this.menuItem?.description ?? ''),
      image: this.fb.control(this.menuItem?.image ?? null),
      selectedImage: this.fb.control(this.menuItem?.selectedImage ?? null),
      selectedDisplayName: this.fb.control(
        this.menuItem?.selectedDisplayName ?? ''
      ),
      isActive: this.fb.control(this.menuItem?.isActive ?? true),
      calorieText: this.fb.control(this.menuItem?.calorieText ?? ''),
      modifierGroups: this.fb.control(this.menuItem?.modifierGroups ?? []),
    });

    this.formReady = true;
  }

  onSubmit() {
    if (this.itemForm.value.calorieText) {
      this.itemForm.value.calorieText = this.itemForm.value.calorieText.slice(
        0,
        25
      );
    }
    this.formSubmitted.emit(this.itemForm.value);
  }

  private async fetchData() {
    this.allModifierGroups = await this.menuService.getModifierGroups(
      this.locationId
    );
  }
}
