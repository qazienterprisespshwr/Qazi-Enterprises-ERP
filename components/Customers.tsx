import React, { useState, useEffect, useMemo } from 'react';
import { deleteCustomer, getCustomers } from '../services/mockApi';
import { Customer, Role } from '../types';

interface CustomersProps {
    userRole?: Role;
}

const Customers: React.FC<CustomersProps> = ({ userRole }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [routeFilter, setRouteFilter] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            const data = await getCustomers();
            setCustomers(data);
        };
        fetchCustomers();
    }, []);

    const uniqueRoutes = useMemo(() => {
        const routes = new Set(customers.map(c => c.route));
        return ['All Routes', ...Array.from(routes)];
    }, [customers]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            const nameMatch = customer.name.toLowerCase().includes(searchTerm.toLowerCase());
            const routeMatch = !routeFilter || routeFilter === 'All Routes' || customer.route === routeFilter;
            return nameMatch && routeMatch;
        });
    }, [customers, searchTerm, routeFilter]);

    const handleDeleteCustomer = async (customerId: number) => {
        if (window.confirm('Are you sure you want to delete this customer? This will not delete their past orders.')) {
            await deleteCustomer(customerId);
            setCustomers(prevCustomers => prevCustomers.filter(c => c.id !== customerId));
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
                <button className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add New Customer
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by customer name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-sm p-2 border border-gray-300 rounded-lg"
                    />
                    <select
                        value={routeFilter}
                        onChange={(e) => setRouteFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg bg-white"
                    >
                        {uniqueRoutes.map(route => (
                            <option key={route} value={route}>
                                {route}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Customer Name</th>
                                <th scope="col" className="px-6 py-3">Phone</th>
                                <th scope="col" className="px-6 py-3">Address</th>
                                <th scope="col" className="px-6 py-3">Route</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                                    <td className="px-6 py-4">{customer.phone}</td>
                                    <td className="px-6 py-4">{customer.address}</td>
                                    <td className="px-6 py-4">{customer.route}</td>
                                    <td className="px-6 py-4">
                                        <a href="#" className="font-medium text-blue-600 hover:underline">Edit</a>
                                        {userRole === Role.Admin && (
                                            <button
                                                onClick={() => handleDeleteCustomer(customer.id)}
                                                className="font-medium text-red-600 hover:underline ml-4"
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
        </div>
    );
};

export default Customers;