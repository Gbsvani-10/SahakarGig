import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Share2, QrCode, ShieldCheck } from 'lucide-react';
import { PaymentRequest } from '../types/payment.types';
import { TranslationSchema } from '../i18n/translations';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: PaymentRequest | null;
  upiUri: string;
  onCopyUpiId: () => Promise<boolean>;
  onSharePaymentLink: () => Promise<boolean>;
  t: TranslationSchema;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  request,
  upiUri,
  onCopyUpiId,
  onSharePaymentLink,
  t,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && upiUri) {
      QRCode.toDataURL(upiUri, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      })
        .then((url) => {
          setQrDataUrl(url);
        })
        .catch((err) => {
          console.error('QR generation error:', err);
        });
    }
  }, [isOpen, upiUri]);

  if (!isOpen || !request) return null;

  const handleCopy = async () => {
    const success = await onCopyUpiId();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    const success = await onSharePaymentLink();
    if (success) {
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  return (
    <div
      id="qr-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="qr-modal-card"
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="btn-close-qr-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Close QR Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal header */}
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-slate-900">
          {t.showQrCode}
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          {t.scanQrPrompt}
        </p>

        {/* QR container */}
        <div className="mt-4 p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-inner">
          {qrDataUrl ? (
            <img
              id="upi-qr-image"
              src={qrDataUrl}
              alt="UPI Payment QR Code"
              className="w-56 h-56 rounded-xl mx-auto"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-xs text-slate-400">
              Generating secure QR...
            </div>
          )}
        </div>

        {/* Payee Details */}
        <div className="mt-3 w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-left">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-0.5">
            <span>{t.merchantLabel}:</span>
            <span className="font-bold text-slate-800">{request.merchantName}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
            <span>UPI ID:</span>
            <span className="font-mono text-emerald-700 font-semibold">{request.merchantUpiId}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
            <span>{t.amountLabel}:</span>
            <span className="text-emerald-700 text-base">₹{request.amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2 w-full mt-4">
          <button
            id="btn-copy-upi-in-modal"
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">{t.copiedUpiId}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>{t.copyUpiId}</span>
              </>
            )}
          </button>

          <button
            id="btn-share-link-in-modal"
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
          >
            {shared ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>{t.sharedLinkSuccess}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-white" />
                <span>{t.sharePaymentLink}</span>
              </>
            )}
          </button>
        </div>

        {/* Security badge in modal */}
        <div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Works with all certified UPI applications</span>
        </div>
      </div>
    </div>
  );
};
