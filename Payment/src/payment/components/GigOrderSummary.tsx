import React from 'react';
import { UserCheck, ShieldCheck, MapPin, Award, CheckCircle } from 'lucide-react';
import { DemoGigOrder } from '../types/payment.types';
import { TranslationSchema } from '../i18n/translations';

interface GigOrderSummaryProps {
  order: DemoGigOrder;
  t: TranslationSchema;
}

export const GigOrderSummary: React.FC<GigOrderSummaryProps> = ({ order, t }) => {
  return (
    <div
      id="gig-order-summary-card"
      className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-lg mx-auto"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-black text-lg flex items-center justify-center flex-shrink-0 shadow-xs">
          {order.workerName.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {order.workerName}
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle className="w-2.5 h-2.5 mr-1" />
              Verified Cooperative Member
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {order.cooperativeUnit}
          </p>
          <p className="text-xs text-emerald-800 font-semibold mt-1">
            Service: <span className="text-slate-800">{order.serviceName}</span>
          </p>
        </div>
      </div>

      <div className="self-end sm:self-center text-right bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
          Service Fee
        </span>
        <span className="text-lg font-black text-emerald-900">
          ₹{order.amount}
        </span>
      </div>
    </div>
  );
};
