import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField from '../components/FormField';
import { Upload, Trash2, Copy, Check, File, Image, FileText, FolderOpen, Search } from 'lucide-react';

export default function MediaLibrary() {
  const toast = useToast();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(0);
  const [copied, setCopied] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, search, type: typeFilter };
      const res = await api.get('media/', { params });
      setMedia(res.data.results || res.data || []);
    } catch { toast.error('Failed to load media'); } finally { setLoading(false); }
  }, [page, search, typeFilter]);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    let success = 0;
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', file.name);
      try {
        await api.post('media/', fd);
        success++;
      } catch { /* individual file may fail */ }
    }
    if (success) toast.success(`${success} file(s) uploaded`);
    fetchMedia();
    e.target.value = '';
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try { await api.delete(`media/${deleteConfirm.id}/`); toast.success('Media deleted'); setDeleteConfirm(null); fetchMedia(); } catch { toast.error('Failed to delete'); }
  };

  const copyUrl = (url) => {
    navigator.clipboard?.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
    toast.success('URL copied');
  };

  const getFileIcon = (item) => {
    const ft = (item.file_type || '').toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ft)) return Image;
    if (ft === 'pdf') return FileText;
    return File;
  };

  const isImage = (item) => {
    const ft = (item.file_type || '').toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ft) || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.file || '');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Media Library</h1>
        <label className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-dark text-white text-sm font-medium rounded-lg cursor-pointer transition-colors">
          <Upload className="w-4 h-4" /> Upload
          <input type="file" multiple onChange={handleUpload} className="hidden" accept="image/*,.pdf,.doc,.docx" />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
          <input type="text" placeholder="Search files..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green" />
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20">
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
          <option value="other">Other</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : media.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-brand-gray bg-white rounded-xl border border-gray-200">
          <FolderOpen className="w-16 h-16 text-gray-300 mb-3" />
          <p className="text-sm font-medium">No media files</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-square overflow-hidden bg-gray-50">
                {isImage(item) ? (
                  <img src={item.file} alt={item.title || ''} className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform" onClick={() => setPreviewItem(item)} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <File className="w-12 h-12 text-brand-gray" />
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs text-brand-ink truncate">{item.title || item.file?.split('/').pop() || 'file'}</p>
                <p className="text-[10px] text-brand-gray">{(item.size ? (item.size / 1024).toFixed(0) : '?')} KB</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => copyUrl(item.file)} className="p-1.5 bg-white/90 rounded-lg shadow hover:bg-white">
                  {copied === item.file ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <Copy className="w-3.5 h-3.5 text-brand-gray" />}
                </button>
                <button onClick={() => setDeleteConfirm(item)} className="p-1.5 bg-white/90 rounded-lg shadow hover:bg-white"><Trash2 className="w-3.5 h-3.5 text-brand-hot" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {media.length > 0 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-40">Previous</button>
          <span className="px-3 py-1.5 text-sm text-brand-gray">Page {page + 1}</span>
          <button onClick={() => setPage(page + 1)} disabled={media.length < 20} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-40">Next</button>
        </div>
      )}

      <Modal isOpen={!!previewItem} onClose={() => setPreviewItem(null)} title="Media Details" size="md">
        {previewItem && (
          <div className="space-y-4">
            {isImage(previewItem) && <img src={previewItem.file} alt="" className="max-w-full max-h-64 rounded-lg object-contain mx-auto" />}
            <div className="text-sm space-y-1">
              <p><span className="font-medium text-brand-gray">Name:</span> {previewItem.title || previewItem.file?.split('/').pop()}</p>
              <p><span className="font-medium text-brand-gray">Type:</span> {previewItem.file_type || 'Unknown'}</p>
              <p><span className="font-medium text-brand-gray">Size:</span> {previewItem.file_size || 'Unknown'}</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="text" readOnly value={previewItem.file || ''} className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50" />
              <button onClick={() => copyUrl(previewItem.file)} className="px-3 py-2 text-sm bg-brand-green text-white rounded-lg hover:bg-brand-dark">
                {copied === previewItem.file ? 'Copied' : 'Copy URL'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Media" message={`Delete "${deleteConfirm?.title || 'this file'}"?`} confirmText="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}
