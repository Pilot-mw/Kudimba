import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-pale">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
          <p className="text-brand-gray text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRole === 'admin' && user.role !== 'admin' && !user.is_superuser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-pale">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-hot mb-2">Access Denied</h2>
          <p className="text-brand-gray">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
