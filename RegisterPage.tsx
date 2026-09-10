import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { 
  Building2, 
  UserCheck, 
  Wrench, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  // Role specific fields
  const [tradeCategory, setTradeCategory] = useState('Plumber');
  const [cooperativeMembershipId, setCooperativeMembershipId] = useState('');
  const [societyRegistrationNo, setSocietyRegistrationNo] = useState('');
  const [societyName, setSocietyName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    await register({
      name,
      email,
      phone,
      role: selectedRole,
      city,
      pincode,
      cooperativeName: societyName || 'Delhi Labour Welfare Cooperative Society Ltd.'
    });

    if (selectedRole === 'customer') navigate('/customer/dashboard');
    if (selectedRole === 'worker') navigate('/worker/dashboard');
    if (selectedRole === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-700 text-white font-bold mb-1 shadow-xs">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Create SahakarGig Account</h1>
          <p className="text-xs text-gray-700">
            Join India's national cooperative gig services ecosystem
          </p>
        </div>

        {/* Step 1: Role Selection Cards */}
        {!selectedRole ? (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                How do you want to use SahakarGig?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Customer */}
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className="p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-emerald-600 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">Customer</h3>
                  <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                    Find and book verified trade services with transparent rates.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 mt-4 flex items-center">
                  Select <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </button>

              {/* Worker */}
              <button
                type="button"
                onClick={() => setSelectedRole('worker')}
                className="p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-teal-600 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">Artisan Worker</h3>
                  <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                    Offer your skills through a registered labour cooperative.
                  </p>
                </div>
                <span className="text-xs font-bold text-teal-700 mt-4 flex items-center">
                  Select <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </button>

              {/* Cooperative Admin */}
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className="p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-blue-600 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">Cooperative Admin</h3>
                  <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                    Manage workers, verify certifications, and dispatch jobs.
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-700 mt-4 flex items-center">
                  Select <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </button>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-gray-500">Already registered? </span>
              <Link to="/login" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
                Sign in to your account
              </Link>
            </div>
          </div>
        ) : (
          /* Step 2: Role Specific Form */
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Portal Selection</span>
              </button>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800">
                {selectedRole} Account
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Legal Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                />
                <Input
                  label="Mobile Number (OTP Verified)"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                />
                <Input
                  label="Secure Password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City / District"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. New Delhi / Noida"
                />
                <Input
                  label="Pincode"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="110001"
                />
              </div>

              {/* Role Specific Extra Fields */}
              {selectedRole === 'worker' && (
                <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-3">
                  <p className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                    Worker Trade & Cooperative Affiliation
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Primary Trade Category
                      </label>
                      <select
                        value={tradeCategory}
                        onChange={(e) => setTradeCategory(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm bg-white"
                      >
                        <option value="Plumber">Plumbing</option>
                        <option value="Electrician">Electrical</option>
                        <option value="Carpenter">Carpentry</option>
                        <option value="Painter">Painting</option>
                        <option value="Cleaner">Cleaning & Sanitation</option>
                        <option value="Caregiver">Caregiving & Nursing Aid</option>
                        <option value="Technician">Appliance Repair</option>
                      </select>
                    </div>

                    <Input
                      label="Labour Cooperative Member ID"
                      value={cooperativeMembershipId}
                      onChange={(e) => setCooperativeMembershipId(e.target.value)}
                      placeholder="e.g. DL/COOP/MEM-882"
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'admin' && (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
                  <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Labour Cooperative Society Verification
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Society Registration Number"
                      required
                      value={societyRegistrationNo}
                      onChange={(e) => setSocietyRegistrationNo(e.target.value)}
                      placeholder="e.g. MSCS/HQ/2021/412"
                    />
                    <Input
                      label="Society Full Name"
                      required
                      value={societyName}
                      onChange={(e) => setSocietyName(e.target.value)}
                      placeholder="e.g. Delhi Shramik Sahakari"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Complete Registration & Open {selectedRole} Portal
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};
