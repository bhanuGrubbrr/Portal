import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import type {
  MenuItem,
  Modifier,
  ModifierGroupSaveData,
} from 'src/app/grubbrr/service/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  MenuService,
  ModifierGroupWithModifiers,
} from 'src/app/grubbrr/service/menu.service';
import { ModifierGroupFormValues } from '../location-kiosk-designer-modifier-group-editor/location-kiosk-designer-modifier-group-editor.component';
import { EditedModifier } from 'src/app/grubbrr/models/menu.models';
import { Observable, Subscription, map } from 'rxjs';

@Component({
  selector: 'app-location-kiosk-designer-modifier-group-edit',
  templateUrl: './location-kiosk-designer-modifier-group-edit.component.html',
  styleUrls: ['./location-kiosk-designer-modifier-group-edit.component.scss'],
})
export class LocationKioskDesignerModifierGroupEditComponent
  implements OnInit, OnDestroy
{
  locationId: string;
  modifierGroupId: string;

  modifierGroup: ModifierGroupWithModifiers;
  allItems: MenuItem[] = [];
  availableModifiersToAdd: MenuItem[];

  saving = false;
  subscription: Subscription;
  allModifierGroups: ModifierGroupWithModifiers[] = [];

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService,
    private loader: NgxUiLoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.modifierGroupId = this.route.snapshot.params.modifierGroupId;
    this.fetchData();
    const state$: Observable<object> = this.route.paramMap.pipe(
      map(() => window.history.state)
    );
    this.subscription = state$.subscribe((data: any) => {
      this.allModifierGroups = data.modifierGroups;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private async fetchData() {
    this.modifierGroup = await this.menuService.getModifierGroup(
      this.locationId,
      this.modifierGroupId
    );
    this.allItems = await this.menuService.getItems(this.locationId);

    // TODO: How should we determine which mods can be added
    this.availableModifiersToAdd =
      (await this.menuService.getUniqueModifiers(this.locationId)) ?? [];

    this.cdr.detectChanges();
  }

  async onSubmit(values: ModifierGroupFormValues) {
    this.loader.start();
    this.saving = true;

    if (values.usedIn) {
      const finalUsedInItemIds = new Set(values.usedIn.map((item) => item.id));
      const originalUsedInItemIds = new Set(
        this.modifierGroup.usedIn?.map((item) => item.id)
      );

      const itemsToRemoveModGroupFrom = [...originalUsedInItemIds].filter(
        (x) => !finalUsedInItemIds.has(x)
      );
      await Promise.all(
        itemsToRemoveModGroupFrom.map(async (itemId) => {
          await this.menuService.removeModifierGroupFromItem(
            this.locationId,
            itemId,
            this.modifierGroupId
          );
        })
      );

      const itemsToAddModGroupTo = [...finalUsedInItemIds].filter(
        (x) => !originalUsedInItemIds.has(x)
      );
      await Promise.all(
        itemsToAddModGroupTo.map(async (itemId) => {
          await this.menuService.addModifierGroupToItem(
            this.locationId,
            itemId,
            this.modifierGroupId
          );
        })
      );
    }

    const modifiers = values.allEditedModifiers ?? [];
    let editedModifiers: EditedModifier[] = [];
    for (const modifier of modifiers) {
      const editedModifier: EditedModifier = {
        originalModifier: modifier,
        displayName: modifier.menuItem.displayName,
        isActive: modifier.menuItem.isActive,
        image: modifier.menuItem.image,
        description: modifier.menuItem.description,
        isDefault: modifier.isDefault,
        maxQuantity: modifier.maxQuantity,
        isInvisible: modifier.isInvisible,
      };
      editedModifiers.push({ ...editedModifier });
    }

    let modifierGroupSavedData: ModifierGroupSaveData = {
      name: values.name,
      displayName: values.displayName,
      isActive: values.isActive,
      selectMin: values.selectMin,
      selectMax: values.selectMax,
      displayFlow: values.displayFlow,
      modifiers: values.modifiers,
    };

    try {
      await this.menuService.updateModifierGroup(
        this.locationId,
        this.modifierGroupId,
        modifierGroupSavedData
      );

      // TODO: Line #144 saves the current modifier group and the modifiers associated
      // with it. However, the modifier group UI allows users to drill into nested
      // modifiers so we need an API method to properly save them
      // await this.menuService.updateModifierGroupWithModifierAndMenuItemsOverrides(
      //   this.locationId,
      //   this.modifierGroupId,
      //   modifierGroupSavedData,
      //   editedModifiers
      // );

      this.toast.success('Saved modifier group successfully');
    } catch (error: any) {
      this.toast.error(error.message);
    } finally {
      this.loader.stop();

      this.router.navigate(
        ['/location', this.locationId, 'kiosk-designer', 'menu'],
        {
          queryParams: { tab: 4 },
        }
      );
    }
  }
}
