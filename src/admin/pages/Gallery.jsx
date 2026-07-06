import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUpload from '../components/ImageUpload';
import FormField from '../components/FormField';
import { Plus, Trash2, X, Eye, GripVertical, Image as ImageIcon } from 'lucide-react';

export default function Gallery() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ image: null, caption: '', alt_text: '', category: '', sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = { category };
      const res = await api.get('gallery/', { params });
      setItems(res.data.results || res.data);
    } catch {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

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
        await api.put(`gallery/${editing.id}/`, fd);
        toast.success('Gallery item updated');
      } else {
        await api.post('gallery/', fd);
        toast.success('Gallery item added');
      }
      setModalOpen(false);
      setEditing(null);
      setForm({ image: null, caption: '', alt_text: '', category: '', sort_order: 0 });
      fetchItems();
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.image?.[0] || err.response?.data?.non_field_errors?.[0] || err.message || 'Failed to save gallery item';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`gallery/${deleteConfirm.id}/`);
      toast.success('Gallery item deleted');
      setDeleteConfirm(null);
      fetchItems();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const allCategories = [...new Set(items.map(i => i.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Gallery</h1>
        <button
          onClick={() => { setEditing(null); setForm({ image: null, caption: '', alt_text: '', category: '', sort_order: 0 }); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-dark text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Images
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setCategory('')} className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${!category ? 'bg-brand-green text-white' : 'bg-gray-100 text-brand-gray hover:bg-gray-200'}`}>All</button>
        {allCategories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${category === cat ? 'bg-brand-green text-white' : 'bg-gray-100 text-brand-gray hover:bg-gray-200'}`}>{cat}</button>
        ))}
      </div>

      <ImageUpload
        label="Upload Images"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) {
            setForm({ ...form, image: files[0] });
            if (!modalOpen) {
              setForm({ image: files[0], caption: '', alt_text: '', category: '', sort_order: 0 });
              setEditing(null);
              setModalOpen(true);
            }
          }
        }}
        multiple
      />

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-brand-gray">
          <ImageIcon className="w-16 h-16 text-gray-300 mb-3" />
          <p className="text-sm font-medium">No images in gallery</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.alt_text || item.caption || ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => setPreviewItem(item)}
                />
              </div>
              <div className="p-2">
                <p className="text-xs text-brand-ink truncate">{item.caption || 'No caption'}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setPreviewItem(item)} className="p-1.5 bg-white/90 rounded-lg shadow hover:bg-white"><Eye className="w-3.5 h-3.5 text-brand-gray" /></button>
                <button onClick={() => { setEditing(item); setForm({ image: item.image, caption: item.caption || '', alt_text: item.alt_text || '', category: item.category || '', sort_order: item.sort_order || 0 }); setModalOpen(true); }} className="p-1.5 bg-white/90 rounded-lg shadow hover:bg-white"><Eye className="w-3.5 h-3.5 text-brand-green" /></button>
                <button onClick={() => setDeleteConfirm(item)} className="p-1.5 bg-white/90 rounded-lg shadow hover:bg-white"><Trash2 className="w-3.5 h-3.5 text-brand-hot" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Image' : 'Add Image'} size="md">
        <div className="space-y-4">
          <ImageUpload label="Image" value={form.image} onChange={(e) => setForm({...form, image: e.target.files?.[0] || e.target.value})} />
          <FormField label="Caption" value={form.caption} onChange={(e) => setForm({...form, caption: e.target.value})} />
          <FormField label="Alt Text" value={form.alt_text} onChange={(e) => setForm({...form, alt_text: e.target.value})} />
          <FormField label="Category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
          <FormField label="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm({...form, sort_order: parseInt(e.target.value) || 0})} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brand-gray bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Add'}</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!previewItem} onClose={() => setPreviewItem(null)} title="Image Preview" size="lg">
        {previewItem && (
          <div className="flex flex-col items-center">
            <img src={previewItem.image} alt={previewItem.alt_text || ''} className="max-w-full max-h-[70vh] rounded-lg object-contain" />
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-brand-ink">{previewItem.caption || 'No caption'}</p>
              {previewItem.alt_text && <p className="text-xs text-brand-gray mt-1">{previewItem.alt_text}</p>}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Image" message="Are you sure? This cannot be undone." confirmText="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}
