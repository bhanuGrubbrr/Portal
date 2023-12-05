import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  MenuCategoryWithItems,
  MenuService,
} from 'src/app/grubbrr/service/menu.service';
import { CategoryFormValues } from '../location-kiosk-designer-category-editor/location-kiosk-designer-category-editor.component';
@Component({
  selector: 'app-location-kiosk-designer-category-edit',
  templateUrl: './location-kiosk-designer-category-edit.component.html',
  styleUrls: ['./location-kiosk-designer-category-edit.component.scss'],
})
export class LocationKioskDesignerCategoryEditComponent implements OnInit {
  locationId: string;
  categoryId: string;

  category: MenuCategoryWithItems;

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
    this.categoryId = this.route.snapshot.params.categoryId;
    this.fetchData();
  }

  async onSubmit(values: CategoryFormValues) {
    this.loader.start();
    this.saving = true;

    await this.menuService.updateCategory(this.locationId, this.categoryId, {
      displayName: values.displayName,
      // description: values.description,
      isActive: values.isActive,
      image: values.image,
      layoutData: values.menuLayoutAssociations,
    });

    this.toast.success('Saved category successfully');
    this.loader.stop();

    this.router.navigate(
      ['/location', this.locationId, 'kiosk-designer', 'menu'],
      {
        queryParams: { tab: 2 },
      }
    );
  }

  private async fetchData() {
    this.category = await this.menuService.getCategory(
      this.locationId,
      this.categoryId
    );

    this.cdr.detectChanges();
  }
}
