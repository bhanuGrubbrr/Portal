export class OrderTypeOptionModel {
  id?: string;
  enable: boolean;
  label: string;
  askCustomerName: boolean;
  askCustomerPhone: boolean;
  askCustomerEmail: boolean;
  tableTent: boolean;
}

export interface PosOrderType {
  id: string;
  displayName: string;
}
export interface OrderType {
  enabled: boolean;
  label: string;
  askCustomerName: boolean;
  askCustomerPhone: boolean;
  askCustomerEmail: boolean;
  tableTent: boolean;
  externalDeliveryMode: string;
}
