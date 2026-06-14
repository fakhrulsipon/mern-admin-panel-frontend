'use client';
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', stock: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  // ১. ডাটাবেজ থেকে সব প্রোডাক্ট লোড করা
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ২. ফর্ম সাবমিট (Create & Update) হ্যান্ডেল করা
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId 
      ? `http://localhost:8000/api/products/${editingId}`
      : 'http://localhost:8000/api/products';
    
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: '', price: '', category: '', stock: '', description: '' });
        setEditingId(null);
        fetchProducts(); // লিস্ট রিফ্রেশ করা
      }
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  // ৩. ডিলিট হ্যান্ডেল করা
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // ৪. এডিট মোড অন করা
  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description || '',
    });
  };

  return (
    <div className="max-w-6xl mx-auto min-w-0 p-6 md:p-10 bg-[#FAF9F6] min-h-screen text-[#1A1A1A]">
      <h1 className="text-3xl font-light tracking-widest uppercase border-b border-gray-200 pb-4 mb-8">
        Product Management
      </h1>

      <div className="grid min-w-0 grid-cols-1 lg:grid-cols-3 gap-10">
        {/* প্রোডাক্ট ফর্ম (মিনিমালিস্ট ডিজাইন) */}
        <div className="min-w-0 lg:col-span-1 bg-white p-6 border border-gray-100 rounded-sm shadow-sm h-fit">
          <h2 className="text-lg font-medium tracking-wide uppercase mb-6">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Product Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-black text-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Price ($)</label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-black text-sm"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Stock</label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-black text-sm"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Category</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-black text-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-black text-sm h-20 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-gray-900 transition-colors rounded-sm"
            >
              {editingId ? 'Update Product' : 'Publish Product'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setFormData({ name: '', price: '', category: '', stock: '', description: '' }); }}
                className="w-full border border-gray-200 text-gray-600 py-2 text-xs uppercase tracking-widest font-medium hover:bg-gray-50 transition-colors rounded-sm mt-2"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* প্রোডাক্ট টেবিল/লিস্ট */}
        <div className="min-w-0 lg:col-span-2 bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400 font-light">No products available. Add one to start.</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="p-4 font-medium text-gray-900">{product.name}</td>
                      <td className="p-4 text-gray-500 font-light">{product.category}</td>
                      <td className="p-4 font-medium">${product.price}</td>
                      <td className="p-4 text-gray-600 font-light">{product.stock} pcs</td>
                      <td className="p-4 text-right space-x-3 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-xs uppercase tracking-wider text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-xs uppercase tracking-wider text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
