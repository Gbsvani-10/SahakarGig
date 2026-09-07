import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Wrench, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Sparkles, 
  Home, 
  HeartHandshake, 
  Car, 
  Sprout, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Heart,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { services, workers } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Plumber': return <Wrench className="w-6 h-6 text-blue-600" />;
      case 'Electrician': return <Zap className="w-6 h-6 text-amber-500" />;
      case 'Carpenter': return <Hammer className="w-6 h-6 text-amber-700" />;
      case 'Painter': return <Paintbrush className="w-6 h-6 text-indigo-600" />;
      case 'Cleaner': return <Sparkles className="w-6 h-6 text-emerald-600" />;
      case 'Domestic Helper': return <Home className="w-6 h-6 text-rose-600" />;
      case 'Caregiver': return <HeartHandshake className="w-6 h-6 text-teal-600" />;
      case 'Driver': return <Car className="w-6 h-6 text-slate-700" />;
      case 'Gardener': return <Sprout className="w-6 h-6 text-green-600" />;
      case 'Technician': return <Cpu className="w-6 h-6 text-cyan-600" />;
      default: return <Wrench className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-gray-50 pt-12 pb-20 border-b border-gray-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Smart India Hackathon 2026 • Ministry of Cooperation</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-950 tracking-tight leading-[1.15]">
                {t('hero.title', 'Empowering Cooperatives. Connecting Communities. Creating Opportunities.')}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
                {t('hero.sub', 'SahakarGig connects verified skilled workers from labour cooperatives with households, communities, and institutions through a trusted digital service platform.')}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => navigate('/customer/services')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {t('btn.findService', 'Find a Service')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/register')}
                >
                  {t('btn.joinWorker', 'Join as a Worker')}
                </Button>
                <Button
                  size="lg"
                  variant="danger"
                  onClick={() => navigate('/customer/emergency')}
                  leftIcon={<AlertTriangle className="w-4 h-4" />}
                >
                  15-Min Emergency Service
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-gray-200/80 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="font-bold text-gray-900">100% Verified</p>
                  <p className="text-gray-500">NCCT & NSDC Certified</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Fair Wages</p>
                  <p className="text-gray-500">Zero Corporate Cuts</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Worker Welfare</p>
                  <p className="text-gray-500">Insurance & Pension</p>
                </div>
              </div>
            </div>

            {/* Right: Interactive Architectural Visual (Customer -> Cooperative -> Skilled Worker) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Cooperative Tri-Party Trust Flow
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Direct Ownership
                  </span>
                </div>

                <div className="space-y-3 relative">
                  {/* Step 1: Customer */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Household / Community</p>
                        <p className="text-[11px] text-gray-500">Direct booking & guaranteed fair rates</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">₹ Transparent</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center text-gray-400">
                    <div className="w-0.5 h-4 bg-emerald-300" />
                  </div>

                  {/* Step 2: Cooperative Federation */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-950">Labour Cooperative Society</p>
                        <p className="text-[11px] text-emerald-800">Background KYC & Skill Certification</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded">
                      Govt Nodal
                    </span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center text-gray-400">
                    <div className="w-0.5 h-4 bg-emerald-300" />
                  </div>

                  {/* Step 3: Skilled Worker */}
                  <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-teal-950">Verified Skilled Artisan</p>
                        <p className="text-[11px] text-teal-800">Direct Benefit Transfer + Social Security</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-teal-900">90% Payout</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Zero Aggregator Rent</span>
                  <span className="font-semibold text-emerald-700">Self-Reliant Cooperatives</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Rapid Emergency Response</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Need a service urgently? Plumbers & Electricians in 15 Minutes
            </h3>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl">
              Water pipe burst, sudden short circuit, or gas line maintenance? Cooperative emergency units are geo-dispatched immediately with fixed transparent emergency rate cards.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-white text-red-700 hover:bg-gray-100 shrink-0 font-bold shadow-md cursor-pointer"
            onClick={() => navigate('/customer/emergency')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Request Emergency Service
          </Button>
        </div>
      </section>

      {/* 10 Service Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Verified Cooperative Trades
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Household & Community Services
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            All trades are governed by cooperative rate transparency with 30-day workmanship assurance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((srv) => (
            <Card
              key={srv.id}
              className="hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => navigate(`/customer/services`)}
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {getCategoryIcon(srv.category)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {srv.category}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs mt-3">
                <span className="font-bold text-emerald-800">{srv.priceRange}</span>
                <span className="text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                  View <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Flow */}
      <section className="bg-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Transparent 6-Step Workflow
            </p>
            <h2 className="text-2xl sm:text-3xl font-black">How SahakarGig Works</h2>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-lg mx-auto">
              From instant verified worker matching to direct cooperative settlement.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Choose Service', desc: 'Select from 10 verified cooperative trades.' },
              { step: '02', title: 'Find Worker', desc: 'Browse nearby verified artisans with real ratings.' },
              { step: '03', title: 'Book Service', desc: 'Pick date/time slot or request 15-min emergency.' },
              { step: '04', title: 'Job Completed', desc: 'Work executed with cooperative safety standards.' },
              { step: '05', title: 'Secure Payment', desc: 'UPI, Card, or Net Banking with official invoice.' },
              { step: '06', title: 'Rate & Review', desc: 'Direct feedback to build artisan cooperative equity.' }
            ].map((item) => (
              <div
                key={item.step}
                className="bg-emerald-800/60 rounded-xl p-4 border border-emerald-700/60 flex flex-col justify-between"
              >
                <span className="text-2xl font-black text-emerald-400/80 mb-2">{item.step}</span>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">{item.title}</h4>
                  <p className="text-[11px] text-emerald-200 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SahakarGig is Different: Cooperative Model vs Corporate Aggregators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              The Cooperative Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Why Choose SahakarGig Over Commercial App Aggregators?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Unlike private commercial platforms that take 25–35% predatory commissions from unorganized workers, SahakarGig is governed directly by Labour Cooperative Societies under the National Council for Cooperative Training (NCCT).
            </p>

            <div className="space-y-3">
              {[
                { title: 'Cooperative-Owned Ecosystem', desc: 'Workers are shareholders and members, not disposable contract gig laborers.' },
                { title: '100% Certified & Verified Workers', desc: 'Every worker undergoes physical skill evaluation and police background clearance by their local cooperative.' },
                { title: 'Social Security & Worker Welfare', desc: 'Every booking funds insurance cover, health linkage, and tool upgrades for the worker.' },
                { title: 'AI Demand Analytics & Fair Allocation', desc: 'Work is distributed equitably across cooperative members rather than manipulated by private algorithms.' }
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{point.title}</h4>
                    <p className="text-xs text-gray-600">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Button
                variant="secondary"
                onClick={() => navigate('/contact')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Partner With SahakarGig (For Cooperatives)
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <span>Fair Value Distribution Breakdown</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-emerald-400">Worker Payout (Direct Benefit Transfer)</span>
                    <span>90%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[90%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-teal-400">Labour Cooperative Welfare & Social Security Fund</span>
                    <span>7%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-teal-500 h-full w-[7%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-blue-400">Digital Platform Maintenance & Server Ingress</span>
                    <span>3%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-blue-500 h-full w-[3%]" />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
                <p className="font-bold text-white">Compare with Commercial Aggregators:</p>
                <p className="text-[11px] text-slate-400">
                  Private aggregators siphon 25% – 35% commission with zero health or pension benefits for workers. SahakarGig ensures dignity and economic empowerment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Demo Statistics */}
      <section className="bg-gray-100 py-12 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-[11px] uppercase font-bold text-gray-500 tracking-wider">
              Platform Demo Statistics
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
              <p className="text-3xl font-black text-emerald-800">1,250+</p>
              <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">Verified Workers</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
              <p className="text-3xl font-black text-teal-800">430+</p>
              <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">Jobs Completed</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
              <p className="text-3xl font-black text-blue-800">85+</p>
              <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">Cooperative Partners</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
              <p className="text-3xl font-black text-amber-700">4.8/5</p>
              <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">Average Rating</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
