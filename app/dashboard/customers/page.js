'use client';
import { useState, useEffect } from 'react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/customers');
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        }
      } catch (err) {
        console.error('Failed to fetch customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="p-10 text-center font-light tracking-widest text-gray-400">LOADING CUSTOMERS...</div>;
  }

  return (
    <div className="text-[#1A1A1A]">
      {/* হেডার */}
      <div className="border-b border-gray-200 pb-4 mb-8">
        <h1 className="text-3xl font-light tracking-widest uppercase">Customer Directory</h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Client Base & Lifetime Value</p>
      </div>

      {/* কাস্টমার টেবিল */}
      <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-medium">Customer Info</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Total Orders</th>
                <th className="p-4 font-medium text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400 font-light">No customers found in database.</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-xs text-gray-400 font-light">{customer.email}</div>
                    </td>
                    <td className="p-4 text-gray-500 font-light">{customer.phone || 'N/A'}</td>
                    <td className="p-4 text-gray-600 font-light">{customer.totalOrders} orders</td>
                    <td className="p-4 text-right font-medium text-gray-900">${customer.totalSpent}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}