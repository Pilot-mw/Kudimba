import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useToast } from '../contexts/ToastContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import { Plus, Pencil, Shield, User } from 'lucide-react';

const defaultForm = { username: '', email: '', password: '', role: 'editor', phone: '' };

export default function Users() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try { const res = await api.get('auth/users/'); setUsers(res.data.results || res.data || []); } catch { toast.error('Failed to load users'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const validate = () => {
    const errors = {};
    if (!form.username?.trim()) errors.username = 'Username is required';
    if (!form.email?.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email format';
    if (!editing && !form.password?.trim()) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        const data = { email: form.email, role: form.role, phone: form.phone };
        if (form.password?.trim()) data.password = form.password;
        await api.patch(`auth/users/${editing.id}/`, data);
        toast.success('User updated');
      } else {
        await api.post('auth/users/', form);
        toast.success('User created');
      }
      setModalOpen(false); setEditing(null); setForm(defaultForm); fetchUsers();
    } catch { toast.error('Failed to save user'); } finally { setSaving(false); }
  };

  const columns = [
    { key: 'username', label: 'Username', render: (r) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-brand-pale flex items-center justify-center text-brand-green font-medium text-sm">{r.username?.charAt(0).toUpperCase()}</div>
        <span className="font-medium">{r.username}</span>
      </div>
    )},
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (r) => (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${r.role === 'admin' || r.is_superuser ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{r.role || (r.is_superuser ? 'admin' : 'user')}</span>
    )},
    { key: 'phone', label: 'Phone' },
    { key: 'last_login', label: 'Last Login', render: (r) => r.last_login ? new Date(r.last_login).toLocaleDateString() : 'Never' },
    { key: 'date_joined', label: 'Joined', render: (r) => r.date_joined ? new Date(r.date_joined).toLocaleDateString() : '—' },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); setEditing(r); setForm({ username: r.username || '', email: r.email || '', password: '', role: r.role || 'editor', phone: r.phone || '' }); setFormErrors({}); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-brand-pale text-brand-gray hover:text-brand-green"><Pencil className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-ink">Users</h1>
        <button onClick={() => { setEditing(null); setForm(defaultForm); setFormErrors({}); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-dark text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Create User
        </button>
      </div>

      <DataTable columns={columns} data={users} loading={loading} emptyMessage="No users found" emptyIcon={Shield} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit User' : 'Create User'} size="md">
        <div className="space-y-4">
          {editing && (
            <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg">
              Editing <strong>{editing.username}</strong>. Leave password blank to keep current.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Username" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} error={formErrors.username} required={!editing} disabled={!!editing} />
            <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} error={formErrors.email} required />
            <FormField label="Password" type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} error={formErrors.password} required={!editing} helperText={editing ? 'Leave blank to keep current' : ''} />
            <FormField label="Role" type="select" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} options={[{value:'admin',label:'Admin'},{value:'editor',label:'Editor'}]} required />
            <FormField label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brand-gray bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-dark rounded-lg disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
