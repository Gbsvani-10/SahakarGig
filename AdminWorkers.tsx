import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Input } from '../../components/common/Input';
import { Search, ShieldCheck, CheckCircle2, XCircle, Award, Phone } from 'lucide-react';
import { Worker } from '../../types';

export const AdminWorkers: React.FC = () => {
  const { workers, addToast } = useApp();
  const [workerList, setWorkerList] = useState<Worker[]>(workers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const filtered = workerList.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.cooperativeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'All' || w.primaryCategory === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleApprove = (id: string, name: string) => {
    setWorkerList((prev) => 
      prev.map((w) => w.id === id ? { ...w, verificationStatus: 'Verified' as const } : w)
    );
    addToast('success', 'Worker Verified', `${name}'s trade certificate and Aadhaar approved for NCCT roster.`);
  };

  const handleSuspend = (id: string, name: string) => {
    setWorkerList((prev) => 
      prev.map((w) => w.id === id ? { ...w, verificationStatus: 'Rejected' as const } : w)
    );
    addToast('info', 'Worker Status Changed', `${name} moved to audit queue.`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Artisan Verification & Governance</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Aadhaar KYC audit, trade competency certifications, and cooperative roster approvals
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search worker by name or cooperative..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-xs border border-gray-200 rounded-xl p-2 bg-white w-full sm:w-auto"
        >
          <option value="All">All Trade Categories</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
          <option value="Carpentry">Carpentry</option>
          <option value="Masonry">Masonry</option>
          <option value="HVAC">HVAC</option>
        </select>
      </Card>

      {/* Workers Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-gray-400 uppercase border-b border-gray-100">
              <tr>
                <th className="pb-3">Worker / Member</th>
                <th className="pb-3">Trade</th>
                <th className="pb-3">Labour Cooperative</th>
                <th className="pb-3">KYC / Aadhaar</th>
                <th className="pb-3">Jobs & Rating</th>
                <th className="pb-3">Verification</th>
                <th className="pb-3 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50/50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={w.avatarUrl}
                        alt={w.name}
                        className="w-9 h-9 rounded-xl object-cover border border-teal-300"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{w.name}</p>
                        <p className="text-[11px] text-gray-500">{w.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-semibold text-gray-800">{w.primaryCategory}</td>
                  <td className="py-3 text-gray-600">{w.cooperativeName}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {w.aadhaarVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-gray-900">{w.completedJobs} jobs</span>
                    <span className="text-amber-500 block text-[11px]">⭐ {w.rating}</span>
                  </td>
                  <td className="py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      w.verificationStatus === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : w.verificationStatus === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {w.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {w.verificationStatus === 'Pending' ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleApprove(w.id, w.name)}
                      >
                        Approve
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSuspend(w.id, w.name)}
                      >
                        Audit
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
