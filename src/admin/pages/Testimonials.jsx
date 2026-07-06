import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField from '../components/FormField';
import ImageUpload from '../components/ImageUpload';
import { Plus, Pencil, Trash2, Star, MessageSquareQuote } from 'lucide-react';

const defaultForm = { name: '', title: '', company: '', content: '', avatar: null, rating: 5, sort_order: 0, is_active: true };

export default function Testimonials() {
  const toast = useToast();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('testimonials/', { params: { page: page + 1 } });
      setTestimonials(res.data.results || res.data);
      setTotal(res.data.count || res.data.length || 0);
    } catch { toast.error('Failed to load testimonials'); } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const validate = () => {
    const errors = {};
    if (!form.name?.trim()) errors.name = 'Name is required';
    if (!form.content?.trim()) errors.content = 'Content is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'avatar' && v instanceof File) fd.append('avatar', v);
        else if (k !== 'avatar') fd.append(k, v);
      });
      if (editing) {
        if (!(form.avatar instanceof File)) fd.delete('avatar');
        await api.put(`testimonials/${editing.id}/`, fd);
        toast.success('Testimonial updated');
      } else {
        await api.post('testimonials/', fd);
        toast.success('Testimonial created');
      }
      setModalOpen(false); setEditing(null); setForm(defaultForm); fetchTestimonials();
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try { await api.delete(`testimonials/${deleteConfirm.id}/`); toast.success('Testimonial deleted'); setDeleteConfirm(null); fetchTestimonials(); } catch { toast.error('Failed to delete'); }
  };

  const renderStars = (rating) => (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
    </div>
  );

  const columns = [
    { key: 'avatar', label: 'Photo', render: (r) => r.avatar ? <img src={r.avatar} alt="" className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-brand-pale flex items-center justify-center text-brand-green font-medium text-sm">{r.name?.charAt(0)}</div> },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'company', label: 'Company' },
    { key: 'rating', label: 'Rating', render: (r) => renderStars(r.rating) },
    { key: 'is_active', label: 'Status', render: (r) => (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.is_active ? 'Active' : 'Inactive'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); setEditing(r); setForm({ name: r.name || '', title: r.title || '', company: r.company || '', content: r.content || '', avatar: r.avatar || null, rating: r.rating || 5, sort_order: r.sort_order || 0, is_active: r.is_active ?? true }); setFormErrors({}); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-brand-pale text-brand-gray hover:text-brand-green"><Pencil className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(r); }} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-gray hover:text-brand-hot"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Testimonials</h1>
        <button onClick={() => { setEditing(null); setForm(defaultForm); setFormErrors({}); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-dark text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <DataTable columns={columns} data={testimonials} loading={loading} page={page} onPageChange={setPage} totalItems={total} emptyMessage="No testimonials yet" emptyIcon={MessageSquareQuote} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Client Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} error={formErrors.name} required />
            <FormField label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
            <FormField label="Company" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} />
            <FormField label="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm({...form, sort_order: parseInt(e.target.value) || 0})} />
          </div>
          <FormField label="Rating" type="select" value={form.rating} onChange={(e) => setForm({...form, rating: parseInt(e.target.value)})} options={[5,4,3,2,1].map(n => ({ value: n, label: `${'★'.repeat(n)}${'☆'.repeat(5-n)}` }))} />
          <FormField label="Content" type="textarea" value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} rows={4} error={formErrors.content} required />
          <ImageUpload label="Avatar" value={form.avatar} onChange={(e) => setForm({...form, avatar: e.target.files?.[0] || e.target.value})} />
          <FormField label="Active" type="checkbox" value={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brand-gray bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Testimonial" message={`Delete testimonial from "${deleteConfirm?.name}"?`} confirmText="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}
