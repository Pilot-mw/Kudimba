import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Mail, Trash2, MailOpen, Reply, Eye } from 'lucide-react';

export default function Messages() {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [readFilter, setReadFilter] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [viewItem, setViewItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, search, is_read: readFilter || undefined };
      const res = await api.get('messages/', { params });
      setMessages(res.data.results || res.data);
      setTotal(res.data.count || res.data.length || 0);
    } catch { toast.error('Failed to load messages'); } finally { setLoading(false); }
  }, [page, search, readFilter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const markAsRead = async (msg) => {
    if (msg.is_read) return;
    try {
      await api.patch(`messages/${msg.id}/`, { is_read: true });
      toast.success('Marked as read');
      fetchMessages();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try { await api.delete(`messages/${deleteConfirm.id}/`); toast.success('Message deleted'); setDeleteConfirm(null); fetchMessages(); } catch { toast.error('Failed to delete'); }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const columns = [
    { key: 'is_read', label: '', render: (r) => r.is_read ? <MailOpen className="w-4 h-4 text-brand-gray" /> : <Mail className="w-4 h-4 text-brand-green" /> },
    { key: 'name', label: 'Name', sortable: true, render: (r) => <span className={`${!r.is_read ? 'font-semibold' : ''}`}>{r.name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject', render: (r) => <span className={`${!r.is_read ? 'font-semibold' : ''} truncate max-w-[200px] block`}>{r.subject || 'No subject'}</span> },
    { key: 'created_at', label: 'Date', sortable: true, render: (r) => new Date(r.created_at || r.date || r.submitted_at).toLocaleDateString() },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); setViewItem(r); markAsRead(r); }} className="p-1.5 rounded-lg hover:bg-brand-pale text-brand-gray hover:text-brand-green"><Eye className="w-4 h-4" /></button>
        <a href={`mailto:${r.email}?subject=Re: ${r.subject || ''}`} onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg hover:bg-brand-pale text-brand-gray hover:text-blue-500"><Reply className="w-4 h-4" /></a>
        <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(r); }} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-gray hover:text-brand-hot"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Messages</h1>
          {unreadCount > 0 && <p className="text-sm text-brand-gray mt-1">{unreadCount} unread messages</p>}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={messages}
        loading={loading}
        searchable searchValue={search} onSearch={setSearch} searchPlaceholder="Search by name or subject..."
        page={page} onPageChange={setPage} totalItems={total}
        filters={
          <select value={readFilter} onChange={(e) => { setReadFilter(e.target.value); setPage(0); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="">All Messages</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
        }
        onRowClick={(row) => { setViewItem(row); markAsRead(row); }}
      />

      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="Message Details" size="lg">
        {viewItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium text-brand-gray">Name:</span> <span className="text-brand-ink">{viewItem.name}</span></div>
              <div><span className="font-medium text-brand-gray">Email:</span> <a href={`mailto:${viewItem.email}`} className="text-brand-green hover:underline">{viewItem.email}</a></div>
              {viewItem.phone && <div><span className="font-medium text-brand-gray">Phone:</span> <span className="text-brand-ink">{viewItem.phone}</span></div>}
              <div><span className="font-medium text-brand-gray">Date:</span> <span className="text-brand-ink">{new Date(viewItem.created_at || viewItem.date || viewItem.submitted_at).toLocaleString()}</span></div>
              <div className="col-span-2"><span className="font-medium text-brand-gray">Subject:</span> <span className="text-brand-ink font-medium">{viewItem.subject || 'No subject'}</span></div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-brand-ink whitespace-pre-wrap">{viewItem.message || viewItem.content || viewItem.body}</p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <a href={`mailto:${viewItem.email}?subject=Re: ${viewItem.subject || ''}`} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg transition-colors"><Reply className="w-4 h-4" /> Reply via Email</a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Message" message={`Delete message from "${deleteConfirm?.name}"?`} confirmText="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}
