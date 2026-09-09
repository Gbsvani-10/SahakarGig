import React, { useState } from 'react';
import { INSURANCE_FAQS } from '../utils/insuranceCalculations';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Clock } from 'lucide-react';

export const InsuranceFAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="insurance-education-faq" className="space-y-4">
      {/* "Insurance in 30 Seconds" Primer Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950 to-stone-900 text-white shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-emerald-400">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Insurance in 30 Seconds
          </span>
        </div>
        <p className="text-base sm:text-lg font-medium text-emerald-50 leading-relaxed max-w-3xl">
          &ldquo;You contribute a small amount regularly. If a covered unexpected event happens, the insurance
          policy may provide financial support according to its terms.&rdquo;
        </p>
        <p className="text-xs text-stone-300">
          No complicated financial jargon. Built specifically for informal and daily wage earners.
        </p>
      </div>

      {/* Expandable FAQs */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs divide-y divide-stone-100">
        <div className="p-4 sm:p-5 bg-stone-50/70 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-stone-600" />
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Frequently Asked Worker Questions
          </h3>
        </div>

        {INSURANCE_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="transition-colors">
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:bg-stone-50 cursor-pointer focus:outline-none focus-visible:bg-stone-50"
              >
                <span className="text-sm sm:text-base font-bold text-stone-900">
                  {faq.question}
                </span>
                <span className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100/80 mt-1 animate-in fade-in duration-150">
                  <div className="pt-2">{faq.answer}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
