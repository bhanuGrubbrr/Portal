import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControlService } from 'src/app/grubbrr/shared/dynamic-form/form-control.service';
import { MaterialModules } from 'src/app/material.module';
import { TranslationModule } from 'src/app/metronic/modules/i18n';
import { TwoDigitDecimalNumberDirective } from 'src/app/shared/pipes/decimal-format.directive';
import { DigitOnlyDirective } from 'src/app/shared/pipes/digit-only.directive';
import { SharedModule } from 'src/app/shared/shared.module';
import { WidgetsModule } from '../../metronic/_metronic/partials';
import { ItemAvailabilityComponent } from './item-availability/item-availability.component';
import { ScreenSaverAddEditComponent } from './kiosk/sections/screen-saver-add-edit/screen-saver-add-edit.component';
import { AddEditKioskComponent } from './kiosks/add-edit-kiosk/add-edit-kiosk.component';
import { KiosksComponent } from './kiosks/kiosks.component';
import { LocationEditComponent } from './location-edit/location-edit.component';
import { LocationInheritanceBannerComponent } from './location-edit/location-inheritance-banner/location-inheritance-banner.component';
import { LocationAddUserComponent } from './location-home/location-add-user/location-add-user.component';
import { LocationDeleteUserComponent } from './location-home/location-delete-user/location-delete-user.component';
import { LocationHomeComponent } from './location-home/location-home.component';
import { LocationToDoListComponent } from './location-home/location-todolist/location-todolist.component';
import { LocationUserEditComponent } from './location-home/location-user-edit/location-user-edit.component';
import { LocationKioskDesignerComponent } from './location-kiosk-designer/location-kiosk-designer.component';
import { MenuCategoriesComponent } from './location-kiosk-designer/menu-categories/menu-categories.component';
import { LocationPrinterAddComponent } from './location-printer-add/location-printer-add.component';
import { LocationPrinterSettingsComponent } from './location-printer-settings/location-printer-settings.component';
import { LocationReceiptCustomizationComponent } from './location-receipt-customization/location-receipt-customization.component';
import { LocationRoutingModule } from './location-routing.module';
import { LocationStaffEditComponent } from './location-staff-edit/location-staff-edit.component';
import { LocationStaffComponent } from './location-staff/location-staff.component';
import { LocationUsersComponent } from './location-users/location-users.component';
import { LocationComponent } from './location.component';
import { AddEditPresetTipComponent } from './modals/add-edit-preset-tip/add-edit-preset-tip.component';
import { ConfirmDeletePaymentSettingsComponent } from './modals/confirm-delete-payment-settings/confirm-delete-payment-settings.component';
import { DeleteKioskModalComponent } from './modals/delete-kiosk-modal/delete-kiosk-modal.component';
import { DeletePresetTipComponent } from './modals/delete-preset-tip/delete-preset-tip.component';
import { MenuSyncDetailModalComponent } from './modals/menu-sync-detail-modal/menu-sync-detail-modal.component';
import { OrderItemsModalComponent } from './modals/order-items-modal/order-items-modal.component';
import { ScreenSaverDeleteComponent } from './modals/screen-saver-delete/screen-saver-delete.component';
import { ScreenSaverEditComponent } from './modals/screen-saver-edit/screen-saver-edit.component';
import { SetupPaymentTypeComponent } from './modals/setup-payment-type/setup-payment-type.component';
import { OrderUpsellComponent } from './order-upsell/order-upsell.component';
import { OrderUpsellNewComponent } from './order-upsell-new/order-upsell-new.component';
import { OrdersDetailsComponent } from './orders-details/orders-details.component';
import { OrdersNavComponent } from './orders-nav/orders-nav.component';
import { OrdersTableComponent } from './orders-table/orders-table.component';
import { PaymentOverviewComponent } from './payment/payment-overview/payment-overview.component';
import { PaymentSettingsComponent } from './payment/payment-settings/payment-settings.component';
import { ColorsComponent } from './appearance/colors/colors.component';
import { FontsComponent } from './appearance/fonts/fonts.component';
import { ImagesComponent } from './appearance/images/images.component';
import { TextoverridesComponent } from './appearance/textoverrides/textoverrides.component';
import { AgeverificationComponent } from './customization/ageverification/ageverification.component';
import { CustomeridentificationComponent } from './customization/customeridentification/customeridentification.component';
import { LanguagesComponent } from './customization/languages/languages.component';
import { LocaleComponent } from './customization/locale/locale.component';
import { TimeoutsComponent } from './customization/timeouts/timeouts.component';
import { TipsComponent } from './customization/tips/tips.component';
import { InsightsComponent } from './insights/insights.component';
import { LoyaltyComponent } from './loyalty/loyalty.component';
import { ConfirmFullRefundComponent } from './modals/confirm-full-refund/confirm-full-refund.component';
import { AgentLogsComponent } from './pos/agent-logs/agent-logs.component';
import { ChangePOSComponent } from './pos/modals/change-pos/change-pos.component';
import { PosScheduleComponent } from './pos/pos-schedule/pos-schedule.component';
import { PosSettingComponent } from './pos/pos-setting/pos-setting.component';
import { PosSyncSettingComponent } from './pos/pos-sync-setting/pos-sync-setting.component';
import { PosSyncHistoryComponent } from './pos/pos-sync-history/pos-sync-history.component';
import { ContactComponent } from './support/contact/contact.component';
import { FaqComponent } from './support/faq/faq.component';
import { LocationToDoItemComponent } from './location-home/location-todo-item/location-todo-item.component';
import { PaytronixComponent } from './loyalty/paytronix/paytronix.component';
import { PunchhComponent } from './loyalty/punchh/punchh.component';
import { AddKioskComponent } from './modals/add-kiosk/add-kiosk.component';
import { AddVideoComponent } from './modals/add-video/add-video.component';
import { ViewVideoComponent } from './modals/view-video/view-video.component';
import { CustIdAdvancedOptionsModalComponent } from './order-types/cust-id-advanced-options-modal/cust-id-advanced-options-modal.component';
import { OrderTokenModalComponent } from './order-types/order-token-modal/order-token-modal.component';
import { OrderTypesComponent } from './order-types/order-types.component';
import { OrderTypeRuleComponent } from './order-upsell/rules/OrderType/order-type-rule/order-type-rule.component';
import { SectionsRuleComponent } from './order-upsell/rules/Sections/sections-rule/sections-rule.component';
import { ProductMixReportComponent } from './reports/product-mix-report/product-mix-report.component';
import { MenuItemsComponent } from './location-kiosk-designer/menu-items/menu-items.component';
import { ModifierGroupsComponent } from './location-kiosk-designer/modifier-groups/modifier-groups.component';
import { MenuComponent } from './location-kiosk-designer/menu/menu.component';
import { MenuCategoryRowComponent } from './location-kiosk-designer/menu/menu-category-row/menu-category-row.component';
import { LocationKioskDesignerItemEditorComponent } from './kiosk-designer/location-kiosk-designer-item-editor/location-kiosk-designer-item-editor.component';
import { CheckboxCardComponent } from './kiosk-designer/checkbox-card/checkbox-card.component';
import { LocationKioskDesignerModifierGroupEditorComponent } from './kiosk-designer/location-kiosk-designer-modifier-group-editor/location-kiosk-designer-modifier-group-editor.component';
import { LocationKioskDesignerCategoryEditorComponent } from './kiosk-designer/location-kiosk-designer-category-editor/location-kiosk-designer-category-editor.component';
import { LocationKioskDesignerVaultComponent } from './kiosk-designer/location-kiosk-designer-vault/location-kiosk-designer-vault.component';
import { VaultStepRowComponent } from './kiosk-designer/location-kiosk-designer-vault/vault-step-row/vault-step-row.component';
import { VaultEntitySelectorComponent } from './kiosk-designer/location-kiosk-designer-vault/vault-entity-selector/vault-entity-selector.component';
import { LocationKioskDesignerCategoryEditComponent } from './kiosk-designer/location-kiosk-designer-category-edit/location-kiosk-designer-category-edit.component';
import { LocationKioskDesignerItemEditComponent } from './kiosk-designer/location-kiosk-designer-item-edit/location-kiosk-designer-item-edit.component';
import { LocationKioskDesignerModifierGroupEditComponent } from './kiosk-designer/location-kiosk-designer-modifier-group-edit/location-kiosk-designer-modifier-group-edit.component';
import { LocationKioskDesignerModifierEditorComponent } from './kiosk-designer/location-kiosk-designer-modifier-editor/location-kiosk-designer-modifier-editor.component';
import { LocationKioskDesignerModifierEditComponent } from './kiosk-designer/location-kiosk-designer-modifier-edit/location-kiosk-designer-modifier-edit.component';
import { ConceptsComponent } from './location-kiosk-designer/concepts/concepts.component';
import { GemComponent } from './gem/gem.component';
import { LocationKioskDesignerCategoryAddComponent } from './kiosk-designer/location-kiosk-designer-category-add/location-kiosk-designer-category-add.component';
import { MessageGuardsComponent } from './message-guards/message-guards.component';
import { LocationKioskDesignerModifierGroupAddComponent } from './kiosk-designer/location-kiosk-designer-modifier-group-add/location-kiosk-designer-modifier-group-add.component';
import { ConceptEditComponent } from './location-kiosk-designer/concepts/concept-edit/concept-edit.component';
import { AddEditConceptComponent } from './modals/add-edit-concept/add-edit-concept.component';
import { NumberDirective } from './numbers-only.directive';
import { ConceptSwitcherComponent } from './location-kiosk-designer/concept-switcher/concept-switcher.component';
import { ConceptSwitcherDropdownComponent } from './location-kiosk-designer/concept-switcher/concept-switcher-dropdown/concept-switcher-dropdown.component';
import { LocationTransformConfigComponent } from './location-transform-config/location-transform-config.component';
import { LoyaltyDefaultImagesComponent } from './appearance/images/loyalty-default-images/loyalty-default-images.component';
import { KpiReportComponent } from './kpi-report/kpi-report.component';
import { AppearanceAssetComponent } from './appearance/images/appearance-asset/appearance-asset.component';
import { FeaturesComponent } from './customization/features/features.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PosOverviewComponent } from './pos/pos-overview/pos-overview.component';
import { ColumnSelectionComponent } from './column-selection/column-selection.component';
import { ClmmConfirmationComponent } from './modals/clmm-confirmation/clmm-confirmation.component';
import { OrderUpsellAddComponent } from './order-upsell-add/order-upsell-add/order-upsell-add.component';
import { OrderUpsellCategoryComponent } from './order-upsell-category/order-upsell-category/order-upsell-category.component';
import { BusinessHoursComponent } from './business-hours/business-hours.component';
import { ModifiersComponent } from './location-kiosk-designer/modifiers/modifiers.component';
import { ItemUpsellNewComponent } from './item-upsell-new/item-upsell-new.component';
import { ItemUpsellAddComponent } from './item-upsell-add/item-upsell-add.component';
import { ItemUpsellGroupComponent } from './item-upsell-group/item-upsell-group.component';

@NgModule({
  declarations: [
    NumberDirective,
    InsightsComponent,
    ColorsComponent,
    FontsComponent,
    ContactComponent,
    FaqComponent,
    TimeoutsComponent,
    CustomeridentificationComponent,
    TipsComponent,
    TextoverridesComponent,
    AgeverificationComponent,
    LocaleComponent,
    LanguagesComponent,
    ImagesComponent,
    LocationComponent,
    LocationHomeComponent,
    LocationEditComponent,
    LocationToDoListComponent,
    LocationToDoItemComponent,
    LocationKioskDesignerComponent,
    MenuCategoriesComponent,
    LocationAddUserComponent,
    LocationDeleteUserComponent,
    ChangePOSComponent,
    LocationUserEditComponent,
    LocationStaffComponent,
    LocationStaffEditComponent,
    LocationPrinterSettingsComponent,
    LocationReceiptCustomizationComponent,
    LocationPrinterAddComponent,
    KiosksComponent,
    LocationUsersComponent,
    ScreenSaverEditComponent,
    ScreenSaverDeleteComponent,
    ScreenSaverAddEditComponent,
    TwoDigitDecimalNumberDirective,
    DigitOnlyDirective,
    PosSettingComponent,
    PosSyncSettingComponent,
    MenuSyncDetailModalComponent,
    PosScheduleComponent,
    PosSyncHistoryComponent,
    OrdersTableComponent,
    OrdersNavComponent,
    OrdersDetailsComponent,
    PaymentSettingsComponent,
    //    TenderMappingComponent,
    PaymentOverviewComponent,
    OrderItemsModalComponent,
    AddEditPresetTipComponent,
    DeletePresetTipComponent,
    LocationInheritanceBannerComponent,
    ItemAvailabilityComponent,
    OrderUpsellComponent,
    OrderUpsellNewComponent,
    DeleteKioskModalComponent,
    AddEditKioskComponent,
    SetupPaymentTypeComponent,
    ConfirmDeletePaymentSettingsComponent,
    AgentLogsComponent,
    LoyaltyComponent,
    ConfirmFullRefundComponent,
    //PaymentTenderMappingComponent,
    AddKioskComponent,
    OrderTypesComponent,
    ViewVideoComponent,
    AddVideoComponent,
    CustIdAdvancedOptionsModalComponent,
    OrderTokenModalComponent,
    OrderTypeRuleComponent,
    SectionsRuleComponent,
    PunchhComponent,
    PaytronixComponent,
    ProductMixReportComponent,
    MenuItemsComponent,
    ModifierGroupsComponent,
    MenuComponent,
    MenuCategoryRowComponent,
    LocationKioskDesignerItemEditorComponent,
    CheckboxCardComponent,
    LocationKioskDesignerModifierGroupEditorComponent,
    LocationKioskDesignerCategoryEditorComponent,
    LocationKioskDesignerVaultComponent,
    VaultStepRowComponent,
    VaultEntitySelectorComponent,
    LocationKioskDesignerCategoryEditComponent,
    LocationKioskDesignerItemEditComponent,
    LocationKioskDesignerModifierGroupEditComponent,
    LocationKioskDesignerModifierEditorComponent,
    LocationKioskDesignerModifierEditComponent,
    ConceptsComponent,
    ConceptSwitcherComponent,
    ConceptSwitcherDropdownComponent,
    LocationKioskDesignerCategoryAddComponent,
    MessageGuardsComponent,
    LocationKioskDesignerModifierGroupAddComponent,
    ConceptEditComponent,
    AddEditConceptComponent,
    LocationTransformConfigComponent,
    GemComponent,
    LoyaltyDefaultImagesComponent,
    AppearanceAssetComponent,
    FeaturesComponent,
    KpiReportComponent,
    ModifierGroupsComponent,
    PosOverviewComponent,
    ColumnSelectionComponent,
    ClmmConfirmationComponent,
    OrderUpsellAddComponent,
    OrderUpsellCategoryComponent,
    BusinessHoursComponent,
    ModifiersComponent,
    ItemUpsellNewComponent,
    ItemUpsellAddComponent,
    ItemUpsellGroupComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    TranslationModule,
    ReactiveFormsModule,
    LocationRoutingModule,
    WidgetsModule,
    SharedModule,
    MaterialModules,
    InlineSVGModule,
  ],
  providers: [NgbActiveModal, FormControlService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LocationModule {}
