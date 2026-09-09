import React, { useState, useEffect } from 'react';
import {
  User,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Award,
  Layers,
  Phone,
  Check,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { useToast } from '../common/Toast.tsx';
import { WorkerEarnings } from './WorkerEarnings.tsx';
import { WorkerProtection } from './WorkerProtection.tsx';
import { WorkerProfileView } from './WorkerProfileView.tsx';
import type { User as UserType, WorkerProfile, JobRequest, AvailabilityStatus } from '../../types.ts';

interface WorkerDashboardProps {
  user: UserType;
  initialProfile: WorkerProfile;
  onLogout: () => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  user,
  initialProfile,
  onLogout
}) => {
  const { success, error } = useToast();
  const [profile, setProfile] = useState<WorkerProfile>(initialProfile);
  const [activeTab, setActiveTab] = useState<'requests' | 'earnings' | 'protection' | 'profile'>('requests');
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Customer details modal
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);

  // Load fresh profile & job requests
  const loadDashboardData = async () => {
    setLoadingRequests(true);
    try {
      const [jobsData, profileData] = await Promise.all([
        api.getWorkerJobs(),
        api.getWorkerProfile()
      ]);
      setJobRequests(jobsData);
      if (profileData) setProfile(profileData);
    } catch (err: any) {
      error('Data sync failed', err.message);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Change availability toggle
  const handleAvailabilityChange = async (newStatus: AvailabilityStatus) => {
    setUpdatingStatus(true);
    try {
      const updated = await api.updateWorkerAvailability(newStatus);
      setProfile(updated);
      success('Availability Updated', `Status is now ${newStatus.replace('_', ' ')}`);
    } catch (err: any) {
      error('Failed to update status', err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Job actions
  const handleJobAction = async (jobId: string, action: 'accept' | 'decline' | 'complete') => {
    try {
      if (action === 'accept') {
        await api.acceptJob(jobId);
        success('Job Accepted', 'Customer has been notified. Please be on time.');
      } else if (action === 'decline') {
        await api.declineJob(jobId);
        success('Job Declined', 'The request has been declined.');
      } else if (action === 'complete') {
        await api.completeJob(jobId);
        success('Work Marked Completed', 'Customer can now confirm completion and release payment.');
      }
      loadDashboardData();
    } catch (err: any) {
      error(`Action failed`, err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Worker Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Profile Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-emerald-700/20 shrink-0">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {profile.fullName}
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {profile.jobType}
                  </span>
                  {profile.badges.identityVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-sky-600" /> ID Verified
                    </span>
                  )}
                  {profile.badges.skillVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Skill Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.preferredArea || profile.address} • Pincode: {profile.pincode}
                </p>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-600 px-2">Availability:</span>
              <div className="inline-flex rounded-lg bg-white p-1 border border-slate-200 shadow-xs">
                <button
                  id="avail-btn-today"
                  disabled={updatingStatus}
                  onClick={() => handleAvailabilityChange('AVAILABLE')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    profile.availability === 'AVAILABLE'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🟢 Available Today
                </button>
                <button
                  id="avail-btn-busy"
                  disabled={updatingStatus}
                  onClick={() => handleAvailabilityChange('CURRENTLY_WORKING')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    profile.availability === 'CURRENTLY_WORKING'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🟡 Busy / Working
                </button>
                <button
                  id="avail-btn-notavail"
                  disabled={updatingStatus}
                  onClick={() => handleAvailabilityChange('NOT_AVAILABLE')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    profile.availability === 'NOT_AVAILABLE'
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⚪ Not Available
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-100 text-left">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Today's Status</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">
                {profile.availability === 'AVAILABLE' ? '🟢 Ready for Work' : profile.availability === 'CURRENTLY_WORKING' ? '🟡 On Active Job' : '⚪ Off Duty'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Total Earnings</span>
              <span className="text-sm font-bold text-emerald-700 mt-1 block">₹{profile.totalEarnings.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Completed Jobs</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">{profile.totalJobsCompleted}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Active Requests</span>
              <span className="text-sm font-bold text-sky-700 mt-1 block">
                {jobRequests.filter((j) => j.status === 'REQUESTED' || j.status === 'ACCEPTED').length}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Rating</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">★ {profile.rating} ({profile.ratingCount})</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Protection</span>
              <span className="text-sm font-bold text-emerald-800 mt-1 block">Day-Linked Active</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl">
          {[
            { id: 'requests', label: 'Work Requests / Opportunities', count: jobRequests.length },
            { id: 'earnings', label: 'My Earnings & Work History' },
            { id: 'protection', label: 'Worker Protection & Security' },
            { id: 'profile', label: 'Profile & Verification' }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`worker-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: WORK REQUESTS / OPPORTUNITIES */}
        {activeTab === 'requests' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Incoming Opportunities</h3>
                <p className="text-xs text-slate-500">Service requests sent to you by customers in your area</p>
              </div>
              <button
                onClick={loadDashboardData}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {loadingRequests ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <div className="inline-block w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
                <p>Loading active job requests...</p>
              </div>
            ) : jobRequests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                <Briefcase className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">No active work requests right now</p>
                <p className="text-slate-400 mt-1 max-w-sm mx-auto">
                  Make sure your availability is set to <strong>Available Today</strong> to be matched with customers looking for your trade.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {jobRequests.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                          {job.serviceRequested}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            job.status === 'REQUESTED'
                              ? 'bg-amber-100 text-amber-800'
                              : job.status === 'ACCEPTED'
                              ? 'bg-sky-100 text-sky-800'
                              : job.status === 'COMPLETED'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          Status: {job.status}
                        </span>
                        {job.paymentStatus === 'PAID' && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ Payment Paid
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-slate-900">{job.description}</h4>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                        <span className="flex items-center gap-1 font-semibold text-slate-900">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          Customer: {job.customerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.serviceAddress} (Pincode: {job.pincode})
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {job.scheduledDate} ({job.scheduledTimeSlot})
                        </span>
                      </div>
                    </div>

                    {/* Right side: wage and actions */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-left md:text-right">
                        <span className="text-[11px] text-slate-500 block">Offered Daily Wage</span>
                        <span className="text-xl font-extrabold text-emerald-700">₹{job.offeredAmount}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                        >
                          View Details
                        </button>

                        {job.status === 'REQUESTED' && (
                          <>
                            <button
                              id={`accept-job-${job.id}`}
                              onClick={() => handleJobAction(job.id, 'accept')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button
                              id={`decline-job-${job.id}`}
                              onClick={() => handleJobAction(job.id, 'decline')}
                              className="px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" /> Decline
                            </button>
                          </>
                        )}

                        {job.status === 'ACCEPTED' && (
                          <button
                            id={`complete-job-${job.id}`}
                            onClick={() => handleJobAction(job.id, 'complete')}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY EARNINGS & WORK HISTORY */}
        {activeTab === 'earnings' && (
          <WorkerEarnings
            workerId={profile.id}
            defaultWage={profile.expectedDailyWage}
            onWorkDayLogged={loadDashboardData}
          />
        )}

        {/* TAB 3: WORKER PROTECTION & BENEFITS */}
        {activeTab === 'protection' && (
          <WorkerProtection workerId={profile.id} />
        )}

        {/* TAB 4: PROFILE & VERIFICATION */}
        {activeTab === 'profile' && (
          <WorkerProfileView profile={profile} onProfileUpdated={(up) => setProfile(up)} />
        )}
      </div>

      {/* Customer details modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left">
            <h3 className="text-base font-bold text-slate-900 mb-1">Customer & Job Details</h3>
            <p className="text-xs text-slate-500 mb-4">Request #{selectedJob.id.slice(0, 8)}</p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer Name:</span>
                  <span className="font-bold text-slate-800">{selectedJob.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Number:</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    {selectedJob.customerContact}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Location:</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[200px]">{selectedJob.serviceAddress}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Required Service:</span>
                  <span className="font-bold text-slate-800">{selectedJob.serviceRequested}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="font-semibold text-slate-800">{selectedJob.scheduledDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Slot:</span>
                  <span className="font-semibold text-slate-800">{selectedJob.scheduledTimeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Offered Wage:</span>
                  <span className="font-bold text-emerald-700">₹{selectedJob.offeredAmount}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Work Description / Problem:</span>
                <p className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
