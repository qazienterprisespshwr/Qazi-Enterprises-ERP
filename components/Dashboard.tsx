// Fix: Implement the Dashboard component with role-based content.
import React, { useState, useEffect } from 'react';
import { Role, Order, Product, Customer, OrderStatus } from '../types';
import { getOrders, getProducts, getCustomers } from '../services/mockApi';
import OrderBookerChatbot from './OrderBookerChatbot';

interface DashboardProps {
    userRole?: Role;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-blue-100 text-blue-600 rounded-full p-3 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        if (userRole === Role.Admin || userRole === Role.Booker || userRole === Role.Accountant) {
            const fetchData = async () => {
                setOrders(await getOrders());
                setProducts(await getProducts());
                setCustomers(await getCustomers());
            };
            fetchData();
        }
    }, [userRole]);

    const lowStockItems = products.filter(p => p.quantity < 50).length;
    const pendingOrders = orders.filter(o => o.status === OrderStatus.Pending).length;

    const renderAdminDashboard = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Orders" value={orders.length} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
                <StatCard title="Total Customers" value={customers.length} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <StatCard title="Pending Orders" value={pendingOrders} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Low Stock Items" value={lowStockItems} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
                     <ul className="space-y-2">
                        {orders.slice(0, 5).map(order => (
                            <li key={order.id} className="flex justify-between items-center text-sm">
                                <span>#{order.id}</span>
                                <span className="text-gray-600">{customers.find(c => c.id === order.customerId)?.name || '...'}</span>
                                <span className="font-semibold">${order.total.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">AI Order Assistant</h2>
                     <p className="text-gray-600 mb-4">For interactive order creation, please log in as a Booker.</p>
                </div>
            </div>
        </>
    );

    const renderBookerDashboard = () => (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, Booker!</h2>
            <p className="text-gray-600 mb-6">You can create a new order by describing it in natural language below.</p>
            <OrderBookerChatbot />
        </div>
    );
    
    const renderDefaultDashboard = () => (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Qazi Enterprises ERP!</h2>
            <p>Select an option from the sidebar to get started.</p>
        </div>
    );

    const renderContent = () => {
        switch (userRole) {
            case Role.Admin:
                return renderAdminDashboard();
            case Role.Booker:
                return renderBookerDashboard();
            case Role.Accountant:
            case Role.Driver:
            default:
                return renderDefaultDashboard();
        }
    }

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
            {renderContent()}
        </div>
    );
};

export default Dashboard;
