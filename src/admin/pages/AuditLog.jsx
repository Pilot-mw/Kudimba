import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Eye, History, User, PlusCircle, Edit, Trash2 } from 'lucide-react';

export default function AuditLog() {
  const toast = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [detailItem, setDetailItem] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, action: actionFilter || undefined, content_type: typeFilter || undefined, user: userFilter || undefined };
      const res = await api.get('audit-log/', { params });
      setLogs(res.data.results || res.data);
      setTotal(res.data.count || res.data.length || 0);
    } catch { toast.error('Failed to load audit log'); } finally { setLoading(false); }
  }, [page, actionFilter, typeFilter, userFilter]);

  const fetchUsers = async () => {
    try { const res = await api.get('auth/users/'); setUsers(res.data.results || res.data || []); } catch {}
  };

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  useEffect(() => { fetchUsers(); }, []);

  const actionIcon = (action) => {
    switch (action) {
      case 'create': return <PlusCircle className="w-4 h-4 text-brand-green" />;
      case 'update': return <Edit className="w-4 h-4 text-brand-orange" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-brand-hot" />;
      default: return <History className="w-4 h-4 text-brand-gray" />;
    }
  };

  const columns = [
    { key: 'action', label: '', render: (r) => actionIcon(r.action) },
    { key: 'user', label: 'User', render: (r) => r.user || r.user__username || 'System' },
    { key: 'action', label: 'Action', render: (r) => <span className="capitalize">{r.action}</span> },
    { key: 'content_type', label: 'Content Type', render: (r) => r.content_type || r.model || '—' },
    { key: 'object', label: 'Object', render: (r) => r.object_repr || r.object || String(r.object_id || '') },
    { key: 'timestamp', label: 'Date', sortable: true, render: (r) => r.timestamp ? new Date(r.timestamp).toLocaleString() : '—' },
    { key: 'actions', label: '', render: (r) => (
      <button onClick={(e) => { e.stopPropagation(); setDetailItem(r); }} className="p-1.5 rounded-lg hover:bg-brand-pale text-brand-gray hover:text-brand-green"><Eye className="w-4 h-4" /></button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Audit Log</h1>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        loading={loading}
        page={page}
        onPageChange={setPage}
        totalItems={total}
        filters={
          <div className="flex gap-2 flex-wrap">
            <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(0); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
            </select>
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="">All Types</option>
              <option value="product">Product</option>
              <option value="gallery">Gallery</option>
              <option value="news">News</option>
              <option value="page">Page</option>
              <option value="user">User</option>
            </select>
            <select value={userFilter} onChange={(e) => { setUserFilter(e.target.value); setPage(0); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="">All Users</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>
          </div>
        }
      />

      <Modal isOpen={!!detailItem} onClose={() => setDetailItem(null)} title="Audit Log Details" size="lg">
        {detailItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium text-brand-gray">User:</span> <span className="text-brand-ink">{detailItem.user || detailItem.user__username || 'System'}</span></div>
              <div><span className="font-medium text-brand-gray">Action:</span> <span className="capitalize text-brand-ink">{detailItem.action}</span></div>
              <div><span className="font-medium text-brand-gray">Content Type:</span> <span className="text-brand-ink">{detailItem.content_type || detailItem.model || '—'}</span></div>
              <div><span className="font-medium text-brand-gray">Object ID:</span> <span className="text-brand-ink">{detailItem.object_id || '—'}</span></div>
              <div className="col-span-2"><span className="font-medium text-brand-gray">Object:</span> <span className="text-brand-ink">{detailItem.object_repr || detailItem.object || '—'}</span></div>
              <div className="col-span-2"><span className="font-medium text-brand-gray">Timestamp:</span> <span className="text-brand-ink">{detailItem.timestamp ? new Date(detailItem.timestamp).toLocaleString() : '—'}</span></div>
            </div>
            {detailItem.changes && (
              <div>
                <p className="text-sm font-medium text-brand-gray mb-2">Changes:</p>
                <pre className="p-4 bg-gray-50 rounded-lg text-xs text-brand-ink overflow-x-auto max-h-64">
                  {typeof detailItem.changes === 'string' ? detailItem.changes : JSON.stringify(detailItem.changes, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
