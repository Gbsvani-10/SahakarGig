import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Clock,
  Loader2,
  RefreshCw,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import { Transaction, PaymentStatus } from '../types/payment.types';
import { TranslationSchema } from '../i18n/translations';

interface PaymentStatusScreenProps {
  status: PaymentStatus;
  transaction: Transaction | null;
  onReset: () => void;
  onOpenQr: () => void;
  onCopyUpi: () => Promise<boolean>;
  t: TranslationSchema;
}

export const PaymentStatusScreen: React.FC<PaymentStatusScreenProps> = ({
  status,
  transaction,
  onReset,
  onOpenQr,
  onCopyUpi,
  t,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await onCopyUpi();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = transaction?.completedAt
    ? new Date(transaction.completedAt).toLocaleString('en-IN')
    : new Date().toLocaleString('en-IN');

  return (
    <div
      id="payment-status-container"
      className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-lg mx-auto"
    >
      <div className="p-6 sm:p-8 flex flex-col items-center text-center">
        {/* State Icon & Titles */}
        {status === 'processing' || status === 'initiating' || status === 'intent_dispatched' ? (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-pulse">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              {t.processingTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xs leading-relaxed">
              {t.processingDesc}
            </p>
          </>
        ) : status === 'success' ? (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 animate-in zoom-in-75 duration-300">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-emerald-900">
              {t.successTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-sm leading-relaxed">
              {t.successDesc}
            </p>
          </>
        ) : status === 'failed' ? (
          <>
            <div className="w-20 h-20 rounded-full bg-rose-100 border-4 border-rose-200 flex items-center justify-center text-rose-600 mb-4 animate-in zoom-in-75 duration-300">
              <XCircle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-rose-950">
              {t.failedTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-sm leading-relaxed">
              {transaction?.failureReason || t.failedDesc}
            </p>
          </>
        ) : status === 'cancelled' ? (
          <>
            <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-200 flex items-center justify-center text-amber-600 mb-4 animate-in zoom-in-75 duration-300">
              <AlertOctagon className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-amber-950">
              {t.cancelledTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-sm leading-relaxed">
              {t.cancelledDesc}
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-blue-100 border-4 border-blue-200 flex items-center justify-center text-blue-600 mb-4">
              <Clock className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-blue-950">
              {t.unconfirmedTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-sm leading-relaxed">
              {t.unconfirmedDesc}
            </p>
          </>
        )}

        {/* Transaction Summary Card */}
        {transaction && (
          <div className="w-full mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">{t.amountLabel}:</span>
              <span className="text-xl font-black text-slate-950">
                ₹{transaction.amount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">{t.payeeLabel}:</span>
              <span className="font-bold text-slate-800">{transaction.merchantName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Merchant UPI ID:</span>
              <span className="font-mono text-emerald-800 font-medium">
                {transaction.merchantUpiId}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">{t.transactionIdLabel}:</span>
              <span className="font-mono text-slate-700 font-medium">
                {transaction.transactionId}
              </span>
            </div>

            {transaction.paymentReference && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{t.referenceLabel}:</span>
                <span className="font-mono text-emerald-700 font-bold">
                  {transaction.paymentReference}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pt-1 text-[11px] text-slate-400">
              <span>{t.paidAtLabel}:</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        )}

        {/* Action Buttons depending on outcome */}
        <div className="w-full mt-6 flex flex-col gap-2.5">
          {status === 'success' ? (
            <button
              id="btn-status-done"
              onClick={onReset}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t.doneButton}</span>
            </button>
          ) : status === 'processing' ? (
            <div className="flex flex-col gap-2 w-full">
              <button
                id="btn-status-open-qr"
                onClick={onOpenQr}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm transition flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>{t.showQrCode}</span>
              </button>
              <button
                id="btn-status-cancel-wait"
                onClick={onReset}
                className="text-xs text-slate-500 hover:text-slate-700 font-semibold py-1"
              >
                Cancel & Return
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              <button
                id="btn-status-try-again"
                onClick={onReset}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t.tryAgainButton}</span>
              </button>

              <button
                id="btn-status-try-qr"
                onClick={onOpenQr}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
              >
                <QrCode className="w-4 h-4" />
                <span>{t.tryQrCodeButton}</span>
              </button>

              <button
                id="btn-status-copy-upi"
                onClick={handleCopy}
                className="sm:col-span-2 w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{t.copiedUpiId}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>{t.copyUpiId}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Security watermark footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>SahakarGig Zero-Knowledge UPI Architecture</span>
        </div>
      </div>
    </div>
  );
};
