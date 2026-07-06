import { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import FormField from '../components/FormField';
import ImageUpload from '../components/ImageUpload';
import { Loader2 } from 'lucide-react';

export default function About() {
  const toast = useToast();
  const [form, setForm] = useState({
    mission: '', vision: '', story: '', ceo_message: '', ceo_name: '',
    ceo_title: '', ceo_image: null, is_published: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutId, setAboutId] = useState(null);

  useEffect(() => { fetchAbout(); }, []);

  const fetchAbout = async () => {
    try {
      const res = await api.get('about/');
      const data = res.data?.results?.[0] || res.data?.[0] || res.data;
      if (data) {
        setAboutId(data.id);
        setForm({
          mission: data.mission || '',
          vision: data.vision || '',
          story: data.story || '',
          ceo_message: data.ceo_message || '',
          ceo_name: data.ceo_name || '',
          ceo_title: data.ceo_title || '',
          ceo_image: data.ceo_image || null,
          is_published: data.is_published ?? true,
        });
      }
    } catch {} finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'ceo_image' && v instanceof File) fd.append('ceo_image', v);
        else if (k !== 'ceo_image') fd.append(k, v);
      });
      if (aboutId) {
        if (!(form.ceo_image instanceof File)) fd.delete('ceo_image');
        await api.put(`about/${aboutId}/`, fd);
      } else {
        const res = await api.post('about/', fd);
        setAboutId(res.data.id);
      }
      toast.success('About page updated');
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-green animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-brand-ink">About Us</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <FormField label="Mission" type="textarea" value={form.mission} onChange={(e) => setForm({...form, mission: e.target.value})} rows={4} />
        <FormField label="Vision" type="textarea" value={form.vision} onChange={(e) => setForm({...form, vision: e.target.value})} rows={4} />
        <FormField label="Our Story" type="textarea" value={form.story} onChange={(e) => setForm({...form, story: e.target.value})} rows={6} />
        <hr className="border-gray-200" />
        <h3 className="text-lg font-semibold text-brand-ink">CEO Message</h3>
        <FormField label="CEO Name" value={form.ceo_name} onChange={(e) => setForm({...form, ceo_name: e.target.value})} />
        <FormField label="CEO Title" value={form.ceo_title} onChange={(e) => setForm({...form, ceo_title: e.target.value})} />
        <FormField label="CEO Message" type="textarea" value={form.ceo_message} onChange={(e) => setForm({...form, ceo_message: e.target.value})} rows={6} />
        <ImageUpload label="CEO Photo" value={form.ceo_image} onChange={(e) => setForm({...form, ceo_image: e.target.files?.[0] || e.target.value})} />
        <FormField label="Published" type="checkbox" value={form.is_published} onChange={(e) => setForm({...form, is_published: e.target.checked})} />
      </div>
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg disabled:opacity-60 flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}{saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
