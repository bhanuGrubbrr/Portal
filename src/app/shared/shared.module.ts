import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgxColorsModule } from 'ngx-colors';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TooltipModule } from 'primeng/tooltip';
import { AccessCheckDirective } from '../grubbrr/directives/accessCheck.directive';
import { DragDropFileUploadDirective } from '../grubbrr/directives/drag-drop-file-upload.directive';
import { RequiresGrubbrrAdminDirective } from '../grubbrr/directives/requiresGrubbrrAdmin.directive';
import { BoxesSkeletonComponent } from '../grubbrr/shared/boxes-skeleton/boxes-skeleton.component';
import { ColorInputComponent } from '../grubbrr/shared/color-input/color-input.component';
import { DynamicFieldsComponent } from '../grubbrr/shared/dynamic-fields/dynamic-fields.component';
import { DynamicFormFieldComponent } from '../grubbrr/shared/dynamic-form/dynamic-form-field.component';
import { DynamicFormComponent } from '../grubbrr/shared/dynamic-form/dynamic-form.component';
import { GrubbrrStickyCardHeaderComponent } from '../grubbrr/shared/grubbrr-sticky-card-header/grubbrr-sticky-card-header.component';
import { GrubbrrSwitchFormControlComponent } from '../grubbrr/shared/grubbrr-switch-form-control/grubbrr-switch-form-control.component';
import { GrubbrrSwitchComponent } from '../grubbrr/shared/grubbrr-switch/grubbrr-switch.component';
import { ListSkeletonComponent } from '../grubbrr/shared/list-skeleton/list-skeleton.component';
import { MenuSkeletonComponent } from '../grubbrr/shared/menu-skeleton/menu-skeleton.component';
import { OrderStatusBadgeComponent } from '../grubbrr/shared/order-status-badge/order-status-badge.component';
import { SaveCancelButtonComponent } from '../grubbrr/shared/save-cancel-button/save-cancel-button.component';
import { SyncInnerComponent } from '../grubbrr/shared/sync-inner/sync-inner.component';
import { TableSkeletonComponent } from '../grubbrr/shared/table-skeleton/table-skeleton.component';
import { MaterialModules } from '../material.module';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { CustomRangePanelComponent } from './custom-range-panel/custom-range-panel.component';
import { DefaultStringPipe } from './pipes/blank.pipe';
import { DropsubstrPipe } from './pipes/dropsubstr.pipe';
import { FixLabelsPipe } from './pipes/fix-labels-pipe';
import { FormatTipOrFixedAmountPipe } from './pipes/format-fixed-percentage-pipe';
import { JoinPipe } from './pipes/join.pipe';
import { MenuSyncDisplayPipe } from './pipes/menusync-display-pipe';
import { PasswordPipe } from './pipes/password-pipe';
import { RemoveIdPrefix } from './pipes/remove-id-prefix';
import { SortPipe } from './pipes/sort.pipe';
import { PrimeNGModule } from './primeng.module';
import { PaginatotronComponent } from '../pages/location/kiosk-designer/paginatotron/paginatotron.component';
import { EntityRowImageComponent } from '../pages/location/location-kiosk-designer/entity-row-image/entity-row-image.component';
import { EntityIdBadgeComponent } from '../pages/location/kiosk-designer/entity-id-badge/entity-id-badge.component';
import { RadioSelectorControlComponent } from '../pages/location/kiosk-designer/radio-selector-control/radio-selector-control.component';
import { RadioSelectorControlOptionComponent } from '../pages/location/kiosk-designer/radio-selector-control-option/radio-selector-control-option.component';
import { ModifierGroupListEditorComponent } from '../pages/location/kiosk-designer/location-kiosk-designer-item-editor/modifier-group-list-editor/modifier-group-list-editor.component';
import { EntityListRemoveButtonComponent } from '../kiosk-designer/entity-list-remove-button/entity-list-remove-button.component';
import { EntityMultiSelectComponent } from '../kiosk-designer/entity-multi-select/entity-multi-select.component';
import { EntityTypeaheadSearchComponent } from '../kiosk-designer/entity-typeahead-search/entity-typeahead-search.component';
import { EntityBadgeComponent } from '../kiosk-designer/entity-badge/entity-badge.component';
import { PaginatorComponent } from '../pages/location/kiosk-designer/paginator/paginator.component';
import { AddEntityButtonComponent } from '../pages/location/kiosk-designer/add-entity-button/add-entity-button.component';
import { ImageUploadControlComponent } from '../pages/location/kiosk-designer/image-upload-control/image-upload-control.component';
import { DropdownSelectComponent } from '../pages/location/dropdown-select/dropdown-select.component';
import ShowMoreShowLessButtonComponent from 'src/app/grubbrr/shared/show-more-show-less-button/show-more-show-less-button.component';
import { ItemListEditorComponent } from '../pages/location/kiosk-designer/location-kiosk-designer-category-editor/item-list-editor/item-list-editor.component';
import { ModifierListEditorComponent } from '../pages/location/kiosk-designer/location-kiosk-designer-modifier-group-editor/modifier-list-editor/modifier-list-editor.component';
import { EntityListBreadcrumbsComponent } from '../pages/location/kiosk-designer/entity-list-breadcrumbs/entity-list-breadcrumbs.component';
import { ModifierRowComponent } from '../pages/location/kiosk-designer/location-kiosk-designer-modifier-group-editor/modifier-list-editor/modifier-row/modifier-row.component';
import { GiftCardBinRangeComponent } from './gift-card-bin-range/gift-card-bin-range.component';

@NgModule({
  declarations: [
    DynamicFormComponent,
    DynamicFormFieldComponent,
    DynamicFieldsComponent,
    FixLabelsPipe,
    PasswordPipe,
    FormatTipOrFixedAmountPipe,
    MenuSyncDisplayPipe,
    JoinPipe,
    SortPipe,
    RemoveIdPrefix,
    DefaultStringPipe,
    DropsubstrPipe,
    SaveCancelButtonComponent,
    GrubbrrSwitchComponent,
    GrubbrrSwitchFormControlComponent,
    TableSkeletonComponent,
    ListSkeletonComponent,
    BoxesSkeletonComponent,
    MenuSkeletonComponent,
    ColorInputComponent,
    GrubbrrStickyCardHeaderComponent,
    OrderStatusBadgeComponent,
    RequiresGrubbrrAdminDirective,
    AccessCheckDirective,
    DragDropFileUploadDirective,
    CustomHeaderComponent,
    CustomRangePanelComponent,
    PaginatotronComponent,
    EntityRowImageComponent,
    EntityIdBadgeComponent,
    RadioSelectorControlComponent,
    RadioSelectorControlOptionComponent,
    ModifierGroupListEditorComponent,
    EntityListRemoveButtonComponent,
    EntityMultiSelectComponent,
    EntityTypeaheadSearchComponent,
    EntityBadgeComponent,
    PaginatorComponent,
    AddEntityButtonComponent,
    ImageUploadControlComponent,
    DropdownSelectComponent,
    ShowMoreShowLessButtonComponent,
    ItemListEditorComponent,
    ModifierListEditorComponent,
    EntityListBreadcrumbsComponent,
    ModifierRowComponent,
    SyncInnerComponent,
    GiftCardBinRangeComponent,
  ],
  imports: [
    // vendor
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    InlineSVGModule,
    MaterialModules,
    NgxSkeletonLoaderModule,
    NgxColorsModule,
    GooglePlaceModule,
    InfiniteScrollModule,
    ScrollingModule,
    PrimeNGModule,
    TooltipModule,
    // grubbrr,
  ],
  exports: [
    // vendor
    CommonModule,
    RouterModule,
    FixLabelsPipe,
    PasswordPipe,
    FormatTipOrFixedAmountPipe,
    MenuSyncDisplayPipe,
    JoinPipe,
    SortPipe,
    DefaultStringPipe,
    RemoveIdPrefix,
    DropsubstrPipe,
    SaveCancelButtonComponent,
    TableSkeletonComponent,
    ListSkeletonComponent,
    BoxesSkeletonComponent,
    MenuSkeletonComponent,
    ColorInputComponent,
    NgxColorsModule,
    GooglePlaceModule,
    InfiniteScrollModule,
    ScrollingModule,
    // grubbrr
    GrubbrrStickyCardHeaderComponent,
    GrubbrrSwitchComponent,
    GrubbrrSwitchFormControlComponent,
    OrderStatusBadgeComponent,
    DynamicFormComponent,
    DynamicFormFieldComponent,
    DynamicFieldsComponent,
    RequiresGrubbrrAdminDirective,
    AccessCheckDirective,
    DragDropFileUploadDirective,
    PrimeNGModule,
    TooltipModule,
    PaginatotronComponent,
    EntityRowImageComponent,
    EntityIdBadgeComponent,
    RadioSelectorControlComponent,
    RadioSelectorControlOptionComponent,
    ModifierGroupListEditorComponent,
    EntityListRemoveButtonComponent,
    EntityMultiSelectComponent,
    EntityTypeaheadSearchComponent,
    EntityBadgeComponent,
    PaginatorComponent,
    AddEntityButtonComponent,
    ImageUploadControlComponent,
    DropdownSelectComponent,
    ShowMoreShowLessButtonComponent,
    ItemListEditorComponent,
    ModifierListEditorComponent,
    EntityListBreadcrumbsComponent,
    ModifierRowComponent,
    SyncInnerComponent,
    GiftCardBinRangeComponent,
  ],
  providers: [CurrencyPipe],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    };
  }
}
