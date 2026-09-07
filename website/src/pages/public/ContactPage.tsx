import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useApp } from '../../context/AppContext';
import { Building2, PhoneCall, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cooperativeName: '',
    message: '',
    inquiryType: 'Household User'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('success', 'Inquiry Submitted', 'Our nodal cooperative officer will contact you within 24 hours.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
          Support & Cooperative Onboarding
        </span>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Connect With SahakarGig & NCCT
        </h1>
        <p className="text-sm text-gray-700">
          Whether you are a household requiring dedicated service, a skilled artisan wishing to join, or a Labour Cooperative Society seeking digital affiliation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-4">
            <h3 className="font-bold text-gray-900 text-base">National Nodal Directorate</h3>
            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">National Council for Cooperative Training (NCCT)</p>
                  <p className="text-gray-700">3, Siri Institutional Area, August Kranti Marg, Hauz Khas, New Delhi, Delhi 110016</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Toll-Free Helpline: 1800-11-SAHAKAR (8:00 AM – 8:00 PM)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>support.sahakargig@ncct.gov.in</span>
              </div>
            </div>
          </Card>

          <Card variant="flat" className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">District Nodal Desks</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between border-b border-gray-200 pb-1.5">
                <span>Delhi & NCR Hub:</span>
                <span className="font-semibold text-gray-900">Asaf Ali Road Cooperative Bhawan</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5">
                <span>UP Federation Nodal:</span>
                <span className="font-semibold text-gray-900">Sector 62, Electronic City Noida</span>
              </div>
              <div className="flex justify-between">
                <span>Haryana Skill Federation:</span>
                <span className="font-semibold text-gray-900">Cooperative Union, Gurugram</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900">Thank You for Connecting!</h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Your inquiry has been logged in the NCCT SahakarGig database. Our district cooperative coordinator will reach out shortly.
                </p>
                <Button size="sm" variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-base text-gray-900 mb-2">Send an Inquiry or Feedback</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ramesh Chandra"
                  />
                  <Input
                    label="Phone Number"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@domain.com"
                  />
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      I Am Connecting As
                    </label>
                    <select
                      value={form.inquiryType}
                      onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="Household User">Household Customer</option>
                      <option value="Skilled Worker">Artisan / Skilled Worker</option>
                      <option value="Labour Cooperative">Labour Cooperative Society</option>
                      <option value="Government Body">Govt Department / Institution</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your Message / Proposal
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Provide details about your service request or cooperative society affiliation..."
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <Button type="submit" variant="primary" rightIcon={<Send className="w-4 h-4" />}>
                  Submit to Cooperative Nodal Officer
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
