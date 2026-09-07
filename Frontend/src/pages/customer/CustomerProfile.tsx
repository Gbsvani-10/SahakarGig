import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { User, MapPin, Phone, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useApp();

  const [name, setName] = useState(user?.name || 'Priya Sharma');
  const [email, setEmail] = useState(user?.email || 'priya.sharma@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [city, setCity] = useState(user?.city || 'Noida');
  const [pincode, setPincode] = useState(user?.pincode || '201304');
  const [address, setAddress] = useState('Flat 402, Lotus Panache, Sector 110');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Profile Updated', 'Your customer details have been saved.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Customer Profile</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Manage your verified contact coordinates and default dispatch address
        </p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400"
          />
          <div>
            <h3 className="text-base font-bold text-gray-900">{name}</h3>
            <p className="text-xs text-gray-500">Member since August 2024 • Verified Household</p>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar OTP Verified
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />
            <Input
              label="Mobile Number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Default House & Street Address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            leftIcon={<MapPin className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              label="Pincode"
              required
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" rightIcon={<CheckCircle2 className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
