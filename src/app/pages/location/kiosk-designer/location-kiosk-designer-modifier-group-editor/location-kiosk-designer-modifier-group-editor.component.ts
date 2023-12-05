import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import {
  MenuItem,
  MenuService,
  Modifier,
} from 'src/app/grubbrr/service/menu.service';

import { ModifierGroupWithModifiers } from 'src/app/grubbrr/service/menu.service';
import { ModifierListEditorValue } from './modifier-list-editor/modifier-list-editor.component';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { ToastrService } from 'ngx-toastr';
import {
  UnsavedModifier,
  isSavedModifier,
} from 'src/app/grubbrr/models/menu.models';

export type ModifierGroupFormValues = {
  name: string;
  displayName: string;
  isActive: boolean;
  selectMin: number | null;
  selectMax: number | null;
  displayFlow?: string;
  // The user can edit nested modifiers - so we need to keep track of any modified modifier along with the modifiers directly assigned
  modifiers: (Modifier | UnsavedModifier)[];
  allEditedModifiers: Modifier[];
  usedIn?: MenuItem[];
};

@Component({
  selector: 'app-location-kiosk-designer-modifier-group-editor',
  templateUrl: './location-kiosk-designer-modifier-group-editor.component.html',
  styleUrls: ['./location-kiosk-designer-modifier-group-editor.component.scss'],
})
export class LocationKioskDesignerModifierGroupEditorComponent
  implements OnInit
{
  @Input() cardTitle: string;
  @Input() locationId: string;
  @Input() modifierGroup: ModifierGroupWithModifiers | null;
  @Input() allItems: MenuItem[] = [];
  @Input() allModifiers: MenuItem[] = [];
  @Input() allModifierGroups: ModifierGroupWithModifiers[] = [];
  @Output() formSubmitted = new EventEmitter<ModifierGroupFormValues>();
  modifierGroupForm: FormGroup;

  formReady = false;
  posIntegrationId: string;
  allowedPOSFreeModifierCount: string[] = [
    'pid-ncr-aloha',
    'pid-ncr-v2-aloha',
    'pid-ncr-aloha-cloud',
    'pid-parbrink',
  ];

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private menuService: MenuService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  getItemDisplayName(menuItem: MenuItem) {
    return menuItem.displayName;
  }

  ngOnInit(): void {
    const modifierListValue: ModifierListEditorValue = {
      modifiersByModifierGroup: {
        root: this.modifierGroup?.modifiers ?? [],
      },
      editedModifiers: [],
    };

    this.modifierGroupForm = this.fb.group(
      {
        name: this.fb.control(this.modifierGroup?.name ?? ''),
        displayName: this.fb.control(this.modifierGroup?.displayName ?? ''),
        // displayFlow: this.fb.control(this.modifierGroup?.displayFlow ?? ''),
        usedInItems: this.fb.control(this.modifierGroup?.usedIn ?? []),
        selectMin: this.fb.control(this.modifierGroup?.selectMin ?? 0),
        selectMax: this.fb.control(this.modifierGroup?.selectMax ?? 0),
        isActive: this.fb.control(this.modifierGroup?.isActive ?? true),
        modifiers: this.fb.control(modifierListValue),
        editedModifiers: this.fb.control([]),
      },
      { validator: this.minLessThanMax }
    );

    this.formReady = true;
    this.initPOSSettings();
    !this.allModifierGroups && this.fetchAllModifierGroups();
  }

  async fetchAllModifierGroups() {
    this.allModifierGroups = await this.menuService.getModifierGroups(
      this.locationId
    );
  }

  async initPOSSettings() {
    var settings = await this.locationService.getLocationPosSettings(
      this.locationId
    );
    if (settings.config) {
      this.posIntegrationId = settings.config.posIntegrationId;
      this.cdr.detectChanges();
    }
  }

  onSubmit() {
    const formValues = this.modifierGroupForm.value;
    const parseOptionalNumericValue = (value: string): number | null => {
      if (!value) {
        return null;
      }

      const numericValue = parseInt(value);
      if (isNaN(numericValue)) {
        return null;
      }

      return numericValue;
    };

    let allModifierGroupNames = this.modifierGroup
      ? this.allModifierGroups
          .filter((mg) => mg.id != this.modifierGroup?.id)
          .map((mg) => mg.name)
      : this.allModifierGroups.map((mg) => mg.name);
    if (allModifierGroupNames.indexOf(formValues.name) != -1) {
      this.toast.error('Modifier group name already exist');
      return;
    }
    const modifierListFormValue =
      formValues.modifiers as ModifierListEditorValue;

    this.formSubmitted.emit({
      name: formValues.name,
      displayName: formValues.displayName,
      isActive: formValues.isActive,
      selectMin: parseOptionalNumericValue(formValues.selectMin),
      selectMax: parseOptionalNumericValue(formValues.selectMax),
      displayFlow: formValues.displayFlow,
      modifiers: modifierListFormValue.modifiersByModifierGroup['root'],
      allEditedModifiers:
        modifierListFormValue.editedModifiers.filter(isSavedModifier),
      usedIn: formValues.usedInItems,
    });
  }

  minLessThanMax(control: AbstractControl): ValidationErrors | null {
    const selectMin = parseInt(control.get('selectMin')?.value);
    const selectMax = parseInt(control.get('selectMax')?.value);
    if (isNaN(selectMin) || isNaN(selectMax)) {
      return { notNumbers: true };
    }

    if (selectMin > selectMax) {
      return { minGreaterThanMax: true };
    }

    return null;
  }

  getSuggestionLabel(entity: MenuItem) {
    return entity.displayName;
  }

  getSuggestionLabelId(entity: MenuItem) {
    return entity.id;
  }
}
