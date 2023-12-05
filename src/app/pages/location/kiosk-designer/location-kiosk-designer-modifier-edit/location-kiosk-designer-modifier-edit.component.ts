import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  MenuItemWithCategoryAndModifierGroups,
  MenuService,
} from 'src/app/grubbrr/service/menu.service';
import { MenuItemFormValues } from '../location-kiosk-designer-modifier-editor/location-kiosk-designer-modifier-editor.component';

@Component({
  selector: 'app-location-kiosk-designer-modifier-edit',
  templateUrl: './location-kiosk-designer-modifier-edit.component.html',
  styleUrls: ['./location-kiosk-designer-modifier-edit.component.scss'],
})
export class LocationKioskDesignerModifierEditComponent implements OnInit {
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
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.menuItemId = this.route.snapshot.params.menuItemId;
    this.fetchData();
  }

  async onSubmit(values: MenuItemFormValues) {
    this.loader.start();
    this.saving = true;

    await this.menuService.updateMenuItem(this.locationId, this.menuItemId, {
      displayName: values.displayName,
      isActive: values.isActive,
      description: values.description,
      image: values.image,
      calorieText: values.calorieText,
      modifierGroupIds: values.modifierGroups.map((mg) => mg.id),
      selectedImage: values.selectedImage,
      selectedDisplayName: values.selectedDisplayName,
    });

    this.toast.success('Saved modifier successfully');
    this.loader.stop();

    this.router.navigate(
      ['/location', this.locationId, 'kiosk-designer', 'menu'],
      {
        queryParams: { tab: 5 },
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
