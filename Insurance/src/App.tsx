/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WorkerProfile } from './types';
import { api } from './utils/apiClient';
import { WorkerHeader } from './components/WorkerHeader';
import { InsurancePage } from './pages/InsurancePage';
import { WelfareDashboard } from './pages/WelfareDashboard';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [loadingWorker, setLoadingWorker] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Client routing
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/insurance';
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/insurance' || hash === '#/insurance' || hash === '#insurance') {
      return '/insurance';
    }
    // Default to /insurance to directly present the requested module
    return '/insurance';
  });

  // Fetch current authenticated worker from backend
  const fetchWorker = async () => {
    try {
      setLoadingWorker(true);
      const profile = await api.getWorkerProfile();
      setWorker(profile);
    } catch (e) {
      console.error('Failed to load authenticated worker profile:', e);
    } finally {
      setLoadingWorker(false);
    }
  };

  useEffect(() => {
    fetchWorker();
  }, [refreshKey]);

  // Synchronize browser history and URL
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/insurance' || hash === '#/insurance' || hash === '#insurance') {
        setCurrentPath('/insurance');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (targetPath: string) => {
    setCurrentPath(targetPath);
    try {
      window.history.pushState({}, '', targetPath);
    } catch {
      window.location.hash = targetPath === '/insurance' ? '#/insurance' : '#/';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWorkerSwitched = () => {
    setRefreshKey((k) => k + 1);
  };

  if (loadingWorker && !worker) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm max-w-sm w-full">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-black text-xl mx-auto">
            SG
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-emerald-700 mx-auto" />
          <h2 className="text-base font-bold text-stone-900">Loading SahakarGig Worker Portal</h2>
          <p className="text-xs text-stone-500">Authenticating session with secure welfare server...</p>
        </div>
      </div>
    );
  }

  // Fallback if no worker was returned
  const activeWorker: WorkerProfile = worker || {
    id: 'usr_w102',
    workerId: 'SG-7714-BLR',
    name: 'Rajesh Sharma',
    mobile: '9822334455',
    occupation: 'Last-Mile Delivery Partner',
    employer: 'Sahakar Quick Commerce',
    workStatus: 'Active Partner',
    location: 'Indiranagar, Bengaluru, KA',
    badge: 'Verified Gig Driver',
    dailyEarnings: 380,
    weeklyEarnings: 2280,
    monthlyEarnings: 9880,
    estimatedWorkingDays: 26,
    estimatedMonthlyEarnings: 9880,
  };

  const isInsurance = currentPath === '/insurance' || currentPath.startsWith('#/insurance');

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans antialiased text-stone-900 selection:bg-emerald-200">
      {/* Top SahakarGig Header with navigation and authenticated worker switcher */}
      <WorkerHeader
        worker={activeWorker}
        currentPath={currentPath}
        onNavigate={navigateTo}
        onWorkerSwitched={handleWorkerSwitched}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {isInsurance ? (
          <InsurancePage
            key={`ins_${activeWorker.id}_${refreshKey}`}
            onBackToPortal={() => navigateTo('/')}
          />
        ) : (
          <WelfareDashboard
            key={`wel_${activeWorker.id}_${refreshKey}`}
            worker={activeWorker}
            onNavigateToInsurance={() => navigateTo('/insurance')}
            onOpenClaimModal={() => navigateTo('/insurance')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="font-bold text-white tracking-tight">SahakarGig</span>
            <span>•</span>
            <span>Worker Welfare Trust & Micro-Insurance</span>
          </div>
          <div className="text-stone-500 text-[11px]">
            Toll-Free Worker Helpline: 1800-123-HELP • Built for gig & daily wage earners
          </div>
        </div>
      </footer>
    </div>
  );
}
