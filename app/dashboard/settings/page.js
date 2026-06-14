'use client';
import { useState } from 'react';

export default function SettingsPage() {
  const [storeName, setStoreName] = useState('E-Shop Headquarter');
  const [currency, setCurrency] = useState('USD');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Configuration saved successfully (Local State)');
  };

  return (
    <div className="min-w-0 text-[#1A1A1A]">
      {/* হেডার */}
      <div className="border-b border-gray-200 pb-4 mb-8">
        <h1 className="text-3xl font-light tracking-widest uppercase">Store Settings</h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">System & Store Preferences</p>
      </div>

      {/* সেটিংস ফর্ম */}
      <div className="max-w-2xl max-w-full bg-white border border-gray-100 p-6 sm:p-8 rounded-sm shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Boutique / Store Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-black text-sm"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Store Currency</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-black text-sm bg-transparent cursor-pointer"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              className="w-full sm:w-auto bg-black text-white px-6 py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-gray-900 transition-colors rounded-sm"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
