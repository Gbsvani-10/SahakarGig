import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Filter,
  CheckCircle2,
  Clock,
  Briefcase,
  Star,
  User,
  Calendar,
  IndianRupee,
  Phone,
  ShieldCheck,
  Award,
  Send,
  CreditCard,
  Layers,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { useToast } from '../common/Toast.tsx';
import type { User as UserType, CustomerProfile, WorkerProfile, JobRequest } from '../../types.ts';

interface CustomerDashboardProps {
  user: UserType;
  initialProfile: CustomerProfile;
  onLogout: () => void;
}

const SERVICE_CATEGORIES = [
  'All Skills',
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Cleaning',
  'Driving',
  'Delivery',
  'Construction',
  'Cooking',
  'Gardening',
  'Security'
];

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  initialProfile,
  onLogout
}) => {
  const { success, error } = useToast();
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(initialProfile);
  const [activeTab, setActiveTab] = useState<'search' | 'requests' | 'history' | 'profile'>('search');

  // Search & Filter state
  const [selectedSkill, setSelectedSkill] = useState('All Skills');
  const [locationQuery, setLocationQuery] = useState(customerProfile.preferredServiceArea || '');
  const [pincodeQuery, setPincodeQuery] = useState(customerProfile.pincode || '');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [maxWage, setMaxWage] = useState(1500);

  // Worker results
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);

  // Active requests
  const [myRequests, setMyRequests] = useState<JobRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Worker profile modal & request form
  const [selectedWorkerForView, setSelectedWorkerForView] = useState<WorkerProfile | null>(null);
  const [selectedWorkerForRequest, setSelectedWorkerForRequest] = useState<WorkerProfile | null>(null);

  // Request form state
  const [requestService, setRequestService] = useState('Plumbing');
  const [requestDesc, setRequestDesc] = useState('');
  const [requestAddress, setRequestAddress] = useState(customerProfile.address || '');
  const [requestPincode, setRequestPincode] = useState(customerProfile.pincode || '');
  const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
  const [requestTimeSlot, setRequestTimeSlot] = useState('Morning (9 AM - 1 PM)');
  const [requestDuration, setRequestDuration] = useState('1 Day (Full Day)');
  const [requestOfferedWage, setRequestOfferedWage] = useState(700);
  const [requestContact, setRequestContact] = useState(customerProfile.contactNumber || user.email);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Rating & Payment modal
  const [paymentModalJob, setPaymentModalJob] = useState<JobRequest | null>(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [feedbackText, setFeedbackText] = useState('Great, professional service!');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Load workers
  const fetchWorkers = async () => {
    setLoadingWorkers(true);
    try {
      const data = await api.searchWorkers({
        skill: selectedSkill === 'All Skills' ? undefined : selectedSkill,
        location: locationQuery || undefined,
        pincode: pincodeQuery || undefined,
        availability: onlyAvailableToday ? 'AVAILABLE' : undefined,
        verifiedOnly: onlyVerified,
        maxWage: maxWage
      });
      setWorkers(data);
    } catch (err: any) {
      error('Search failed', err.message);
    } finally {
      setLoadingWorkers(false);
    }
  };

  // Load customer job requests
  const fetchMyRequests = async () => {
    setLoadingRequests(true);
    try {
      const data = await api.getCustomerJobs();
      setMyRequests(data);
    } catch (err: any) {
      error('Failed to load requests', err.message);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [selectedSkill, onlyAvailableToday, onlyVerified, maxWage]);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  // Open booking modal
  const handleOpenBooking = (worker: WorkerProfile) => {
    setSelectedWorkerForRequest(worker);
    setRequestService(worker.jobType || worker.skills[0] || 'General Work');
    setRequestOfferedWage(worker.expectedDailyWage || 700);
  };

  // Submit booking request
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerForRequest) return;
    if (!requestDesc.trim()) {
      error('Missing Description', 'Please provide a short description of the work needed.');
      return;
    }
    if (!requestAddress.trim() || !requestPincode.trim()) {
      error('Missing Location', 'Please provide service address and pincode.');
      return;
    }

    setSubmittingRequest(true);
    try {
      await api.createJobRequest({
        workerId: selectedWorkerForRequest.id,
        serviceRequested: requestService,
        description: requestDesc,
        serviceAddress: requestAddress,
        pincode: requestPincode,
        scheduledDate: requestDate,
        scheduledTimeSlot: requestTimeSlot,
        durationDays: requestDuration === 'Half day' ? 0.5 : 1,
        offeredAmount: Number(requestOfferedWage),
        customerContact: requestContact
      });

      success('Request Dispatched!', `Work request sent to ${selectedWorkerForRequest.fullName}.`);
      setSelectedWorkerForRequest(null);
      setRequestDesc('');
      fetchMyRequests();
      setActiveTab('requests');
    } catch (err: any) {
      error('Request failed', err.message);
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Pay and complete job
  const handleConfirmPayment = async () => {
    if (!paymentModalJob) return;
    setProcessingPayment(true);
    try {
      await api.payJob(paymentModalJob.id, {
        rating: ratingVal,
        feedback: feedbackText
      });
      success('Payment Released', `₹${paymentModalJob.offeredAmount} credited to ${paymentModalJob.workerName}.`);
      setPaymentModalJob(null);
      fetchMyRequests();
      fetchWorkers();
    } catch (err: any) {
      error('Payment failed', err.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Customer Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-sky-600/20">
                  {customerProfile.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{customerProfile.fullName}</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customer Portal • {customerProfile.preferredServiceArea || 'All Localities'} (Pincode: {customerProfile.pincode})
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="text-xs bg-sky-50 text-sky-800 font-semibold px-3 py-1.5 rounded-full border border-sky-200">
                {myRequests.filter((r) => r.status === 'ACCEPTED' || r.status === 'REQUESTED').length} Active Requests
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl">
          {[
            { id: 'search', label: 'Search & Hire Workers' },
            { id: 'requests', label: 'My Bookings / Service Requests', count: myRequests.filter((r) => r.status !== 'PAID').length },
            { id: 'history', label: 'Service & Payment History' }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`customer-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-sky-600 text-sky-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px]">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: SEARCH & HIRE WORKERS */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Filters Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-sky-600" />
                  Find Trusted Gig & Daily-Wage Workers
                </h3>
                <span className="text-xs text-slate-500">{workers.length} workers available</span>
              </div>

              {/* Skills Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {SERVICE_CATEGORIES.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setSelectedSkill(skill)}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all text-xs font-semibold ${
                      selectedSkill === skill
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              {/* Advanced Filter Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Locality / Area</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder="e.g. Indiranagar"
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincodeQuery}
                    onChange={(e) => setPincodeQuery(e.target.value)}
                    placeholder="e.g. 560038"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Max Daily Wage: ₹{maxWage}
                  </label>
                  <input
                    type="range"
                    min={400}
                    max={2000}
                    step={100}
                    value={maxWage}
                    onChange={(e) => setMaxWage(Number(e.target.value))}
                    className="w-full accent-sky-600 mt-1.5"
                  />
                </div>

                <div className="flex flex-col justify-center gap-1.5 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={onlyAvailableToday}
                      onChange={(e) => setOnlyAvailableToday(e.target.checked)}
                      className="rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                    />
                    Available Today Only
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={onlyVerified}
                      onChange={(e) => setOnlyVerified(e.target.checked)}
                      className="rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                    />
                    Verified Workers Only
                  </label>
                </div>
              </div>
            </div>

            {/* Workers Grid */}
            {loadingWorkers ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                <div className="inline-block w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mb-2" />
                <p>Searching verified workers in your radius...</p>
              </div>
            ) : workers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500 text-xs">
                <User className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-800">No workers match your exact criteria</p>
                <p className="text-slate-400 mt-1">
                  Try clearing the Pincode or wage filters to view all available verified professionals.
                </p>
                <button
                  onClick={() => {
                    setSelectedSkill('All Skills');
                    setLocationQuery('');
                    setPincodeQuery('');
                    setOnlyAvailableToday(false);
                    setOnlyVerified(false);
                  }}
                  className="mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {workers.map((w) => (
                  <div
                    key={w.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0">
                            {w.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-slate-900">{w.fullName}</h4>
                            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              {w.jobType}
                            </span>
                          </div>
                        </div>

                        {/* Availability Pill */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            w.availability === 'AVAILABLE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : w.availability === 'CURRENTLY_WORKING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {w.availability === 'AVAILABLE'
                            ? '● Available'
                            : w.availability === 'CURRENTLY_WORKING'
                            ? '● Busy'
                            : 'Offline'}
                        </span>
                      </div>

                      {/* Location & Experience */}
                      <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                        <p className="flex items-center gap-1.5 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {w.preferredArea || w.address} (Pincode: {w.pincode})
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          {w.experienceYears} Years Field Experience • {w.preferredWorkType}
                        </p>
                      </div>

                      {/* Skills Tags */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {w.skills.slice(0, 3).map((s) => (
                          <span key={s} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                        {w.skills.length > 3 && (
                          <span className="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded">
                            +{w.skills.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Verification Badges */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                        {w.badges.identityVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                            <ShieldCheck className="w-3 h-3 text-sky-600" /> ID Verified
                          </span>
                        )}
                        {w.badges.skillVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Skill Verified
                          </span>
                        )}
                        {w.badges.certificateVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                            <Award className="w-3 h-3 text-purple-600" /> Certified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom: Wage & CTAs */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Expected Wage</span>
                        <span className="text-base font-extrabold text-slate-900">₹{w.expectedDailyWage} / day</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedWorkerForView(w)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                        >
                          Profile
                        </button>
                        <button
                          id={`hire-worker-${w.id}`}
                          onClick={() => handleOpenBooking(w)}
                          className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm"
                        >
                          Request Worker
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY BOOKINGS / SERVICE REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Service Requests</h3>
                <p className="text-xs text-slate-500">Track worker confirmation, dispatch, and completion</p>
              </div>
              <button
                onClick={fetchMyRequests}
                className="text-xs font-semibold text-sky-700 hover:underline"
              >
                Refresh List
              </button>
            </div>

            {loadingRequests ? (
              <div className="p-8 text-center text-slate-500 text-xs">Loading requests...</div>
            ) : myRequests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                <Briefcase className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">No service requests placed yet</p>
                <p className="text-slate-400 mt-1">
                  Switch to the "Search & Hire Workers" tab to find and request local service experts.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          Worker: {req.workerName}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                          {req.serviceRequested}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            req.status === 'REQUESTED'
                              ? 'bg-amber-100 text-amber-800'
                              : req.status === 'ACCEPTED'
                              ? 'bg-sky-100 text-sky-800'
                              : req.status === 'COMPLETED'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          Status: {req.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">{req.description}</p>

                      <div className="flex flex-wrap items-center gap-x-4 text-xs text-slate-500 pt-1">
                        <span>📅 Scheduled: {req.scheduledDate} ({req.scheduledTimeSlot})</span>
                        <span>📍 Location: {req.serviceAddress}</span>
                        <span>💰 Offered: ₹{req.offeredAmount}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === 'REQUESTED' && (
                        <span className="text-xs text-amber-700 font-medium bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Awaiting Worker Confirmation
                        </span>
                      )}

                      {req.status === 'ACCEPTED' && (
                        <div className="text-xs bg-sky-50 text-sky-900 p-2 rounded-xl border border-sky-200">
                          <span className="font-semibold block">✓ Accepted & Dispatched</span>
                          <span className="text-[11px] text-sky-700">Worker Contact: {req.workerContact}</span>
                        </div>
                      )}

                      {req.status === 'COMPLETED' && req.paymentStatus !== 'PAID' && (
                        <button
                          id={`pay-worker-${req.id}`}
                          onClick={() => setPaymentModalJob(req)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5"
                        >
                          <CreditCard className="w-3.5 h-3.5" /> Confirm & Pay ₹{req.offeredAmount}
                        </button>
                      )}

                      {req.paymentStatus === 'PAID' && (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed & Paid
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SERVICE HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Service & Payment History</h3>
            <p className="text-xs text-slate-500 mb-4">Past completed tasks with receipts and review logs</p>

            <div className="divide-y divide-slate-100 text-xs">
              {myRequests.filter((r) => r.paymentStatus === 'PAID').length === 0 ? (
                <p className="py-6 text-center text-slate-400">No completed jobs yet.</p>
              ) : (
                myRequests
                  .filter((r) => r.paymentStatus === 'PAID')
                  .map((r) => (
                    <div key={r.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 block">{r.serviceRequested} by {r.workerName}</span>
                        <span className="text-slate-500 text-[11px]">
                          {r.scheduledDate} • Address: {r.serviceAddress}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-emerald-700 block">₹{r.offeredAmount}</span>
                        <span className="text-[10px] text-emerald-600">✓ Paid</span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* WORKER PUBLIC PROFILE MODAL (SENSITIVE DATA STRICTLY MASKED) */}
      {selectedWorkerForView && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
                  {selectedWorkerForView.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedWorkerForView.fullName}</h3>
                  <p className="text-xs text-slate-500">{selectedWorkerForView.jobType} Specialist</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorkerForView(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <span className="font-semibold text-slate-700 block mb-1">About & Bio</span>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-600 leading-relaxed">
                  {selectedWorkerForView.bio || 'Verified professional registered on SahakarGig cooperative platform.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Expected Daily Rate</span>
                  <span className="font-bold text-slate-900 text-sm">₹{selectedWorkerForView.expectedDailyWage} / day</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Experience</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedWorkerForView.experienceYears} Years</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1.5">Trade Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedWorkerForView.skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {selectedWorkerForView.certifications.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1.5">Trade Certifications</span>
                  <div className="space-y-1.5">
                    {selectedWorkerForView.certifications.map((c, i) => (
                      <div key={i} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">{c.name}</p>
                          <p className="text-[10px] text-slate-500">{c.organization} ({c.year})</p>
                        </div>
                        <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                          ✓ Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Secure Identity Verification Display (Strictly Masked) */}
              <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified
                  </span>
                  <span className="text-[11px] font-mono text-slate-300">
                    {selectedWorkerForView.identityVerification.maskedNumber}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Worker identity has been verified through official database checks. Full sensitive identity documents are protected and never displayed.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedWorkerForView(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedWorkerForRequest(selectedWorkerForView);
                  setSelectedWorkerForView(null);
                }}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold"
              >
                Request Worker Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST / BOOK WORKER FORM MODAL */}
      {selectedWorkerForRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Book {selectedWorkerForRequest.fullName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Send a direct service request with your address and date.
            </p>

            <form onSubmit={handleSubmitBooking} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Required *</label>
                <input
                  type="text"
                  required
                  value={requestService}
                  onChange={(e) => setRequestService(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Description & Scope *</label>
                <textarea
                  rows={2}
                  required
                  value={requestDesc}
                  onChange={(e) => setRequestDesc(e.target.value)}
                  placeholder="e.g. Need kitchen sink leak fixed and check main bathroom valve..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Location / Address *</label>
                <input
                  type="text"
                  required
                  value={requestAddress}
                  onChange={(e) => setRequestAddress(e.target.value)}
                  placeholder="Flat #, Street, Locality"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={requestPincode}
                    onChange={(e) => setRequestPincode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={requestContact}
                    onChange={(e) => setRequestContact(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Time Slot</label>
                  <select
                    value={requestTimeSlot}
                    onChange={(e) => setRequestTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Morning (9 AM - 1 PM)">Morning (9 AM - 1 PM)</option>
                    <option value="Afternoon (1 PM - 5 PM)">Afternoon (1 PM - 5 PM)</option>
                    <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Duration</label>
                  <select
                    value={requestDuration}
                    onChange={(e) => setRequestDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="1 Day (Full Day)">1 Day (Full Day)</option>
                    <option value="Half day">Half Day (4 hrs)</option>
                    <option value="2 Days">2 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Offered Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    step={50}
                    value={requestOfferedWage}
                    onChange={(e) => setRequestOfferedWage(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedWorkerForRequest(null)}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold disabled:opacity-50"
                >
                  {submittingRequest ? 'Sending...' : 'Dispatch Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM PAYMENT & RATING MODAL */}
      {paymentModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-left">
            <h3 className="text-base font-bold text-slate-900 mb-1">Complete Job & Pay</h3>
            <p className="text-xs text-slate-500 mb-4">
              Releasing ₹{paymentModalJob.offeredAmount} to {paymentModalJob.workerName}.
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rate Worker Service</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingVal(star)}
                      className={`text-xl ${ratingVal >= star ? 'text-amber-400' : 'text-slate-300'}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="font-bold text-slate-700 ml-2">{ratingVal} / 5</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Review Feedback</label>
                <textarea
                  rows={2}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800">
                ✓ Dynamic Social Security: ₹10 will be safely contributed to {paymentModalJob.workerName}'s micro-protection fund for this completed day.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalJob(null)}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={processingPayment}
                  onClick={handleConfirmPayment}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold disabled:opacity-50"
                >
                  {processingPayment ? 'Processing...' : `Pay ₹${paymentModalJob.offeredAmount}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
