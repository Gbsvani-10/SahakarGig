import React, { useState, useEffect } from 'react';
import { ToastProvider } from './components/common/Toast.tsx';
import { Navbar } from './components/common/Navbar.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { RoleSelectionPage } from './components/auth/RoleSelectionPage.tsx';
import { WorkerAuth } from './components/auth/WorkerAuth.tsx';
import { CustomerAuth } from './components/auth/CustomerAuth.tsx';
import { AdminAuth } from './components/auth/AdminAuth.tsx';
import { WorkerDashboard } from './components/worker/WorkerDashboard.tsx';
import { CustomerDashboard } from './components/customer/CustomerDashboard.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { api, removeAuthToken, getAuthToken } from './lib/api.ts';
import type { User as UserType, WorkerProfile, CustomerProfile } from './types.ts';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [initializing, setInitializing] = useState(true);

  // Check existing session
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        setInitializing(false);
        return;
      }
      try {
        const userRes = await api.getCurrentUser();
        if (userRes && userRes.user) {
          setCurrentUser(userRes.user);
          if (userRes.user.role === 'WORKER') {
            const wp = await api.getWorkerProfile();
            setWorkerProfile(wp);
            setCurrentView('worker-dashboard');
          } else if (userRes.user.role === 'CUSTOMER') {
            const cp = await api.getCustomerProfile();
            setCustomerProfile(cp);
            setCurrentView('customer-dashboard');
          } else if (userRes.user.role === 'ADMIN') {
            setCurrentView('admin-dashboard');
          }
        }
      } catch (err) {
        removeAuthToken();
        setCurrentUser(null);
      } finally {
        setInitializing(false);
      }
    };

    initAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // proceed anyway
    }
    removeAuthToken();
    setCurrentUser(null);
    setWorkerProfile(null);
    setCustomerProfile(null);
    setCurrentView('landing');
  };

  const handleSelectRole = (role: 'WORKER' | 'CUSTOMER' | 'ADMIN') => {
    if (role === 'WORKER') {
      setCurrentView('worker-auth');
    } else if (role === 'CUSTOMER') {
      setCurrentView('customer-auth');
    } else if (role === 'ADMIN') {
      setCurrentView('admin-auth');
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
            Loading SahakarGig Platform...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar
          currentUser={currentUser}
          currentRole={currentUser?.role || null}
          onNavigate={(view) => {
            if (view === 'worker-dashboard' && currentUser?.role === 'WORKER') {
              setCurrentView('worker-dashboard');
            } else if (view === 'customer-dashboard' && currentUser?.role === 'CUSTOMER') {
              setCurrentView('customer-dashboard');
            } else if (view === 'admin-dashboard' && currentUser?.role === 'ADMIN') {
              setCurrentView('admin-dashboard');
            } else {
              setCurrentView(view);
            }
          }}
          onLogout={handleLogout}
        />

        <main className="flex-1">
          {/* LANDING PAGE */}
          {currentView === 'landing' && (
            <LandingPage
              onGetStarted={() => setCurrentView('role-selection')}
              onExplore={() => {
                const el = document.getElementById('how-it-works-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}

          {/* ROLE SELECTION */}
          {currentView === 'role-selection' && (
            <RoleSelectionPage
              onSelectRole={handleSelectRole}
              onBack={() => setCurrentView('landing')}
            />
          )}

          {/* WORKER AUTH */}
          {currentView === 'worker-auth' && (
            <WorkerAuth
              onSuccess={(user, profile) => {
                setCurrentUser(user);
                setWorkerProfile(profile);
                setCurrentView('worker-dashboard');
              }}
              onBack={() => setCurrentView('role-selection')}
            />
          )}

          {/* CUSTOMER AUTH */}
          {currentView === 'customer-auth' && (
            <CustomerAuth
              onSuccess={(user, profile) => {
                setCurrentUser(user);
                setCustomerProfile(profile);
                setCurrentView('customer-dashboard');
              }}
              onBack={() => setCurrentView('role-selection')}
            />
          )}

          {/* ADMIN AUTH */}
          {currentView === 'admin-auth' && (
            <AdminAuth
              onSuccess={(user) => {
                setCurrentUser(user);
                setCurrentView('admin-dashboard');
              }}
              onBack={() => setCurrentView('role-selection')}
            />
          )}

          {/* WORKER DASHBOARD */}
          {currentView === 'worker-dashboard' && currentUser && workerProfile && (
            <WorkerDashboard
              user={currentUser}
              initialProfile={workerProfile}
              onLogout={handleLogout}
            />
          )}

          {/* CUSTOMER DASHBOARD */}
          {currentView === 'customer-dashboard' && currentUser && customerProfile && (
            <CustomerDashboard
              user={currentUser}
              initialProfile={customerProfile}
              onLogout={handleLogout}
            />
          )}

          {/* ADMIN DASHBOARD */}
          {currentView === 'admin-dashboard' && currentUser && currentUser.role === 'ADMIN' && (
            <AdminDashboard user={currentUser} onLogout={handleLogout} />
          )}
        </main>
      </div>
    </ToastProvider>
  );
}
