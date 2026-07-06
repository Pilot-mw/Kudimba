import { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import FormField from '../components/FormField';
import ImageUpload from '../components/ImageUpload';
import { Loader2 } from 'lucide-react';

export default function Hero() {
  const toast = useToast();
  const [form, setForm] = useState({
    title: '', subtitle: '', cta_text: '', cta_link: '', background_image: null,
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroId, setHeroId] = useState(null);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await api.get('hero/');
      const data = res.data?.results?.[0] || res.data?.[0] || res.data;
      if (data) {
        setHeroId(data.id);
        setForm({
          title: data.title || '',
          subtitle: data.subtitle || '',
          cta_text: data.cta_text || '',
          cta_link: data.cta_link || '',
          background_image: data.background_image || data.image || null,
          is_active: data.is_active ?? true,
        });
      }
    } catch {
      // No hero exists yet, that's fine
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'background_image' && v instanceof File) fd.append('background_image', v);
        else if (k !== 'background_image') fd.append(k, v);
      });
      if (heroId) {
        if (!(form.background_image instanceof File)) fd.delete('background_image');
        await api.put(`hero/${heroId}/`, fd);
        toast.success('Hero section updated');
      } else {
        const res = await api.post('hero/', fd);
        setHeroId(res.data.id);
        toast.success('Hero section created');
      }
    } catch {
      toast.error('Failed to save hero section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-brand-ink">Hero Section</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <FormField label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
        <FormField label="Subtitle" type="textarea" value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value})} rows={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="CTA Button Text" value={form.cta_text} onChange={(e) => setForm({...form, cta_text: e.target.value})} placeholder="e.g. Shop Now" />
          <FormField label="CTA Button Link" value={form.cta_link} onChange={(e) => setForm({...form, cta_link: e.target.value})} placeholder="e.g. /products" />
        </div>
        <ImageUpload label="Background Image" value={form.background_image} onChange={(e) => setForm({...form, background_image: e.target.files?.[0] || e.target.value})} helperText="Recommended: 1920x1080px" />
        <FormField label="Active" type="checkbox" value={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} />
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
