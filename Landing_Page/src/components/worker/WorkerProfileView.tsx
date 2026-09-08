import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Edit3,
  Calendar,
  Languages,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { useToast } from '../common/Toast.tsx';
import type { WorkerProfile, AvailabilityStatus, WorkTypePreference } from '../../types.ts';

interface WorkerProfileViewProps {
  profile: WorkerProfile;
  onProfileUpdated: (updated: WorkerProfile) => void;
}

export const WorkerProfileView: React.FC<WorkerProfileViewProps> = ({
  profile,
  onProfileUpdated
}) => {
  const { success, error } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [fullName, setFullName] = useState(profile.fullName);
  const [address, setAddress] = useState(profile.address);
  const [pincode, setPincode] = useState(profile.pincode);
  const [preferredArea, setPreferredArea] = useState(profile.preferredArea);
  const [expectedDailyWage, setExpectedDailyWage] = useState(profile.expectedDailyWage);
  const [preferredWorkType, setPreferredWorkType] = useState<WorkTypePreference>(profile.preferredWorkType);
  const [experienceYears, setExperienceYears] = useState(profile.experienceYears);
  const [bio, setBio] = useState(profile.bio);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateWorkerProfile({
        fullName,
        address,
        pincode,
        preferredArea,
        expectedDailyWage: Number(expectedDailyWage),
        preferredWorkType,
        experienceYears: Number(experienceYears),
        bio
      });
      success('Profile Updated', 'Your profile changes have been saved.');
      onProfileUpdated(updated);
      setEditing(false);
    } catch (err: any) {
      error('Update Failed', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-emerald-600/20">
              {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'W'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{profile.fullName}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  {profile.jobType}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {profile.preferredArea || profile.address || 'Service Area Configured'} (Pincode: {profile.pincode})
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                <span>⭐ <strong>{profile.rating}</strong> ({profile.ratingCount} reviews)</span>
                <span>•</span>
                <span>💼 <strong>{profile.totalJobsCompleted}</strong> completed jobs</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">
                  Trust Score: <strong>{profile.trustScore}%</strong>
                </span>
              </div>
            </div>
          </div>

          <button
            id="edit-profile-btn"
            onClick={() => setEditing(!editing)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors self-start sm:self-auto"
          >
            <Edit3 className="w-4 h-4" />
            {editing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Verification Badges (Only displayed when corresponding status exists) */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold text-slate-500 mr-1">Verification Status:</span>

          {profile.badges.identityVerified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Identity Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Identity Review Pending
            </span>
          )}

          {profile.badges.skillVerified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Skill Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              Skill Pending Review
            </span>
          )}

          {profile.badges.certificateVerified && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Certificate Verified
            </span>
          )}
        </div>
      </div>

      {/* Edit Form or Detail Sections */}
      {editing ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-emerald-600" />
            Update Profile Information
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Daily Wage (₹)</label>
                <input
                  type="number"
                  step={50}
                  value={expectedDailyWage}
                  onChange={(e) => setExpectedDailyWage(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Work Area</label>
                <input
                  type="text"
                  value={preferredArea}
                  onChange={(e) => setPreferredArea(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bio</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section: Personal & Contact Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              Personal Information
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Mobile Number:</span>
                <span className="font-semibold text-slate-800">{profile.mobile}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-800">{profile.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Address:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[200px] truncate">{profile.address}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Languages Known:</span>
                <span className="font-semibold text-slate-800">{profile.languages.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Emergency Contact:</span>
                <span className="font-semibold text-slate-800">
                  {profile.emergencyContact.name} ({profile.emergencyContact.phone})
                </span>
              </div>
            </div>
          </div>

          {/* Section: Work & Skills */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Work & Trade Details
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Expected Daily Wage:</span>
                <span className="font-bold text-slate-900">₹{profile.expectedDailyWage} / day</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Preferred Work Type:</span>
                <span className="font-semibold text-slate-800">{profile.preferredWorkType}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Field Experience:</span>
                <span className="font-semibold text-slate-800">{profile.experienceYears} Years</span>
              </div>
            </div>
          </div>

          {/* Section: Certifications */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Certifications & Credentials
            </h3>
            {profile.certifications.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">
                No formal certifications added yet. You can upload trade certificates during onboarding or profile review.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {profile.certifications.map((c) => (
                  <div key={c.id || c.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{c.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white text-emerald-700 font-semibold border border-slate-200">
                        {c.verified ? 'Verified' : 'Review in Progress'}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{c.organization} • {c.year}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Sensitive Identity Data & Privacy Workflow */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Secure Identity Verification
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Document:</span>
                <span className="font-bold text-emerald-400">{profile.identityVerification.idType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Masked Identifier:</span>
                <span className="font-mono font-bold tracking-wider text-slate-200">
                  {profile.identityVerification.maskedNumber}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                🔒 Protected: Per SahakarGig privacy standards, original identity documents and full numbers are never exposed in search results, dashboards, or to customers.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
