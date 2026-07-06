import { Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Gallery from './pages/Gallery';
import News from './pages/News';
import Hero from './pages/Hero';
import Slider from './pages/Slider';
import Adverts from './pages/Adverts';
import Announcements from './pages/Announcements';
import About from './pages/About';
import Contact from './pages/Contact';
import Testimonials from './pages/Testimonials';
import Staff from './pages/Staff';
import FAQ from './pages/FAQ';
import Downloads from './pages/Downloads';
import MediaLibrary from './pages/MediaLibrary';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Users from './pages/Users';
import AuditLog from './pages/AuditLog';
import { Outlet } from 'react-router-dom';

function ProtectedLayout({ children, requiredRole }) {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export function AdminShell() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Outlet />
      </ToastProvider>
    </AuthProvider>
  );
}

export const adminRoutes = [
  <Route key="login" path="login" element={<Login />} />,
  <Route key="index" index element={<Navigate to="dashboard" replace />} />,
  <Route key="dashboard" path="dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />,
  <Route key="products" path="products" element={<ProtectedLayout><Products /></ProtectedLayout>} />,
  <Route key="gallery" path="gallery" element={<ProtectedLayout><Gallery /></ProtectedLayout>} />,
  <Route key="news" path="news" element={<ProtectedLayout><News /></ProtectedLayout>} />,
  <Route key="hero" path="hero" element={<ProtectedLayout><Hero /></ProtectedLayout>} />,
  <Route key="slider" path="slider" element={<ProtectedLayout><Slider /></ProtectedLayout>} />,
  <Route key="adverts" path="adverts" element={<ProtectedLayout><Adverts /></ProtectedLayout>} />,
  <Route key="announcements" path="announcements" element={<ProtectedLayout><Announcements /></ProtectedLayout>} />,
  <Route key="about" path="about" element={<ProtectedLayout><About /></ProtectedLayout>} />,
  <Route key="contact" path="contact" element={<ProtectedLayout><Contact /></ProtectedLayout>} />,
  <Route key="testimonials" path="testimonials" element={<ProtectedLayout><Testimonials /></ProtectedLayout>} />,
  <Route key="staff" path="staff" element={<ProtectedLayout><Staff /></ProtectedLayout>} />,
  <Route key="faq" path="faq" element={<ProtectedLayout><FAQ /></ProtectedLayout>} />,
  <Route key="downloads" path="downloads" element={<ProtectedLayout><Downloads /></ProtectedLayout>} />,
  <Route key="media" path="media" element={<ProtectedLayout><MediaLibrary /></ProtectedLayout>} />,
  <Route key="messages" path="messages" element={<ProtectedLayout><Messages /></ProtectedLayout>} />,
  <Route key="settings" path="settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />,
  <Route key="users" path="users" element={<ProtectedLayout requiredRole="admin"><Users /></ProtectedLayout>} />,
  <Route key="audit-log" path="audit-log" element={<ProtectedLayout><AuditLog /></ProtectedLayout>} />,
];
