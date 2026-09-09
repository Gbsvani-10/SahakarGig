import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { DemoBanner } from '../components/common/DemoBanner';
import { ToastContainer } from '../components/common/ToastContainer';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Sparkles,
  Calendar,
  GitPullRequest,
  AlertOctagon,
  CreditCard,
  HeartHandshake,
  MessageSquareWarning,
  BarChart3,
  TrendingUp,
  Settings,
  LogOut,
  Building2,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { workers, complaints } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingVerificationsCount = workers.filter((w) => w.verificationStatus === 'Pending').length;
  const openComplaintsCount = complaints.filter((c) => c.status === 'Open').length;

  const navItems = [
    { label: 'Federation Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Worker Roster', path: '/admin/workers', icon: <Users className="w-4 h-4" /> },
    { 
      label: 'Worker Verification', 
      path: '/admin/verification', 
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingVerificationsCount > 0 ? pendingVerificationsCount : undefined
    },
    { label: 'Skills & Wage Cards', path: '/admin/skills', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Booking Operations', path: '/admin/bookings', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Workforce Allocation', path: '/admin/workforce', icon: <GitPullRequest className="w-4 h-4" /> },
    { label: 'Emergency Command', path: '/admin/emergency', icon: <AlertOctagon className="w-4 h-4" />, alert: true },
    { label: 'Payments & Direct Benefit', path: '/admin/payments', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Worker Welfare Fund', path: '/admin/welfare', icon: <HeartHandshake className="w-4 h-4" /> },
    { 
      label: 'Complaints & Redressal', 
      path: '/admin/complaints', 
      icon: <MessageSquareWarning className="w-4 h-4" />,
      badge: openComplaintsCount > 0 ? openComplaintsCount : undefined
    },
    { label: 'Performance Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'AI Demand Forecast', path: '/admin/demand-forecast', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Federation Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-200 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-base">SahakarGig</span>
                <span className="block text-[10px] text-blue-400 font-semibold uppercase -mt-0.5">
                  Cooperative Admin
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ministry / Federation Badge */}
          <div className="mx-3 my-2.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-slate-200 truncate">NCCT Nodal Federation</p>
              <p className="text-[10px] text-slate-400 truncate">Ministry of Cooperation</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : item.alert
                      ? 'text-amber-300 hover:bg-slate-800 hover:text-amber-200'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Admin Info & Logout */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-9 h-9 rounded-full object-cover border border-blue-400"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Dr. Rameshwar Rao'}</p>
                <p className="text-[10px] text-blue-300 truncate">NCCT Nodal Director</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5">
                <span>Cooperative Command Center</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="font-semibold text-slate-800 capitalize">
                  {location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin/emergency"
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Emergency Dispatch Grid</span>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};
