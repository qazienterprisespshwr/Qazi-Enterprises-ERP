import React, { useState, useEffect } from 'react';
import { deleteOrder, getOrders, getCustomers, updateOrderStatus } from '../services/mockApi';
import { Order, Customer, Role, OrderStatus } from '../types';

interface OrdersProps {
    onViewInvoice: (order: Order) => void;
    userRole?: Role;
}


const Orders: React.FC<OrdersProps> = ({ onViewInvoice, userRole }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setOrders(await getOrders());
            setCustomers(await getCustomers());
        };
        fetchData();
    }, []);

    const getCustomerName = (customerId: number) => {
        return customers.find(c => c.id === customerId)?.name || 'Unknown';
    };
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Delivered': return 'bg-blue-100 text-blue-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    const handleDeleteOrder = async (orderId: number) => {
        if (window.confirm('Are you sure you want to delete this order? This action is permanent.')) {
            await deleteOrder(orderId);
            setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
        }
    };
    
    const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
        const updatedOrder = await updateOrderStatus(orderId, newStatus);
        if (updatedOrder) {
            setOrders(prevOrders => 
                prevOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
            );
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
              {userRole === Role.Admin || userRole === Role.Booker ? (
                <button className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Create New Order
                </button>
              ) : null}
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                 <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Order ID</th>
                            <th scope="col" className="px-6 py-3">Customer</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                                <td className="px-6 py-4">{getCustomerName(order.customerId)}</td>
                                <td className="px-6 py-4">{order.date}</td>
                                <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    {userRole === Role.Admin || userRole === Role.Booker ? (
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                            className={`w-full p-1 text-xs font-medium rounded-md border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 ${getStatusColor(order.status)}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {Object.values(OrderStatus).map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 space-x-4">
                                    <button 
                                        onClick={() => onViewInvoice(order)}
                                        className="font-medium text-blue-600 hover:underline"
                                    >
                                        View Invoice
                                    </button>
                                    {userRole === Role.Admin && (
                                        <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="font-medium text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;