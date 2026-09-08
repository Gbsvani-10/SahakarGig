import React, { useState } from 'react';
import {
  Smartphone,
  QrCode,
  Copy,
  Check,
  Share2,
  Lock,
  ArrowRight,
  ExternalLink,
  Info,
} from 'lucide-react';
import { PaymentRequest, UpiApp } from '../types/payment.types';
import { TranslationSchema } from '../i18n/translations';
import { SUPPORTED_UPI_APPS, isMobileDevice, isAndroidDevice } from '../utils/deepLinkHandler';
import { UpiAppIcon } from './UpiAppIcon';

interface PaymentCardProps {
  request: PaymentRequest | null;
  onPayAnyUpi: () => void;
  onPaySpecificApp: (appId: string) => void;
  onOpenQr: () => void;
  onCopyUpi: () => Promise<boolean>;
  onShareLink: () => Promise<boolean>;
  isSubmitting: boolean;
  t: TranslationSchema;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  request,
  onPayAnyUpi,
  onPaySpecificApp,
  onOpenQr,
  onCopyUpi,
  onShareLink,
  isSubmitting,
  t,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  if (!request) return null;

  const handleCopy = async () => {
    const success = await onCopyUpi();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const success = await onShareLink();
    if (success) {
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const isAndroid = isAndroidDevice();

  return (
    <div
      id="payment-card"
      className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden max-w-lg mx-auto"
    >
      {/* Header bar of the card */}
      <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
        <div>
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
            UPI Payment Confirmation
          </span>
          <p className="text-xs text-slate-300">
            Booking ID: <span className="font-mono text-slate-100">{request.orderId}</span>
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Core Payment Details requested */}
        <div className="space-y-4">
          {/* Merchant Section */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {t.merchantLabel}
            </span>
            <div className="flex items-center justify-between mt-1">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {request.merchantName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  UPI ID: <span className="text-emerald-800 font-bold">{request.merchantUpiId}</span>
                </p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {t.verifiedWorkerBadge}
              </span>
            </div>
          </div>

          {/* Amount Section */}
          <div className="bg-emerald-50/70 p-5 rounded-2xl border-2 border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                {t.amountLabel}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight mt-0.5">
                ₹{request.amount.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">
                Currency
              </span>
              <span className="text-sm font-black text-slate-700">
                INR (₹)
              </span>
            </div>
          </div>

          {/* Purpose / Description */}
          <div className="px-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {t.purposeLabel}
            </span>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              {request.description}
            </p>
          </div>
        </div>

        {/* PRIMARY ACTION: PAY WITH ANY UPI APP */}
        <div className="pt-2">
          <button
            id="btn-pay-with-any-upi"
            onClick={onPayAnyUpi}
            disabled={isSubmitting}
            className={`w-full py-4 sm:py-5 px-6 rounded-2xl font-black text-lg sm:text-xl tracking-wide shadow-lg transition duration-200 flex flex-col items-center justify-center cursor-pointer ${
              isSubmitting
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white shadow-emerald-700/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-6 h-6" />
              <span>{t.payWithAnyUpi}</span>
            </div>
            <span className="text-xs text-emerald-100 font-normal mt-1 opacity-90">
              {t.payWithAnyUpiDesc}
            </span>
          </button>
        </div>

        {/* Secondary Section: Other payment options */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {t.otherPaymentOptions}
            </span>
            <span className="text-[11px] text-slate-400">
              {isAndroid ? 'Installed App Intent' : 'Select preferred app'}
            </span>
          </div>

          {/* App grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUPPORTED_UPI_APPS.filter((a) => a.id !== 'generic' && a.popular).map((app) => (
              <button
                key={app.id}
                id={`btn-pay-${app.id}`}
                onClick={() => onPaySpecificApp(app.id)}
                disabled={isSubmitting}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition cursor-pointer group active:scale-95"
              >
                <UpiAppIcon
                  appId={app.id}
                  size="md"
                  className="mb-1.5 group-hover:scale-105"
                />
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Alternative Actions: Show QR, Copy UPI, Share Link */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2">
          <button
            id="btn-show-qr"
            onClick={onOpenQr}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-emerald-600 mb-1" />
            <span className="truncate">{t.showQrCode}</span>
          </button>

          <button
            id="btn-copy-upi"
            onClick={handleCopy}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="text-emerald-700 truncate">{t.copiedUpiId}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500 mb-1" />
                <span className="truncate">{t.copyUpiId}</span>
              </>
            )}
          </button>

          <button
            id="btn-share-link"
            onClick={handleShare}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
          >
            {shared ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="text-emerald-700 truncate">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-500 mb-1" />
                <span className="truncate">{t.sharePaymentLink}</span>
              </>
            )}
          </button>
        </div>

        {/* Security Assurance footer note */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
          <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="leading-tight font-medium">
            <strong className="text-slate-800">Security Guarantee: </strong>
            {t.securityMessage}
          </p>
        </div>
      </div>
    </div>
  );
};
