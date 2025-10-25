import React, { useState, useEffect } from 'react';
import { Order, Customer, Product, Role } from '../types';
import { getCustomerById, getProductById, deleteOrder } from '../services/mockApi';
import { LOGO_BASE64_URL } from '../constants';


interface InvoiceProps {
  order: Order;
  onBack: () => void;
  userRole?: Role;
}

const Invoice: React.FC<InvoiceProps> = ({ order, onBack, userRole }) => {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [productDetails, setProductDetails] = useState<{[key: number]: Product}>({});

    useEffect(() => {
        const fetchDetails = async () => {
            const cust = await getCustomerById(order.customerId);
            setCustomer(cust || null);

            const products: {[key: number]: Product} = {};
            for (const item of order.items) {
                const prod = await getProductById(item.productId);
                if (prod) {
                    products[item.productId] = prod;
                }
            }
            setProductDetails(products);
        };

        fetchDetails();
    }, [order]);

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete Order #${order.id}? This action cannot be undone.`)) {
            await deleteOrder(order.id);
            alert(`Order #${order.id} has been deleted.`);
            onBack();
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-gray-200">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4 print:hidden">
                    <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Orders
                    </button>
                    <div className="flex items-center gap-3">
                        {userRole === Role.Admin && (
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Delete Order
                            </button>
                        )}
                        <button onClick={() => window.print()} className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                            Print / Save as PDF
                        </button>
                    </div>
                </div>
                <div className="bg-white p-12 shadow-lg rounded-lg print:shadow-none" id="invoice-content">
                    <header className="flex justify-between items-start pb-8 border-b">
                        <div>
                            <img src={LOGO_BASE64_URL} alt="Qazi Enterprises" className="h-20 w-auto mb-2" />
                            <p className="text-gray-500">Peshawar, Pakistan</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">INVOICE</h2>
                            <p className="text-gray-500 font-mono">INV-{String(order.id).padStart(4, '0')}</p>
                        </div>
                    </header>

                    <section className="grid grid-cols-2 gap-8 my-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
                            <p className="font-bold text-gray-800">{customer?.name}</p>
                            <p className="text-gray-600">{customer?.address}</p>
                            <p className="text-gray-600">{customer?.phone}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Details</h3>
                            <p className="text-gray-600"><span className="font-semibold text-gray-700">Invoice Date:</span> {order.date}</p>
                             <p className="text-gray-600"><span className="font-semibold text-gray-700">Payment Terms:</span> Due Upon Receipt</p>
                            <p className="text-gray-600"><span className="font-semibold text-gray-700">Order Status:</span> {order.status}</p>
                        </div>
                    </section>

                    <section>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Product</th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase text-center">Qty</th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase text-right">Price</th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map(item => (
                                    <tr key={item.id} className="border-b">
                                        <td className="p-3">{productDetails[item.productId]?.name || 'Loading...'}</td>
                                        <td className="p-3 text-center">{item.quantity}</td>
                                        <td className="p-3 text-right">${item.price.toFixed(2)}</td>
                                        <td className="p-3 text-right font-medium">${item.subtotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                    
                    <section className="flex justify-end mt-8">
                        <div className="w-full max-w-xs">
                            <div className="flex justify-between text-gray-600">
                                <p>Subtotal</p>
                                <p>${order.total.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between text-gray-600 mt-2">
                                <p>Tax (0%)</p>
                                <p>$0.00</p>
                            </div>
                            <div className="flex justify-between font-bold text-xl text-gray-900 mt-4 pt-4 border-t">
                                <p>Total</p>
                                <p>${order.total.toFixed(2)}</p>
                            </div>
                        </div>
                    </section>

                    <footer className="mt-16 pt-8 border-t">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2 text-gray-500 text-sm">
                                <p className="font-semibold mb-2">Notes & Terms</p>
                                <p className="text-xs">1. All payments are due upon receipt unless specified otherwise.</p>
                                <p className="text-xs">2. Please inspect goods upon delivery. No returns after 24 hours.</p>
                                <p className="text-xs">3. For any inquiries, contact us at qazienterprises.pshwr@gmail.com.</p>
                            </div>
                            <div className="text-center">
                                <div className="h-20 w-full border-b-2 border-dotted border-gray-400 mb-2"></div>
                                <p className="text-xs text-gray-600">Authorized Signature / Company Stamp</p>
                            </div>
                        </div>
                        <div className="text-center text-gray-500 text-sm mt-12">
                            <p>Thank you for your business!</p>
                            <p>Qazi Enterprises - Quality You Can Trust</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Invoice;