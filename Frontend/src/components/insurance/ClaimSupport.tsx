import React, { useEffect, useState } from 'react';
import {
  LifeBuoy,
  PhoneCall,
  AlertCircle,
  Upload,
  CheckCircle2,
  ChevronRight,
  Loader2,
  X,
} from 'lucide-react';
import { insuranceApi } from '../../services/insuranceApi';
import type { InsuranceClaim } from '../../types/insurance';

interface ClaimSupportProps {
  onClose?: () => void;
  isOpen?: boolean;
}

type ClaimType =
  | 'Accident'
  | 'Hospitalization'
  | 'Medical Emergency'
  | 'Other';

export const ClaimSupport: React.FC<ClaimSupportProps> = ({
  onClose,
  isOpen = true,
}) => {
  const [activeTab, setActiveTab] = useState<'new_claim' | 'my_claims'>(
    'new_claim'
  );

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [claimType, setClaimType] = useState<ClaimType>('Accident');
  const [incidentDate, setIncidentDate] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedClaim, setSubmittedClaim] =
    useState<InsuranceClaim | null>(null);

  const [existingClaims, setExistingClaims] = useState<InsuranceClaim[]>([]);
  const [loadingClaims, setLoadingClaims] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setIncidentDate(today);
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoadingClaims(true);
      const claims = await insuranceApi.getClaims();
      setExistingClaims(claims);
    } catch (error) {
      console.error('Failed to load insurance claims:', error);
    } finally {
      setLoadingClaims(false);
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.length) return;

    const fileNames = Array.from(event.target.files).map(
      (file) => file.name
    );

    setAttachedFiles((previous) => [
      ...previous,
      ...fileNames,
    ]);
  };

  const removeFile = (fileName: string) => {
    setAttachedFiles((previous) =>
      previous.filter((file) => file !== fileName)
    );
  };

  const handleSubmitClaim = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!description.trim()) {
      setSubmitError('Please provide a brief description.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      /*
       * The current backend insurance API accepts claimType,
       * description and optional amount.
       *
       * Incident date, hospital name, contact number and file
       * names are currently UI-only fields unless the backend
       * claim schema is extended to persist them.
       */
      const newClaim = await insuranceApi.createClaim({
        claimType,
        description: [
          `Incident date: ${incidentDate || 'Not provided'}`,
          `Hospital / Clinic: ${hospitalName || 'Not provided'}`,
          `Callback number: ${contactNumber || 'Not provided'}`,
          `Documents: ${
            attachedFiles.length > 0
              ? attachedFiles.join(', ')
              : 'None'
          }`,
          '',
          description.trim(),
        ].join('\n'),
      });

      setSubmittedClaim(newClaim);
      setExistingClaims((previous) => [newClaim, ...previous]);
      setStep(3);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Failed to submit claim. Please try again.'
      );
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <LifeBuoy className="w-7 h-7" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              Welfare Assistance
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
              Need Insurance Help?
            </h2>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="self-end p-2 rounded-lg hover:bg-stone-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Helpline */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-200 flex items-center justify-center">
          <PhoneCall className="w-4 h-4" />
        </div>

        <div>
          <span className="font-bold text-sm block">
            Worker Insurance Assistance
          </span>
          <span className="text-xs text-emerald-800">
            Submit your claim details through the SahakarGig platform.
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-stone-100 p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('new_claim')}
          className={`px-4 py-2 rounded-lg text-xs font-bold ${
            activeTab === 'new_claim'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600'
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
          className={`px-4 py-2 rounded-lg text-xs font-bold ${
            activeTab === 'my_claims'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600'
          }`}
        >
          My Claims
          {existingClaims.length > 0 && (
            <span className="ml-2">
              ({existingClaims.length})
            </span>
          )}
        </button>
      </div>

      {/* New Claim */}
      {activeTab === 'new_claim' && (
        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3].map((number) => (
              <React.Fragment key={number}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= number
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {number}
                </div>

                {number < 3 && (
                  <div className="w-10 h-0.5 bg-stone-200" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-base font-bold">
                  What happened?
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Select the category for your insurance claim.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'Accident' as ClaimType,
                    title: 'Accident',
                    description:
                      'Workplace or road accident',
                  },
                  {
                    id: 'Hospitalization' as ClaimType,
                    title: 'Hospitalization',
                    description:
                      'Hospital admission or surgery',
                  },
                  {
                    id: 'Medical Emergency' as ClaimType,
                    title: 'Medical Emergency',
                    description:
                      'Sudden medical emergency',
                  },
                  {
                    id: 'Other' as ClaimType,
                    title: 'Other',
                    description:
                      'Other health-related assistance',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setClaimType(item.id)}
                    className={`p-4 rounded-2xl border-2 text-left ${
                      claimType === item.id
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold">
                          {item.title}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1">
                          {item.description}
                        </p>
                      </div>

                      {claimType === item.id && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-amber-400 font-bold text-xs flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form
              onSubmit={handleSubmitClaim}
              className="space-y-4"
            >
              {submitError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Date of Incident
                  </label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(event) =>
                      setIncidentDate(event.target.value)
                    }
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">
                    Callback Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(event) =>
                      setContactNumber(event.target.value)
                    }
                    placeholder="Enter mobile number"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1">
                    Hospital / Clinic
                  </label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(event) =>
                      setHospitalName(event.target.value)
                    }
                    placeholder="Hospital or clinic name"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder="Describe what happened..."
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-2">
                    Supporting Documents
                  </label>

                  <input
                    type="file"
                    id="claim-file-input"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <label
                    htmlFor="claim-file-input"
                    className="border-2 border-dashed border-stone-300 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-stone-400" />
                    <span className="text-xs font-bold text-emerald-800 mt-2">
                      Upload supporting documents
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1">
                      PNG, JPG or PDF
                    </span>
                  </label>

                  {attachedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachedFiles.map((file) => (
                        <div
                          key={file}
                          className="flex items-center justify-between bg-stone-50 rounded-lg px-3 py-2 text-xs"
                        >
                          <span>{file}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(file)}
                            className="text-rose-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {isSubmitting
                    ? 'Submitting...'
                    : 'Submit Claim'}
                </button>
              </div>
            </form>
          )}

          {/* Step 3 */}
          {step === 3 && submittedClaim && (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-black">
                Claim Submitted Successfully
              </h3>

              <p className="text-sm text-stone-500">
                Your insurance claim has been submitted and is
                now available in My Claims.
              </p>

              {submittedClaim.id && (
                <p className="text-xs text-stone-500">
                  Claim ID: {submittedClaim.id}
                </p>
              )}

              <div className="flex justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('my_claims');
                    fetchClaims();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold"
                >
                  View My Claims
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold"
                >
                  New Claim
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* My Claims */}
      {activeTab === 'my_claims' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold">
            My Insurance Claims
          </h3>

          {loadingClaims ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : existingClaims.length === 0 ? (
            <div className="text-center py-8 text-sm text-stone-500">
              No insurance claims found.
            </div>
          ) : (
            <div className="space-y-3">
              {existingClaims.map((claim) => (
                <div
                  key={claim.id ?? `${claim.claimType}-${claim.createdAt}`}
                  className="border border-stone-200 rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold">
                        {claim.claimType || 'Insurance Claim'}
                      </h4>

                      <p className="text-xs text-stone-500 mt-1 whitespace-pre-line">
                        {claim.description || 'No description'}
                      </p>
                    </div>

                    <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-stone-100">
                      {claim.status || 'Submitted'}
                    </span>
                  </div>

                  {claim.createdAt && (
                    <p className="text-[11px] text-stone-400 mt-3">
                      Submitted:{' '}
                      {new Date(
                        claim.createdAt
                      ).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClaimSupport;
