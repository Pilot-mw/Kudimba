import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import api from '../api';
import StatsCard from '../components/StatsCard';
import {
  Package, Image, Newspaper, MessageSquare, Loader2,
  PlusCircle, ArrowRight, Clock, User
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [prodRes, galRes, newsRes, msgRes, activityRes] = await Promise.all([
        api.get('products/', { params: { page_size: 1 } }).catch(() => ({ data: { count: 0 } })),
        api.get('gallery/', { params: { page_size: 1 } }).catch(() => ({ data: { count: 0 } })),
        api.get('news/', { params: { page_size: 1 } }).catch(() => ({ data: { count: 0 } })),
        api.get('messages/', { params: { page_size: 1 } }).catch(() => ({ data: { count: 0 } })),
        api.get('audit-log/', { params: { page_size: 10 } }).catch(() => ({ data: { results: [] } })),
      ]);
      setStats({
        products_count: prodRes.data.count || 0,
        gallery_count: galRes.data.count || 0,
        news_count: newsRes.data.count || 0,
        messages_count: msgRes.data.count || 0,
      });
      setRecentActivity(activityRes.data?.results || activityRes.data || []);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Add Product', icon: Package, path: '/admin/products', color: 'bg-brand-green' },
    { label: 'Add Gallery Image', icon: Image, path: '/admin/gallery', color: 'bg-blue-500' },
    { label: 'Create News', icon: Newspaper, path: '/admin/news', color: 'bg-brand-orange' },
    { label: 'View Messages', icon: MessageSquare, path: '/admin/messages', color: 'bg-brand-hot' },
  ];

  const statCards = [
    { title: 'Total Products', key: 'products_count', icon: Package, color: 'brand-green' },
    { title: 'Gallery Items', key: 'gallery_count', icon: Image, color: 'blue' },
    { title: 'Articles', key: 'news_count', icon: Newspaper, color: 'brand-orange' },
    { title: 'Messages', key: 'messages_count', icon: MessageSquare, color: 'brand-hot' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-ink">
          Welcome back, {user?.username || 'Admin'}
        </h1>
        <p className="text-brand-gray text-sm mt-1">Here's what's happening at Kudimba Farms.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatsCard
            key={card.key}
            title={card.title}
            value={stats?.[card.key]}
            icon={card.icon}
            color={card.color}
            loading={loading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-ink">Recent Activity</h2>
            <button
              onClick={() => navigate('/admin/audit-log')}
              className="text-sm text-brand-green hover:text-brand-dark font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
                    <div className="h-2.5 w-1/2 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <p className="text-sm text-brand-gray py-8 text-center">No recent activity</p>
          ) : (
            <div className="space-y-1">
              {recentActivity.map((act, i) => (
                <div key={act.id || i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-1.5 rounded-full bg-brand-pale">
                    <User className="w-4 h-4 text-brand-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brand-ink">
                      <span className="font-medium">{act.user || act.user__username || 'System'}</span>
                      {' '}{act.action || 'performed'}{' '}
                      <span className="text-brand-gray">{act.content_type || 'action'}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-brand-gray" />
                      <span className="text-xs text-brand-gray">
                        {act.timestamp ? new Date(act.timestamp).toLocaleString() : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-brand-ink mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-gray-200 hover:border-brand-green hover:bg-brand-pale/30 transition-all group"
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-brand-ink group-hover:text-brand-green transition-colors">
                  {action.label}
                </span>
                <ArrowRight className="w-4 h-4 text-brand-gray ml-auto group-hover:text-brand-green transition-colors" />
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-brand-pale rounded-lg">
            <h3 className="text-sm font-semibold text-brand-dark mb-2">System Info</h3>
            <div className="space-y-1 text-xs text-brand-gray">
              <p>Kudimba Farms v1.0</p>
              <p>Role: <span className="capitalize text-brand-ink font-medium">{user?.role || 'user'}</span></p>
              <p>Last login: {user?.last_login ? new Date(user.last_login).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
