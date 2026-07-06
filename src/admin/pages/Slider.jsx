import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField from '../components/FormField';
import ImageUpload from '../components/ImageUpload';
import { Plus, Pencil, Trash2, GripVertical, Images, Eye } from 'lucide-react';

const defaultForm = { title: '', subtitle: '', cta_text: '', cta_link: '', image: null, sort_order: 0, is_active: true };

export default function Slider() {
  const toast = useToast();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('slider/');
      const items = res.data.results || res.data || [];
      setSlides(items.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
    } catch {
      toast.error('Failed to load slides');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSlides(); }, [fetchSlides]);

  const handleSave = async () => {
    if (!form.image && !editing) { toast.error('Please select an image'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'image' && v instanceof File) fd.append('image', v);
        else if (k !== 'image') fd.append(k, v);
      });
      if (editing) {
        if (!(form.image instanceof File)) fd.delete('image');
        await api.put(`slider/${editing.id}/`, fd);
        toast.success('Slider item updated');
      } else {
        await api.post('slider/', fd);
        toast.success('Slide added');
      }
      setModalOpen(false);
      setEditing(null);
      setForm(defaultForm);
      fetchSlides();
    } catch {
      toast.error('Failed to save slide');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`slider/${deleteConfirm.id}/`);
      toast.success('Slide deleted');
      setDeleteConfirm(null);
      fetchSlides();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const toggleActive = async (slide) => {
    try {
      await api.patch(`slider/${slide.id}/`, { is_active: !slide.is_active });
      toast.success(`Slide ${slide.is_active ? 'deactivated' : 'activated'}`);
      fetchSlides();
    } catch {
      toast.error('Failed to toggle');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Slider</h1>
        <button onClick={() => { setEditing(null); setForm(defaultForm); setFormErrors({}); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-dark text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      {slides.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-brand-gray bg-white rounded-xl border border-gray-200">
          <Images className="w-16 h-16 text-gray-300 mb-3" />
          <p className="text-sm font-medium">No slides yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-brand-gray cursor-move"><GripVertical className="w-5 h-5" /></div>
              <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                {slide.image ? <img src={slide.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Images className="w-6 h-6 text-gray-300" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-ink truncate">{slide.title || `Slide ${idx + 1}`}</p>
                <p className="text-xs text-brand-gray truncate">{slide.subtitle || 'No subtitle'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(slide)} className={`px-2 py-0.5 text-xs font-medium rounded-full ${slide.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{slide.is_active ? 'Active' : 'Inactive'}</button>
                <button onClick={() => { setEditing(slide); setForm({ title: slide.title || '', subtitle: slide.subtitle || '', cta_text: slide.cta_text || '', cta_link: slide.cta_link || '', image: slide.image || null, sort_order: slide.sort_order || 0, is_active: slide.is_active ?? true }); setFormErrors({}); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-brand-pale text-brand-gray hover:text-brand-green"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteConfirm(slide)} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-gray hover:text-brand-hot"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Slide' : 'Add Slide'} size="lg">
        <div className="space-y-4">
          <ImageUpload label="Slide Image" value={form.image} onChange={(e) => setForm({...form, image: e.target.files?.[0] || e.target.value})} helperText="Recommended: 1920x600px" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
            <FormField label="Subtitle" value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value})} />
            <FormField label="CTA Text" value={form.cta_text} onChange={(e) => setForm({...form, cta_text: e.target.value})} />
            <FormField label="CTA Link" value={form.cta_link} onChange={(e) => setForm({...form, cta_link: e.target.value})} />
            <FormField label="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm({...form, sort_order: parseInt(e.target.value) || 0})} />
          </div>
          <FormField label="Active" type="checkbox" value={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brand-gray bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Add'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Slide" message="Are you sure?" confirmText="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}
