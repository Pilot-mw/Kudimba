import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField from '../components/FormField';
import ImageUpload from '../components/ImageUpload';
import { Plus, Pencil, Trash2, Megaphone } from 'lucide-react';

const defaultForm = { title: '', image: null, link: '', position: 'homepage', start_date: '', end_date: '', is_active: true };

export default function Adverts() {
  const toast = useToast();
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchAdverts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('adverts/', { params: { page: page + 1 } });
      setAdverts(res.data.results || res.data);
      setTotal(res.data.count || res.data.length || 0);
    } catch {
      toast.error('Failed to load adverts');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchAdverts(); }, [fetchAdverts]);

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'image' && v instanceof File) fd.append('image', v);
        else if (k !== 'image') fd.append(k, v);
      });
      if (editing) {
        if (!(form.image instanceof File)) fd.delete('image');
        await api.put(`adverts/${editing.id}/`, fd);
        toast.success('Advert updated');
      } else {
        await api.post('adverts/', fd);
        toast.success('Advert created');
      }
      setModalOpen(false);
      setEditing(null);
      setForm(defaultForm);
      fetchAdverts();
    } catch {
      toast.error('Failed to save advert');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`adverts/${deleteConfirm.id}/`);
      toast.success('Advert deleted');
      setDeleteConfirm(null);
      fetchAdverts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const columns = [
    { key: 'image', label: 'Image', render: (r) => r.image ? <img src={r.image} alt="" className="w-16 h-10 rounded-lg object-cover" /> : <div className="w-16 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Megaphone className="w-5 h-5 text-gray-400" /></div> },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'position', label: 'Position', render: (r) => <span className="capitalize text-sm">{r.position}</span> },
    { key: 'start_date', label: 'Start', render: (r) => r.start_date ? new Date(r.start_date).toLocaleDateString() : '—' },
    { key: 'end_date', label: 'End', render: (r) => r.end_date ? new Date(r.end_date).toLocaleDateString() : '—' },
    { key: 'is_active', label: 'Status', render: (r) => (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.is_active ? 'Active' : 'Inactive'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); setEditing(r); setForm({ title: r.title || '', image: r.image || null, link: r.link || '', position: r.position || 'homepage', start_date: r.start_date ? r.start_date.slice(0,10) : '', end_date: r.end_date ? r.end_date.slice(0,10) : '', is_active: r.is_active ?? true }); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-brand-pale text-brand-gray hover:text-brand-green"><Pencil className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(r); }} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-gray hover:text-brand-hot"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Adverts</h1>
        <button onClick={() => { setEditing(null); setForm(defaultForm); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-dark text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Advert
        </button>
      </div>

      <DataTable columns={columns} data={adverts} loading={loading} page={page} onPageChange={setPage} totalItems={total} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Advert' : 'Add Advert'} size="lg">
        <div className="space-y-4">
          <ImageUpload label="Advert Image" value={form.image} onChange={(e) => setForm({...form, image: e.target.files?.[0] || e.target.value})} />
          <FormField label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
          <FormField label="Link URL" value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} placeholder="https://..." />
          <FormField label="Position" type="select" value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} options={[{value:'homepage',label:'Homepage'},{value:'sidebar',label:'Sidebar'},{value:'footer',label:'Footer'}]} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Start Date" type="date" value={form.start_date} onChange={(e) => setForm({...form, start_date: e.target.value})} />
            <FormField label="End Date" type="date" value={form.end_date} onChange={(e) => setForm({...form, end_date: e.target.value})} />
          </div>
          <FormField label="Active" type="checkbox" value={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brand-gray bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Advert" message={`Delete "${deleteConfirm?.title}"?`} confirmText="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}
