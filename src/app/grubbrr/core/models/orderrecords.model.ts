export class OrderRecord {
  orderType: string;
  orderTypeLabel: string;
  invoiceNo: string;
  orderDate: Date;
  locationId: string;
  totals: OrderTotals;
  refundTotal: number;
  items: OrderItem[];
  paymentDetails: PaymentDetails;
  paymentTransactionDeatils: PaymentDetails[];
  customer: OrderCustomer;
  orderIdentity: OrderIdentity;
  status: string;
  isUpChargeCard: boolean;
  upChargeAmountCard: number;
  isPercentageCard: boolean;
  percentageOrAmountCard: number;
  refunds: OrderRefund[];
  adjustedTotal?: number;
  appRefID: string;
  appRefIDOrder: string;
  redeemedRewards: RewardVM[];
}

export class RewardVM {
  id: string;
  name: string;
  value: number;
}

export class OrderRecordsModel {
  orderRecords: OrderRecord[];
  continuationToken?: any;
  moreRecords: boolean;
}

export class OrderItem {
  itemId: string;
  status: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  unitPrice: number;
  totalTax: number;
  totalPrice: number;
  quantity: number;
  options: OrderItemOption[];
  specialRequest?: string;
}

export class OrderItemOption {
  modifierGroupId: string;
  modifierId: string;
  name: string;
  quantity: number;
  price: number;
  options: OrderItemOption[];
  isInvisible: boolean;
  freeQuantity: number;
}

export class OrderTotals {
  total: number;
  subTotal: number;
  tax: number;
  tip: number;
  discount: number;
}

export class PaymentDetails {
  amount: number;
  type: string;
  paymentProvider: string;
  transactionId: string;
  paymentIntegrationLabel: string;
  retref: string;
}

export class OrderRefund {
  amount: number;
  invoiceNo: string;
  orderDate: string;
  refundDate: string;
  refundTransactionId: string;
  refundType: string;
  locationId: string;
  itemIds?: Array<string>;
}

export class OrderCustomer {
  customerId: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export class OrderIdentity {
  name: string;
  email: string;
  phone: string;
  tableTent: string;
}
