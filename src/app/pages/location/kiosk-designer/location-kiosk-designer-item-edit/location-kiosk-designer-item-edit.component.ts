import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  MenuCategory,
  MenuItemWithCategoryAndModifierGroups,
  MenuService,
  ModifierGroup,
} from 'src/app/grubbrr/service/menu.service';
import { MenuItemFormValues } from '../location-kiosk-designer-item-editor/location-kiosk-designer-item-editor.component';

@Component({
  selector: 'app-location-kiosk-designer-item-edit',
  templateUrl: './location-kiosk-designer-item-edit.component.html',
  styleUrls: ['./location-kiosk-designer-item-edit.component.scss'],
})
export class LocationKioskDesignerItemEditComponent implements OnInit {
  locationId: string;
  menuItemId: string;

  menuItem: MenuItemWithCategoryAndModifierGroups | null;

  loading = true;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private toast: ToastrService,
    private loader: NgxUiLoaderService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      const tab = params.tab;
    });
  }

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.menuItemId = this.route.snapshot.params.menuItemId;
    this.fetchData();
  }

  async onSubmit(values: MenuItemFormValues) {
    this.loader.start();
    this.saving = true;

    if (values.layoutUpdates) {
      for (let layoutUpdate of values.layoutUpdates) {
        await this.menuService.addOrRemoveMenuItemFromCategoriesInLayout(
          this.locationId,
          layoutUpdate.menuLayoutId,
          this.menuItemId,
          layoutUpdate.categories
        );
      }
    }

    await this.menuService.updateMenuItem(this.locationId, this.menuItemId, {
      displayFlow: values.modifierDisplayMode,
      displayName: values.displayName,
      isActive: values.isActive,
      description: values.description,
      image: values.image,
      modifierGroupIds: values.modifierGroups.map((mg) => mg.id),
      calorieText: values.calorieText,
    });

    this.toast.success('Saved item successfully');
    this.loader.stop();

    this.router.navigate(
      ['/location', this.locationId, 'kiosk-designer', 'menu'],
      {
        queryParams: { tab: 3 },
      }
    );
  }

  private async fetchData() {
    this.menuItem = await this.menuService.getItem(
      this.locationId,
      this.menuItemId
    );

    this.cdr.detectChanges();
  }
}
