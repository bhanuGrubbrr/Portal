import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  MenuItemWithCategoryAndModifierGroups,
  MenuCategory,
  ModifierGroup,
  MenuService,
} from 'src/app/grubbrr/service/menu.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  MenuItemDisplayFlow,
  MenuLayout,
} from 'src/app/grubbrr/generated/menu_pb';
import { ConceptVM } from 'src/app/grubbrr/generated/kioskConfig_pb';
import { ConceptsService } from 'src/app/grubbrr/service/concepts.service';
import { ActivatedRoute } from '@angular/router';

type ModifierDisplayOption = {
  label: string;
  value: MenuItemDisplayFlow;
};

type MenuItemLayoutUpdate = {
  menuLayoutId: string;
  categories: MenuCategory[];
};

export type MenuItemFormValues = {
  displayName: string;
  description: string;
  modifierDisplayMode: MenuItemDisplayFlow;
  image: File | string | null;
  isActive: boolean;
  modifierGroups: ModifierGroup[];
  layoutUpdates: MenuItemLayoutUpdate[];
  calorieText: string;
};

@Component({
  selector: 'app-location-kiosk-designer-item-editor',
  templateUrl: './location-kiosk-designer-item-editor.component.html',
  styleUrls: ['./location-kiosk-designer-item-editor.component.scss'],
})
export class LocationKioskDesignerItemEditorComponent implements OnInit {
  @Input() menuItem: MenuItemWithCategoryAndModifierGroups | undefined;
  @Input() locationId: string;
  @Output() formSubmitted = new EventEmitter<MenuItemFormValues>();

  itemForm: FormGroup;
  descriptionPlaceholderText: string = 'Enter item description here';
  formReady = false;

  allCategories: MenuCategory[];
  allModifierGroups: ModifierGroup[];

  selectableCategorys: MenuCategory[] = [];

  modifierDisplayOptions: ModifierDisplayOption[] = [
    {
      label: 'Default',
      value: MenuItemDisplayFlow.Default,
    },
    // {
    //   label: 'Accordion',
    //   value: MenuItemDisplayFlow.Accordion,
    // },
    {
      label: 'Builder Mode',
      value: MenuItemDisplayFlow.Builder,
    },
    {
      label: 'Pizza Mode',
      value: MenuItemDisplayFlow.Pizza,
    },
    // {
    //   label: 'Pizza Dropped',
    //   value: MenuItemDisplayFlow.PizzaDropper,
    // },
    // {
    //   label: 'Taco',
    //   value: MenuItemDisplayFlow.Taco,
    // },
  ];

  defaultLayoutId: string | null = null;
  concepts: ConceptVM[] = [];
  activeConcept: ConceptVM | null = null;
  loading = false;
  layout: MenuLayout;
  menuLayoutAssoicationFormControlIndex: number = -1;
  tab: number = 1;

  get currentMenuLayoutId(): string {
    return (this.activeConcept?.menuLayoutId ?? this.defaultLayoutId)!;
  }

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private conceptsSerivce: ConceptsService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
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
      modifierDisplayMode: this.fb.control(
        this.menuItem?.modifierSelectionMode ??
          this.modifierDisplayOptions[0].value
      ),
      image: this.fb.control(this.menuItem?.image ?? null),
      isActive: this.fb.control(this.menuItem?.isActive ?? true),
      modifierGroups: this.fb.control(this.menuItem?.modifierGroups ?? []),
      layoutUpdates: this.fb.array([]),
      calorieText: this.fb.control(this.menuItem?.calorieText ?? ''),
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

  getCategoryDisplayName(category: MenuCategory) {
    return category.displayName ?? category.posCategory?.name;
  }

  getCategoryId(category: MenuCategory) {
    return category.id;
  }

  private async fetchData() {
    this.loading = true;
    this.allCategories = await this.menuService.getCategories(this.locationId);
    this.allModifierGroups = await this.menuService.getModifierGroups(
      this.locationId
    );
    const layoutIdAndConceptEnabled =
      await this.menuService.getDefaultLayoutIdAndConceptEnabled(
        this.locationId
      );
    this.defaultLayoutId = layoutIdAndConceptEnabled.defaultMenuLayoutId;

    const result = await this.conceptsSerivce.getConcepts(this.locationId);
    this.concepts = result.concepts;
    this.activeConcept = this.concepts?.length > 0 ? this.concepts[0] : null;

    this.cdr.detectChanges();

    this.fetchMenuLayout();
  }

  setActiveConceptId(id: ConceptVM) {
    this.activeConcept = id;
    this.fetchMenuLayout();
  }

  private async fetchMenuLayout() {
    this.loading = true;

    const layoutResponse = await this.menuService.getMenuLayout(
      this.locationId,
      this.currentMenuLayoutId
    );

    this.layout = layoutResponse;
    const layoutCategories = await this.menuService.getCategoriesForLayout(
      this.locationId,
      layoutResponse
    );
    this.selectableCategorys = layoutCategories;

    const layoutFormControls = this.itemForm.controls
      .layoutUpdates as FormArray;
    const matchingControlIndex = layoutFormControls.controls.findIndex((c) => {
      return c.get('menuLayoutId')?.value === this.layout.menuLayoutId;
    });

    if (matchingControlIndex !== -1) {
      this.menuLayoutAssoicationFormControlIndex = matchingControlIndex;
    } else {
      const currentCategories = layoutCategories.filter((c) => {
        return c.itemIds.includes(this.menuItem!.id);
      });
      layoutFormControls.push(
        this.createMenuLayoutAssociationControl(this.layout, currentCategories)
      );

      this.menuLayoutAssoicationFormControlIndex =
        layoutFormControls.length - 1;
    }

    this.loading = false;
    this.cdr.detectChanges();
  }
  createMenuLayoutAssociationControl(
    layout: MenuLayout,
    categories: MenuCategory[] | undefined
  ) {
    return this.fb.group({
      menuLayoutId: this.fb.control(layout.menuLayoutId),
      categories: this.fb.control(categories ?? []),
    });
  }
}
