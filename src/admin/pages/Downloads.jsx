import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField from '../components/FormField';
import { Plus, Pencil, Trash2, Download, FileText, File as FileIcon } from 'lucide-react';

const defaultForm = { title: '', description: '', file: null, category: '', is_active: true };

export default function Downloads() {
  const toast = useToast();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchDownloads = useCallback(async () => {
    setLoading(true);
    try { const res = await api.get('downloads/'); setDownloads(res.data.results || res.data || []); } catch { toast.error('Failed to load downloads'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDownloads(); }, [fetchDownloads]);

  const validate = () => {
    const errors = {};
    if (!form.title?.trim()) errors.title = 'Title is required';
    if (!form.file && !editing) errors.file = 'File is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'file' && v instanceof File) fd.append('file', v);
        else if (k !== 'file') fd.append(k, v);
      });
      if (editing) {
        if (!(form.file instanceof File)) fd.delete('file');
        await api.put(`downloads/${editing.id}/`, fd);
        toast.success('Download updated');
      } else {
        await api.post('downloads/', fd);
        toast.success('Download added');
      }
      setModalOpen(false); setEditing(null); setForm(defaultForm); fetchDownloads();
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try { await api.delete(`downloads/${deleteConfirm.id}/`); toast.success('Download deleted'); setDeleteConfirm(null); fetchDownloads(); } catch { toast.error('Failed to delete'); }
  };

  const getFileIcon = (url) => {
    if (!url) return FileIcon;
    const ext = url.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext)) return FileText;
    if (['doc','docx'].includes(ext)) return FileText;
    return FileIcon;
  };

  const columns = [
    { key: 'file', label: 'Type', render: (r) => {
      const Icon = getFileIcon(r.file);
      return <Icon className="w-8 h-8 text-brand-gray" />;
    }},
    { key: 'title', label: 'Title', sortable: true },
    { key: 'category', label: 'Category' },
    { key: 'download_count', label: 'Downloads', sortable: true, render: (r) => r.download_count ?? 0 },
    { key: 'is_active', label: 'Status', render: (r) => (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.is_active ? 'Active' : 'Inactive'}</span>
    )},
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); setEditing(r); setForm({ title: r.title || '', description: r.description || '', file: r.file || null, category: r.category || '', is_active: r.is_active ?? true }); setFormErrors({}); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-brand-pale text-brand-gray hover:text-brand-green"><Pencil className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(r); }} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-gray hover:text-brand-hot"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Downloads</h1>
        <button onClick={() => { setEditing(null); setForm(defaultForm); setFormErrors({}); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-dark text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Download
        </button>
      </div>

      <DataTable columns={columns} data={downloads} loading={loading} emptyMessage="No downloads yet" emptyIcon={Download} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Download' : 'Add Download'} size="md">
        <div className="space-y-4">
          <FormField label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} error={formErrors.title} required />
          <FormField label="Description" type="textarea" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
            <FormField label="Active" type="checkbox" value={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} />
          </div>
          <FormField label="File" type="file" value={undefined} onChange={(e) => setForm({...form, file: e.target.files?.[0]})} accept=".pdf,.doc,.docx" error={formErrors.file} helperText={editing?.file ? 'Current file will be kept if not replaced' : ''} />
          {editing?.file && <p className="text-xs text-brand-gray">Current file: {editing.file.split('/').pop()}</p>}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brand-gray bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Download" message={`Delete "${deleteConfirm?.title}"?`} confirmText="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}
