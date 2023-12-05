import { paymentOrderTypeOption } from './defaults';
import { OrderTypeOptionModel } from './order-type-option.model';

export class GeneralSettingModel {
  orderTypeOptions: OrderTypeOptionModel[];
  paymentTypeOptions: paymentOrderTypeOption[];
  allowPurchaseOfGiftCards: boolean;
  showAvailableInventory: boolean;
  showCurrencyPrefix: boolean;
  showCalorieCount: boolean;
  hideStartsAtVariablePriced: boolean;
  minimizeSpacingBetweenItems: boolean;
  showItemTagImages: boolean;
  idCheckAlcoholItem: boolean;
  builderMode: boolean;
  enableItemSpecialRequest: boolean;
  showNegativeCustomizations: boolean;
  showDefaultCustomizations: boolean;
  itemHideCustomizationSelections: boolean;
  allowAddItemToCartForCustomizationsGroup86: boolean;
  includeTaxInPrice: boolean;
  hideItemLineTaxCheckoutScreen: boolean;
  upChargeOnCreditCardPayments: boolean;
  upChargeOnCreditCardPaymentsIsPercentage: boolean;
  upChargeOnCreditCardPaymentsAmount: number;
  askForTip: boolean;
  returningCustomers: boolean;
  showPaymentScreen: boolean;
  generalTimeout: number;
  checkoutTimeout: number;
}
