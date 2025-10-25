import { User, Product, Order, Customer, Role, OrderStatus, BookerLocation } from '../types';

// Mock Data
const users: User[] = [
  { id: 1, username: 'admin', email: 'admin@qazi.com', role: Role.Admin },
  { id: 2, username: 'booker', email: 'booker@qazi.com', role: Role.Booker },
  { id: 3, username: 'driver', email: 'driver@qazi.com', role: Role.Driver },
  { id: 4, username: 'accountant', email: 'accountant@qazi.com', role: Role.Accountant },
  { id: 5, username: 'izaz', email: 'izaz@qazi.com', role: Role.Booker },
  { id: 6, username: 'saqib', email: 'saqib@qazi.com', role: Role.Booker },
];

let products: Product[] = [
  { id: 1, name: 'Lays Chips', category: 'Snacks', quantity: 150, price: 1.50, supplier: 'PepsiCo', expiryDate: '2024-12-31' },
  { id: 2, name: 'Coca-Cola 1.5L', category: 'Beverages', quantity: 200, price: 2.00, supplier: 'Coca-Cola Inc.', expiryDate: '2025-06-30' },
  { id: 3, name: 'Whole Wheat Bread', category: 'Bakery', quantity: 45, price: 3.50, supplier: 'Local Bakery', expiryDate: '2024-07-15' },
  { id: 4, name: 'Milk 1 Gallon', category: 'Dairy', quantity: 80, price: 4.25, supplier: 'Dairy Farm', expiryDate: '2024-07-20' },
  { id: 5, name: 'Cheddar Cheese', category: 'Dairy', quantity: 120, price: 5.00, supplier: 'Cheese Co.', expiryDate: '2024-10-01' },
  { id: 6, name: 'Pepsi 1.5L', category: 'Beverages', quantity: 30, price: 1.90, supplier: 'PepsiCo', expiryDate: '2025-06-30' },
  { id: 7, name: '7-Up 1.5L', category: 'Beverages', quantity: 180, price: 1.90, supplier: 'PepsiCo', expiryDate: '2025-06-30' },
];

let customers: Customer[] = [
  { id: 1, name: 'Green Valley Supermarket', phone: '555-0101', address: '123 Main St, Cityville', route: 'Route A' },
  { id: 2, name: 'Corner Mart', phone: '555-0102', address: '456 Oak Ave, Townsville', route: 'Route B' },
  { id: 3, name: 'Quick Stop Groceries', phone: '555-0103', address: '789 Pine Ln, Villageton', route: 'Route A' },
  { id: 4, name: 'City Central Grocers', phone: '555-0104', address: '101 Center Plaza, Cityville', route: 'Route C' },
];

let orders: Order[] = [
  { id: 1001, customerId: 1, date: '2024-07-01', total: 105.00, items: [{id: 1, productId: 1, quantity: 70, price: 1.50, subtotal: 105.00}], status: OrderStatus.Delivered },
  { id: 1002, customerId: 2, date: '2024-07-02', total: 100.00, items: [{id: 2, productId: 2, quantity: 50, price: 2.00, subtotal: 100.00}], status: OrderStatus.Paid },
  { id: 1003, customerId: 1, date: '2024-07-03', total: 52.50, items: [{id: 3, productId: 3, quantity: 15, price: 3.50, subtotal: 52.50}], status: OrderStatus.Pending },
  { id: 1004, customerId: 3, date: '2024-07-04', total: 127.50, items: [{id: 4, productId: 4, quantity: 30, price: 4.25, subtotal: 127.50}], status: OrderStatus.Delivered },
  { id: 1005, customerId: 4, date: '2024-07-05', total: 200.00, items: [{id: 5, productId: 5, quantity: 40, price: 5.00, subtotal: 200.00}], status: OrderStatus.Paid },
];

const bookerLocations: BookerLocation[] = [
    { id: 2, username: 'booker', latitude: 34.0151, longitude: 71.5249, status: 'On Route' },
    { id: 5, username: 'izaz', latitude: 34.025, longitude: 71.58, status: 'Meeting' },
    { id: 6, username: 'saqib', latitude: 33.99, longitude: 71.48, status: 'Idle' },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// API Functions
export const login = async (emailOrUsername: string, password: string): Promise<User | null> => {
  await delay(500);
  const user = users.find(u => (u.email === emailOrUsername || u.username === emailOrUsername) && password === 'password'); // Simple password for mock
  return user || null;
};

export const getProducts = async (): Promise<Product[]> => {
  await delay(300);
  return [...products];
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
  await delay(100);
  return products.find(p => p.id === id);
}

export const deleteProduct = async (id: number): Promise<void> => {
    await delay(500);
    products = products.filter(p => p.id !== id);
}

export const getOrders = async (): Promise<Order[]> => {
  await delay(300);
  return [...orders];
};

export const deleteOrder = async (id: number): Promise<void> => {
    await delay(500);
    orders = orders.filter(o => o.id !== id);
}

export const updateOrderStatus = async (orderId: number, status: OrderStatus): Promise<Order | null> => {
    await delay(300);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        return { ...orders[orderIndex] };
    }
    return null;
}

export const getCustomers = async (): Promise<Customer[]> => {
  await delay(300);
  return [...customers];
};

export const getCustomerById = async (id: number): Promise<Customer | undefined> => {
    await delay(100);
    return customers.find(c => c.id === id);
}

export const deleteCustomer = async (id: number): Promise<void> => {
    await delay(500);
    customers = customers.filter(c => c.id !== id);
}

export const getBookerLocations = async (): Promise<BookerLocation[]> => {
    await delay(400);
    return [...bookerLocations];
}
