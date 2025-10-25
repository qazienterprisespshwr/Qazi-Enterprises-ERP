// Fix: Define all necessary types for the application.
export enum Role {
  Admin = 'Admin',
  Booker = 'Booker',
  Driver = 'Driver',
  Accountant = 'Accountant',
}

export enum OrderStatus {
    Paid = 'Paid',
    Delivered = 'Delivered',
    Pending = 'Pending',
}

export type View = 'Dashboard' | 'Inventory' | 'Orders' | 'Customers' | 'Payments' | 'Reports' | 'Settings';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  supplier: string;
  expiryDate: string;
}

export interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Order {
  id: number;
  customerId: number;
  date: string;
  total: number;
  items: OrderItem[];
  status: OrderStatus;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  route: string;
}

export interface BookerLocation {
    id: number;
    username: string;
    latitude: number;
    longitude: number;
    status: string;
}
