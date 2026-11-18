export interface OrderItem {
  id?: number;
  selected?: boolean;
  productName: string;
  name?: string;
  sku?: string;
  qtyOrdered?: number;
  qtyPicked?: number;
  qtyShipped?: number;
  labelPrintedFor?: number;
  qtyShipping?: number;
  quantity?: number;
  price: number;
}

export interface BoxDimensions {
  length: number | null;
  width: number | null;
  height: number | null;
  weight: number | null;
}

export interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export type OrderStatus = 'Packing' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  orderDate: string;
  totalAmount: number;
  itemsCount: number;

  // Billing Address
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  altPickPerson?: string;
  streetName?: string;
  cityStateZip?: string;

  // Order Information
  store?: string;
  orderType?: string;
  signifydGuarantee?: string;
  signifydScore?: number;

  // Shipping Information
  shipmentId?: string;
  shippingAddressText?: string;
  unreadMessages?: number;
  boxDimensions?: BoxDimensions;
  selectedBox?: string;

  // Actions / State
  canVoid?: boolean;
  canRefund?: boolean;

  // Legacy / fallback fields
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  shippingAddress?: ShippingAddress;
  items: OrderItem[];
}
