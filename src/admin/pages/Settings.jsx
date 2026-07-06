import { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import FormField from '../components/FormField';
import ImageUpload from '../components/ImageUpload';
import { Loader2, Settings as SettingsIcon } from 'lucide-react';

const defaultForm = {
  site_name: '', logo: null, favicon: null,
  primary_color: '#4C7A3D', secondary_color: '#1B4332',
  seo_title: '', seo_description: '', seo_keywords: '',
  footer_content: '', footer_email: '', footer_phone: '', footer_address: '',
  google_analytics_id: '', custom_css: '', custom_js: '',
};

export default function Settings() {
  const toast = useToast();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState(null);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('settings/');
      const data = res.data?.results?.[0] || res.data?.[0] || res.data;
      if (data) {
        setSettingsId(data.id);
        setForm({
          site_name: data.site_name || '',
          logo: data.logo || null,
          favicon: data.favicon || null,
          primary_color: data.primary_color || '#4C7A3D',
          secondary_color: data.secondary_color || '#1B4332',
          seo_title: data.seo_title || '',
          seo_description: data.seo_description || '',
          seo_keywords: data.seo_keywords || '',
          footer_content: data.footer_content || '',
          footer_email: data.footer_email || '',
          footer_phone: data.footer_phone || '',
          footer_address: data.footer_address || '',
          google_analytics_id: data.google_analytics_id || '',
          custom_css: data.custom_css || '',
          custom_js: data.custom_js || '',
        });
      }
    } catch {} finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if ((k === 'logo' || k === 'favicon') && v instanceof File) fd.append(k, v);
        else if (k !== 'logo' && k !== 'favicon') fd.append(k, v);
      });
      if (settingsId) {
        if (!(form.logo instanceof File)) fd.delete('logo');
        if (!(form.favicon instanceof File)) fd.delete('favicon');
        await api.put(`settings/${settingsId}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        const res = await api.post('settings/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setSettingsId(res.data.id);
      }
      toast.success('Settings updated');
    } catch { toast.error('Failed to save settings'); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-green animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-brand-ink">Website Settings</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-brand-ink">Branding</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Site Name" value={form.site_name} onChange={(e) => setForm({...form, site_name: e.target.value})} />
          <div></div>
        </div>
        <ImageUpload label="Site Logo" value={form.logo} onChange={(e) => setForm({...form, logo: e.target.files?.[0] || e.target.value})} />
        <ImageUpload label="Favicon" value={form.favicon} onChange={(e) => setForm({...form, favicon: e.target.files?.[0] || e.target.value})} accept="image/*" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Primary Color" value={form.primary_color} onChange={(e) => setForm({...form, primary_color: e.target.value})} placeholder="#4C7A3D" helperText="Brand green default" />
          <FormField label="Secondary Color" value={form.secondary_color} onChange={(e) => setForm({...form, secondary_color: e.target.value})} placeholder="#1B4332" helperText="Brand dark default" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-brand-ink">SEO</h3>
        <FormField label="SEO Title" value={form.seo_title} onChange={(e) => setForm({...form, seo_title: e.target.value})} />
        <FormField label="SEO Description" type="textarea" value={form.seo_description} onChange={(e) => setForm({...form, seo_description: e.target.value})} rows={3} />
        <FormField label="SEO Keywords" type="textarea" value={form.seo_keywords} onChange={(e) => setForm({...form, seo_keywords: e.target.value})} rows={2} helperText="Comma-separated" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-brand-ink">Footer</h3>
        <FormField label="Footer Content" type="textarea" value={form.footer_content} onChange={(e) => setForm({...form, footer_content: e.target.value})} rows={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Footer Email" type="email" value={form.footer_email} onChange={(e) => setForm({...form, footer_email: e.target.value})} />
          <FormField label="Footer Phone" type="tel" value={form.footer_phone} onChange={(e) => setForm({...form, footer_phone: e.target.value})} />
        </div>
        <FormField label="Footer Address" value={form.footer_address} onChange={(e) => setForm({...form, footer_address: e.target.value})} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-brand-ink">Advanced</h3>
        <FormField label="Google Analytics ID" value={form.google_analytics_id} onChange={(e) => setForm({...form, google_analytics_id: e.target.value})} placeholder="G-XXXXXXXXXX" />
        <FormField label="Custom CSS" type="textarea" value={form.custom_css} onChange={(e) => setForm({...form, custom_css: e.target.value})} rows={6} helperText="Will be injected in &lt;style&gt; tags" />
        <FormField label="Custom JS" type="textarea" value={form.custom_js} onChange={(e) => setForm({...form, custom_js: e.target.value})} rows={6} helperText="Will be injected in &lt;script&gt; tags" />
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg disabled:opacity-60 flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}{saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}
