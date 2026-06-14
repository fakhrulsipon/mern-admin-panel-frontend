"use client";
import { useState, useEffect } from "react";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  // ডাটাবেজ থেকে রিয়েল-টাইম অ্যানালিটিক্স সামারি লোড করা
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/analytics/summary");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="p-10 text-center font-light tracking-widest text-gray-500">LOADING OVERVIEW...</div>;
  }

  return (
    <div className="text-[#1A1A1A]">
      {/* হেডার সেকশন */}
      <div className="border-b border-gray-200 pb-4 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light tracking-widest uppercase">Overview</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Performance Metrics</p>
        </div>
        <span className="text-xs text-gray-500 font-light font-mono">
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </span>
      </div>

      {/* ৪টি অ্যানালিটিক্স কার্ড গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">Total Revenue</p>
          <p className="text-3xl font-light tracking-tight">${stats.totalRevenue}</p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">Total Orders</p>
          <p className="text-3xl font-light tracking-tight">{stats.totalOrders}</p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">Pending Orders</p>
          <p className="text-3xl font-light tracking-tight text-amber-600">{stats.pendingOrders}</p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">Active Products</p>
          <p className="text-3xl font-light tracking-tight">{stats.totalProducts}</p>
        </div>
      </div>

      {/* রিসেন্ট অর্ডার টেবিল সেকশন */}
      <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-[#FAF9F6] flex justify-between items-center">
          <h2 className="text-xs font-medium uppercase tracking-wider text-gray-700">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400 font-light">No recent transactions yet.</td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-400 font-light font-mono">#{order._id.substring(18, 24).toUpperCase()}</div>
                    </td>
                    <td className="p-4 text-gray-500 font-light">
                      {order.products.map(p => p.product?.name).join(", ") || "Products"}
                    </td>
                    <td className="p-4 font-medium">${order.totalAmount}</td>
                    <td className="p-4 text-right">
                      <span className={`inline-block px-2 py-0.5 text-xs uppercase tracking-wider font-medium rounded-sm ${
                        order.status === "Pending" ? "text-amber-600 bg-amber-50" :
                        order.status === "Delivered" ? "text-emerald-600 bg-emerald-50" : "text-gray-500 bg-gray-50"
                      }`}>
                        {order.status}
                      </span>
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