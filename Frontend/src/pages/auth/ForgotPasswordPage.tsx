import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Building2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-700 text-white font-bold mb-1 shadow-xs">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Reset Your Password</h1>
          <p className="text-xs text-gray-700">
            Enter your registered email or mobile number to receive an OTP
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-4">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">OTP Sent Successfully</h3>
              <p className="text-xs text-gray-700 max-w-xs mx-auto">
                We have transmitted a 6-digit verification code to <strong>{email}</strong>. Check your inbox/SMS.
              </p>
              <Link to="/login">
                <Button variant="primary" size="sm" className="mt-4">
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email or Mobile"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com / 9876543210"
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Button type="submit" variant="primary" className="w-full">
                Send OTP Verification Code
              </Button>
            </form>
          )}

          <div className="pt-3 border-t border-gray-100 text-center">
            <Link to="/login" className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
