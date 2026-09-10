import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Wrench, ShieldAlert, RotateCcw, AlertOctagon } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { role, loginAs } = useAuth();
  const { triggerDemoEmergencyScenario, resetAllDemoData } = useApp();
  const navigate = useNavigate();

  const handleRoleSwitch = async (targetRole: 'customer' | 'worker' | 'admin') => {
    await loginAs(targetRole);
    if (targetRole === 'customer') {
      navigate('/customer/dashboard');
    } else if (targetRole === 'worker') {
      navigate('/worker/dashboard');
    } else if (targetRole === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  const handleEmergencyTrigger = async () => {
    await triggerDemoEmergencyScenario();
    navigate('/customer/bookings');
  };

  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800 px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-md relative z-40">
      <div className="flex items-center gap-2">
        <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
          SahakarGig Interactive Demo
        </span>
        <span className="hidden md:inline text-slate-300">
          Cooperative Digital Marketplace Platform for Household & Community Services
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-1.5">
        <span className="text-slate-400 text-[11px] hidden sm:inline mr-1">Switch Portal:</span>

        <button
          onClick={() => handleRoleSwitch('customer')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            role === 'customer'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Switch to Customer Portal (Priya Sharma)"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Customer</span>
        </button>

        <button
          onClick={() => handleRoleSwitch('worker')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            role === 'worker'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Switch to Worker Portal (Ravi Kumar - Plumber)"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Worker</span>
        </button>

        <button
          onClick={() => handleRoleSwitch('admin')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            role === 'admin'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Switch to Cooperative Admin Portal (Dr. Rameshwar Rao)"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Cooperative Admin</span>
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

        <button
          onClick={handleEmergencyTrigger}
          className="bg-amber-600/90 hover:bg-amber-600 text-white px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
          title="Simulate customer urgent pipe burst & dispatch nearby worker"
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Trigger</span> Emergency Demo
        </button>

        <button
          onClick={resetAllDemoData}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md font-medium transition-colors cursor-pointer"
          title="Reset demo data to initial state"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
