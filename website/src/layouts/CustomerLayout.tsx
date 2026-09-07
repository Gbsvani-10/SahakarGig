import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { DemoBanner } from '../components/common/DemoBanner';
import { ToastContainer } from '../components/common/ToastContainer';
import {
  LayoutDashboard,
  Search,
  Users,
  Calendar,
  AlertTriangle,
  CreditCard,
  FileText,
  Star,
  User,
  Settings,
  LogOut,
  Building2,
  Menu,
  X,
  Bell,
  ChevronRight
} from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadNotificationCount } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/customer/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Find Services', path: '/customer/services', icon: <Search className="w-4 h-4" /> },
    { label: 'Verified Workers', path: '/customer/workers', icon: <Users className="w-4 h-4" /> },
    { label: 'My Bookings', path: '/customer/bookings', icon: <Calendar className="w-4 h-4" /> },
    { 
      label: 'Emergency Service', 
      path: '/customer/emergency', 
      icon: <AlertTriangle className="w-4 h-4" />,
      isEmergency: true 
    },
    { label: 'Payments', path: '/customer/payments', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Invoices', path: '/customer/invoices', icon: <FileText className="w-4 h-4" /> },
    { label: 'Ratings & Reviews', path: '/customer/ratings', icon: <Star className="w-4 h-4" /> },
    { label: 'My Profile', path: '/customer/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Settings', path: '/customer/settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DemoBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-900/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-1/0 lg:translate-x-0'
          }`}
        >
          {/* Brand */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-base">SahakarGig</span>
                <span className="block text-[10px] text-emerald-800 font-semibold uppercase -mt-0.5">
                  Customer Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/customer/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    item.isEmergency
                      ? isActive
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/60'
                      : isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.isEmergency && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                      Urgent
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-9 h-9 rounded-full object-cover border border-emerald-300"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate">{user?.name || 'Customer'}</p>
                <p className="text-[11px] text-gray-500 truncate">{user?.city || 'Noida'}, UP</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
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
                <span>SahakarGig</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="font-semibold text-gray-800 capitalize">
                  {location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/customer/emergency"
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs animate-pulse"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Emergency</span> 15-Min Service
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50">
                    <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-900">Notifications</p>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        {unreadNotificationCount} New
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-xs text-gray-500 text-center">No notifications</p>
                      ) : (
                        notifications.slice(0, 4).map((n) => (
                          <div key={n.id} className="p-3 hover:bg-gray-50 text-xs">
                            <p className="font-semibold text-gray-900">{n.title}</p>
                            <p className="text-gray-600 mt-0.5 text-[11px]">{n.message}</p>
                            <span className="text-[10px] text-gray-400 mt-1 block">{n.timestamp}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};
