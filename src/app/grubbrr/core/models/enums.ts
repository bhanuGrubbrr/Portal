export enum OrderStatusEnum {
  Paid = 'Paid',
  FullRefund = 'FullyRefunded',
  PartialRefund = 'PartiallyRefunded',
}

export enum OrderIdentityMode {
  none,
  tableTent,
}

export enum CustomerIdentityMode {
  none,
  name,
}
