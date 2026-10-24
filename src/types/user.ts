export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  token?: string;
  shippingAddress?: {
    address: string;
    city: string;
    zip: string;
    country: string;
  };
}

export interface AuthResponse {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  token: string;
  shippingAddress?: {
    address: string;
    city: string;
    zip: string;
    country: string;
  };
}
