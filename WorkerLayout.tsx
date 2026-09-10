import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { DemoBanner } from '../components/common/DemoBanner';
import { ToastContainer } from '../components/common/ToastContainer';
import {
  LayoutDashboard,
  User,
  Wrench,
  Award,
  Clock,
  Briefcase,
  PlayCircle,
  IndianRupee,
  Star,
  HeartPulse,
  Bell,
  Settings,
  LogOut,
  Building2,
  Menu,
  X,
  Radio,
  ChevronRight
} from 'lucide-react';

export const WorkerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { workers, updateWorkerAvailability, unreadNotificationCount } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentWorker = workers.find((w) => w.userId === user?.id || w.id === 'work-201') || workers[0];
  const activeStatus = currentWorker?.availabilityStatus || 'Available';

  const navItems = [
    { label: 'Dashboard', path: '/worker/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Job Requests', path: '/worker/jobs', icon: <Briefcase className="w-4 h-4" />, highlight: true },
    { label: 'Active Job Screen', path: '/worker/active-job', icon: <PlayCircle className="w-4 h-4" /> },
    { label: 'My Profile', path: '/worker/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Trade Skills', path: '/worker/skills', icon: <Wrench className="w-4 h-4" /> },
    { label: 'Certifications', path: '/worker/certifications', icon: <Award className="w-4 h-4" /> },
    { label: 'Availability Schedule', path: '/worker/availability', icon: <Clock className="w-4 h-4" /> },
    { label: 'Earnings & Payouts', path: '/worker/earnings', icon: <IndianRupee className="w-4 h-4" /> },
    { label: 'Customer Ratings', path: '/worker/ratings', icon: <Star className="w-4 h-4" /> },
    { label: 'Welfare & Insurance', path: '/worker/welfare', icon: <HeartPulse className="w-4 h-4" /> },
    { label: 'Notifications', path: '/worker/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Settings', path: '/worker/settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const handleStatusToggle = (newStatus: 'Available' | 'Busy' | 'Offline') => {
    if (currentWorker) {
      updateWorkerAvailability(currentWorker.id, newStatus);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-900/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-1/0 lg:translate-x-0'
          }`}
        >
          {/* Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-base">SahakarGig</span>
                <span className="block text-[10px] text-teal-400 font-semibold uppercase -mt-0.5">
                  Artisan Worker Portal
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

          {/* Worker Status Widget */}
          <div className="p-3 mx-3 my-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Duty Status</span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <Radio className="w-3 h-3 animate-pulse" />
                {activeStatus}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-1 rounded-lg text-center">
              <button
                onClick={() => handleStatusToggle('Available')}
                className={`py-1 text-[10px] font-bold rounded transition-colors cursor-pointer ${
                  activeStatus === 'Available' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Online
              </button>
              <button
                onClick={() => handleStatusToggle('Busy')}
                className={`py-1 text-[10px] font-bold rounded transition-colors cursor-pointer ${
                  activeStatus === 'Busy' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Busy
              </button>
              <button
                onClick={() => handleStatusToggle('Offline')}
                className={`py-1 text-[10px] font-bold rounded transition-colors cursor-pointer ${
                  activeStatus === 'Offline' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Offline
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Worker Info Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={currentWorker?.avatarUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'}
                alt={currentWorker?.name}
                className="w-9 h-9 rounded-full object-cover border border-teal-500"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{currentWorker?.name || 'Ravi Kumar'}</p>
                <p className="text-[10px] text-teal-400 truncate font-medium">
                  {currentWorker?.primaryCategory} • ⭐ {currentWorker?.rating}
                </p>
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
          <header className="h-16 bg-white border-b border-gray-200/80 flex items-center justify-between px-4 sm:px-6 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="text-xs text-gray-500 hidden sm:flex items-center gap-1.5">
                <span>SahakarGig Worker</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="font-semibold text-gray-800 capitalize">
                  {location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-semibold">
                <span>Coop ID:</span>
                <span className="font-mono text-[11px] text-emerald-900">NCCT-DEL-4412</span>
              </div>

              <Link
                to="/worker/active-job"
                className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Active Job Step Tracker</span>
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
