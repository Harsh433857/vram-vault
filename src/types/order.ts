import { CartItem } from './gpu';

export interface ShippingAddress {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  mainImage: string;
}

export interface Order {
  id: string;
  _id?: string;
  orderNumber: string;
  user?: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  subtotal: number;
  taxPrice: number;
  shippingPrice: number;
  totalAmount: number;
  isPaid: boolean;
  paidAt?: string;
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}
