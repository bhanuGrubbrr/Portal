import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import type { MenuItem, Modifier } from 'src/app/grubbrr/service/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  MenuService,
  ModifierGroupWithModifiers,
} from 'src/app/grubbrr/service/menu.service';
import { ModifierGroupFormValues } from '../../location/kiosk-designer/location-kiosk-designer-modifier-group-editor/location-kiosk-designer-modifier-group-editor.component';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { ModifierListEditorValue } from '../../location/kiosk-designer/location-kiosk-designer-modifier-group-editor/modifier-list-editor/modifier-list-editor.component';

@Component({
  selector: 'app-company-kiosk-designer-modifier-group-add',
  templateUrl: './company-kiosk-designer-modifier-group-add.component.html',
  styleUrls: ['./company-kiosk-designer-modifier-group-add.component.scss'],
})
export class CompanyKioskDesignerModifierGroupAddComponent implements OnInit {
  locationId: string;
  companyId: string;
  modifierGroupId: string;

  modifierGroup: ModifierGroupWithModifiers;
  allItems: MenuItem[] = [];
  allModifiers: MenuItem[] = [];

  saving = false;
  modifierGroupForm: FormGroup;

  formReady = false;

  getItemDisplayName(menuItem: MenuItem) {
    return menuItem.displayName;
  }
  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService,
    private loader: NgxUiLoaderService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.companyId = this.route.snapshot.params.companyid;
    this.modifierGroupId = this.route.snapshot.params.modifierGroupId;
    this.initForm();
    this.fetchData();
  }

  initForm() {
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
  }

  private async fetchData() {
    this.allItems = await this.menuService.getItems(this.locationId);
    this.allModifiers = await this.menuService.getUniqueModifiers(
      this.locationId
    );
    if (this.modifierGroupId) {
      this.modifierGroup = await this.menuService.getModifierGroup(
        this.locationId,
        this.modifierGroupId
      );
      this.initForm();
    }
    this.cdr.detectChanges();
  }

  async onSubmit() {
    // const formValues = this.modifierGroupForm.value;
    // const parseOptionalNumericValue = (value: string): number | null => {
    //   if (!value) {
    //     return null;
    //   }
    //   const numericValue = parseInt(value);
    //   if (isNaN(numericValue)) {
    //     return null;
    //   }
    //   return numericValue;
    // };
    // const modifierListFormValue =
    //   formValues.modifiers as ModifierListEditorValue;
    // const values: ModifierGroupFormValues = {
    //   name: formValues.name,
    //   displayName: formValues.displayName,
    //   isActive: formValues.isActive,
    //   selectMin: parseOptionalNumericValue(formValues.selectMin),
    //   selectMax: parseOptionalNumericValue(formValues.selectMax),
    //   displayFlow: formValues.displayFlow,
    //   modifierIds: modifierListFormValue.modifiersByModifierGroup['root'].map(
    //     (m: Modifier) => m.id
    //   ),
    //   editedModifiers: modifierListFormValue.editedModifiers,
    //   usedIn: formValues.usedInItems,
    // };
    // this.loader.start();
    // this.saving = true;
    // if (!this.modifierGroupId) {
    //   await this.menuService.createModifierGroup(this.locationId, {
    //     name: values.name,
    //     displayName: values.displayName,
    //     isActive: values.isActive,
    //     selectMin: values.selectMin,
    //     selectMax: values.selectMax,
    //     displayFlow: values.displayFlow,
    //     modifierIds: values.modifierIds,
    //   });
    // } else {
    //   if (values.usedIn) {
    //     const finalUsedInItemIds = new Set(
    //       values.usedIn.map((item) => item.id)
    //     );
    //     const originalUsedInItemIds = new Set(
    //       this.modifierGroup.usedIn?.map((item) => item.id)
    //     );
    //     const itemsToRemoveModGroupFrom = [...originalUsedInItemIds].filter(
    //       (x) => !finalUsedInItemIds.has(x)
    //     );
    //     await Promise.all(
    //       itemsToRemoveModGroupFrom.map(async (itemId) => {
    //         await this.menuService.removeModifierGroupFromItem(
    //           this.locationId,
    //           itemId,
    //           this.modifierGroupId
    //         );
    //       })
    //     );
    //     const itemsToAddModGroupTo = [...finalUsedInItemIds].filter(
    //       (x) => !originalUsedInItemIds.has(x)
    //     );
    //     await Promise.all(
    //       itemsToAddModGroupTo.map(async (itemId) => {
    //         await this.menuService.addModifierGroupToItem(
    //           this.locationId,
    //           itemId,
    //           this.modifierGroupId
    //         );
    //       })
    //     );
    //   }
    //   const editedModifiers = values.editedModifiers ?? [];
    //   for (const modifier of editedModifiers) {
    //     await this.menuService.updateModifier(this.locationId, modifier, {
    //       displayName: modifier.menuItem.displayName,
    //       isActive: modifier.menuItem.isActive,
    //       image: modifier.menuItem.image,
    //       description: modifier.menuItem.description,
    //       isDefault: modifier.isDefault,
    //       maxQuantity: modifier.maxQuantity,
    //       isInvisible: modifier.isInvisible,
    //     });
    //   }
    //   await this.menuService.updateModifierGroup(
    //     this.locationId,
    //     this.modifierGroupId,
    //     {
    //       name: values.name,
    //       displayName: values.displayName,
    //       isActive: values.isActive,
    //       selectMin: values.selectMin,
    //       selectMax: values.selectMax,
    //       displayFlow: values.displayFlow,
    //       modifierIds: values.modifierIds,
    //     }
    //   );
    // }
    // this.toast.success('Saved modifier group successfully');
    // this.loader.stop();
    // this.router.navigate(
    //   ['/company', this.companyId, this.locationId, 'kiosk-designer', 'menu'],
    //   {
    //     queryParams: { tab: 4 },
    //   }
    // );
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
