import React from 'react';
import {
  Smartphone,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  QrCode,
  Copy,
} from 'lucide-react';
import { PaymentRequest, Language } from '../types/payment.types';
import { TranslationSchema } from '../i18n/translations';
import { UpiAppIcon } from './UpiAppIcon';

interface EasyPaymentModeProps {
  request: PaymentRequest | null;
  activeStep: number;
  onSetStep: (step: number) => void;
  onPayAnyUpi: () => void;
  onOpenQr: () => void;
  t: TranslationSchema;
}

export const EasyPaymentMode: React.FC<EasyPaymentModeProps> = ({
  request,
  activeStep,
  onSetStep,
  onPayAnyUpi,
  onOpenQr,
  t,
}) => {
  if (!request) return null;

  return (
    <div
      id="easy-payment-mode"
      className="bg-white rounded-3xl border-4 border-emerald-600 shadow-2xl p-6 sm:p-10 max-w-xl mx-auto space-y-8"
    >
      {/* High Contrast Header with Big Accessible Mode Badge */}
      <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-300 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-sm">
          ✓
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
            {t.easyModeTitle}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-800 font-bold">
            {t.easyModeSubtitle}
          </p>
        </div>
      </div>

      {/* STEP 1: Check the Amount */}
      <section
        id="step-1-card"
        className={`p-6 rounded-3xl border-3 transition duration-200 ${
          activeStep === 1
            ? 'bg-amber-50/70 border-amber-500 ring-4 ring-amber-200'
            : 'bg-slate-50 border-slate-200 opacity-90'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-sm flex items-center justify-center">
            1
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950">
            {t.step1Title}
          </h3>
        </div>

        <p className="text-sm font-semibold text-slate-700 mt-2">
          {t.step1Desc}
        </p>

        {/* Massive Amount Display */}
        <div className="mt-4 p-5 bg-white rounded-2xl border-2 border-slate-300 flex items-center justify-between shadow-inner">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {t.amountLabel}
            </span>
            <span className="text-4xl sm:text-5xl font-black text-emerald-700 tracking-tight">
              ₹{request.amount.toFixed(0)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-500 block">{t.merchantLabel}</span>
            <span className="text-base sm:text-lg font-black text-slate-900 block">
              {request.merchantName}
            </span>
          </div>
        </div>

        {activeStep === 1 && (
          <button
            id="btn-step1-confirm"
            onClick={() => onSetStep(2)}
            className="w-full mt-4 py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base sm:text-lg shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.continueButton}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </section>

      {/* STEP 2: Choose Your Payment App */}
      <section
        id="step-2-card"
        className={`p-6 rounded-3xl border-3 transition duration-200 ${
          activeStep === 2
            ? 'bg-emerald-50 border-emerald-600 ring-4 ring-emerald-200'
            : activeStep > 2
            ? 'bg-slate-50 border-slate-200 opacity-85'
            : 'bg-slate-50 border-slate-200 opacity-60'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-sm flex items-center justify-center">
            2
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950">
            {t.step2Title}
          </h3>
        </div>

        <p className="text-sm font-semibold text-slate-700 mt-2">
          {t.step2Desc}
        </p>

        {/* Giant Green Pay with Any UPI App Button */}
        <div className="mt-4">
          <button
            id="btn-easy-pay-any-upi"
            onClick={() => {
              onPayAnyUpi();
              onSetStep(3);
            }}
            className="w-full py-5 sm:py-6 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-xl sm:text-2xl tracking-wide shadow-xl flex items-center justify-center gap-3 cursor-pointer border-2 border-emerald-500"
          >
            <Smartphone className="w-7 h-7" />
            <span>{t.payWithAnyUpi}</span>
          </button>
        </div>

        <div className="mt-3 text-center">
          <button
            onClick={onOpenQr}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 hover:underline"
          >
            <QrCode className="w-4 h-4" />
            <span>{t.showQrCode} (QR కోడ్ చూడండి)</span>
          </button>
        </div>
      </section>

      {/* STEP 3: Your UPI App Will Open */}
      <section
        id="step-3-card"
        className={`p-6 rounded-3xl border-3 transition duration-200 ${
          activeStep === 3
            ? 'bg-blue-50 border-blue-600 ring-4 ring-blue-200'
            : activeStep > 3
            ? 'bg-slate-50 border-slate-200 opacity-85'
            : 'bg-slate-50 border-slate-200 opacity-60'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-blue-700 text-white font-black text-sm flex items-center justify-center">
            3
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950">
            {t.step3Title}
          </h3>
        </div>

        <p className="text-sm sm:text-base font-bold text-slate-800 mt-2 leading-relaxed">
          {t.step3Desc}
        </p>

        {/* Familiar UPI App Icons */}
        <div className="mt-3 flex items-center justify-start gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <UpiAppIcon appId="phonepe" size="sm" />
            <span className="text-xs font-bold text-slate-800">PhonePe</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <UpiAppIcon appId="gpay" size="sm" />
            <span className="text-xs font-bold text-slate-800">Google Pay</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <UpiAppIcon appId="paytm" size="sm" />
            <span className="text-xs font-bold text-slate-800">Paytm</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <UpiAppIcon appId="bhim" size="sm" />
            <span className="text-xs font-bold text-slate-800">BHIM</span>
          </div>
        </div>

        {activeStep === 3 && (
          <div className="mt-4 flex gap-3">
            <button
              id="btn-easy-step3-continue"
              onClick={() => onSetStep(4)}
              className="flex-1 py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.continueButton}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>

      {/* STEP 4: Check Merchant Name & Amount */}
      <section
        id="step-4-card"
        className={`p-6 rounded-3xl border-3 transition duration-200 ${
          activeStep === 4
            ? 'bg-amber-50 border-amber-600 ring-4 ring-amber-200'
            : activeStep > 4
            ? 'bg-slate-50 border-slate-200 opacity-85'
            : 'bg-slate-50 border-slate-200 opacity-60'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-amber-700 text-white font-black text-sm flex items-center justify-center">
            4
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950">
            {t.step4Title}
          </h3>
        </div>

        <p className="text-sm sm:text-base font-bold text-slate-800 mt-2 leading-relaxed">
          {t.step4Desc}
        </p>

        <div className="mt-3 p-3 bg-white rounded-xl border border-amber-300 text-slate-900 font-bold text-sm">
          Payee: <span className="text-emerald-800 font-black">{request.merchantName}</span> | Amount: <span className="text-emerald-800 font-black">₹{request.amount}</span>
        </div>

        {activeStep === 4 && (
          <button
            id="btn-easy-step4-continue"
            onClick={() => onSetStep(5)}
            className="w-full mt-4 py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-lg shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>I Checked, Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </section>

      {/* STEP 5: Complete Payment Inside UPI App (Never ask PIN) */}
      <section
        id="step-5-card"
        className={`p-6 rounded-3xl border-3 transition duration-200 ${
          activeStep === 5
            ? 'bg-purple-50 border-purple-600 ring-4 ring-purple-200'
            : 'bg-slate-50 border-slate-200 opacity-60'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-purple-800 text-white font-black text-sm flex items-center justify-center">
            5
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950">
            {t.step5Title}
          </h3>
        </div>

        <p className="text-sm sm:text-base font-bold text-purple-950 mt-2 leading-relaxed">
          {t.step5Desc}
        </p>

        {/* High Contrast Security Red Notice */}
        <div className="mt-4 p-4 bg-rose-50 rounded-2xl border-2 border-rose-300 flex items-start gap-3">
          <Lock className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-bold text-rose-950">
            Never enter your UPI PIN on this website or any link. Enter your PIN ONLY inside your bank&apos;s UPI app!
          </p>
        </div>
      </section>
    </div>
  );
};
