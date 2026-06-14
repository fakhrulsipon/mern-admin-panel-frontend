'use client';
import { useState, useEffect } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  // ১. ডাটাবেজ থেকে সব অর্ডার লোড করা
  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ২. অর্ডারের স্ট্যাটাস পরিবর্তন হ্যান্ডেল করা
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchOrders(); // আপডেট হওয়ার পর লিস্ট রিফ্রেশ করা
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // স্ট্যাটাসের ওপর ভিত্তি করে টেক্সটের কালার সেট করার ফাংশন
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'text-amber-600 bg-amber-50';
      case 'Processing': return 'text-blue-600 bg-blue-50';
      case 'Shipped': return 'text-purple-600 bg-purple-50';
      case 'Delivered': return 'text-emerald-600 bg-emerald-50';
      case 'Cancelled': return 'text-rose-600 bg-rose-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 bg-[#FAF9F6] min-h-screen text-[#1A1A1A]">
      <h1 className="text-3xl font-light tracking-widest uppercase border-b border-gray-200 pb-4 mb-8">
        Order Management
      </h1>

      <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-medium">Order ID / Date</th>
                <th className="p-4 font-medium">Customer Details</th>
                <th className="p-4 font-medium">Items Ordered</th>
                <th className="p-4 font-medium">Total Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400 font-light">
                    No orders found in the system.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FAF9F6] transition-colors">
                    {/* অর্ডার আইডি এবং ডেট */}
                    <td className="p-4">
                      <span className="font-mono text-xs text-gray-400 block mb-1">
                        #{order._id.substring(18, 24).toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 font-light">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* কাস্টমার ডিটেইলস */}
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500 font-light">{order.email}</div>
                    </td>

                    {/* অর্ডার করা আইটেমসমূহ */}
                    <td className="p-4">
                      <div className="space-y-1">
                        {order.products.map((item, idx) => (
                          <div key={idx} className="text-xs text-gray-600 font-light">
                            <span className="font-medium text-gray-950">{item.product?.name || 'Unknown Product'}</span>
                            <span className="text-gray-400"> x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* টোটাল অ্যামাউন্ট */}
                    <td className="p-4 font-medium text-gray-900">
                      ${order.totalAmount}
                    </td>

                    {/* কারেন্ট স্ট্যাটাস ব্যাজ */}
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 text-xs uppercase tracking-wider font-medium rounded-sm ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    {/* স্ট্যাটাস চেঞ্জ করার ড্রপডাউন মেনু */}
                    <td className="p-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="text-xs bg-transparent border border-gray-200 rounded-sm p-1.5 focus:outline-none focus:border-black text-gray-700 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
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