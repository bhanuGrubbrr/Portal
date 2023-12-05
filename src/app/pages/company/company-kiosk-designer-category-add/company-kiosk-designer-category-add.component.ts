import {
  EventEmitter,
  Component,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConceptVM } from 'src/app/grubbrr/generated/kioskConfig_pb';
import {
  Menu,
  MenuCategoryLayout,
  MenuLayout,
} from 'src/app/grubbrr/generated/menu_pb';
import { findParentCategoryId } from 'src/app/grubbrr/models/menu.models';
import { ConceptsService } from 'src/app/grubbrr/service/concepts.service';
import {
  CategoryMenuLayoutFormValues,
  MenuCategoryWithItems,
  MenuCategory,
  MenuItem,
  MenuService,
} from 'src/app/grubbrr/service/menu.service';

export type CategoryFormValues = {
  displayName?: string;
  isActive?: boolean;
  image?: File;
  menuLayoutAssociations: CategoryMenuLayoutFormValues[];
};

type ParentCategoryOption = {
  id: string;
  name: string;
};

const getParentCategoryOptions = (
  allCategories: MenuCategory[],
  layout: MenuLayout,
  currentCategoryId: string | null
): ParentCategoryOption[] => {
  const categoriesById = allCategories.reduce((accum, category) => {
    accum[category.id] = category;
    return accum;
  }, {} as { [id: string]: MenuCategory });

  const flattenCategoryTree = (
    categoryLayout: MenuCategoryLayout[],
    accumList: ParentCategoryOption[],
    depth = 0
  ) => {
    for (let category of categoryLayout) {
      if (currentCategoryId === category.categoryId) {
        continue;
      }

      const prefix = depth > 0 ? `${'-'.repeat(depth)} ` : '';
      accumList.push({
        id: category.categoryId,
        name: prefix + categoriesById[category.categoryId]?.displayName,
      });

      flattenCategoryTree(category.subCategories, accumList, depth + 1);
    }

    return accumList;
  };

  return flattenCategoryTree(layout.categories, []);
};

@Component({
  selector: 'app-company-kiosk-designer-category-add',
  templateUrl: './company-kiosk-designer-category-add.component.html',
  styleUrls: ['./company-kiosk-designer-category-add.component.scss'],
})
export class CompanyKioskDesignerCategoryAddComponent implements OnInit {
  parentCategoryOptions: ParentCategoryOption[] = [];
  allItems: MenuItem[];
  defaultLayoutId: string | null = null;
  concepts: ConceptVM[] = [];
  activeConcept: ConceptVM | null = null;
  loading = false;
  layout: MenuLayout;
  menuLayoutAssoicationFormControlIndex: number = -1;

  locationId: string;
  categoryId: string;
  companyId: string;

  category: MenuCategoryWithItems;
  saving = false;

  get currentMenuLayoutId(): string {
    return (this.activeConcept?.menuLayoutId ?? this.defaultLayoutId)!;
  }

  get availableItems() {
    const currentItemIds = new Set(
      this.categoryForm.value.menuLayoutAssociations[
        this.menuLayoutAssoicationFormControlIndex
      ].items?.map((i: any) => i.id)
    );
    return (
      this.allItems?.filter((menuItem) => {
        return !currentItemIds.has(menuItem.id) && menuItem.isActive;
      }) ?? []
    );
  }

  categoryForm: FormGroup;

  formReady = false;
  tab: number = 1;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private conceptsSerivce: ConceptsService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private loader: NgxUiLoaderService,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      this.tab = params['tab'] ?? 1;
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.locationId = this.route.snapshot.params.locationid;
    this.companyId = this.route.snapshot.params.companyid;
    this.categoryId = this.route.snapshot.params.categoryId;
    this.fetchData();
  }

  initForm() {
    this.categoryForm = this.fb.group({
      displayName: this.fb.control(this.category?.displayName ?? ''),
      description: this.fb.control(''),
      isActive: this.fb.control(this.category?.isActive ?? true),
      image: this.fb.control(this.category?.media ?? null),
      menuLayoutAssociations: this.fb.array([]),
    });
  }

  createMenuLayoutAssociationControl(
    layout: MenuLayout,
    items: MenuItem[] | undefined,
    displayOrder: { order: 'before' | 'after'; categoryId: string } | null,
    parentCategoryId: string | null
  ) {
    return this.fb.group({
      menuLayoutId: this.fb.control(layout.menuLayoutId),
      displayOrder: this.fb.group({
        order: this.fb.control(displayOrder?.order),
        categoryId: this.fb.control(displayOrder?.categoryId),
      }),
      items: this.fb.control(items ?? []),
      parentCategoryId: this.fb.control(parentCategoryId ?? null),
    });
  }

  setActiveConceptId(id: ConceptVM) {
    this.activeConcept = id;
    this.fetchMenuLayout();
  }

  private async fetchData() {
    this.loading = true;
    if (this.categoryId) {
      this.category = await this.menuService.getCategory(
        this.locationId,
        this.categoryId
      );
    }
    this.initForm();
    this.cdr.detectChanges();
    this.allItems = await this.menuService.getItems(this.locationId);
    const layoutIdAndConceptEnabled =
      await this.menuService.getDefaultLayoutIdAndConceptEnabled(
        this.locationId
      );
    this.defaultLayoutId = layoutIdAndConceptEnabled.defaultMenuLayoutId;

    const result = await this.conceptsSerivce.getConcepts(this.locationId);
    this.concepts = result.concepts;
    this.activeConcept = this.concepts[0];

    this.cdr.detectChanges();

    this.fetchMenuLayout();
  }

  private async fetchMenuLayout() {
    this.loading = true;
    let layoutResponse = await this.menuService.getMenuLayout(
      this.locationId,
      this.currentMenuLayoutId
    );

    this.layout = layoutResponse;
    const layoutCategories = await this.menuService.getCategoriesForLayout(
      this.locationId,
      layoutResponse
    );

    const allCategories = await this.menuService.getCategories(this.locationId);
    this.parentCategoryOptions = getParentCategoryOptions(
      allCategories,
      layoutResponse,
      this.category?.id ?? null
    );

    const layoutFormControls = this.categoryForm.controls
      .menuLayoutAssociations as FormArray;
    const matchingControlIndex = layoutFormControls.controls.findIndex((c) => {
      return c.get('menuLayoutId')?.value === this.layout.menuLayoutId;
    });

    if (matchingControlIndex !== -1) {
      this.menuLayoutAssoicationFormControlIndex = matchingControlIndex;
    } else {
      const currentCategoryIndex = layoutCategories.findIndex(
        (c) => c.id === this.category?.id
      );

      let currentCategory: any = layoutCategories[currentCategoryIndex];

      //code by Rajni handel N lavel category
      if (!currentCategory) {
        currentCategory = layoutCategories
          .map((layoutCategory) => {
            return this.findSubcategoryById(layoutCategory, this.category?.id);
          })
          .find((c) => c);
      }

      const parentCategoryId = this.category?.id
        ? findParentCategoryId(this.layout, this.category?.id)
        : null;
      layoutFormControls.push(
        this.createMenuLayoutAssociationControl(
          this.layout,
          currentCategory?.items ?? this.category?.items,
          currentCategory
            ? {
                order: currentCategoryIndex === 0 ? 'before' : 'after',
                categoryId: currentCategory.id,
              }
            : {
                order: currentCategoryIndex === 0 ? 'before' : 'after',
                categoryId: this.category?.id,
              },
          parentCategoryId
        )
      );

      this.menuLayoutAssoicationFormControlIndex =
        layoutFormControls.length - 1;
    }

    this.loading = false;
    this.cdr.detectChanges();
  }

  findSubcategoryById(category: any, targetId: string | undefined) {
    if (category.id === targetId) {
      return category;
    }

    if (category.subCategories) {
      for (const subCategory of category.subCategories) {
        const foundSubCategory: any = this.findSubcategoryById(
          subCategory,
          targetId
        );
        if (foundSubCategory) {
          return foundSubCategory;
        }
      }
    }

    return null;
  }

  async onSubmit() {
    let values: CategoryFormValues = this.categoryForm.value;
    this.loader.start();
    this.saving = true;

    if (this.categoryId) {
      await this.menuService.updateCategory(this.locationId, this.categoryId, {
        displayName: values.displayName,
        isActive: values.isActive,
        image: values.image,
        layoutData: values.menuLayoutAssociations,
      });
    } else {
      await this.menuService.createCategory(this.locationId, this.categoryId, {
        displayName: values.displayName,
        isActive: values.isActive,
        image: values.image,
        layoutData: values.menuLayoutAssociations,
      });
    }

    this.toast.success('Saved category successfully');
    this.loader.stop();

    this.router.navigate(
      ['/company', this.companyId, this.locationId, 'kiosk-designer', 'menu'],
      {
        queryParams: { tab: 2 },
      }
    );
  }
}
