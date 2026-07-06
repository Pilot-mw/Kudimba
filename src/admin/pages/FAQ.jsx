import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField from '../components/FormField';
import { Plus, Pencil, Trash2, HelpCircle } from 'lucide-react';

const defaultForm = { question: '', answer: '', category: '', sort_order: 0, is_active: true };

export default function FAQ() {
  const toast = useToast();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try { const params = { category }; const res = await api.get('faq/', { params }); setFaqs(res.data.results || res.data || []); } catch { toast.error('Failed to load FAQs'); } finally { setLoading(false); }
  }, [category]);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  const validate = () => {
    const errors = {};
    if (!form.question?.trim()) errors.question = 'Question is required';
    if (!form.answer?.trim()) errors.answer = 'Answer is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) { await api.put(`faq/${editing.id}/`, form); toast.success('FAQ updated'); }
      else { await api.post('faq/', form); toast.success('FAQ created'); }
      setModalOpen(false); setEditing(null); setForm(defaultForm); fetchFaqs();
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try { await api.delete(`faq/${deleteConfirm.id}/`); toast.success('FAQ deleted'); setDeleteConfirm(null); fetchFaqs(); } catch { toast.error('Failed to delete'); }
  };

  const allCategories = [...new Set(faqs.map(f => f.category).filter(Boolean))];

  const columns = [
    { key: 'question', label: 'Question', sortable: true, render: (r) => <span className="font-medium">{r.question}</span> },
    { key: 'category', label: 'Category' },
    { key: 'sort_order', label: 'Order', sortable: true },
    { key: 'is_active', label: 'Status', render: (r) => (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.is_active ? 'Active' : 'Inactive'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); setEditing(r); setForm({ question: r.question || '', answer: r.answer || '', category: r.category || '', sort_order: r.sort_order || 0, is_active: r.is_active ?? true }); setFormErrors({}); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-brand-pale text-brand-gray hover:text-brand-green"><Pencil className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(r); }} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-gray hover:text-brand-hot"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">FAQ</h1>
        <button onClick={() => { setEditing(null); setForm(defaultForm); setFormErrors({}); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-dark text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setCategory('')} className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${!category ? 'bg-brand-green text-white' : 'bg-gray-100 text-brand-gray hover:bg-gray-200'}`}>All</button>
        {allCategories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${category === cat ? 'bg-brand-green text-white' : 'bg-gray-100 text-brand-gray hover:bg-gray-200'}`}>{cat}</button>
        ))}
      </div>

      <DataTable columns={columns} data={faqs} loading={loading} emptyMessage="No FAQs yet" emptyIcon={HelpCircle} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit FAQ' : 'Add FAQ'} size="lg">
        <div className="space-y-4">
          <FormField label="Question" value={form.question} onChange={(e) => setForm({...form, question: e.target.value})} error={formErrors.question} required />
          <FormField label="Answer" type="textarea" value={form.answer} onChange={(e) => setForm({...form, answer: e.target.value})} rows={5} error={formErrors.answer} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Category" type="select" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} options={allCategories.map(c => ({ value: c, label: c }))} />
            <FormField label="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm({...form, sort_order: parseInt(e.target.value) || 0})} />
          </div>
          <FormField label="Active" type="checkbox" value={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brand-gray bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete FAQ" message={`Delete "${deleteConfirm?.question}"?`} confirmText="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}
