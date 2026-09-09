import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingPage } from '../../portal/landing/LandingPage';
import { RoleSelectionPage } from '../../portal/auth/RoleSelectionPage';
import { WorkerAuth } from '../../portal/auth/WorkerAuth';
import { CustomerAuth } from '../../portal/auth/CustomerAuth';
import { AdminAuth } from '../../portal/auth/AdminAuth';
import { ToastProvider } from '../../portal/common/Toast';
import { useAuth } from '../../context/AuthContext';
import type { UserRole, User as AppUser } from '../../types';
import type { User as PortalUser } from '../../portal/types';
import { getAuthToken } from '../../portal/lib/api';

export const SahakarGigPortal: React.FC = () => {
  const navigate = useNavigate();
  const { adoptSession } = useAuth();
  const [view, setView] = useState<'landing' | 'role-selection' | 'worker-auth' | 'customer-auth' | 'admin-auth'>('landing');

  const mapUser = (user: PortalUser): AppUser => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.mobile,
    role: String(user.role).toUpperCase() === 'WORKER' ? 'worker' : String(user.role).toUpperCase() === 'CUSTOMER' ? 'customer' : 'admin'
  });

  const goToDashboard = (user: PortalUser) => {
    const appUser = mapUser(user);
    const token = getAuthToken();
    if (!token) return;
    adoptSession(appUser, token);
    const target: UserRole = appUser.role;
    navigate(`/${target}/dashboard`);
  };

  return (
    <ToastProvider>
      {view === 'landing' && (
        <LandingPage
          onGetStarted={() => setView('role-selection')}
          onExplore={() => document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' })}
        />
      )}
      {view === 'role-selection' && (
        <RoleSelectionPage onSelectRole={(role) => setView(role === 'WORKER' ? 'worker-auth' : role === 'CUSTOMER' ? 'customer-auth' : 'admin-auth')} onBack={() => setView('landing')} />
      )}
      {view === 'worker-auth' && (
        <WorkerAuth onSuccess={(user) => goToDashboard(user)} onBack={() => setView('role-selection')} />
      )}
      {view === 'customer-auth' && (
        <CustomerAuth onSuccess={(user) => goToDashboard(user)} onBack={() => setView('role-selection')} />
      )}
      {view === 'admin-auth' && (
        <AdminAuth onSuccess={(user) => goToDashboard(user)} onBack={() => setView('role-selection')} />
      )}
    </ToastProvider>
  );
};
