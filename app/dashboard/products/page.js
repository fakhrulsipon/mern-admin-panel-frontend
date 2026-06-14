'use client';
import { useState, useEffect } from 'react';
import { confirmAction, showError, showSuccess } from '@/lib/alerts';
import { Plus, Edit3, Trash2, RotateCcw } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', stock: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://mern-admin-panel-ao02.onrender.com/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = Boolean(editingId);
    const url = isEditing
      ? `https://mern-admin-panel-ao02.onrender.com/api/products/${editingId}`
      : 'https://mern-admin-panel-ao02.onrender.com/api/products';

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Unable to save product. Please try again.');
      }

      setFormData({ name: '', price: '', category: '', stock: '', description: '' });
      setEditingId(null);
      fetchProducts();
      await showSuccess(isEditing ? 'Product updated successfully.' : 'Product published successfully.');
    } catch (err) {
      console.error('Error saving product:', err);
      await showError(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAction({
      title: 'Are you sure you want to delete this record?',
      text: 'This product will be removed from the catalog.',
    });

    if (!confirmed) return;

    try {
      const res = await fetch(`https://mern-admin-panel-ao02.onrender.com/api/products/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        throw new Error('Unable to delete product. Please try again.');
      }

      fetchProducts();
      await showSuccess('Product deleted successfully.');
    } catch (err) {
      console.error('Error deleting product:', err);
      await showError(err);
    }
  };

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
    <div className="w-full min-w-0  bg-[#FAF9F6] text-[#1A1A1A]">
      {/* Header section with tight bottom margin */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h1 className="text-3xl font-light tracking-widest uppercase">
          Product Management
        </h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Manage live catalog items and stock level parameters</p>
      </div>

      {/* Grid wrapper with optimized column layout and compact gaps */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        
        {/* Creation/Modification Form Module */}
        <div className="lg:col-span-1 bg-white p-6 border border-gray-100 rounded-sm shadow-sm h-fit">
          <h2 className="text-lg font-medium tracking-wide uppercase mb-4 flex items-center gap-2">
            <Plus size={16} strokeWidth={2} />
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Product Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-black text-sm text-black font-light"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Price ($)</label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-black text-sm text-black font-light"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Stock</label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-black text-sm text-black font-light"
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
                className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-black text-sm text-black font-light"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-black text-sm text-black font-light h-20 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="pt-1 space-y-2">
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
                  className="w-full border border-gray-200 text-gray-600 py-2 text-xs uppercase tracking-widest font-medium hover:bg-gray-50 transition-colors rounded-sm flex items-center justify-center gap-2"
                >
                  <RotateCcw size={12} />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Catalog Table View Module */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-[#1A1A1A]">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400 font-light tracking-wide">
                      No products available. Add one to start.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="p-4 font-medium text-gray-900">{product.name}</td>
                      <td className="p-4 text-gray-500 font-light">{product.category}</td>
                      <td className="p-4 font-medium">${Number(product.price).toFixed(2)}</td>
                      <td className="p-4 text-gray-600 font-light">
                        <span className={`inline-block px-2 py-0.5 text-[10px] uppercase font-medium tracking-wider ${
                          product.stock > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {product.stock > 0 ? `${product.stock} pcs` : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-xs uppercase tracking-wider text-blue-600 hover:underline"
                            title="Edit Record"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-xs uppercase tracking-wider text-red-600 hover:underline"
                            title="Remove Record"
                          >
                            Delete
                          </button>
                        </div>
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