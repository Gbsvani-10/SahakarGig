import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  UserCheck, 
  Calendar, 
  Wrench, 
  CreditCard, 
  Star,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();

  const customerSteps = [
    {
      num: '1',
      title: 'Choose Service',
      desc: 'Select from 10 certified cooperative trade categories like Plumbing, Electrical, Cleaning, or Caregiving.',
      icon: <Search className="w-5 h-5 text-emerald-700" />
    },
    {
      num: '2',
      title: 'Find Verified Worker',
      desc: 'View real cooperative verified profiles with skill ratings, certifications, and proximity distance.',
      icon: <UserCheck className="w-5 h-5 text-teal-700" />
    },
    {
      num: '3',
      title: 'Book Service',
      desc: 'Pick your preferred date/time slot or initiate instant 15-minute emergency dispatch.',
      icon: <Calendar className="w-5 h-5 text-blue-700" />
    },
    {
      num: '4',
      title: 'Service Completed',
      desc: 'Worker arrives with cooperative ID badge and standardized tools to perform work under warranty.',
      icon: <Wrench className="w-5 h-5 text-amber-700" />
    },
    {
      num: '5',
      title: 'Secure Payment',
      desc: 'Pay digitally via UPI, Card, or Net Banking with instant downloadable GST & cooperative invoice.',
      icon: <CreditCard className="w-5 h-5 text-purple-700" />
    },
    {
      num: '6',
      title: 'Rate & Review',
      desc: 'Share verified feedback that directly determines annual cooperative member dividends.',
      icon: <Star className="w-5 h-5 text-amber-500" />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="max-w-3xl space-y-4 text-center mx-auto">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
          Transparent Process
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          How SahakarGig Works for Everyone
        </h1>
        <p className="text-sm text-gray-700 leading-relaxed">
          A seamless digital bridge between conscientious households, democratic labour cooperatives, and skilled artisans.
        </p>
      </div>

      {/* Customer Journey */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">1</span>
            <span>Customer Booking Journey</span>
          </h2>
          <Button size="sm" variant="outline" onClick={() => navigate('/customer/services')}>
            Experience Live Flow
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customerSteps.map((step) => (
            <Card key={step.num} className="space-y-3 relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                  {step.icon}
                </div>
                <span className="text-2xl font-black text-gray-200">0{step.num}</span>
              </div>
              <h3 className="font-bold text-sm text-gray-900">{step.title}</h3>
              <p className="text-xs text-gray-700 leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Cooperative Federation Workflow */}
      <Card variant="highlight" className="p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-emerald-800" />
          <h3 className="text-lg font-bold text-emerald-950">How Labour Cooperatives Oversee Workforce Quality</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-emerald-900">
          <div className="bg-white/80 p-4 rounded-xl border border-emerald-200 space-y-2">
            <p className="font-bold text-emerald-950">1. Verification & Skill Audit</p>
            <p className="text-gray-700">Societies conduct hands-on skill evaluations, inspect ITI/NSDC certifications, and verify police background checks.</p>
          </div>
          <div className="bg-white/80 p-4 rounded-xl border border-emerald-200 space-y-2">
            <p className="font-bold text-emerald-950">2. Algorithmic Allocation Fairness</p>
            <p className="text-gray-700">Jobs are distributed fairly by proximity and rotation, preventing favoritism and ensuring steady livelihoods.</p>
          </div>
          <div className="bg-white/80 p-4 rounded-xl border border-emerald-200 space-y-2">
            <p className="font-bold text-emerald-950">3. Welfare Fund Reserve</p>
            <p className="text-gray-700">7% of every gig automatically accrues into the worker's cooperative social safety and insurance pool.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
