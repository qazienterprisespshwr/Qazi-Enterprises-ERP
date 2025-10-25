import React, { useState, useEffect, useMemo } from 'react';
import { deleteProduct, getProducts } from '../services/mockApi';
import { Product, Role } from '../types';

const LOW_STOCK_THRESHOLD = 50;

interface InventoryProps {
    userRole?: Role;
}

const Inventory: React.FC<InventoryProps> = ({ userRole }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!searchTerm) {
            return products;
        }
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const handleExportToExcel = () => {
        if (!filteredProducts.length) return;

        const headers = ['ID', 'Product Name', 'Category', 'Quantity', 'Price', 'Supplier', 'Expiry Date'];
        
        const escapeCsvField = (field: any): string => {
            const stringField = String(field);
            if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
                return `"${stringField.replace(/"/g, '""')}"`;
            }
            return stringField;
        };

        const csvRows = [
            headers.join(','),
            ...filteredProducts.map(p => 
                [
                    p.id,
                    escapeCsvField(p.name),
                    escapeCsvField(p.category),
                    p.quantity,
                    p.price,
                    escapeCsvField(p.supplier),
                    p.expiryDate
                ].join(',')
            )
        ];
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "qazi-inventory-export.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDeleteProduct = async (productId: number) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            await deleteProduct(productId);
            setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleExportToExcel}
                        className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Export to Excel
                    </button>
                    <button className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Add New Product
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-sm p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Product Name</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Quantity</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3">Stock Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => {
                                const isLowStock = product.quantity <= LOW_STOCK_THRESHOLD;
                                return (
                                    <tr key={product.id} className={`border-b ${isLowStock ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-white hover:bg-gray-50'}`}>
                                        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4">{product.category}</td>
                                        <td className={`px-6 py-4 font-semibold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>{product.quantity}</td>
                                        <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${isLowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {isLowStock ? 'Low Stock' : 'In Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href="#" className="font-medium text-blue-600 hover:underline">Edit</a>
                                            {userRole === Role.Admin && (
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="font-medium text-red-600 hover:underline ml-4"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;