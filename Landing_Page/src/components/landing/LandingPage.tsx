import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  Award,
  Users,
  Sparkles,
  BadgeCheck,
  Briefcase
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onExplore }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-emerald-50/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Cooperative Digital Platform for Gig & Daily-Wage Labor
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            SAHAKARGIG
            <span className="block text-2xl sm:text-3xl md:text-4xl font-semibold text-emerald-700 mt-3">
              “Empowering workers, simplifying their work life.”
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
            A digital platform built to support gig and daily-wage workers by helping them manage their work, income, benefits, and financial security in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
            <button
              id="hero-get-started-btn"
              onClick={onGetStarted}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-sm shadow-emerald-600/30 transition-all hover:translate-y-[-1px]"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-explore-btn"
              onClick={onExplore}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-base border border-slate-300 shadow-sm transition-all"
            >
              How It Works
            </button>
          </div>

          {/* Platform Pillars */}
          <div className="pt-12 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs text-slate-600 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-emerald-600" /> Masked ID Verification
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-emerald-600" /> Verified Working Day Tracking
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Day-Linked Micro-Insurance
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" /> Direct Customer Connections
            </span>
          </div>
        </div>
      </section>

      {/* PLATFORM BENEFITS ("How SahakarGig Helps") */}
      <section id="how-it-works-section" className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
              Platform Benefits
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How SahakarGig Helps
            </p>
            <p className="text-base text-slate-600 mt-3">
              Designed with human-centered principles to address the unique needs and vulnerabilities of daily-wage and gig labor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Benefit 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Find and manage work</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect directly with verified customers seeking skilled services. Accept or decline requests based on your availability without intermediate middleman fees.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all text-left">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 mb-4">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Track income and working days</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Record actual days worked, daily wages, and pending balances in real time. Maintain clear financial records without assumptions of fixed monthly salaries.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Build verified skills & work profiles</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload trade certifications and secure government ID credentials with automated masking to build a transparent, verifiable reputation.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Access financial & worker protection</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Benefit from day-linked micro-insurance that accumulates only on days you work. Protection pauses automatically with zero deductions during non-working days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
              Simple Workflow
            </h2>
            <p className="text-3xl font-extrabold text-slate-900">
              How It Works
            </p>
            <p className="text-base text-slate-600 mt-3">
              A transparent three-step cooperative model designed for workers and customers alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg mb-4 shadow-sm shadow-emerald-600/20">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Create your profile</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Provide basic details, select your trade skills, set your daily wage preference, and upload certifications with secure masked identity verification.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg mb-4 shadow-sm shadow-emerald-600/20">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Connect with opportunities</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Set your working availability to receive direct job requests from verified customers matched according to your trade, proximity, and experience.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg mb-4 shadow-sm shadow-emerald-600/20">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Manage work & benefits</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Log completed work days, track wage settlements, and build day-linked emergency and accident protection backed by the cooperative pool.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GET STARTED CTA */}
      <section className="py-16 md:py-20 bg-emerald-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to get started?
          </h2>
          <p className="text-base sm:text-lg text-emerald-100 max-w-xl mx-auto mt-3 mb-8">
            Join workers and customers on a transparent, secure, and dignified digital cooperative platform.
          </p>
          <button
            id="final-join-btn"
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-emerald-800 font-bold text-base hover:bg-emerald-50 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
          >
            Join SahakarGig
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                SG
              </div>
              <span className="font-bold text-slate-200 text-base">SahakarGig</span>
              <span className="text-xs text-slate-500 pl-2 border-l border-slate-800">
                Empowering workers, simplifying work life.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-medium">
              <button onClick={onExplore} className="hover:text-white transition-colors">How it works</button>
              <button onClick={onGetStarted} className="hover:text-white transition-colors">Get Started</button>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} SahakarGig. Built for India's Gig and Daily-Wage Workforce.
          </div>
        </div>
      </footer>
    </div>
  );
};
