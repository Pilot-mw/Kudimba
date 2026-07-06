import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField from '../components/FormField';
import ImageUpload from '../components/ImageUpload';
import RichTextEditor from '../components/RichTextEditor';
import { Plus, Pencil, Trash2, Volume2 } from 'lucide-react';

const defaultForm = { title: '', content: '', background_image: null, link: '', start_date: '', expiry_date: '', is_active: true };

export default function Announcements() {
  const toast = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('announcements/');
      setAnnouncements(res.data.results || res.data || []);
    } catch {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'background_image' && v instanceof File) fd.append('background_image', v);
        else if (k !== 'background_image') fd.append(k, v);
      });
      if (editing) {
        if (!(form.background_image instanceof File)) fd.delete('background_image');
        await api.put(`announcements/${editing.id}/`, fd);
        toast.success('Announcement updated');
      } else {
        await api.post('announcements/', fd);
        toast.success('Announcement created');
      }
      setModalOpen(false);
      setEditing(null);
      setForm(defaultForm);
      fetchAnnouncements();
    } catch {
      toast.error('Failed to save announcement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`announcements/${deleteConfirm.id}/`);
      toast.success('Announcement deleted');
      setDeleteConfirm(null);
      fetchAnnouncements();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const toggleActive = async (item) => {
    try {
      await api.patch(`announcements/${item.id}/`, { is_active: !item.is_active });
      toast.success(`Announcement ${item.is_active ? 'deactivated' : 'activated'}`);
      fetchAnnouncements();
    } catch {
      toast.error('Failed to toggle');
    }
  };

  if (loading) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Announcements</h1>
        <button onClick={() => { setEditing(null); setForm(defaultForm); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-dark text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Announcement
        </button>
      </div>

      {announcements.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-brand-gray bg-white rounded-xl border border-gray-200">
          <Volume2 className="w-16 h-16 text-gray-300 mb-3" />
          <p className="text-sm font-medium">No announcements</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-brand-ink">{item.title}</p>
                  <button onClick={() => toggleActive(item)} className={`px-2 py-0.5 text-xs font-medium rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.is_active ? 'Active' : 'Inactive'}</button>
                </div>
                <div className="flex gap-3 mt-1 text-xs text-brand-gray">
                  {item.start_date && <span>Start: {new Date(item.start_date).toLocaleDateString()}</span>}
                  {item.expiry_date && <span>Expiry: {new Date(item.expiry_date).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditing(item); setForm({ title: item.title || '', content: item.content || '', background_image: item.background_image || null, link: item.link || '', start_date: item.start_date ? item.start_date.slice(0,10) : '', expiry_date: item.expiry_date ? item.expiry_date.slice(0,10) : '', is_active: item.is_active ?? true }); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-brand-pale text-brand-gray hover:text-brand-green"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteConfirm(item)} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-gray hover:text-brand-hot"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Announcement' : 'Add Announcement'} size="lg">
        <div className="space-y-4">
          <FormField label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
          <RichTextEditor label="Content" value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} height={200} />
          <ImageUpload label="Background Image" value={form.background_image} onChange={(e) => setForm({...form, background_image: e.target.files?.[0] || e.target.value})} />
          <FormField label="Link URL" value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} placeholder="https://..." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Start Date" type="date" value={form.start_date} onChange={(e) => setForm({...form, start_date: e.target.value})} />
            <FormField label="Expiry Date" type="date" value={form.expiry_date} onChange={(e) => setForm({...form, expiry_date: e.target.value})} />
          </div>
          <FormField label="Active" type="checkbox" value={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brand-gray bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Announcement" message={`Delete "${deleteConfirm?.title}"?`} confirmText="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}
