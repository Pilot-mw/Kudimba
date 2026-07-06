import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUpload from '../components/ImageUpload';
import { Plus, Pencil, Trash2, Eye, Package } from 'lucide-react';

const defaultForm = {
  name: '', category: '', price: '', compare_price: '', stock: '',
  description: '', image: null, status: 'active', featured: false,
};

export default function Products() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, search, category: categoryFilter, status: statusFilter };
      const res = await api.get('products/', { params });
      setProducts(res.data.results || res.data);
      setTotal(res.data.count || res.data.length || 0);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter, statusFilter]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('categories/');
      setCategories(res.data.results || res.data || []);
    } catch {}
  };

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchCategories(); }, []);

  const validate = () => {
    const errors = {};
    if (!form.name?.trim()) errors.name = 'Name is required';
    if (!form.category?.trim()) errors.category = 'Category is required';
    if (!form.price || form.price <= 0) errors.price = 'Valid price is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'image' && v instanceof File) fd.append('image', v);
        else if (k !== 'image') fd.append(k, v);
      });
      if (editing) {
        await api.put(`products/${editing.id}/`, fd);
        toast.success('Product updated');
      } else {
        await api.post('products/', fd);
        toast.success('Product created');
      }
      setModalOpen(false);
      setEditing(null);
      setForm(defaultForm);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || '',
      category: product.category || product.category_name || '',
      price: product.price || '',
      compare_price: product.compare_price || '',
      stock: product.stock ?? '',
      description: product.description || '',
      image: product.image || null,
      status: product.status || 'active',
      featured: product.featured || false,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`products/${deleteConfirm.id}/`);
      toast.success('Product deleted');
      setDeleteConfirm(null);
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const columns = [
    { key: 'image', label: 'Image', render: (r) => (
      r.image ? <img src={r.image} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Package className="w-5 h-5 text-gray-400" /></div>
    )},
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category', render: (r) => r.category_name || r.category || '—' },
    { key: 'price', label: 'Price', sortable: true, render: (r) => `$${parseFloat(r.price).toFixed(2)}` },
    { key: 'stock', label: 'Stock', sortable: true },
    { key: 'status', label: 'Status', render: (r) => (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${r.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.status}</span>
    )},
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); handleEdit(r); }} className="p-1.5 rounded-lg hover:bg-brand-pale text-brand-gray hover:text-brand-green"><Pencil className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(r); }} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-gray hover:text-brand-hot"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Products</h1>
        <button
          onClick={() => { setEditing(null); setForm(defaultForm); setFormErrors({}); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-dark text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        searchable
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Search products..."
        page={page}
        onPageChange={setPage}
        totalItems={total}
        filters={
          <div className="flex gap-2">
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20">
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c.id || c} value={c.id || c}>{c.name || c}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        }
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Product Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} error={formErrors.name} required />
            <FormField label="Category" type="select" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} options={categories.map(c => ({ value: c.id || c, label: c.name || c }))} error={formErrors.category} required />
            <FormField label="Price" type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} error={formErrors.price} required />
            <FormField label="Compare Price" type="number" value={form.compare_price} onChange={(e) => setForm({...form, compare_price: e.target.value})} />
            <FormField label="Stock" type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} />
            <FormField label="Status" type="select" value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} options={[{value:'active',label:'Active'},{value:'inactive',label:'Inactive'}]} />
          </div>
          <FormField label="Featured" type="checkbox" value={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})} />
          <FormField label="Description" type="textarea" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={4} />
          <ImageUpload label="Product Image" value={form.image} onChange={(e) => setForm({...form, image: e.target.files?.[0] || e.target.value})} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brand-gray bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg disabled:opacity-60 flex items-center gap-2">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This cannot be undone.`}
        confirmText="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
