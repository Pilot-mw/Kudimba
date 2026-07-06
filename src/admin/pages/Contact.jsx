import { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import FormField from '../components/FormField';
import { Loader2 } from 'lucide-react';

const defaultForm = {
  phone: '', whatsapp: '', email: '', address: '', map_embed_url: '',
  facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '',
};

export default function Contact() {
  const toast = useToast();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactId, setContactId] = useState(null);

  useEffect(() => { fetchContact(); }, []);

  const fetchContact = async () => {
    try {
      const res = await api.get('contact/');
      const data = res.data?.results?.[0] || res.data?.[0] || res.data;
      if (data) {
        setContactId(data.id);
        setForm({
          phone: data.phone || '', whatsapp: data.whatsapp || '', email: data.email || '',
          address: data.address || '', map_embed_url: data.map_embed_url || '',
          facebook: data.facebook || '', twitter: data.twitter || '', instagram: data.instagram || '',
          linkedin: data.linkedin || '', youtube: data.youtube || '',
        });
      }
    } catch {} finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (contactId) {
        await api.put(`contact/${contactId}/`, form);
      } else {
        const res = await api.post('contact/', form);
        setContactId(res.data.id);
      }
      toast.success('Contact details updated');
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-green animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-brand-ink">Contact Details</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-brand-ink">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="+265 123 456 789" />
          <FormField label="WhatsApp" type="tel" value={form.whatsapp} onChange={(e) => setForm({...form, whatsapp: e.target.value})} placeholder="+265 123 456 789" />
          <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          <FormField label="Address" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} />
        </div>
        <FormField label="Map Embed URL" value={form.map_embed_url} onChange={(e) => setForm({...form, map_embed_url: e.target.value})} helperText="Google Maps embed URL" />

        <hr className="border-gray-200" />
        <h3 className="text-lg font-semibold text-brand-ink">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Facebook" value={form.facebook} onChange={(e) => setForm({...form, facebook: e.target.value})} placeholder="https://facebook.com/..." />
          <FormField label="Twitter / X" value={form.twitter} onChange={(e) => setForm({...form, twitter: e.target.value})} placeholder="https://twitter.com/..." />
          <FormField label="Instagram" value={form.instagram} onChange={(e) => setForm({...form, instagram: e.target.value})} placeholder="https://instagram.com/..." />
          <FormField label="LinkedIn" value={form.linkedin} onChange={(e) => setForm({...form, linkedin: e.target.value})} placeholder="https://linkedin.com/..." />
          <FormField label="YouTube" value={form.youtube} onChange={(e) => setForm({...form, youtube: e.target.value})} placeholder="https://youtube.com/..." />
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg disabled:opacity-60 flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}{saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
