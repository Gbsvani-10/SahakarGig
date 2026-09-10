import React, { useState } from 'react';
import {
  Briefcase,
  Lock,
  Mail,
  Phone,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  FileCheck,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { api, setAuthToken } from '../../lib/api.ts';
import { useToast } from '../common/Toast.tsx';
import type { WorkTypePreference, AvailabilityStatus, SkillCertification, User as UserType, WorkerProfile } from '../../types.ts';

interface WorkerAuthProps {
  onSuccess: (user: UserType, profile: WorkerProfile) => void;
  onBack: () => void;
}

const AVAILABLE_SKILLS = [
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
  'Security',
  'Other'
];

export const WorkerAuth: React.FC<WorkerAuthProps> = ({ onSuccess, onBack }) => {
  const { success, error } = useToast();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Sign In state
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Multi-step Sign Up state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Basic Info
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [preferredArea, setPreferredArea] = useState('');

  // Step 2: Work Profile
  const [jobType, setJobType] = useState('Plumbing');
  const [experienceYears, setExperienceYears] = useState(3);
  const [preferredWorkType, setPreferredWorkType] = useState<WorkTypePreference>('Flexible / Gig');
  const [expectedDailyWage, setExpectedDailyWage] = useState(700);
  const [availability, setAvailability] = useState<AvailabilityStatus>('AVAILABLE');
  const [preferredRadiusKm, setPreferredRadiusKm] = useState(15);
  const [languages, setLanguages] = useState(['Hindi', 'English']);
  const [bio, setBio] = useState('');

  // Step 3: Skills & Verification
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Plumbing']);
  const [certifications, setCertifications] = useState<
    { skill: string; name: string; organization: string; year: string; certificateFileName?: string }[]
  >([]);

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Family');

  // Sensitive ID verification
  const [idType, setIdType] = useState<'Aadhaar' | 'Voter ID' | 'PAN Card'>('Aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [certSkillName, setCertSkillName] = useState('Plumbing');
  const [certCourseName, setCertCourseName] = useState('');
  const [certOrg, setCertOrg] = useState('');
  const [certYear, setCertYear] = useState('2024');

  // Profile completion calculation
  const calculateCompletionPercentage = () => {
    let score = 0;
    if (fullName) score += 15;
    if (mobile && email) score += 15;
    if (address && pincode) score += 15;
    if (selectedSkills.length > 0) score += 20;
    if (expectedDailyWage > 0) score += 10;
    if (idNumber) score += 15;
    if (certifications.length > 0) score += 10;
    return Math.min(100, score);
  };

  const completionPercentage = calculateCompletionPercentage();

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInIdentifier || !signInPassword) {
      error('Missing Credentials', 'Please enter your email or mobile number, and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login({
        identifier: signInIdentifier,
        password: signInPassword,
        expectedRole: 'WORKER'
      });
      setAuthToken(res.token);
      success('Welcome Back!', `Signed in as ${res.user.name}`);
      onSuccess(res.user, res.profile as WorkerProfile);
    } catch (err: any) {
      error('Sign In Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step validation
  const handleNextStep = () => {
    if (step === 1) {
      if (!fullName.trim()) return error('Validation Error', 'Full Name is required');
      if (!mobile.trim() || mobile.length < 10) return error('Validation Error', 'Valid 10-digit mobile number required');
      if (!email.trim() || !email.includes('@')) return error('Validation Error', 'Valid email address required');
      if (!password || password.length < 6) return error('Validation Error', 'Password must be at least 6 characters');
      if (!address.trim()) return error('Validation Error', 'Address is required');
      if (!pincode.trim() || pincode.length < 6) return error('Validation Error', 'Valid 6-digit Pincode required');
      setStep(2);
    } else if (step === 2) {
      if (selectedSkills.length === 0) return error('Validation Error', 'Please select at least one primary skill');
      if (!expectedDailyWage || expectedDailyWage < 100) return error('Validation Error', 'Expected daily wage must be valid (min ₹100)');
      setStep(3);
    }
  };

  const handleAddCertification = () => {
    if (!certCourseName || !certOrg) {
      error('Incomplete Certification', 'Enter certificate name and issuing organization');
      return;
    }
    setCertifications([
      ...certifications,
      {
        skill: certSkillName,
        name: certCourseName,
        organization: certOrg,
        year: certYear,
        certificateFileName: `${certCourseName.replace(/\s+/g, '_')}_Cert.pdf`
      }
    ]);
    setCertCourseName('');
    setCertOrg('');
    success('Certification Added', 'Your certification will be reviewed for verification.');
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length === 1) {
        error('Skill Selection', 'You must have at least one skill selected.');
        return;
      }
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Submit complete onboarding
  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idNumber || idNumber.length < 4) {
      error('Identity Verification', 'Please enter your government ID number for secure verification.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.registerWorker({
        fullName,
        email,
        mobile,
        password,
        address,
        pincode,
        preferredArea: preferredArea || address,
        jobType: selectedSkills[0] || 'Worker',
        experienceYears,
        skills: selectedSkills,
        preferredWorkType,
        expectedDailyWage,
        availability,
        certifications,
        identityDocType: idType,
        identityDocNumber: idNumber,
        emergencyContact: {
          name: emergencyName || 'Family Contact',
          phone: emergencyPhone || mobile,
          relation: emergencyRelation
        },
        preferredRadiusKm,
        languages,
        bio: bio || `${selectedSkills.join(', ')} professional with ${experienceYears} years of experience.`,
        workExperienceSummary: `Specializing in ${selectedSkills.join(', ')}. Committed to prompt, reliable daily service.`
      });

      setAuthToken(res.token);
      success('Onboarding Complete!', `Welcome to SahakarGig, ${res.user.name}`);
      onSuccess(res.user, res.workerProfile);
    } catch (err: any) {
      error('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 p-6 sm:p-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Worker Portal</h2>
              <p className="text-xs text-slate-500">
                {mode === 'signin' ? 'Sign in to access your work, earnings & benefits' : 'Create your worker profile & get verified'}
              </p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Back
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl my-6">
          <button
            id="tab-worker-signin"
            type="button"
            onClick={() => setMode('signin')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            id="tab-worker-signup"
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Worker Account
          </button>
        </div>

        {/* SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="worker-signin-identifier"
                  type="text"
                  required
                  value={signInIdentifier}
                  onChange={(e) => setSignInIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or worker@sahakar.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="worker-signin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-emerald-700 font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              id="worker-signin-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* MULTI-STEP SIGN UP */}
        {mode === 'signup' && (
          <div className="space-y-6 text-left">
            {/* Step & Completion indicator */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-emerald-800 uppercase tracking-wider">
                  Step {step} of 3: {step === 1 ? 'Basic Information' : step === 2 ? 'Work Profile' : 'Skills & Verification'}
                </span>
                <span className="font-bold text-slate-700">
                  Profile {completionPercentage}% complete
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* STEP 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      id="worker-reg-fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      id="worker-reg-mobile"
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      id="worker-reg-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ramesh@example.com"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password *</label>
                    <input
                      id="worker-reg-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Home Address *</label>
                  <input
                    id="worker-reg-address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street name, locality, or landmark"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode *</label>
                    <input
                      id="worker-reg-pincode"
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 560038"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Working Area</label>
                    <input
                      id="worker-reg-area"
                      type="text"
                      value={preferredArea}
                      onChange={(e) => setPreferredArea(e.target.value)}
                      placeholder="e.g. Indiranagar & surrounding 10km"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <button
                  id="worker-step1-next-btn"
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-4"
                >
                  Continue to Work Profile
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Work Profile */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Work / Job Type</label>
                    <select
                      id="worker-reg-jobtype"
                      value={selectedSkills[0] || 'Plumbing'}
                      onChange={(e) => {
                        const newSkill = e.target.value;
                        if (!selectedSkills.includes(newSkill)) {
                          setSelectedSkills([newSkill, ...selectedSkills]);
                        }
                      }}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      {AVAILABLE_SKILLS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Years of Experience</label>
                    <input
                      id="worker-reg-exp"
                      type="number"
                      min={0}
                      max={50}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Skills tags selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select All Skills You Perform ({selectedSkills.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_SKILLS.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Work Type</label>
                    <select
                      id="worker-reg-worktype"
                      value={preferredWorkType}
                      onChange={(e) => setPreferredWorkType(e.target.value as WorkTypePreference)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Flexible / Gig">Flexible / Gig</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Expected Daily Wage (₹) *
                    </label>
                    <input
                      id="worker-reg-wage"
                      type="number"
                      step={50}
                      min={200}
                      value={expectedDailyWage}
                      onChange={(e) => setExpectedDailyWage(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      e.g. ₹700/day. Used for job estimates and transparent earnings calculation.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Availability</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'AVAILABLE', label: '🟢 Available Today' },
                      { id: 'THIS_WEEK', label: '🟡 Available This Week' },
                      { id: 'CURRENTLY_WORKING', label: '💼 Currently Working' },
                      { id: 'NOT_AVAILABLE', label: '⚪ Not Available' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAvailability(opt.id as AvailabilityStatus)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                          availability === opt.id
                            ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-semibold ring-1 ring-emerald-500'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 text-xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    id="worker-step2-next-btn"
                    type="button"
                    onClick={handleNextStep}
                    className="w-2/3 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    Continue to Skills & Verification
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Skills & Verification */}
            {step === 3 && (
              <form onSubmit={handleCompleteOnboarding} className="space-y-4">
                {/* Government Identity Verification with Security & Privacy Warning */}
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Secure Identity Verification
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        Your identity number is strictly masked (`XXXX-XXXX-1234`) and never exposed publicly.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">ID Document Type</label>
                      <select
                        value={idType}
                        onChange={(e) => setIdType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Aadhaar">Aadhaar Card (UIDAI)</option>
                        <option value="Voter ID">Voter ID (Election Commission)</option>
                        <option value="PAN Card">PAN Card (Govt of India)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Document Number * (Masked on Save)
                      </label>
                      <input
                        id="worker-reg-idnumber"
                        type="text"
                        required
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        placeholder="e.g. 5892 4819 9210"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Trade Certification upload */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" /> Trade Certifications & Credentials
                    </span>
                    <span className="text-[11px] text-slate-500">Optional but boosts Trust Score</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Skill</label>
                      <select
                        value={certSkillName}
                        onChange={(e) => setCertSkillName(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      >
                        {selectedSkills.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Certification Name</label>
                      <input
                        type="text"
                        value={certCourseName}
                        onChange={(e) => setCertCourseName(e.target.value)}
                        placeholder="e.g. ITI Certified Plumber"
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Issuing Organization</label>
                      <input
                        type="text"
                        value={certOrg}
                        onChange={(e) => setCertOrg(e.target.value)}
                        placeholder="e.g. National Skill Dev Corp"
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCertification}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Certification
                  </button>

                  {/* Added certifications preview */}
                  {certifications.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      {certifications.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs">
                          <div>
                            <span className="font-semibold text-slate-800">{c.name}</span>
                            <span className="text-slate-500 ml-1.5">({c.organization}, {c.year})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCertifications(certifications.filter((_, idx) => idx !== i))}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Emergency Contact & Short Bio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Person</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="e.g. Sunita Devi (Spouse)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Mobile Number</label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="Emergency contact number"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Short Bio & Work Summary</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your skills, punctuality, and work experience..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                {/* Navigation Actions */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 text-xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    id="worker-complete-onboarding-btn"
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Complete Profile & Open Dashboard
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Reset Worker Password</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Enter your registered mobile number or email. You will receive an OTP code to securely reset your credentials.
            </p>
            <input
              type="text"
              placeholder="Mobile or email"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordOpen(false);
                  success('Reset Link Sent', 'Instructions sent to your contact details.');
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
              >
                Send OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
