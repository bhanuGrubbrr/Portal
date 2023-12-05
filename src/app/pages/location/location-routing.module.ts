import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { ItemAvailabilityComponent } from './item-availability/item-availability.component';
import { ScreenSaverAddEditComponent } from './kiosk/sections/screen-saver-add-edit/screen-saver-add-edit.component';
import { AddEditKioskComponent } from './kiosks/add-edit-kiosk/add-edit-kiosk.component';
import { KiosksComponent } from './kiosks/kiosks.component';
import { LocationEditComponent } from './location-edit/location-edit.component';
import { LocationHomeComponent } from './location-home/location-home.component';
import { LocationKioskDesignerComponent } from './location-kiosk-designer/location-kiosk-designer.component';
import { LocationKioskDesignerItemEditComponent } from './kiosk-designer/location-kiosk-designer-item-edit/location-kiosk-designer-item-edit.component';
import { LocationKioskDesignerModifierEditComponent } from './kiosk-designer/location-kiosk-designer-modifier-edit/location-kiosk-designer-modifier-edit.component';
import { LocationReceiptCustomizationComponent } from './location-receipt-customization/location-receipt-customization.component';
import { LocationPrinterAddComponent } from './location-printer-add/location-printer-add.component';
import { LocationPrinterSettingsComponent } from './location-printer-settings/location-printer-settings.component';
import { LocationStaffEditComponent } from './location-staff-edit/location-staff-edit.component';
import { LocationStaffComponent } from './location-staff/location-staff.component';
import { LocationUsersComponent } from './location-users/location-users.component';
import { LoyaltyComponent } from './loyalty/loyalty.component';
import { OrderTypesComponent } from './order-types/order-types.component';
import { OrderUpsellComponent } from './order-upsell/order-upsell.component';
import { OrderUpsellNewComponent } from './order-upsell-new/order-upsell-new.component';
import { OrdersNavComponent } from './orders-nav/orders-nav.component';
import { PaymentOverviewComponent } from './payment/payment-overview/payment-overview.component';
import { ProductMixReportComponent } from './reports/product-mix-report/product-mix-report.component';
import { ContactComponent } from './support/contact/contact.component';
import { FaqComponent } from './support/faq/faq.component';
import { LocationKioskDesignerModifierGroupEditComponent } from './kiosk-designer/location-kiosk-designer-modifier-group-edit/location-kiosk-designer-modifier-group-edit.component';
import { LocationKioskDesignerModifierGroupAddComponent } from './kiosk-designer/location-kiosk-designer-modifier-group-add/location-kiosk-designer-modifier-group-add.component';
import { LocationKioskDesignerCategoryEditComponent } from './kiosk-designer/location-kiosk-designer-category-edit/location-kiosk-designer-category-edit.component';
import { LocationKioskDesignerCategoryAddComponent } from './kiosk-designer/location-kiosk-designer-category-add/location-kiosk-designer-category-add.component';
import { LocationKioskDesignerVaultComponent } from './kiosk-designer/location-kiosk-designer-vault/location-kiosk-designer-vault.component';
import { ConceptsComponent } from './location-kiosk-designer/concepts/concepts.component';
import { LocationTransformConfigComponent } from './location-transform-config/location-transform-config.component';
import { GemComponent } from './gem/gem.component';
import { MessageGuardsComponent } from './message-guards/message-guards.component';
import { ConceptEditComponent } from './location-kiosk-designer/concepts/concept-edit/concept-edit.component';
import { MenuCategoriesComponent } from './location-kiosk-designer/menu-categories/menu-categories.component';
import { FeaturesComponent } from './customization/features/features.component';
import { KpiReportComponent } from './kpi-report/kpi-report.component';
import { PosOverviewComponent } from './pos/pos-overview/pos-overview.component';
import { OrderUpsellAddComponent } from './order-upsell-add/order-upsell-add/order-upsell-add.component';
import { BusinessHoursComponent } from './business-hours/business-hours.component';
import { ItemUpsellNewComponent } from './item-upsell-new/item-upsell-new.component';
import { ItemUpsellAddComponent } from './item-upsell-add/item-upsell-add.component';

const routes: Routes = [
  {
    pathMatch: 'full',
    path: ':locationid/setup-checklist',
    component: LocationHomeComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/pos',
    component: PosOverviewComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/edit',
    component: LocationEditComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/payment',
    component: PaymentOverviewComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk/devices',
    component: KiosksComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk/devices/:kioskId',
    component: AddEditKioskComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/insights',
    component: InsightsComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/product-mix',
    component: ProductMixReportComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/dashboard',
    component: KpiReportComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/appearance/colors',
    component: ColorsComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/appearance/fonts',
    component: FontsComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/customization/languages',
    component: LanguagesComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/customization/locale',
    component: LocaleComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/customization/timeouts',
    component: TimeoutsComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/customization/ageverification',
    component: AgeverificationComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/customization/tips',
    component: TipsComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/customization/customeridentification',
    component: CustomeridentificationComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/customization/receipts',
    component: LocationReceiptCustomizationComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/customization/features',
    component: FeaturesComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/support/faq',
    component: FaqComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/support/contact',
    component: ContactComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/appearance/images',
    component: ImagesComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/appearance/textoverrides',
    component: TextoverridesComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk/orders',
    component: OrdersNavComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk/screensaver/add',
    component: ScreenSaverAddEditComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk/screensaver/:displayOrder/edit',
    component: ScreenSaverAddEditComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk/printer',
    component: LocationPrinterSettingsComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk/printer/add',
    component: LocationPrinterAddComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk/printer/:printerId/edit',
    component: LocationPrinterAddComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk-designer/menu',
    component: LocationKioskDesignerComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk-designer/menu/item/:menuItemId',
    component: LocationKioskDesignerItemEditComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk-designer/menu/modifier/:menuItemId',
    component: LocationKioskDesignerModifierEditComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk-designer/menu/modifier-group/edit/:modifierGroupId',
    component: LocationKioskDesignerModifierGroupEditComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk-designer/menu/modifier-group/add',
    component: LocationKioskDesignerModifierGroupAddComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk-designer/menu/category/edit/:categoryId',
    component: LocationKioskDesignerCategoryEditComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk-designer/menu/category/add',
    component: LocationKioskDesignerCategoryAddComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk-designer/pos-vault',
    component: LocationKioskDesignerVaultComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/menu/86',
    component: ItemAvailabilityComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/menu/upsell',
    component: OrderUpsellComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/menu/upsellnew',
    component: OrderUpsellNewComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/menu/upsellnew/add',
    component: OrderUpsellAddComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/menu/item-upsell-new',
    component: ItemUpsellNewComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/menu/item-upsell-new/add',
    component: ItemUpsellAddComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/menu/message-guards',
    component: MessageGuardsComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/customization/business-hours',
    component: BusinessHoursComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/staff',
    component: LocationStaffComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/staff/new',
    component: LocationStaffEditComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/staff/:staffId/edit',
    component: LocationStaffEditComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/users',
    component: LocationUsersComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/ordertypes',
    component: OrderTypesComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/loyalty',
    component: LoyaltyComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/kiosk-designer/concepts',
    component: ConceptsComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/transform-config',
    component: LocationTransformConfigComponent,
  },
  {
    pathMatch: 'full',
    path: ':companyid/:locationid/GEM',
    component: GemComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/:conceptId/edit',
    component: ConceptEditComponent,
  },
  {
    pathMatch: 'full',
    path: ':locationid/:kiosk-designer/menu/categories',
    component: MenuCategoriesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationRoutingModule {}
