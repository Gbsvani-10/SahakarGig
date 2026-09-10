import React, { useState, useEffect } from 'react';
import { ClaimRequest, ClaimType } from '../../types/insurance';
import { api } from '../utils/apiClient';
import {
  LifeBuoy,
  PhoneCall,
  AlertCircle,
  FileText,
  Upload,
  CheckCircle2,
  Calendar,
  Building2,
  Phone,
  ShieldCheck,
  ChevronRight,
  Clock,
  ArrowRight,
  X,
  Loader2,
} from 'lucide-react';

interface ClaimSupportProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export const ClaimSupport: React.FC<ClaimSupportProps> = ({ onClose, isOpen = true }) => {
  const [activeTab, setActiveTab] = useState<'new_claim' | 'my_claims'>('new_claim');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [claimType, setClaimType] = useState<ClaimType>('Accident');
  const [incidentDate, setIncidentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [hospitalName, setHospitalName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedClaim, setSubmittedClaim] = useState<ClaimRequest | null>(null);

  // Existing claims list
  const [existingClaims, setExistingClaims] = useState<ClaimRequest[]>([]);
  const [loadingClaims, setLoadingClaims] = useState<boolean>(false);

  const fetchClaims = async () => {
    try {
      setLoadingClaims(true);
      const data = await api.getClaims();
      setExistingClaims(data);
    } catch (e) {
      console.error('Failed to load claims', e);
    } finally {
      setLoadingClaims(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      setAttachedFiles((prev) => [...prev, fileName]);
    }
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactNumber.trim()) {
      setSubmitError('Please provide an active mobile contact number.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const newClaim = await api.submitClaim({
        claimType,
        incidentDate,
        hospitalOrClinic: hospitalName,
        description,
        contactNumber,
        documentsAttached: attachedFiles,
      });

      setSubmittedClaim(newClaim);
      setStep(3);
      fetchClaims();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setClaimType('Accident');
    setHospitalName('');
    setDescription('');
    setContactNumber('');
    setAttachedFiles([]);
    setSubmittedClaim(null);
    setSubmitError(null);
  };

  if (!isOpen) return null;

  return (
    <div
      id="claim-support-component"
      className="bg-white rounded-3xl border border-stone-200 shadow-md p-5 sm:p-7 space-y-6"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <LifeBuoy className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                Welfare Assistance
              </span>
              <span className="text-xs text-stone-500">24/7 SahakarGig Desk</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
              🆘 Need Insurance Help?
            </h2>
          </div>
        </div>

        {/* Tab switcher: New Claim vs My Claims */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-stone-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('new_claim')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'new_claim'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Claim Insurance
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('my_claims');
              fetchClaims();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'my_claims'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>My Claims</span>
            {existingClaims.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">
                {existingClaims.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Toll Free Helpline Fast Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-emerald-950 block">
              Direct Worker Assistance Helpline: 1800-123-HELP
            </span>
            <span className="text-emerald-800">
              Free 24/7 assistance in Hindi, Marathi, Kannada, Tamil, and English.
            </span>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg self-start sm:self-auto border border-emerald-200">
          Emergency Response Priority
        </span>
      </div>

      {/* TAB 1: NEW CLAIM (3-STEP FLOW) */}
      {activeTab === 'new_claim' && (
        <div className="space-y-6">
          {/* Step Progress Tracker */}
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 1 ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                1
              </div>
              <span className="text-xs font-semibold text-stone-800">Incident Type</span>
            </div>
            <div className="w-12 h-0.5 bg-stone-200" />
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 2 ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                2
              </div>
              <span className="text-xs font-semibold text-stone-800">Details & Docs</span>
            </div>
            <div className="w-12 h-0.5 bg-stone-200" />
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 3 ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                3
              </div>
              <span className="text-xs font-semibold text-stone-800">Status</span>
            </div>
          </div>

          {/* STEP 1: INCIDENT TYPE */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-center max-w-sm mx-auto space-y-1">
                <h3 className="text-base font-bold text-stone-900">What happened?</h3>
                <p className="text-xs text-stone-500">
                  Select the category that best describes your emergency or medical need.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'Accident' as ClaimType,
                    title: 'Workplace / Road Accident',
                    desc: 'Injury sustained on active shift or commute',
                  },
                  {
                    id: 'Hospitalization' as ClaimType,
                    title: 'Hospital Admission',
                    desc: 'Admitted to clinic or hospital for surgery or severe sickness',
                  },
                  {
                    id: 'Medical Emergency' as ClaimType,
                    title: 'Acute Medical Emergency',
                    desc: 'Sudden fever, severe infection, or urgent doctor visit',
                  },
                  {
                    id: 'Other' as ClaimType,
                    title: 'Other Health Distress',
                    desc: 'Compassionate assistance for other physical distress',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setClaimType(item.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start justify-between ${
                      claimType === item.id
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500/20'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                      <p className="text-xs text-stone-500 mt-1">{item.desc}</p>
                    </div>
                    {claimType === item.id && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  id="claim-step-1-next"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Next: Add Details & Documents</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS & DOCUMENTATION */}
          {step === 2 && (
            <form onSubmit={handleSubmitClaim} className="space-y-4 animate-in fade-in duration-150">
              {submitError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Date of Incident *
                  </label>
                  <input
                    type="date"
                    required
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-emerald-600"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Active Mobile Number for Callback *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-emerald-600"
                  />
                </div>

                {/* Hospital / Clinic */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Hospital / Clinic Name & Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Community Health Center, Kurla West"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-emerald-600"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Brief Description of What Happened
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe symptoms, accident details, or doctor recommendations..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-emerald-600 resize-none"
                  />
                </div>

                {/* Document attachment */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Attach Medical Bills or Doctor Prescription (Optional)
                  </label>
                  <div className="border-2 border-dashed border-stone-300 rounded-2xl p-4 text-center hover:bg-stone-50 transition-colors">
                    <input
                      type="file"
                      id="claim-file-input"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="claim-file-input"
                      className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                    >
                      <Upload className="w-6 h-6 text-stone-400" />
                      <span className="text-xs font-bold text-emerald-800">
                        Upload Doctor Paper / Hospital Slip
                      </span>
                      <span className="text-[11px] text-stone-400">
                        PNG, JPG, or PDF (up to 10MB)
                      </span>
                    </label>

                    {attachedFiles.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-stone-200 flex flex-wrap gap-2 justify-center">
                        {attachedFiles.map((file, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{file}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  ← Back to Incident Type
                </button>

                <button
                  type="submit"
                  id="submit-claim-btn"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs disabled:bg-stone-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Claim...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Claim Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUBMISSION SUCCESS & STATUS */}
          {step === 3 && submittedClaim && (
            <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-150">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 stroke-[2.2]" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Status: {submittedClaim.status}
                </span>
                <h3 className="text-xl font-bold text-stone-900 mt-2">
                  Claim Successfully Registered!
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  Your claim has been assigned Reference ID{' '}
                  <strong className="font-mono text-stone-900">
                    {submittedClaim.referenceCode}
                  </strong>
                  . A welfare officer will review your documentation and contact you within 2 hours.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 max-w-sm mx-auto text-left text-xs space-y-1.5 border border-emerald-200">
                <div className="flex justify-between">
                  <span className="text-stone-500">Claim Type:</span>
                  <strong className="text-stone-900">{submittedClaim.claimType}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Incident Date:</span>
                  <span className="text-stone-800">{submittedClaim.incidentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Callback Contact:</span>
                  <span className="text-stone-800">{submittedClaim.contactNumber}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 hover:bg-white cursor-pointer"
                >
                  Submit Another Claim
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('my_claims')}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 text-amber-400 text-xs font-bold hover:bg-stone-800 cursor-pointer"
                >
                  View My Claims
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY CLAIMS */}
      {activeTab === 'my_claims' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">My Registered Claims</h3>
            <button
              type="button"
              onClick={fetchClaims}
              className="text-xs text-emerald-800 hover:underline cursor-pointer"
            >
              Refresh
            </button>
          </div>

          {loadingClaims ? (
            <div className="p-8 text-center text-xs text-stone-500">Loading claims...</div>
          ) : existingClaims.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-1">
              <FileText className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-sm font-bold text-stone-800">No claims submitted yet.</p>
              <p className="text-xs text-stone-500">
                If you encounter a medical or accidental emergency, you can file a claim above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {existingClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-4 rounded-2xl border border-stone-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{claim.claimType}</span>
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                          claim.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : claim.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 mt-1 flex items-center gap-2 flex-wrap">
                      <span>Ref: <strong className="font-mono text-stone-700">{claim.referenceCode}</strong></span>
                      <span>•</span>
                      <span>Date: {claim.incidentDate}</span>
                      {claim.hospitalOrClinic && (
                        <>
                          <span>•</span>
                          <span>{claim.hospitalOrClinic}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-stone-500 sm:text-right">
                    <span>Submitted on: {new Date(claim.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
