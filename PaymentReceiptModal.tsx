import React from 'react';
import { BookingData, Language, PaymentCalculation } from '../types';
import { translations } from '../translations';
import { formatInr } from '../utils/payment';
import { CheckCircle2, Download, Printer, X, ShieldCheck } from 'lucide-react';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingData;
  calculation: PaymentCalculation;
  language: Language;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  booking,
  calculation,
  language,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const txId = booking.transactionId || `SG-UPI-${booking.id}-TXN`;
  const paidDate = booking.paidAt || new Date().toLocaleString();

  const handleDownload = () => {
    // Generate clean text summary receipt for download
    const receiptContent = `===========================================
        SAHAKARGIG COOPERATIVE RECEIPT
===========================================
Payment Status: PAID & VERIFIED
Transaction ID: ${txId} [Demo Prototype]
Booking ID:     ${booking.id}
Date & Time:    ${paidDate}
Payment Method: UPI (${booking.paymentMethod || 'UPI App'})

CUSTOMER & WORKER DETAILS
-------------------------------------------
Worker Name:    ${booking.workerName}
Worker UPI ID:  ${booking.workerUpiId}
Service:        ${booking.service}
Scheduled:      ${booking.scheduledDate} at ${booking.scheduledTime}

PAYMENT BREAKDOWN
-------------------------------------------
Service Amount:              ${formatInr(calculation.serviceAmount)}
GST (${calculation.gstRatePercent}%):                   ${formatInr(calculation.gstAmount)}
Admin / Platform Charge:     ${formatInr(calculation.adminCharge)}
-------------------------------------------
TOTAL AMOUNT PAID:           ${formatInr(calculation.grandTotal)}
===========================================
Cooperative Fair-Work Guarantee:
Payment is safely held in cooperative escrow 
until service verification.
===========================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SahakarGig-Receipt-${booking.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="receipt-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="receipt-modal-card"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-emerald-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-500 rounded-full">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight text-white">
                {t.cooperativeInvoice}
              </h3>
              <p className="text-xs text-emerald-100">
                {t.brandName} • {booking.id}
              </p>
            </div>
          </div>
          <button
            id="close-receipt-btn-x"
            onClick={onClose}
            aria-label={t.closeReceiptBtn}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-emerald-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="flex items-center gap-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-sm text-emerald-900">{t.paymentSuccessfulTitle}</p>
              <p className="text-xs text-emerald-700">{t.receiptSubtitle}</p>
            </div>
          </div>

          {/* Primary Meta Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">{t.paymentIdLabel}:</span>
              <span className="font-mono font-semibold text-slate-800 break-all">{txId}</span>
              <span className="inline-block mt-0.5 text-[10px] text-amber-600 bg-amber-50 px-1 rounded border border-amber-200">
                Demo/Prototype
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.dateLabel}:</span>
              <span className="font-medium text-slate-800">{paidDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.workerNameLabel}:</span>
              <span className="font-bold text-slate-900">{booking.workerName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.serviceLabel}:</span>
              <span className="font-medium text-slate-800">{booking.service}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.bookingIdLabel}:</span>
              <span className="font-mono font-medium text-slate-800">{booking.id}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.upiIdLabel}:</span>
              <span className="font-mono text-slate-800">{booking.workerUpiId}</span>
            </div>
          </div>

          {/* Itemized Calculations */}
          <div className="border-t border-b border-slate-200 py-3 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>{t.serviceAmountLabel}</span>
              <span className="font-medium text-slate-800">{formatInr(calculation.serviceAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{t.gstLabel}</span>
              <span className="font-medium text-slate-800">{formatInr(calculation.gstAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{t.adminChargeLabel}</span>
              <span className="font-medium text-slate-800">{formatInr(calculation.adminCharge)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-base">{t.grandTotalLabel}</span>
              <span className="font-black text-emerald-700 text-xl">{formatInr(calculation.grandTotal)}</span>
            </div>
          </div>

          {/* Cooperative Guarantee Note */}
          <p className="text-xs text-slate-500 text-center leading-relaxed">
            {t.cooperativeNote}
          </p>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 justify-end">
          <button
            id="print-receipt-btn"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print
          </button>
          <button
            id="download-receipt-btn"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            {t.downloadReceiptBtn}
          </button>
          <button
            id="close-receipt-btn"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
          >
            {t.closeReceiptBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
