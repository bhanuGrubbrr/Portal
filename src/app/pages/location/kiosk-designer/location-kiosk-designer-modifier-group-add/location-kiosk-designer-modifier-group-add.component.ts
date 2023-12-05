import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import type { MenuItem, Modifier } from 'src/app/grubbrr/service/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  MenuService,
  ModifierGroupWithModifiers,
} from 'src/app/grubbrr/service/menu.service';
import { ModifierGroupFormValues } from '../location-kiosk-designer-modifier-group-editor/location-kiosk-designer-modifier-group-editor.component';
import { Observable, Subscription, map } from 'rxjs';

@Component({
  selector: 'app-location-kiosk-designer-modifier-group-add',
  templateUrl: './location-kiosk-designer-modifier-group-add.component.html',
  styleUrls: ['./location-kiosk-designer-modifier-group-add.component.scss'],
})
export class LocationKioskDesignerModifierGroupAddComponent
  implements OnInit, OnDestroy
{
  locationId: string;
  modifierGroupId: string;

  allItems: MenuItem[] = [];
  allModifiers: MenuItem[] = [];

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
    this.allItems = await this.menuService.getItems(this.locationId);

    this.allModifiers = await this.menuService.getUniqueModifiers(
      this.locationId
    );

    this.cdr.detectChanges();
  }

  async onSubmit(values: ModifierGroupFormValues) {
    this.loader.start();
    this.saving = true;

    let createReponse = await this.menuService.createModifierGroup(
      this.locationId,
      {
        name: values.name,
        displayName: values.displayName,
        isActive: values.isActive,
        selectMin: values.selectMin,
        selectMax: values.selectMax,
        displayFlow: values.displayFlow,
        modifiers: values.modifiers,
      }
    );

    if (values.usedIn) {
      const itemsToAddModGroupTo = [
        ...new Set(values.usedIn.map((item) => item.id)),
      ];

      await Promise.all(
        itemsToAddModGroupTo.map(async (itemId) => {
          await this.menuService.addModifierGroupToItem(
            this.locationId,
            itemId,
            createReponse.response.id // modifierGroupId
          );
        })
      );
    }

    this.toast.success('Saved category successfully');
    this.loader.stop();

    this.router.navigate(
      ['/location', this.locationId, 'kiosk-designer', 'menu'],
      {
        queryParams: { tab: 4 },
      }
    );
  }
}
