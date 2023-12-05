import { OrderType, OrderTypeOptionModel } from './order-type-option.model';

export const defaultOrderTypes: OrderType[] = [
  {
    enabled: false,
    label: 'Dine In',
    askCustomerName: true,
    askCustomerPhone: false,
    askCustomerEmail: false,
    tableTent: false,
    externalDeliveryMode: '',
  },
  {
    enabled: false,
    label: 'Take out',
    askCustomerName: false,
    askCustomerPhone: true,
    askCustomerEmail: false,
    tableTent: false,
    externalDeliveryMode: '',
  },
];

export const OrderTypeOptionDefaults: OrderTypeOptionModel[] = [
  {
    id: 'oto-dineine',
    enable: true,
    label: 'Dine In',
    askCustomerName: false,
    askCustomerPhone: false,
    askCustomerEmail: false,
    tableTent: false,
  },
  {
    id: 'oto-takeout',
    enable: true,
    label: 'Take Out',
    askCustomerName: false,
    askCustomerPhone: false,
    askCustomerEmail: false,
    tableTent: false,
  },
  {
    id: 'oto-partyevent',
    enable: true,
    label: 'Party Event',
    askCustomerName: false,
    askCustomerPhone: false,
    askCustomerEmail: false,
    tableTent: false,
  },
  {
    id: 'oto-delivery',
    enable: true,
    label: 'Delivery',
    askCustomerName: false,
    askCustomerPhone: false,
    askCustomerEmail: false,
    tableTent: false,
  },
];

export const PaymentTypeoptionDefaults: paymentOrderTypeOption[] = [
  {
    label: 'Credit Card',
    displayOrder: 0,
    enable: true,
  },
  {
    label: 'Cash',
    displayOrder: 1,
    enable: false,
  },
  {
    label: 'Gift Card',
    displayOrder: 2,
    enable: false,
  },
  {
    label: 'House Account',
    displayOrder: 3,
    enable: false,
  },
  // { // USConnect(if USConnect is enabled in payment setting)
  //   label: 'USConnect',
  //   displayOrder: 4,
  //   enable: false,
  // },
];
export class paymentOrderTypeOption {
  enable: boolean;
  label: string;
  displayOrder: number;
}
