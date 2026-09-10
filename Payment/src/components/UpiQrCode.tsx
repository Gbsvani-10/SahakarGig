import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, AlertCircle } from 'lucide-react';

interface UpiQrCodeProps {
  upiUrl: string;
  workerName: string;
  amount: number;
  label?: string;
  demoNotice?: string;
}

export const UpiQrCode: React.FC<UpiQrCodeProps> = ({
  upiUrl,
  workerName,
  amount,
  label = 'Scan & Pay',
  demoNotice,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(
      upiUrl,
      {
        width: 240,
        margin: 1.5,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      },
      (err, url) => {
        if (!isMounted) return;
        if (err || !url) {
          setHasError(true);
        } else {
          setQrDataUrl(url);
          setHasError(false);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [upiUrl]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
        <QrCode className="w-4 h-4 text-emerald-600" />
        <span>{label}</span>
      </div>

      <div className="relative p-2 bg-white rounded-lg border-2 border-slate-100 flex items-center justify-center min-w-[200px] min-h-[200px]">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={`UPI Payment QR for ${workerName} - ₹${amount}`}
            className="w-48 h-48 rounded object-contain"
            id="upi-qr-image"
          />
        ) : hasError ? (
          <div className="w-48 h-48 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
            <AlertCircle className="w-8 h-8 mb-1 text-slate-400" />
            <span className="text-xs">QR Preview Unavailable</span>
          </div>
        ) : (
          <div className="w-48 h-48 flex items-center justify-center text-slate-400">
            <span className="text-xs animate-pulse">Generating QR...</span>
          </div>
        )}
      </div>

      <div className="mt-2 text-center">
        <span className="inline-block text-[11px] font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">
          ₹{Math.round(amount).toLocaleString('en-IN')} to {workerName}
        </span>
      </div>

      {demoNotice && (
        <p className="mt-2 text-[10px] text-slate-500 text-center max-w-xs leading-tight">
          ℹ️ {demoNotice}
        </p>
      )}
    </div>
  );
};
