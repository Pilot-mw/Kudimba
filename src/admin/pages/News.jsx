import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField from '../components/FormField';
import ImageUpload from '../components/ImageUpload';
import RichTextEditor from '../components/RichTextEditor';
import { Plus, Pencil, Trash2, Newspaper } from 'lucide-react';

const defaultForm = { title: '', slug: '', content: '', excerpt: '', category: '', featured_image: null, status: 'draft', published_at: '' };

export default function News() {
  const toast = useToast();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, search, status: statusFilter, category: categoryFilter };
      const res = await api.get('news/', { params });
      setArticles(res.data.results || res.data);
      setTotal(res.data.count || res.data.length || 0);
    } catch {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('news-categories/');
      setCategories(res.data.results || res.data || []);
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => { fetchArticles(); }, [fetchArticles]);
  useEffect(() => { fetchCategories(); }, []);

  const validate = () => {
    const errors = {};
    if (!form.title?.trim()) errors.title = 'Title is required';
    if (!form.content?.trim() || form.content === '<br>') errors.content = 'Content is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'featured_image' && v instanceof File) fd.append('featured_image', v);
        else if (k === 'category') { if (v) fd.append('category_ids', v); }
        else if (k === 'published_at') { if (v) fd.append(k, v); }
        else if (k !== 'featured_image' && k !== 'category') fd.append(k, v);
      });
      if (editing) {
        if (!(form.featured_image instanceof File)) fd.delete('featured_image');
        await api.put(`news/${editing.id}/`, fd);
        toast.success('News article updated');
      } else {
        await api.post('news/', fd);
        toast.success('Article created');
      }
      setModalOpen(false);
      setEditing(null);
      setForm(defaultForm);
      fetchArticles();
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.detail || (typeof data === 'object' ? Object.values(data).flat().join(', ') : String(data)) || err.message || 'Failed to save article';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`news/${deleteConfirm.id}/`);
      toast.success('Article deleted');
      setDeleteConfirm(null);
      fetchArticles();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete');
    }
  };

  const toggleStatus = async (article) => {
    try {
      const newStatus = article.status === 'published' ? 'draft' : 'published';
      await api.patch(`news/${article.id}/`, { status: newStatus });
      toast.success(`Article ${newStatus}`);
      fetchArticles();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to toggle status');
    }
  };

  const columns = [
    { key: 'image', label: 'Image', render: (r) => r.image ? <img src={r.image} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Newspaper className="w-5 h-5 text-gray-400" /></div> },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'category', label: 'Category', render: (r) => r.category_name || r.category || '—' },
    { key: 'author', label: 'Author' },
    { key: 'status', label: 'Status', render: (r) => (
      <button onClick={(e) => { e.stopPropagation(); toggleStatus(r); }} className={`px-2 py-0.5 text-xs font-medium rounded-full cursor-pointer ${r.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</button>
    )},
    { key: 'published_at', label: 'Published', sortable: true, render: (r) => r.published_at ? new Date(r.published_at).toLocaleDateString() : '—' },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); setEditing(r); setForm({ title: r.title || '', slug: r.slug || '', content: r.content || '', excerpt: r.excerpt || '', category: r.category_ids?.[0] || '', featured_image: r.featured_image || null, status: r.status || 'draft', published_at: r.published_at || '' }); setFormErrors({}); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-brand-pale text-brand-gray hover:text-brand-green"><Pencil className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(r); }} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-gray hover:text-brand-hot"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">News & Articles</h1>
        <button onClick={() => { setEditing(null); setForm(defaultForm); setFormErrors({}); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-dark text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      <DataTable
        columns={columns}
        data={articles}
        loading={loading}
        searchable searchValue={search} onSearch={setSearch} searchPlaceholder="Search articles..."
        page={page} onPageChange={setPage} totalItems={total}
        filters={
          <div className="flex gap-2">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c.id || c} value={c.id || c}>{c.name || c}</option>)}
            </select>
          </div>
        }
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Article' : 'New Article'} size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} error={formErrors.title} required />
            <FormField label="Slug" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} helperText="Leave blank to auto-generate" />
            <FormField label="Category" type="select" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} options={categories.map(c => ({ value: c.id || c, label: c.name || c }))} />
            <FormField label="Status" type="select" value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} options={[{value:'draft',label:'Draft'},{value:'published',label:'Published'}]} />
            <FormField label="Status" type="select" value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} options={[{value:'draft',label:'Draft'},{value:'published',label:'Published'}]} />
            <FormField label="Publish Date" type="datetime-local" value={form.published_at} onChange={(e) => setForm({...form, published_at: e.target.value})} />
          </div>
          <FormField label="Excerpt" type="textarea" value={form.excerpt} onChange={(e) => setForm({...form, excerpt: e.target.value})} rows={2} helperText="Short summary for previews" />
          <RichTextEditor label="Content" value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} error={formErrors.content} />
          <ImageUpload label="Featured Image" value={form.featured_image} onChange={(e) => setForm({...form, featured_image: e.target.files?.[0] || e.target.value})} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brand-gray bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Article" message={`Delete "${deleteConfirm?.title}"?`} confirmText="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}
