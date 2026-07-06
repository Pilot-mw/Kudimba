import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField from '../components/FormField';
import ImageUpload from '../components/ImageUpload';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';

const defaultForm = { name: '', position: '', bio: '', photo: null, email: '', phone: '', sort_order: 0, is_active: true };

export default function Staff() {
  const toast = useToast();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try { const res = await api.get('staff/'); setStaff(res.data.results || res.data || []); } catch { toast.error('Failed to load staff'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const validate = () => {
    const errors = {};
    if (!form.name?.trim()) errors.name = 'Name is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'photo' && v instanceof File) fd.append('photo', v);
        else if (k !== 'photo') fd.append(k, v);
      });
      if (editing) {
        if (!(form.photo instanceof File)) fd.delete('photo');
        await api.put(`staff/${editing.id}/`, fd);
        toast.success('Staff member updated');
      } else {
        await api.post('staff/', fd);
        toast.success('Staff added');
      }
      setModalOpen(false); setEditing(null); setForm(defaultForm); fetchStaff();
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try { await api.delete(`staff/${deleteConfirm.id}/`); toast.success('Staff deleted'); setDeleteConfirm(null); fetchStaff(); } catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { key: 'photo', label: 'Photo', render: (r) => r.photo ? <img src={r.photo} alt="" className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-brand-pale flex items-center justify-center text-brand-green font-medium text-sm">{r.name?.charAt(0)}</div> },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'position', label: 'Position' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'is_active', label: 'Status', render: (r) => (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.is_active ? 'Active' : 'Inactive'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); setEditing(r); setForm({ name: r.name || '', position: r.position || '', bio: r.bio || '', photo: r.photo || null, email: r.email || '', phone: r.phone || '', sort_order: r.sort_order || 0, is_active: r.is_active ?? true }); setFormErrors({}); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-brand-pale text-brand-gray hover:text-brand-green"><Pencil className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(r); }} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-gray hover:text-brand-hot"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Staff</h1>
        <button onClick={() => { setEditing(null); setForm(defaultForm); setFormErrors({}); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-dark text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <DataTable columns={columns} data={staff} loading={loading} emptyMessage="No staff members" emptyIcon={Users} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Staff' : 'Add Staff'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} error={formErrors.name} required />
            <FormField label="Position" value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} />
            <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
            <FormField label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
            <FormField label="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm({...form, sort_order: parseInt(e.target.value) || 0})} />
          </div>
          <FormField label="Bio" type="textarea" value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} rows={4} />
          <ImageUpload label="Photo" value={form.photo} onChange={(e) => setForm({...form, photo: e.target.files?.[0] || e.target.value})} />
          <FormField label="Active" type="checkbox" value={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brand-gray bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Staff" message={`Delete "${deleteConfirm?.name}"?`} confirmText="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}
