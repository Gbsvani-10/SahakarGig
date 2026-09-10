import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Activity,
  User,
  Wrench,
  Award,
  CalendarDays,
  Wallet,
  Star,
  HeartPulse,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const WorkerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { workers } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const currentWorker = useMemo(() => {
    if (!user?.id) return null;

    return workers.find(
      (worker) => String(worker.userId) === String(user.id)
    );
  }, [workers, user?.id]);

  const navItems = [
    {
      label: 'Dashboard',
      path: '/worker/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: 'Job Requests',
      path: '/worker/jobs',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      label: 'Active Job Screen',
      path: '/worker/active-job',
      icon: <Activity className="w-4 h-4" />,
    },
    {
      label: 'My Profile',
      path: '/worker/profile',
      icon: <User className="w-4 h-4" />,
    },
    {
      label: 'Trade Skills',
      path: '/worker/skills',
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      label: 'Certifications',
      path: '/worker/certifications',
      icon: <Award className="w-4 h-4" />,
    },
    {
      label: 'Availability Schedule',
      path: '/worker/availability',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      label: 'Earnings & Payouts',
      path: '/worker/earnings',
      icon: <Wallet className="w-4 h-4" />,
    },
    {
      label: 'Customer Ratings',
      path: '/worker/ratings',
      icon: <Star className="w-4 h-4" />,
    },
    {
      label: 'Welfare & Insurance',
      path: '/insurance',
      icon: <HeartPulse className="w-4 h-4" />,
    },
    {
      label: 'Notifications',
      path: '/worker/notifications',
      icon: <Bell className="w-4 h-4" />,
    },
    {
      label: 'Settings',
      path: '/worker/settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/worker/dashboard') {
      return (
        location.pathname === '/worker' ||
        location.pathname === '/worker/' ||
        location.pathname === '/worker/dashboard'
      );
    }

    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100"
          aria-label="Open worker menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="font-bold text-slate-900">SahakarGig</div>

        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
          {currentWorker?.fullName?.charAt(0)?.toUpperCase() ||
            user?.name?.charAt(0)?.toUpperCase() ||
            'W'}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close worker menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200
          flex flex-col transition-transform duration-200
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleNavigation('/worker/dashboard')}
            className="font-black text-lg text-slate-900"
          >
            Sahakar<span className="text-emerald-700">Gig</span>
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Worker */}
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              {currentWorker?.fullName?.charAt(0)?.toUpperCase() ||
                user?.name?.charAt(0)?.toUpperCase() ||
                'W'}
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-900 truncate">
                {currentWorker?.fullName || user?.name || 'Worker'}
              </p>

              <p className="text-xs text-slate-500 truncate">
                {currentWorker?.cooperativeName || 'Worker Account'}
              </p>
            </div>
          </div>

          {currentWorker && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Account connected
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium transition-colors text-left
                ${
                  isActive(item.path)
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-200">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
