import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ title, value, icon: Icon, trend, color = 'brand-green', loading = false }) {
  const colorClasses = {
    'brand-green': 'border-l-brand-green bg-gradient-to-r from-brand-green/5 to-transparent',
    'brand-orange': 'border-l-brand-orange bg-gradient-to-r from-brand-orange/5 to-transparent',
    'brand-hot': 'border-l-brand-hot bg-gradient-to-r from-brand-hot/5 to-transparent',
    'brand-dark': 'border-l-brand-dark bg-gradient-to-r from-brand-dark/5 to-transparent',
    'blue': 'border-l-blue-500 bg-gradient-to-r from-blue-500/5 to-transparent',
  };

  const iconColorClasses = {
    'brand-green': 'text-brand-green bg-brand-pale',
    'brand-orange': 'text-brand-orange bg-orange-50',
    'brand-hot': 'text-brand-hot bg-red-50',
    'brand-dark': 'text-brand-dark bg-gray-100',
    'blue': 'text-blue-500 bg-blue-50',
  };

  const formatValue = (val) => {
    if (val == null) return '—';
    if (typeof val === 'number') {
      if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
      if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
      return val.toLocaleString();
    }
    return val;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 border-l-4 border-l-gray-200">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-7 w-16 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-5 border-l-4 ${colorClasses[color] || colorClasses['brand-green']}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-brand-gray">{title}</p>
          <p className="text-2xl font-bold text-brand-ink">{formatValue(value)}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend >= 0 ? 'text-brand-green' : 'text-brand-hot'
            }`}>
              {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{Math.abs(trend)}% from last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconColorClasses[color] || iconColorClasses['brand-green']}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
