import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertTriangle, KeyRound } from 'lucide-react';
import { api, setAuthToken } from '../lib/api.ts';
import { useToast } from '../common/Toast.tsx';
import type { User as UserType } from '../types.ts';

interface AdminAuthProps {
  onSuccess: (user: UserType) => void;
  onBack: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onSuccess, onBack }) => {
  const { success, error } = useToast();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      error('Credentials Required', 'Please enter admin email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login({
        identifier,
        password,
        expectedRole: 'ADMIN'
      });
      setAuthToken(res.token);
      success('Admin Access Granted', `Signed in to Administrator Console`);
      onSuccess(res.user);
    } catch (err: any) {
      error('Access Denied', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 p-8 text-left">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Administrator Console</h2>
              <p className="text-xs text-slate-500">Authorized Personnel Only</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            ← Back
          </button>
        </div>

        {/* Security Warning Notice */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 mb-6">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Public registration is prohibited.</span>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Only provisioned system administrators may authenticate to oversee worker verifications, dispute resolutions, and platform analytics.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-signin-identifier"
                type="email"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@sahakargig.in"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-signin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <button
            id="admin-signin-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-4 text-sm"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Admin Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
