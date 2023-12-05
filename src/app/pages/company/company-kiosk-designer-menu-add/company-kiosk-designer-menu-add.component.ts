import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MenuCategoryWithItems,
  MenuItem,
} from 'src/app/grubbrr/service/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/grubbrr/service/company.service';
@Component({
  selector: 'app-company-kiosk-designer-menu-add',
  templateUrl: './company-kiosk-designer-menu-add.component.html',
  styleUrls: [
    './company-kiosk-designer-menu-add.component.scss',
    '../../location/location-kiosk-designer/shared.scss',
  ],
})
export class CompanyKioskDesignerMenuAddComponent implements OnInit {
  menuForm: FormGroup;
  tab: number = 1;
  loading = false;
  companyId: string;
  menuId: string;
  menuLayoutAssoicationFormControlIndex: number = -1;
  allItems: MenuItem[];
  initialData: MenuItem;
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      this.tab = params['tab'] ?? 1;
    });
    this.companyId = this.route.snapshot.params.companyid;
    this.menuId = this.route.snapshot.params.menuid;
    if (this.menuId) {
      this.getMenuById();
    }
  }
  async getMenuById() {
    this.initialData = await this.companyService.getCompanyMenuById(
      this.companyId,
      this.menuId
    );
  }

  ngOnInit(): void {
    this.menuForm = this.fb.group({
      displayName: this.fb.control(this.initialData?.displayName ?? ''),
      description: this.fb.control(this.initialData?.description ?? ''),
      isActive: this.fb.control(this.initialData?.isActive ?? true),
      image: this.fb.control(this.initialData?.image ?? null),
      menuLayoutAssociations: this.fb.array([]),
    });
  }

  get availableItems() {
    const currentItemIds = new Set(
      this.menuForm.value.menuLayoutAssociations[
        this.menuLayoutAssoicationFormControlIndex
      ].items?.map((i: any) => i.id)
    );
    return (
      this.allItems?.filter((menuItem) => {
        return !currentItemIds.has(menuItem.id) && menuItem.isActive;
      }) ?? []
    );
  }

  async onSubmit() {
    if (this.menuId) {
      const menus = [
        Object.assign(this.menuForm.value, {
          id: this.menuId,
          location: ['Region 1', 'Region 2'],
        }),
      ];
      this.companyService.updateCompanyMenus(
        this.companyId,
        this.menuId,
        menus
      );
    } else {
      const menus = [
        Object.assign(this.menuForm.value, {
          id: 1,
          location: ['Region 1', 'Region 2'],
        }),
      ];
      this.companyService.setCompanyMenus(this.companyId, menus);
    }
    this.router.navigate([`company/${this.companyId}/kiosk-designer/menu`], {
      queryParams: { tab: 1 },
    });
  }
}
